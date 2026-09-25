# ESOCS Admin — REST API contract

This is everything the admin portal expects from the backend. The portal holds no data of its own: every screen reads from and writes to these endpoints.

- **TypeScript shapes** for each payload live in the portal at `src/features/<area>/types.ts`. They are the source of truth; this document names them.
- **Input validation** schemas (Zod) live in `src/features/<area>/schemas.ts`. The API must enforce the same rules, and may be stricter.

---

## 1. Conventions

| Topic             | Rule                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Base URL          | `BACKEND_API_URL`, e.g. `https://api.esocs.org/v1`. Only the portal's **server** calls it; browsers never do.                                                                              |
| Auth              | `Authorization: Bearer <accessToken>` on every non-public endpoint.                                                                                                                        |
| Success           | `200/201` with `{ "data": … }`. Lists add `"meta": { "page", "pageSize", "total" }`. `204` for empty responses.                                                                            |
| Errors            | `{ "error": { "code": ErrorCode, "message": string, "fields"?: { [field]: string[] } } }`. The `message` is shown to users, so write it for a non-technical reader.                        |
| Error codes       | `VALIDATION` (400/422), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `REAUTH_REQUIRED` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `UNAVAILABLE` (5xx).               |
| Lists             | Query `page` (1-based), `pageSize` (10/20/50/100), `q` (search), `sort` (field name), `dir` (`asc`/`desc`), plus the filters listed per endpoint.                                          |
| Dates             | ISO 8601 UTC strings.                                                                                                                                                                      |
| IDs               | Opaque strings matching `^[A-Za-z0-9_-]{1,64}$`. The portal rejects anything else before calling you.                                                                                      |
| Forwarded headers | `X-Request-Id` (log it; correlate with portal logs), `X-Forwarded-For` (the real client IP — use it for rate limiting and audit), `User-Agent`.                                            |
| Sudo              | Dangerous operations send `X-Sudo-Token` (from `POST /auth/reauthenticate`). If it's missing or expired, respond `403 REAUTH_REQUIRED`. The portal then asks for the password and retries. |
| Timeouts          | The portal gives up after 15 s (120 s for CSV exports).                                                                                                                                    |

---

## 2. Security duties of the API

The portal checks sessions and permissions before every page and action. That is **defence in depth**: it does not replace these checks in the API.

1. **Authorise every request** against the caller's permissions (§3), and scope by parish for parish-level admins. Check ownership of every ID you're given; never trust an ID because the portal sent it (IDOR).
2. **Passwords:** Argon2id. At least 12 characters. Reject passwords found in breach corpora (e.g. the Have I Been Pwned k-anonymity API) and ones matching the user's email.
3. **Login protection:** rate-limit by IP and by account, with progressive delays and a temporary lock after repeated failures. Return the **same** error for "no such user" and "wrong password".
4. **Tokens:** access tokens are short-lived (≈15 min). Refresh tokens are rotated on every use, with reuse detection that revokes the whole family. Store refresh tokens hashed. The portal keeps both in `httpOnly` `__Host-` cookies.
5. **Sessions:** track each session (device, IP, last active) for `/me/sessions`. Revoke every session on password reset, suspension or role removal. Enforce an idle timeout of about 30 minutes.
6. **Two-step verification (TOTP, RFC 6238):** 30-second step, ±1 step tolerance, reject reused codes. Recovery codes are single-use and stored hashed.
7. **Sudo tokens:** issued by `/auth/reauthenticate`, valid for about 5 minutes, bound to the session.
8. **Account enumeration:** `/auth/password/forgot` and `/auth/signup` must not reveal whether an email exists (send an email either way).
9. **Audit** every sign-in, failed sign-in, permission change, export, deletion, send and settings change (§12). Audit records are append-only.
10. **Email content** is a structured document (§8), never HTML. Render it to HTML **server-side** with every text value escaped. Only allow `https:` and `mailto:` links. Add the unsubscribe link, `List-Unsubscribe` and `List-Unsubscribe-Post` headers, and the organisation's postal address.
11. **Consent:** never email a contact without a recorded opt-in (source, time, IP, the admin who attested it). Unsubscribes, bounces and spam complaints permanently suppress the address, and imports must never re-subscribe it.
12. **CSV exports:** prefix any cell starting with `=`, `+`, `-`, `@`, tab or carriage return with `'` to prevent formula injection. Audit every export.
13. **Public form submissions:** rate-limit by IP and by form. Validate answers against the live form definition and drop unknown keys. Verify the CAPTCHA token if you enable one.
14. **Security headers** on API responses: `Cache-Control: no-store` for authenticated data.

---

## 3. Permissions

Returned per user in `GET /auth/me`, as `permissions: Permission[]`:

```
dashboard:view
members:view      members:manage    members:export
campaigns:view    campaigns:manage  campaigns:send
audiences:view    audiences:manage  templates:manage
forms:view        forms:manage
users:view        users:manage      roles:manage
audit:view        settings:manage
```

Plain-language descriptions shown in the role editor are in `src/lib/permission-catalog.ts`. The built-in **Owner** role holds every permission and is `locked: true`.

---

## 4. Authentication — `features/auth`

| Method & path                            | Body → `data`                                                                        | Notes                                                                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /auth/login`                       | `{ email, password, remember }` → `LoginResponse`                                    | `{status:"authenticated", tokens}` \| `{status:"mfa_required", challengeToken, expiresIn}` \| `{status:"email_unverified", email}`. Failure: `401 UNAUTHENTICATED`. |
| `POST /auth/mfa/verify`                  | `{ challengeToken, method:"totp"\|"recovery", code, rememberDevice }` → `AuthTokens` |                                                                                                                                                                     |
| `POST /auth/refresh`                     | `{ refreshToken }` → `AuthTokens`                                                    | Rotate the refresh token. Called by the portal proxy.                                                                                                               |
| `POST /auth/logout`                      | `{ refreshToken }` → 204                                                             | Revoke the session.                                                                                                                                                 |
| `GET /auth/me`                           | → `SessionUser`                                                                      | Called on every page load. Keep it fast.                                                                                                                            |
| `POST /auth/session/touch`               | → 204                                                                                | Keep-alive while the user is active.                                                                                                                                |
| `POST /auth/reauthenticate`              | `{ password }` → `{ sudoToken, expiresIn }`                                          | Rate-limit it.                                                                                                                                                      |
| `POST /auth/signup`                      | `{ name, email, phone, parishId, requestedRoleId, password }` → 201                  | Creates an **access request** (§11), not an active account. Sends a 6-digit code.                                                                                   |
| `POST /auth/verify-email`                | `{ email, code }` → 204                                                              | Code valid 15 min, 5 attempts.                                                                                                                                      |
| `POST /auth/verify-email/resend`         | `{ email }` → 204                                                                    | At most one every 45 s.                                                                                                                                             |
| `POST /auth/password/forgot`             | `{ email }` → 204                                                                    | Link `APP_URL/reset-password?token=…`, single use, 30 min.                                                                                                          |
| `POST /auth/password/reset`              | `{ token, password }` → 204                                                          | Revoke all sessions.                                                                                                                                                |
| `GET /public/parishes`                   | → `PublicParish[]`                                                                   | Sign-up form.                                                                                                                                                       |
| `GET /public/requestable-roles`          | → `PublicRole[]`                                                                     | `icon`: `church` \| `finance` \| `editor` \| `viewer` \| `admin`.                                                                                                   |
| `GET /public/invitations/:token`         | → `{ email, name, roleName, invitedBy, expiresAt }`                                  | `404` if invalid or expired.                                                                                                                                        |
| `POST /public/invitations/:token/accept` | `{ name, password }` → 204                                                           |                                                                                                                                                                     |

`AuthTokens = { accessToken, expiresIn, refreshToken, refreshExpiresIn }` (expiry values in seconds).

---

## 5. Account — `features/account`

| Method & path                                                        | Body → `data`                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `GET /me/profile` · `PATCH /me/profile`                              | `Profile` · `{ name, phone }`                                 |
| `POST /me/password`                                                  | `{ currentPassword, newPassword }`. Revoke other sessions.    |
| `GET /me/security`                                                   | `SecurityOverview` (MFA state, recovery codes left, sessions) |
| `POST /me/mfa/setup` 🔒sudo                                          | → `{ secret, otpauthUrl }`                                    |
| `POST /me/mfa/enable`                                                | `{ code }` → `{ recoveryCodes: string[] }` (10 codes)         |
| `DELETE /me/mfa` 🔒sudo                                              |                                                               |
| `POST /me/mfa/recovery-codes` 🔒sudo                                 | → `{ recoveryCodes }`                                         |
| `DELETE /me/sessions/:id` · `POST /me/sessions/revoke-others` 🔒sudo | → `{ revoked }`                                               |
| `GET/PUT /me/notification-preferences`                               | `NotificationPrefs`                                           |
| `GET /notifications?limit=15`                                        | `Notification[]` with `meta: { unread }`                      |
| `POST /notifications/read-all`                                       |                                                               |

---

## 6. Dashboard & lookups

| Method & path            | → `data`                                                                | Permission       |
| ------------------------ | ----------------------------------------------------------------------- | ---------------- |
| `GET /dashboard/summary` | `DashboardSummary`. Set a section to `null` when the user can't see it. | `dashboard:view` |
| `GET /lookups/parishes`  | `Parish[]`, scoped to the caller's parish when they have one            | any              |

---

## 7. Members — `features/members`

| Method & path                                                     | Body / query → `data`                                                                                         | Permission       |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------- |
| `GET /members`                                                    | list params + `status`, `parishId` → `Page<MemberSummary>`. `q` matches name, email, phone and member number. | `members:view`   |
| `GET /members/:id`                                                | → `Member`                                                                                                    | `members:view`   |
| `POST /members`                                                   | `MemberInput` → `Member`                                                                                      | `members:manage` |
| `PATCH /members/:id`                                              | `MemberInput`                                                                                                 | `members:manage` |
| `POST /members/bulk`                                              | `{ ids, action: "approve"\|"deactivate" }` → `{ updated }`                                                    | `members:manage` |
| `DELETE /members/:id` 🔒sudo · `POST /members/bulk-delete` 🔒sudo | `{ ids }` → `{ deleted }`                                                                                     | `members:manage` |
| `GET /members/export`                                             | same filters → CSV stream                                                                                     | `members:export` |

`emailConsent` must be recorded with who set it and when.

---

## 8. Email marketing

### Email document (`features/email-builder/types.ts`)

```ts
{ version: 1,
  settings: { accentColor: "#rrggbb", background: "light" | "muted" },
  blocks: Array<
    | { id, type: "heading", text, align }
    | { id, type: "text", text, align }            // plain text; **bold** allowed; \n = line break
    | { id, type: "button", label, url, align, style: "filled" | "outline" }
    | { id, type: "image", src, alt, href, width: "full" | "medium" }
    | { id, type: "divider" }
    | { id, type: "spacer", size: "sm" | "md" | "lg" } > }
```

Merge tags: `{{first_name}}`, `{{last_name}}`, `{{email}}`.

### Audiences — `features/audiences`

| Method & path                              | Body → `data`                                                        | Permission         |
| ------------------------------------------ | -------------------------------------------------------------------- | ------------------ |
| `GET /audiences` · `GET /audiences/:id`    | → `AudienceList[]` · `AudienceList`                                  | `audiences:view`   |
| `POST /audiences` · `PATCH /audiences/:id` | `{ name, description, doubleOptIn }`                                 | `audiences:manage` |
| `DELETE /audiences/:id` 🔒sudo             |                                                                      | `audiences:manage` |
| `GET /audiences/:id/contacts`              | list params + `status` → `Page<Contact>`                             | `audiences:view`   |
| `POST /audiences/:id/contacts`             | `{ email, firstName, lastName, consent: true }`                      | `audiences:manage` |
| `POST /audiences/:id/imports`              | `{ contacts: ≤500, consent: true, updateExisting }` → `ImportResult` | `audiences:manage` |
| `POST /audiences/:id/sync-members`         | `{ parishId? }` → `ImportResult`. Only members with `emailConsent`.  | `audiences:manage` |
| `POST /audiences/:id/contacts/remove`      | `{ ids }` → `{ removed }`                                            | `audiences:manage` |
| `POST /audiences/estimate`                 | `{ listIds }` → `{ count }`. Unique, subscribed addresses only.      | `campaigns:manage` |

### Templates — `features/templates`

`GET /templates?include=content` → `Template[]` · `GET/PATCH/DELETE /templates/:id` · `POST /templates` `{ name, content }` · `POST /templates/:id/duplicate`. Permission `templates:manage`; reading is also allowed for `campaigns:manage` (the composer's template picker).

### Campaigns — `features/campaigns`

| Method & path                                                           | Body → `data`                                                                           | Permission         |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------ |
| `GET /campaigns`                                                        | list params + `status` → `Page<CampaignSummary>`                                        | `campaigns:view`   |
| `GET /campaigns/:id` · `GET /campaigns/:id/report`                      | `Campaign` · `CampaignReport`                                                           | `campaigns:view`   |
| `POST /campaigns`                                                       | `{ name, content }` → `Campaign` (draft)                                                | `campaigns:manage` |
| `PATCH /campaigns/:id`                                                  | `{ setup?, audience?: { listIds }, content? }`. Drafts only; `409` otherwise.           | `campaigns:manage` |
| `POST /campaigns/:id/test`                                              | `{ emails: ≤5 }`. Rate-limit it.                                                        | `campaigns:manage` |
| `POST /campaigns/:id/schedule` 🔒sudo                                   | `{ sendAt }`                                                                            | `campaigns:send`   |
| `POST /campaigns/:id/send` 🔒sudo                                       | `{ expectedRecipients }`. Refuse with `409` if the real count differs by more than 5 %. | `campaigns:send`   |
| `POST /campaigns/:id/unschedule`                                        | back to draft                                                                           | `campaigns:send`   |
| `POST /campaigns/:id/duplicate` · `DELETE /campaigns/:id` (drafts only) |                                                                                         | `campaigns:manage` |
| `GET /email/sender-profile`                                             | `SenderProfile` (verified from-addresses, organisation name, postal address)            | `campaigns:view`   |

Before scheduling or sending, check that the subject, sender name, a from-address on a **verified** domain, at least one audience, valid content and a postal address are all present.

### Sending settings — `features/sending`

`GET/PUT /email/sending` (`SendingSettings`) · `POST /email/domains` 🔒sudo `{ domain }` · `POST /email/domains/:id/verify` · `DELETE /email/domains/:id` 🔒sudo. Permission `settings:manage`. Records should cover SPF, DKIM (2048-bit), DMARC and a custom return-path.

---

## 9. Forms — `features/forms`

| Method & path                                       | Body → `data`                                                                                                                                      | Permission           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `GET /forms`                                        | list params + `status` → `Page<FormSummary>`                                                                                                       | `forms:view`         |
| `GET /forms/:id`                                    | → `Form`                                                                                                                                           | `forms:view`         |
| `POST /forms`                                       | `{ title }` → `Form` (draft, generated `slug`)                                                                                                     | `forms:manage`       |
| `PATCH /forms/:id`                                  | `{ title?, description?, fields? }`                                                                                                                | `forms:manage`       |
| `PUT /forms/:id/settings`                           | `FormSettings`                                                                                                                                     | `forms:manage`       |
| `PUT /forms/:id/slug`                               | `{ slug }`. `409` if taken.                                                                                                                        | `forms:manage`       |
| `POST /forms/:id/publish` · `/close` · `/duplicate` |                                                                                                                                                    | `forms:manage`       |
| `DELETE /forms/:id` 🔒sudo                          | deletes all responses                                                                                                                              | `forms:manage`       |
| `GET /forms/:id/responses`                          | list params → `Page<FormResponse>`. `q` searches answers.                                                                                          | `forms:view`         |
| `POST /forms/:id/responses/delete` 🔒sudo           | `{ responseIds }` → `{ deleted }`                                                                                                                  | `forms:manage`       |
| `GET /forms/:id/responses/export`                   | CSV (one column per question, choice answers as labels)                                                                                            | `forms:view`         |
| `GET /public/forms/:slug`                           | → `PublicForm`. `404` for drafts.                                                                                                                  | public               |
| `POST /public/forms/:slug/responses`                | `{ answers, captchaToken? }`. Validate, enforce `closesAt` and `responseLimit`, notify `notifyEmails`, add consenting respondents to `audienceId`. | public, rate-limited |

---

## 10. Users & roles — `features/users`

| Method & path                                                                    | Body → `data`                                                     | Permission     |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------- |
| `GET /admin-users`                                                               | list params + `status`, `roleId` → `Page<AdminUser>`              | `users:view`   |
| `POST /admin-users/invitations` 🔒sudo                                           | `{ email, name, roleId }`. Link `APP_URL/invite/<token>`, 7 days. | `users:manage` |
| `POST /admin-users/:id/invitation/resend` · `DELETE /admin-users/:id/invitation` |                                                                   | `users:manage` |
| `PUT /admin-users/:id/role` 🔒sudo                                               | `{ roleId }`                                                      | `users:manage` |
| `POST /admin-users/:id/suspend` 🔒sudo · `/reactivate` 🔒sudo                    | Suspending revokes all sessions.                                  | `users:manage` |
| `POST /admin-users/:id/mfa/reset` 🔒sudo                                         |                                                                   | `users:manage` |
| `GET /roles` · `GET /roles/:id`                                                  | `Role[]` · `Role`                                                 | `users:view`   |
| `POST /roles` · `PUT /roles/:id` · `DELETE /roles/:id` (all 🔒sudo)              | `{ name, description, permissions }`                              | `roles:manage` |

Rules the API must enforce: nobody can change their own role, suspend themselves or reset their own two-step verification. The last active Owner can't be demoted or suspended. Only an Owner can grant `roles:manage`. A role that is still assigned can't be deleted (`409`).

---

## 11. Access requests

`GET /access-requests?status=pending` → `AccessRequest[]` · `POST /access-requests/:id/approve` 🔒sudo `{ roleId }` · `POST /access-requests/:id/reject` `{ reason? }`. Permission `users:manage`; only approve requests whose email has been verified.

---

## 12. Audit log — `features/audit`

`GET /audit-events` with list params + `severity`, `actorId`, `from` (ISO) → `Page<AuditEvent>` · `GET /audit-events/export` → CSV. Permission `audit:view`.

`action` uses `area.verb` names (`auth.login_failed`, `member.deleted`, `campaign.sent`, `role.updated`, …). `summary` is a readable sentence. `changes` holds before/after values for updates and must **never** contain passwords, tokens or secrets.
