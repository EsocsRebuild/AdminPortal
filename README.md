# ESOCS — Admin Portal

Administration portal for the Eternal Sacred Order of Cherubim & Seraphim.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · TanStack Table v9 · cmdk · next-themes · Sonner

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3001
npm run validate     # lint + format + typecheck + unit tests
npm run test:e2e     # responsive + accessibility checks at phone / tablet / desktop
```

Open **`/design-system`** to see every token and component live.

## Structure

```
src/
├─ app/
│  ├─ globals.css              design tokens, themes, density, utilities
│  ├─ layout.tsx               fonts, providers, no-flash preferences script
│  ├─ (auth)/                   login, signup (3 steps), verify (6-digit code),
│  │                            forgot-password, reset-password
│  └─ (app)/                   everything behind the app shell
│     ├─ dashboard             reference: KPIs, chart, tasks, activity
│     ├─ members               reference: full DataTable module
│     ├─ settings              appearance, profile, notifications
│     ├─ design-system         living style guide
│     └─ [...slug]             placeholder for nav modules not built yet
├─ components/
│  ├─ ui/                      primitives (Button, Input, Select, Dialog, Sheet, Tabs, …)
│  ├─ data-table/              DataTable, ColumnHeader, FacetedFilter, selectColumn, …
│  ├─ layout/                  AppShell, Sidebar, Topbar, CommandMenu, Page, PageHeader
│  ├─ blocks/                  StatCard, StatusBadge
│  ├─ charts/                  Sparkline, StackedBarChart
│  ├─ auth/                    SessionProvider, <Can>, PasswordInput, PasswordStrength, AuthHeader
│  ├─ motion/                  PageTransition, Reveal, Stagger, CountUp, SuccessCheck
│  └─ theme/                   Providers, ThemeToggle, AppearanceSettings
├─ config/                     site, navigation, role → permission map
├─ hooks/                      usePreference, useHotkey, useMediaQuery, useDebouncedValue, useCopy
├─ lib/                        cn, formatters, typed API client, permissions, preferences, fixtures
└─ types/                      shared domain types
```

## Theming

Every colour is a **semantic token** (`bg-surface`, `text-muted-foreground`, `bg-primary`, `border-border`, …) that resolves differently per theme. Never use raw hex or palette steps in components.

| Preference   | Values                        | Where it lives                                    |
| ------------ | ----------------------------- | ------------------------------------------------- |
| Colour mode  | light · dark · system         | `class="dark"` on `<html>` (next-themes)          |
| Accent       | royal · gold · emerald · rose | `data-accent`                                     |
| Density      | comfortable · compact         | `data-density` → `h-control-*`, `h-row`, `p-card` |
| Sidebar      | expanded · collapsed (⌘B)     | `data-sidebar` → `rail:` variant                  |
| Sidebar tone | default · brand               | `data-sidebar-tone`                               |

Preferences are stored in localStorage and applied by an inline script before first paint (no flash). Read or change them with `usePreference("accent")`.

**Type:** Geist (UI, 14px base), Geist Mono (IDs, figures), Cormorant Garamond (brand only). Use `tabular` on numbers that line up.

**Sizes follow density:** use `h-control-sm|md|lg` rather than fixed heights so compact mode works. Touch devices always keep 44px targets.

## Motion

Motion should explain what changed, never slow anyone down. Built on `motion/react`, with `MotionConfig reducedMotion="user"` so the system "reduce motion" setting turns it off.

- **Pages** fade and rise in via `template.tsx` in each route group.
- **Sections** enter in sequence with `<Stagger>` / `<StaggerItem>`; single blocks with `<Reveal>`.
- **Indicators glide**: the active nav item (`layoutId`), tabs and segmented controls (`useSlidingIndicator`).
- **Numbers** count up once on screen (`<CountUp>`); chart bars and progress bars grow in.
- **Feedback**: buttons press in, errors shake, checks draw themselves (`<SuccessCheck>`), slow links show a spinner (`useLinkStatus`).
- Durations: 150–300ms for UI, up to 1.2s for celebratory moments. Use `ease-out-expo` for entrances.

## Responsive behaviour

- **≥ 1024px** persistent sidebar, collapsible to an icon rail.
- **< 1024px** sidebar becomes a drawer from the top bar.
- **< 768px** DataTables switch to cards (`renderMobileRow`), dialogs become bottom sheets, page actions go full-width, search collapses to an icon.
- Inputs use 16px text on phones so iOS never zooms on focus; safe-area insets are respected.

## Building a module

```tsx
// app/(app)/parishes/page.tsx
export default async function ParishesPage() {
  const parishes = await api.get<Paginated<Parish>>("/parishes");
  return (
    <Page>
      <PageHeader
        title="Parishes"
        actions={
          <Can permission="parishes:manage">
            <Button>Add parish</Button>
          </Can>
        }
      />
      <ParishesTable data={parishes.items} />
    </Page>
  );
}
```

1. Add the route under `app/(app)/`. It gets the shell automatically.
2. The nav entry already exists in `config/navigation.ts` (with its permission), and the `[...slug]` placeholder stops matching once your page exists.
3. Build tables with `columnHelper<T>()` + `<DataTable>`; see `members/_components/members-view.tsx`.
4. Gate UI with `<Can permission>` / `usePermission()`. **The API must enforce the same rules.** This only hides UI.

## Before production

- Replace `demoUser` in `app/layout.tsx` with the real session, and add a `proxy.ts` redirect for signed-out users.
- Replace `lib/fixtures.ts` with API calls via `lib/api.ts`.
- Swap `LogoMark` for the official crest.
