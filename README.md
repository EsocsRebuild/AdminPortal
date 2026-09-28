# ESOCS — Admin Portal

Administration software for the Eternal Sacred Order of Cherubim & Seraphim: members, email marketing, forms, administrators and audit.

**Stack:** Next.js 16 (App Router, Server Actions, Proxy) · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · Motion · TanStack Table v9 · Zod 4

The portal is a **backend-for-frontend**. It holds no data: every screen reads from the REST API described in [`docs/api-contract.md`](docs/api-contract.md), from the server. Browsers never talk to the API and never see a token.

```bash
npm install
npm run dev:preview               # portal + mock API → http://localhost:3001
```

Sign in with **admin@esocs.test / Preview-Password-2026**. Two-step demo: **mfa@esocs.test**, same password, code **123456**.

`dev:preview` starts a **mock API** (`tools/mock-api/`) that follows the API contract with sample data held in memory, so every screen can be explored before the real backend exists. It resets on restart and is never part of the product or the Docker image.

With the real backend:

```bash
cp .env.example .env.local        # set BACKEND_API_URL
npm run dev                       # http://localhost:3001
npm run validate                  # lint + format + typecheck + unit tests
npm run test:e2e                  # security + public pages at phone/tablet/desktop
```

To run the signed-in end-to-end suite against a staging API:
`E2E_BACKEND_URL=https://staging-api.example/v1 E2E_EMAIL=… E2E_PASSWORD=… npm run test:e2e`

---

## Architecture

```
src/
├─ proxy.ts                  per-request CSP nonce · optimistic auth redirect · silent token refresh
├─ server/                   server-only
│  ├─ env.ts                 validated environment
│  ├─ backend.ts             API client (bearer from httpOnly cookie, forwarded IP/UA/request-id, error mapping)
│  ├─ session.ts             Data Access Layer: getSession · requireSession · requirePermission
│  ├─ action.ts              secureAction / publicAction: session → permission → sudo → Zod → handler
│  ├─ cookies.ts             cookie names and policy (__Host-, httpOnly, Secure, SameSite)
│  ├─ query.ts               findOrNotFound, assertId
│  └─ download.ts            permission-checked CSV streaming
├─ features/<area>/          one folder per domain
│  ├─ types.ts               API shapes (the contract)
│  ├─ schemas.ts             Zod input rules, shared by browser and server
│  ├─ queries.ts             server-only reads, each checks its permission
│  ├─ actions.ts             "use server" mutations via secureAction
│  └─ components/            the feature's UI
│     areas: auth · account · dashboard · members · audiences · email-builder · templates
│            campaigns · sending · forms · users · audit · notifications · lookups
├─ app/
│  ├─ (auth)/                login · mfa · signup · verify · forgot/reset password · invite/[token]
│  ├─ (app)/                 signed-in area (layout verifies the session on every request)
│  ├─ f/[slug]/              public form pages (embeddable only by FORM_EMBED_ORIGINS)
│  ├─ api/…/export/          CSV downloads
│  └─ forbidden.tsx          403 page for missing permissions
├─ components/               shared UI: ui/ · layout/ · data-table/ · modals/ · motion/ · charts/ · auth/
├─ hooks/                    useAction · useAutosave · useUrlQuery · usePreference · useHotkey · …
└─ lib/                      permissions · result types · list params · validation · password policy · CSV · formatters
```

### Data flow

- **Reads:** a Server Component calls `features/x/queries.ts` → `requirePermission()` → `backend()` → rendered on the server. List pages keep page, search, sort and filters in the URL (`parseListParams` + `<DataTable server>`), so views can be shared and survive a refresh.
- **Writes:** a client component calls a Server Action through `useAction()`. The action is wrapped in `secureAction({ schema, permission, sudo })`, which always re-checks everything. It returns an `ActionResult` (never throws to the browser), and `useAction` shows toasts, prompts for the password again when needed, and handles expired sessions.

---

## Security model

| Layer                     | What it does                                                                                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tokens**                | Access and refresh tokens live in `__Host-` cookies that are `httpOnly`, `Secure` and `SameSite=Lax`. Page JavaScript cannot read them (`document.cookie` is empty).                                                         |
| **Proxy**                 | Redirects signed-out visitors (with a safe `next`), renews expired access tokens from the refresh token, and keeps signed-in users off the auth pages.                                                                       |
| **Data Access Layer**     | Every page asks the API who the token belongs to (`/auth/me`), so revoked sessions stop working immediately. Missing permissions render a 403.                                                                               |
| **Server Actions**        | Each one re-checks the session and permission (it doesn't trust the page), validates input with Zod, and hides unexpected errors behind a generic message. Next.js adds origin checks and encrypted action IDs.              |
| **Sudo mode**             | Deleting, sending, role changes, invitations and domain changes require re-entering your password within the last few minutes. Enforced here and by the API (`X-Sudo-Token`).                                                |
| **Idle timeout**          | One-minute warning, then sign-out after `NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES`. Synced across tabs.                                                                                                                              |
| **Two-step verification** | Authenticator app (TOTP), recovery codes, "remember this device"; administrators can reset it for others.                                                                                                                    |
| **Headers**               | Per-request nonce CSP (`strict-dynamic`, `object-src 'none'`, `frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options: DENY`, `COOP`, `CORP`, a strict `Permissions-Policy`, and `no-store` on signed-in pages.         |
| **Input**                 | Route IDs are validated before they reach an API path; list params fall back to defaults; post-login redirects accept same-site paths only; email links allow only `https:`/`mailto:`; emails are block documents, not HTML. |
| **Public forms**          | Honeypot, minimum fill time, server-side validation against the live form, and unknown fields dropped. The API adds rate limits and an optional CAPTCHA.                                                                     |
| **Consent**               | Nobody is added to an audience without an explicit consent attestation; members need `emailConsent`.                                                                                                                         |
| **Self-protection**       | You can't change your own role, suspend yourself or reset your own two-step verification. The Owner role is locked.                                                                                                          |

The API must enforce the same rules on its side: see §2 of the API contract.

---

## Docker & reverse proxy

```
Internet ──► nginx (proxy) :80/:443 ──► portal (Next.js standalone) :3000 ──► REST API
             TLS, rate limits,           non-root, read-only,
             caching, host checks        not published
```

| File                | Purpose                                                                                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`        | Multi-stage build (deps → build → ~minimal runtime). Runs as a non-root user with no npm in the image, has a health check, and handles SIGTERM gracefully. The Server Actions key is a BuildKit **secret**, never a layer. |
| `compose.yml`       | Production stack: `portal` + `proxy` (+ `certbot` profile). Read-only file systems, all capabilities dropped, `no-new-privileges`, resource limits, rotated logs, health-gated start-up.                                   |
| `compose.local.yml` | The same stack on this machine at `https://localhost:8443` with a self-signed certificate.                                                                                                                                 |
| `docker/nginx/`     | `nginx.conf`, the site template, snippets (proxy, TLS, real-IP) and the maintenance page.                                                                                                                                  |
| `docker/scripts/`   | `dev-certs.sh` (self-signed), `init-letsencrypt.sh` (first real certificate).                                                                                                                                              |
| `Makefile`          | `make help` lists everything: `secrets`, `build`, `up`, `down`, `logs`, `certs-init`, `certs-renew`, `local`.                                                                                                              |

**What the proxy does**

- **TLS:** 1.2/1.3 (Mozilla intermediate) with HTTP/2 and HTTP→HTTPS redirects.
- **Hostname checks:** unknown hostnames are dropped on :80 and their TLS handshakes rejected on :443.
- **Rate limits:** per IP generally, 10/min on sign-in POSTs, 6/min on public form submissions and 6/min on CSV exports, plus a cap on concurrent connections.
- **Slow-client limits:** timeouts against slow-drip attacks and body size limits (5 MB, 256 KB for public forms).
- **Client IP:** `X-Forwarded-For` is **overwritten** with the real client IP, so the app's rate limits and audit log can't be spoofed.
- **Caching:** `/_next/static` assets are cached immutably; HTML and data never are.
- **Logs:** JSON access logs with a request ID that is passed on to the app and the API.
- **Maintenance page:** shown while the app restarts.

**First deployment**

```bash
cp .env.docker.example .env        # SERVER_NAME, APP_URL, BACKEND_API_URL…
make secrets >> .env               # stable Server Actions key
make certs-init                    # Let's Encrypt (DNS must point here; ports 80/443 open)
make up
# daily cron: make certs-renew
```

**Try it locally:** `make certs-dev`, set the local values shown in `.env.docker.example`, then `make local` and open https://localhost:8443.

> Building the image needs about 4 GB of memory for `next build`. On Docker Desktop, raise **Settings → Resources → Memory** to at least 4 GB.

If a CDN or load balancer sits in front of nginx, enable `docker/nginx/snippets/real-ip.conf` with that provider's IP ranges only.

## Design system

- Semantic colour tokens only (`bg-surface`, `text-muted-foreground`, …). Light/dark mode, 4 accents, comfortable/compact density and a neutral/royal sidebar are all set in `src/app/globals.css` and chosen by each user in **Settings → Appearance**.
- Motion: `<Reveal>`, `<Stagger>`, `<CountUp>`, `<SuccessCheck>`, route transitions, and gliding indicators. All of it respects "reduce motion".
- In-app dialogs: `const modals = useModals()` gives `await modals.confirm({…})`, `await modals.reauth()` and `await modals.open(render)`.
- `/design-system` shows every component. It is available in development, and in production only when `ENABLE_DESIGN_SYSTEM=true`.

## Adding a feature

1. Add the types (from the API contract), schemas, queries and actions under `src/features/<area>/`.
2. Pages go in `src/app/(app)/<area>/`. Call a query, which checks the permission, and render.
3. Mutations: `export const doThing = secureAction({ schema, permission, sudo? }, handler)`, then call it from the UI with `useAction(doThing, { success: "…" })`.
4. Add the nav entry (with its permission) in `src/config/navigation.ts`, and the permission in `src/lib/permissions.ts` and `permission-catalog.ts`.
5. Document the endpoints in `docs/api-contract.md`.
