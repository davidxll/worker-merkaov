# Waltkerovoz

An Angular 21 standalone PWA that serves two purposes: a **UI component showcase** and a **Gear Builder** — an interactive multi-step wizard for configuring a custom vehicle.

## Stack

| Library | Version | Role |
|---|---|---|
| Angular | 21 | Framework — standalone components, signal-based reactivity, new control flow (`@for`, `@if`) |
| PrimeNG | 21 | UI component library — buttons, cards, dialogs, inputs, tags, badges, chips, toast, avatars, progress bars |
| AG Grid Community | 36 | High-performance data grid with sorting, filtering, and pagination |
| Tailwind CSS | 3.4 | Utility-first CSS for layout and spacing via `@apply` |
| FontAwesome Free | 6 | Icon set (Solid, Regular, Brands) used as plain CSS classes |
| Angular Service Worker | 21 | PWA support — offline caching via `ngsw-config.json` |

## Prerequisites

- Node.js 20+
- npm 10+

## Getting started

```bash
npm install
npm start        # → http://localhost:4200
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build → `dist/waltkerovoz` |
| `npm run watch` | Dev build in watch mode (no server) |
| `npm test` | Karma/Jasmine unit tests |
| `npm run lint` | ESLint over `src/**/*.ts` |

## Pages

### `/` — Component Showcase

The home page is a self-contained showcase of the UI stack:

- **Hero** — landing section with tech chip pills
- **PrimeNG Buttons** — severities, styles, icon variants, loading state
- **PrimeNG Cards** — dashboard widgets with progress bars, avatars, and tags
- **Form Inputs** — live two-way binding with `ngModel`
- **Tags, Badges & Chips** — status labels and removable filter chips
- **AG Grid** — sortable/filterable employee table with custom cell colouring
- **PrimeNG Dialog** — basic modal and a confirm dialog with toast feedback
- **FontAwesome Icons** — icon tile grid

### `/gear-builder` — Vehicle Wizard

A 3-step wizard (Chassis → Engine → Styling) with:

- **Sticky HUD** — compact SVG vehicle preview updating in real time, plus build chips and step tab navigation
- **Full-width step sections** — option cards with collapsible spec panels, quick-select dropdowns, and "Compare All" side-by-side tables in modals
- **Sticky bottom nav bar** — Back / Continue / Finish Build with a live summary of selected options
- **Completion modal** — full build summary

All wizard state lives in `GearBuilderService` (`providedIn: 'root'`). The page contains only the template and styles.

## Project Structure

```
src/app/
├── app.ts                           # Root shell (mobile topbar + router outlet)
├── app.routes.ts                    # Lazy-loaded routes
├── app.config.ts                    # PrimeNG Aura theme + router providers
├── layout/
│   └── nav.component.ts             # Collapsible sidebar (desktop) / overlay drawer (mobile)
├── services/
│   ├── layout.service.ts            # Sidebar collapsed / mobileOpen signals
│   └── app.service.ts               # In-memory data provider
├── shared/
│   ├── components/                  # Hero, FeatureCards, Footer
│   └── modals/                      # ConfirmModal
├── models/models.ts                 # Shared TypeScript interfaces
└── features/
    ├── home/home.page.ts            # Showcase page
    └── gear-builder/
        ├── gear-builder.types.ts    # All types: WizardStep, GearBuild, option shapes
        ├── gear-builder.mock.ts     # Static option arrays (no API)
        ├── gear-builder.service.ts  # All wizard state, navigation, and actions
        ├── gear-builder.page.ts     # Template shell — injects service, no own signals
        ├── directives/
        │   └── wizard-step.directive.ts   # [wizardStep] attribute directive
        └── components/
            ├── vehicle-preview.component.ts   # SVG preview; [compact] strips card chrome
            ├── step-indicator.component.ts    # Step progress bar
            ├── chassis-step.component.ts
            ├── engine-step.component.ts
            └── styling-step.component.ts
```

## Adding a New Page

1. Create `src/app/features/<name>/<name>.page.ts` as a standalone component
2. Add a lazy route in `app.routes.ts`:
   ```ts
   { path: '<path>', loadComponent: () => import('./features/<name>/<name>.page').then(m => m.<Name>Page) }
   ```
3. Add a nav entry in `layout/nav.component.ts`

## PWA

Build for production and serve the output folder to test service worker behaviour:

```bash
npm run build
npx serve dist/waltkerovoz/browser
```

The service worker config is at `src/ngsw-config.json`. App shell files are prefetched on install; other assets are lazy-cached on first access.
