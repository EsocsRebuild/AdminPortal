# ESOCS — Admin Portal

Administration software for the Eternal Sacred Order of Cherubim & Seraphim: members, email marketing, forms, administrators and audit.

**Stack:** Next.js 16 (App Router, Server Actions, Proxy) · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · Motion · TanStack Table v9 · Zod 4

The portal is a **backend-for-frontend**. It holds no data: every screen reads from the REST API described in [`docs/api-contract.md`](docs/api-contract.md), from the server. Browsers never talk to the API and never see a token.

```bash
cp .env.example .env.local        # set BACKEND_API_URL
npm install
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
