# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/waltkerovoz
npm run watch      # incremental dev build (no serve)
npm run lint       # ESLint over src/**/*.ts
npm test           # Karma/Jasmine unit tests
```

Dev server launch config lives in `.claude/launch.json` — use `preview_start` with the name `"waltkerovoz dev server"`.

## Git & Version Control

- **Never push to remote or open PRs** unless explicitly asked.
- **Local commits only** by default. Always confirm the exact repo path before any `git` operation.
- Never amend published commits or force-push.

## Dev Environment

- Run exactly **one dev server** at a time via the launch config above. Do not spin up secondary preview servers.
- If `ng` is not on PATH, use `npx ng serve` (e.g. for ad-hoc CLI commands outside the launch config).

## Build & Verification

After any code change, run the build and confirm it passes before reporting done:

```bash
npm run build   # or: npx ng build
```

- Stale errors can appear in IDE/LSP logs — treat the **build output** as the source of truth, not editor squiggles.
- For type-only checks without a full build: `npx tsc --noEmit`.

## Routing

Two distinct layouts coexist under a bare `<router-outlet>` in `AppComponent`:

```
/                → redirect → /welcome
/welcome         → WelcomePage          (full-width landing, no sidebar)
/app             → redirect → /app/home
/app/home        → AppShellComponent > HomePage
/app/gear-builder         → AppShellComponent > GearBuilderPage
/app/experiment-designer  → AppShellComponent > ExperimentDesignerPage
/app/element-explorer     → AppShellComponent > ElementExplorerPage
/app/mls-composer         → AppShellComponent > MlsComposerPage
/app/dream-space          → AppShellComponent > DreamSpacePage
/app/my-workflow          → AppShellComponent > MyWorkflowPage
/app/db-wizard            → AppShellComponent > DbWizardPage
/app/seances              → AppShellComponent > SeancesPage
/app/team-builder         → AppShellComponent > TeamBuilderPage
**               → redirect → /welcome
```

- **`/welcome`** — standalone marketing landing page with its own top nav. No sidebar. Links to `/app/*` routes via `routerLink`. Lives in `features/welcome/welcome.page.ts`.
- **`/app/*`** — the full app shell (sidebar + mobile topbar). `AppShellComponent` (`layout/app-shell.component.ts`) owns the shell layout; `AppComponent` (`app.ts`) is a bare `<router-outlet>`.

## Architecture

**Angular 21 standalone PWA.** No NgModules — every component, directive, and pipe is `standalone: true`. All routing is lazy-loaded via `loadComponent`.

### App shell

```
AppComponent (app.ts)          ← bare <router-outlet> only
  ├─ /welcome → WelcomePage    (no sidebar, own full-width nav)
  └─ /app     → AppShellComponent (layout/app-shell.component.ts)
                  ├─ mobile topbar (md:hidden)
                  ├─ NavComponent  (layout/nav.component.ts)
                  └─ <router-outlet>
                       ├─ /app/home                → HomePage
                       ├─ /app/gear-builder        → GearBuilderPage (wizard)
                       ├─ /app/experiment-designer → ExperimentDesignerPage (wizard)
                       ├─ /app/element-explorer    → ElementExplorerPage (wizard)
                       ├─ /app/mls-composer        → MlsComposerPage (wizard)
                       ├─ /app/dream-space         → DreamSpacePage (wizard)
                       ├─ /app/my-workflow         → MyWorkflowPage (wizard)
                       ├─ /app/db-wizard           → DbWizardPage (wizard)
                       ├─ /app/seances             → SeancesPage (wizard)
                       └─ /app/team-builder        → TeamBuilderPage (wizard)
```

`LayoutService` (`services/layout.service.ts`) is the single source of truth for sidebar collapsed/mobileOpen state. Inject it in any component that needs to read or mutate layout.

### Responsive layout

Three tiers, using Tailwind `md` (768 px) and `lg` (1024 px) breakpoints:

| Tier | Viewport | Topbar | Sidebar |
|------|----------|--------|---------|
| Mobile | < 768 px | sticky 48 px topbar + hamburger | hidden; slides in as overlay on open |
| Tablet | 768–1023 px | hidden (`md:hidden`) | always-visible, CSS-locked to 48 px icon-only |
| Desktop | ≥ 1024 px | hidden | user-controlled: 260 px expanded or 48 px collapsed |

`LayoutService.collapsed` and `mobileOpen` drive JS state. At tablet width the sidebar is forced to 48 px by a CSS media query regardless of `collapsed` — the toggle button is hidden at that breakpoint (`hidden lg:flex`).

Page-level HUD previews (vehicle SVG in Gear Builder, apparatus schematic in Experiment Designer, periodic table mini in Element Explorer) are hidden on mobile via `display: none` at `max-width: 767px`.

### Feature: Welcome / Landing (`features/welcome/welcome.page.ts`)

Full-width marketing landing page for the project. Has its own sticky top nav (no sidebar). Sections: hero, stats bar, feature cards, Gear Builder showcase, footer. Uses only `--f-*` and `--kr-*` CSS tokens — no raw colours. Links navigate into `/app/*` via Angular `routerLink`.

### Feature: Home page (`features/home/home.page.ts`)

The Home page is a **component showcase**, not a product feature. It renders `HeroComponent`, `FeatureCardsComponent`, and then inline sections demonstrating Krypton UI components (buttons, cards, tags, chips, avatars, progress bars, dialogs) and an AG Grid employee table. All data (nav items, employees, feature cards) comes from `AppService`, which returns static in-memory mocks via `of(...)` — there is no backend.

### Shared: Wizard-step directive (`shared/wizard-step.directive.ts`)

All nine wizard features share a single `wizardStep` directive. It depends on `WIZARD_STEP_SERVICE` — an `InjectionToken<IWizardStepService>` — which each service provides via `providers: [{ provide: WIZARD_STEP_SERVICE, useExisting: <FeatureService> }]`. The directive exposes `isActive`, `isDone`, `isReachable`, `label`, `icon`, and `sublabel` as computed signals; step sections reference it via `#ref="wizardStep"`.

`IWizardStepService` requires two members: `currentStep: Signal<number>` and `isStepReachable(n: number): boolean`. All three feature services satisfy this interface.

**Important:** use the directive as a plain attribute (`wizardStep`), not a property binding (`[wizardStep]`). The directive has no input named `wizardStep`; binding it causes a compile error.

Each wizard feature exports a provider constant to keep the page template clean:
```typescript
export const MY_WIZARD_PROVIDER = { provide: WIZARD_STEP_SERVICE, useExisting: MyService };
// In the page: providers: [MY_WIZARD_PROVIDER]
```

### Wizard feature file convention

Every wizard feature follows this layout:

```
features/{name}/
  {name}.types.ts    ← TS interfaces, union types, re-exports (use `export type` for re-exports)
  {name}.mock.ts     ← WIZARD_STEPS array + static option arrays + colour/data maps
  {name}.service.ts  ← All signals & computed; navigation; exports WIZARD_PROVIDER const
  {name}.page.ts     ← Template + styles only; injects service; no own signals
  components/        ← Sub-components (optional)
```

The service satisfies `IWizardStepService` and exports:
```typescript
export const FOO_WIZARD_PROVIDER = { provide: WIZARD_STEP_SERVICE, useExisting: FooService };
```

### Feature: Gear Builder (`features/gear-builder/`)

Wizard UI with a sticky HUD, full-width step sections, compare modals, and a completion modal. State lives entirely in `GearBuilderService` — the page is a thin shell that injects the service and wires the template.

| File | Role |
|---|---|
| `gear-builder.types.ts` | `GearBuild`, option ID types, option shapes, SVG specs. Re-exports `WizardStep` with `export type`. |
| `gear-builder.mock.ts` | Static option arrays (`CHASSIS_OPTIONS`, `ENGINE_OPTIONS`, etc.) |
| `gear-builder.service.ts` | All signals, computed values, navigation, selection, and compare-modal state. Provides `WIZARD_STEP_SERVICE`. |
| `gear-builder.page.ts` | Template + styles only; injects `GearBuilderService`; no own signals |
| `components/vehicle-preview.component.ts` | SVG vehicle preview; accepts `[compact]="true"` to strip card chrome when used in the HUD |

### Feature: Element Explorer (`features/element-explorer/`)

4-step "Build Your Periodic Table" wizard. Configures and renders a live 118-element periodic table.

| File | Role |
|---|---|
| `element-explorer.types.ts` | `ChemElement`, union types (`LayoutStyle`, `ColorScheme`, `DetailLevel`, `FilterMode`), option shapes. Re-exports `WizardStep` with `export type`. |
| `element-explorer.mock.ts` | All 118 elements as `ELEMENTS[]`, plus `WIZARD_STEPS`, option arrays, and colour maps (`CATEGORY_COLORS`, `STATE_COLORS`, `BLOCK_COLORS`, `PERIOD_COLORS`). |
| `element-explorer.service.ts` | Signals state; `filteredElements` computed; `getElementColor(el, scheme)` method (**stub — needs implementation**); grid helpers `getGridRow/Col`, `getSvgX/Y`. Exports `ELEMENT_EXPLORER_WIZARD_PROVIDER`. |
| `element-explorer.page.ts` | Template + styles; renders HUD with mini SVG preview, 4 step sections, full CSS Grid table on completion, element detail drawer. |

**Periodic table grid layout:** CSS Grid with `repeat(18, 1fr)` columns and 10 rows. Rows 1–7 are the 7 main periods. Row 8 is a visual separator (`f-sep`). Rows 9–10 hold the lanthanide / actinide f-block annex. Grid position is determined by `el.group` (main table) or `el.fRow`/`el.fCol` (f-block annex, `group === null`).

**`getElementColor(el, scheme)` is a user-implemented stub.** Colour maps are imported in the service; return any valid CSS colour string. Fallback: `'#6b7280'`.

### Signals pattern

- `private readonly xSig = signal<T>(...)` — raw writable signal, never exposed directly
- `public readonly x = this.xSig.asReadonly()` — externally readable
- `protected readonly y = computed(...)` — template-only derived state
- When a template consumes an Observable, convert it with `toSignal()` rather than using the `async` pipe or storing to a plain array. `toSignal` integrates with the signal graph and avoids manual subscription management.

### Angular architecture conventions

- **Smart/Dumb component pattern**: services hold all state and logic (smart); page/component templates are thin shells that inject the service and wire the template (dumb). Pages own no signals of their own.
- **Prefer shared directives and components** over duplicated logic. If two feature pages need the same behaviour, extract it to `src/app/shared/` first.
- **Before refactoring state or signals**, scan the templates and consumers to confirm how the data is actually used (signal, observable, or array), state the plan, and confirm before implementing. Mismatches between the refactor plan and template usage cause unnecessary backtracking.

### Styling

**Active theme: `src/styles.scss`** — the Crystalline Torque / Krypton design system, applied globally. Imports `src/krypton-theme.scss` and defines:
- `--f-*` token namespace: `--f-accent`, `--f-layer-0..3`, `--f-text-1..3`, `--f-stroke`, `--f-shadow-*`, `--f-acrylic-bg`, `--f-acrylic-blur`, `--f-ease`, etc.
- AG Grid Krypton overrides (`.ag-theme-alpine`)

**Reference & Active: `src/krypton-theme.scss`** — the canonical `--kr-*` token definitions with full design commentary. **Imported into the build** via `@use './krypton-theme'` in `styles.scss`. All `--kr-*` values in this file are the source of truth for colours, spacing, and typography.

All component styles use `--f-*` tokens exclusively — never raw colours. The acrylic pattern (`background: var(--f-acrylic-bg)` + `backdrop-filter: blur(var(--f-acrylic-blur))`) is used by the sticky nav and mobile topbar.

**Tailwind CSS** is used with `@apply` inside component `styles` blocks. The `tailwind.config.js` `primary` palette stops at shade 900 — there is no `primary-950` Tailwind class.

**Krypton UI** — hand-rolled component library in `src/app/shared/ui/` (button, card, chip, dialog, avatar, progress-bar, tag, toast). Replaces PrimeNG entirely. All components follow the standalone + OnPush pattern and use `--f-*` tokens.

**AG Grid v36** — `AllCommunityModule` registered once in `home.page.ts` via `ModuleRegistry.registerModules`. AG Grid is themed via CSS variable overrides in `styles.scss` under `.ag-theme-alpine`.

> **Theming pitfalls:** AG Grid v36 changed several internal class names from earlier versions — always verify against the v36 API when adding or fixing grid styles. After any styling change, visually verify **both light and dark** rendering.

Component style budget is raised to `16 kB` warning / `64 kB` error in `angular.json` to accommodate large page-level style blocks.

Component styles use native CSS nesting (`&:hover { }`, `&.active { }`) — supported by Angular 17+'s default Vite/esbuild pipeline.

### Access modifier convention

Use minimum-privilege access modifiers throughout:
- `private readonly` — injected services and internal signals
- `protected readonly` — template-bound computed/signals (not needed outside the class)
- `public readonly` — members consumed by other classes or the service contract

