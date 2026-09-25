# Agent notes

- Next.js 16: read `node_modules/next/dist/docs/` before using unfamiliar APIs. Middleware is `src/proxy.ts`.
- TanStack Table is **v9** (`useTable`, `tableFeatures`, `columnHelper`). Its guides are in `node_modules/@tanstack/*/skills/`.
- **No mock data in the app.** All data comes from the API via `src/server/backend.ts`. Keep `docs/api-contract.md` in sync with every endpoint you call.
- Reads: `features/*/queries.ts` (`import "server-only"`, call `requirePermission` first). Writes: `features/*/actions.ts` with `secureAction`. Never call the API from client code.
- Never pass functions from Server Components to Client Components (e.g. `formatValue`); wrap the chart or control in a small client component instead.
- Use semantic colour tokens and density-aware sizes (`h-control-md`, `p-card`, `gap-page`). No raw colours in feature UI.
- Tailwind resolves `max-w-*` against `--spacing-*` before `--container-*`: don't reuse names across them.
- Grid wrappers around wide children need `grid-cols-[minmax(0,1fr)]`, or they overflow on phones.
- Use plain `@theme` / `@theme inline`, never `@theme static` (the IntelliSense extension can't parse it).
- Dialog state belongs in the dialog body (mounted only while open), not in reset-on-open effects; the React lint rules reject setState in effects.
- Run `npm run validate` before committing; `npm run test:e2e` for security headers and the public pages.
