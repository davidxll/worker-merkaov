# Waltkerovoz

An Angular 21 standalone PWA that serves two purposes: a **UI component showcase** and a **Gear Builder** — an interactive multi-step wizard for configuring a custom vehicle.

## Stack

| Library | Version | Role |
|---|---|---|
| Angular | 21 | Framework — standalone components, signal-based reactivity, new control flow (`@for`, `@if`) |
| Angular CDK | 21 | Clipboard, drag-and-drop, and layout utilities |
| AG Grid Community | 36 | High-performance data grid with sorting, filtering, and pagination |
| Tailwind CSS | 3.4 | Utility-first CSS for layout and spacing via `@apply` |
| FontAwesome Free | 6 | Icon set (Solid, Regular, Brands) used as plain CSS classes |

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

### `/app/home` — Component Showcase

A self-contained showcase of Krypton UI components and integration patterns:

- **Hero** — landing section with tech chip pills
- **Buttons, Cards, Tags** — Krypton UI component library demo
- **Form Inputs** — live two-way binding with `ngModel`
- **Avatars & Progress Bars** — UI component variants
- **AG Grid** — sortable/filterable employee table with custom cell colouring
- **Dialogs & Toast** — modals with confirmation and toast notifications
- **Angular CDK** — clipboard copy demo and drag-and-drop reordering
- **FontAwesome Icons** — icon tile grid

### `/app/gear-builder` — Gear Builder (Wizard)

A 3-step wizard (Structure → Drive → Finish) with:

- **Sticky HUD** — compact SVG preview updating in real time, plus build chips and step tab navigation
- **Full-width step sections** — option cards with collapsible spec panels, quick-select dropdowns, and "Compare All" side-by-side tables in modals
- **Sticky bottom nav bar** — Back / Continue / Finish Build with a live summary of selected options
- **Completion modal** — full build summary

### Additional Wizard Features

Nine total wizard features guide users through multi-step configuration flows:
- `/app/gear-builder` — Build a custom vehicle (Structure, Drive, Finish, Detail, Module)
- `/app/experiment-designer` — Configure a spectroscopy apparatus (Containment, Excitation, Detector, Output)
- `/app/element-explorer` — Build a periodic table (Layout, Colors, Detail Level, Filter)
- `/app/mls-composer` — Search real estate listings (Property Type, Price, Beds, Baths, Features)
- `/app/dream-space` — Design an impossible home (Realm, Form, Impossible Feature, Atmosphere)
- `/app/my-workflow` — Configure a workflow (Color, Size)
- `/app/db-wizard` — Configure a database (Engine, Pool, Indexes, Cache)
- `/app/seances` — Plan a Viking ritual (Offerings, Deity, Vessel)
- `/app/team-builder` — Build a project team (Project Info, Team, Tasks)

All wizard state lives in the feature's service (`providedIn: 'root'`). Pages contain only the template and styles; all logic and state management is in the service.

## Project Structure

```
src/app/
├── app.ts                           # Root shell (mobile topbar + router outlet)
├── app.routes.ts                    # Lazy-loaded routes (9 wizard features + home, welcome)
├── app.config.ts                    # Router providers
├── layout/
│   ├── app-shell.component.ts       # Shell layout (mobile topbar, sidebar, outlet)
│   └── nav.component.ts             # Collapsible sidebar (desktop) / overlay drawer (mobile)
├── services/
│   ├── layout.service.ts            # Sidebar collapsed / mobileOpen signals
│   └── app.service.ts               # In-memory nav items and feature card data
├── shared/
│   ├── ui/                          # Krypton UI component library
│   │   ├── button.component.ts
│   │   ├── card.component.ts
│   │   ├── chip.component.ts
│   │   ├── dialog.component.ts
│   │   ├── avatar.component.ts
│   │   ├── progress-bar.component.ts
│   │   ├── tag.component.ts
│   │   ├── toast.service.ts
│   │   └── toast-host.component.ts
│   ├── components/                  # Hero, FeatureCards, Footer, WizardResult
│   ├── wizard-step.directive.ts     # Shared by all 9 wizard features
│   └── wizard-nav.ts                # Shared navigation logic factory
├── models/models.ts                 # Shared TypeScript interfaces
└── features/
    ├── welcome/welcome.page.ts      # Marketing landing page
    ├── home/home.page.ts            # Component & CDK showcase
    ├── gear-builder/                # 5-step vehicle builder wizard
    ├── experiment-designer/         # 4-step apparatus designer wizard
    ├── element-explorer/            # 4-step periodic table builder wizard
    ├── mls-composer/                # 5-step real estate search wizard
    ├── dream-space/                 # 5-step impossible home designer wizard
    ├── my-workflow/                 # 3-step workflow config wizard
    ├── db-wizard/                   # 4-step database config wizard
    ├── seances/                     # 4-step ritual planner wizard
    └── team-builder/                # 3-step project team builder wizard
```

## Adding a New Page

1. Create `src/app/features/<name>/<name>.page.ts` as a standalone component
2. Add a lazy route in `app.routes.ts`:
   ```ts
   { path: '<path>', loadComponent: () => import('./features/<name>/<name>.page').then(m => m.<Name>Page) }
   ```
3. Add a nav entry in `layout/nav.component.ts`
