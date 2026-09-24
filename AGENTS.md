# Agent notes

- Next.js 16: read `node_modules/next/dist/docs/` before using unfamiliar APIs. Middleware is now `proxy.ts`.
- TanStack Table is **v9** (`useTable`, `tableFeatures`, `columnHelper`), not v8. Its guides ship in `node_modules/@tanstack/*/skills/`.
- Use semantic colour tokens and density-aware sizes (`h-control-md`, `p-card`, `gap-page`). No raw colours.
- Tailwind resolves `max-w-*` against `--spacing-*` before `--container-*`. Don't give a container token the same name as a spacing token.
- Grid wrappers around wide children (tables, tab lists, charts) need `grid-cols-[minmax(0,1fr)]`, or they overflow on phones.
- Run `npm run validate` before committing.
- Use plain `@theme` / `@theme inline` in globals.css, never `@theme static`: the Tailwind IntelliSense extension (v0.16) can't parse the `static` modifier and flags every token as a CSS error.
