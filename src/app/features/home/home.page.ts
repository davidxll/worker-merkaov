import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { ButtonModule }      from 'primeng/button';
import { CardModule }        from 'primeng/card';
import { BadgeModule }       from 'primeng/badge';
import { TagModule }         from 'primeng/tag';
import { ChipModule }        from 'primeng/chip';
import { InputTextModule }   from 'primeng/inputtext';
import { DialogModule }      from 'primeng/dialog';
import { ToastModule }       from 'primeng/toast';
import { MessageService }    from 'primeng/api';
import { AvatarModule }      from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { AgGridAngular }     from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AppService }        from '../../services/app.service';
import type { Employee } from '../../models/models';
import { HeroComponent } from '../../shared/components/hero.component';
import { FeatureCardsComponent } from '../../shared/components/feature-cards.component';
import { FooterComponent } from '../../shared/components/footer.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    CommonModule, FormsModule,
    ButtonModule, CardModule, BadgeModule, TagModule, ChipModule,
    InputTextModule, DialogModule, ToastModule, AvatarModule, ProgressBarModule,
    AgGridAngular,
    HeroComponent, FeatureCardsComponent, FooterComponent,
  ],
  template: `
    <p-toast></p-toast>

    <app-hero></app-hero>
    <app-feature-cards></app-feature-cards>

    <!-- Buttons -->
    <section id="buttons" class="showcase-section alt-bg" aria-labelledby="h-buttons">
      <div class="showcase-header">
        <h2 id="h-buttons"><i class="fas fa-hand-pointer mr-3 text-primary-500" aria-hidden="true"></i>PrimeNG Buttons</h2>
        <p>
          <code class="code-tag">ButtonModule</code> provides severities, sizes, outlined,
          text, icon-only, and loading states — all driven by the Aura design token system.
        </p>
      </div>
      <div class="demo-block">
        <p class="demo-label">Severities</p>
        <div class="flex flex-wrap gap-3">
          <p-button label="Primary"></p-button>
          <p-button label="Secondary" severity="secondary"></p-button>
          <p-button label="Success"   severity="success"></p-button>
          <p-button label="Warning"   severity="warn"></p-button>
          <p-button label="Danger"    severity="danger"></p-button>
          <p-button label="Info"      severity="info"></p-button>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">Styles</p>
        <div class="flex flex-wrap gap-3">
          <p-button label="Outlined" [outlined]="true"></p-button>
          <p-button label="Text"     [text]="true"></p-button>
          <p-button label="Rounded"  [rounded]="true"></p-button>
          <p-button label="Raised"   [raised]="true"></p-button>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">With Icons</p>
        <div class="flex flex-wrap gap-3">
          <p-button label="Save"    icon="fas fa-floppy-disk"></p-button>
          <p-button label="Delete"  icon="fas fa-trash" severity="danger"></p-button>
          <p-button icon="fas fa-heart" [rounded]="true" severity="danger" ariaLabel="Add to favourites"></p-button>
          <p-button icon="fas fa-share-nodes" [rounded]="true" [outlined]="true" ariaLabel="Share"></p-button>
          <p-button label="Loading" [loading]="loadingBtn"
                    (onClick)="triggerLoading()" icon="fas fa-sync"></p-button>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section id="cards" class="showcase-section" aria-labelledby="h-cards">
      <div class="showcase-header">
        <h2 id="h-cards"><i class="fas fa-id-card mr-3 text-primary-500" aria-hidden="true"></i>PrimeNG Cards</h2>
        <p>
          <code class="code-tag">CardModule</code> provides a flexible container with
          header, content, and footer zones. Ideal for dashboard widgets and summary panels.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <p-card>
          <ng-template #header>
            <div class="card-media card-media--blue">
              <i class="fas fa-chart-line text-4xl text-white opacity-80" aria-hidden="true"></i>
            </div>
          </ng-template>
          <ng-template #title>Monthly Revenue</ng-template>
          <ng-template #subtitle>Finance &middot; Q2 2026</ng-template>
          <ng-template #content>
            <p class="card-body-text">Total revenue increased 18% compared to last quarter, driven by enterprise subscriptions.</p>
            <div class="mt-4">
              <div class="flex justify-between card-caption-text mb-1"><span>Target</span><span>74%</span></div>
              <p-progressbar [value]="74" [showValue]="false" styleClass="h-2"></p-progressbar>
            </div>
          </ng-template>
          <ng-template #footer>
            <p-button label="View Report" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></p-button>
          </ng-template>
        </p-card>

        <p-card>
          <ng-template #header>
            <div class="card-media card-media--purple">
              <i class="fas fa-users text-4xl text-white opacity-80" aria-hidden="true"></i>
            </div>
          </ng-template>
          <ng-template #title>Active Users</ng-template>
          <ng-template #subtitle>Platform &middot; Today</ng-template>
          <ng-template #content>
            <p class="card-body-text">3,842 users active across web and mobile. Peak hour was 2 PM with 612 concurrent sessions.</p>
            <div class="flex items-center gap-2 mt-4">
              <p-avatar icon="fas fa-user" shape="circle" styleClass="bg-primary-600 text-white"></p-avatar>
              <p-avatar icon="fas fa-user" shape="circle" styleClass="bg-purple-600 text-white"></p-avatar>
              <p-avatar icon="fas fa-user" shape="circle" styleClass="bg-emerald-600 text-white"></p-avatar>
              <span class="card-caption-text ml-1">+3,839 more</span>
            </div>
          </ng-template>
          <ng-template #footer>
            <p-button label="Analytics" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></p-button>
          </ng-template>
        </p-card>

        <p-card>
          <ng-template #header>
            <div class="card-media card-media--emerald">
              <i class="fas fa-shield-halved text-4xl text-white opacity-80" aria-hidden="true"></i>
            </div>
          </ng-template>
          <ng-template #title>System Health</ng-template>
          <ng-template #subtitle>Infrastructure &middot; Live</ng-template>
          <ng-template #content>
            <p class="card-body-text">All services operational. Uptime at 99.97% over the last 30 days.</p>
            <div class="flex gap-2 mt-4 flex-wrap">
              <p-tag value="API" severity="success"></p-tag>
              <p-tag value="DB"  severity="success"></p-tag>
              <p-tag value="CDN" severity="success"></p-tag>
              <p-tag value="Auth" severity="success"></p-tag>
            </div>
          </ng-template>
          <ng-template #footer>
            <p-button label="Status Page" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></p-button>
          </ng-template>
        </p-card>
      </div>
    </section>

    <!-- Inputs -->
    <section id="inputs" class="showcase-section alt-bg" aria-labelledby="h-inputs">
      <div class="showcase-header">
        <h2 id="h-inputs"><i class="fas fa-keyboard mr-3 text-primary-500" aria-hidden="true"></i>PrimeNG Form Inputs</h2>
        <p>
          <code class="code-tag">InputTextModule</code> plugs into Angular template-driven
          and reactive forms with live two-way binding.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <div class="form-field">
          <label class="form-label" for="input-full-name">Full Name</label>
          <input pInputText id="input-full-name" type="text" [(ngModel)]="formName" placeholder="Alice Martin" class="w-full" />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-email">Email Address</label>
          <input pInputText id="input-email" type="email" [(ngModel)]="formEmail" placeholder="alice@example.com" class="w-full" />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-search">Search</label>
          <input pInputText id="input-search" type="text" [(ngModel)]="formSearch" placeholder="Type to search..." class="w-full" />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-api-key">API Key <span class="field-hint">(disabled)</span></label>
          <input pInputText id="input-api-key" type="text" value="sk-&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" [disabled]="true" class="w-full opacity-50" />
        </div>
      </div>
      @if (formName) {
        <p class="mt-5" style="font-size:14px;color:var(--f-text-2);">
          Hello, <span style="color:var(--f-accent-light);font-weight:500;">{{ formName }}</span>! Live binding is working.
        </p>
      }
    </section>

    <!-- Tags / Badges / Chips -->
    <section id="tags" class="showcase-section" aria-labelledby="h-tags">
      <div class="showcase-header">
        <h2 id="h-tags"><i class="fas fa-tags mr-3 text-primary-500" aria-hidden="true"></i>Tags, Badges &amp; Chips</h2>
        <p>
          <code class="code-tag">TagModule</code>, <code class="code-tag">BadgeModule</code>,
          and <code class="code-tag">ChipModule</code> provide compact labelling primitives
          for statuses, counts, and removable filter tokens.
        </p>
      </div>
      <div class="demo-block">
        <p class="demo-label">Tags</p>
        <div class="flex flex-wrap gap-3">
          <p-tag value="New Feature" severity="info"    icon="fas fa-star"></p-tag>
          <p-tag value="In Progress" severity="warn"    icon="fas fa-hourglass-half"></p-tag>
          <p-tag value="Completed"   severity="success" icon="fas fa-check"></p-tag>
          <p-tag value="Blocked"     severity="danger"  icon="fas fa-ban"></p-tag>
          <p-tag value="Draft"                          icon="fas fa-pencil"></p-tag>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">Chips — click X to remove</p>
        <div class="flex flex-wrap gap-3">
          @for (chip of activeChips(); track chip) {
            <p-chip [label]="chip" [removable]="true" (onRemove)="removeChip(chip)"></p-chip>
          }
          @if (activeChips().length === 0) {
            <span style="font-size:13px;color:var(--f-text-3);font-style:italic;">All chips removed.</span>
          }
        </div>
      </div>
    </section>

    <!-- AG Grid -->
    <section id="grid" class="showcase-section alt-bg" aria-labelledby="h-grid">
      <div class="showcase-header">
        <h2 id="h-grid"><i class="fas fa-table-cells mr-3 text-primary-500" aria-hidden="true"></i>AG Grid Community</h2>
        <p>
          High-performance data grid with sorting, column resizing, and pagination.
          Uses <code class="code-tag">AllCommunityModule</code> from ag-grid v36 with a custom dark theme.
        </p>
      </div>
      <div class="ag-theme-alpine" style="height:380px; width:100%;">
        <ag-grid-angular
          [rowData]="employees()"
          [columnDefs]="colDefs"
          [gridOptions]="gridOptions"
          [animateRows]="true"
          [pagination]="true"
          [paginationPageSize]="5"
          style="height:100%; width:100%;">
        </ag-grid-angular>
      </div>
    </section>

    <!-- Dialog -->
    <section id="dialog" class="showcase-section" aria-labelledby="h-dialog">
      <div class="showcase-header">
        <h2 id="h-dialog"><i class="fas fa-window-maximize mr-3 text-primary-500" aria-hidden="true"></i>PrimeNG Dialog</h2>
        <p>
          <code class="code-tag">DialogModule</code> renders modal overlays with customisable
          headers, footers, and animation. Supports dragging and maximisation.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <p-button label="Basic Dialog"   icon="fas fa-message"             (onClick)="showDialog('basic')"></p-button>
        <p-button label="Confirm Dialog" icon="fas fa-triangle-exclamation" severity="warn" (onClick)="showDialog('confirm')"></p-button>
      </div>

      <p-dialog header="Welcome to Waltkerovoz" [(visible)]="dialogBasic"
                [modal]="true" [draggable]="true" [style]="{ width: '480px' }">
        <p class="dialog-text">
          This is a PrimeNG dialog. It supports rich content, form controls, and custom footers.
          Drag it by the header bar or press Escape to close.
        </p>
        <ng-template #footer>
          <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="dialogBasic = false"></p-button>
          <p-button label="Got it!" icon="fas fa-check" (onClick)="dialogBasic = false"></p-button>
        </ng-template>
      </p-dialog>

      <p-dialog header="Confirm Action" [(visible)]="dialogConfirm"
                [modal]="true" [style]="{ width: '400px' }">
        <div class="flex items-start gap-4">
          <i class="fas fa-triangle-exclamation shrink-0" style="color:var(--kr-warning);font-size:22px;margin-top:2px;" aria-hidden="true"></i>
          <p class="dialog-text">
            This action cannot be undone. Are you sure you want to permanently delete this record?
          </p>
        </div>
        <ng-template #footer>
          <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="dialogConfirm = false"></p-button>
          <p-button label="Delete" icon="fas fa-trash" severity="danger" (onClick)="onConfirmDelete()"></p-button>
        </ng-template>
      </p-dialog>
    </section>

    <!-- FontAwesome Icons -->
    <section id="icons" class="showcase-section alt-bg" aria-labelledby="h-icons">
      <div class="showcase-header">
        <h2 id="h-icons"><i class="fas fa-icons mr-3 text-primary-500" aria-hidden="true"></i>FontAwesome Free Icons</h2>
        <p>
          2,000+ free icons (Solid, Regular, Brands) via
          <code class="code-tag">&#64;fortawesome/fontawesome-free</code> — used as plain CSS classes.
        </p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        @for (icon of showcaseIcons; track icon.class) {
          <div class="icon-tile">
            <i [class]="icon.class + ' text-2xl text-primary-400'" aria-hidden="true"></i>
            <span class="icon-label">{{ icon.label }}</span>
          </div>
        }
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styles: [`
    /* ── Sections ── */
    .showcase-section {
      padding: 48px 40px;
      background: var(--f-layer-0);
      @media (max-width: 767px)                         { padding: 24px 16px; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 32px 24px; }
    }
    .alt-bg { background: var(--f-layer-1); }

    .showcase-header {
      margin-bottom: 28px;
      h2 {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        color: var(--f-text-1);
        margin: 0 0 8px;
        i { color: var(--f-accent-light); margin-right: 10px; font-size: 18px; }
      }
      p { font-size: 14px; color: var(--f-text-2); line-height: 1.5; margin: 0; }
    }

    /* ── Demo blocks ── */
    .demo-block  { margin-bottom: 28px; }
    .demo-label  {
      font-size: 11px;
      font-weight: 600;
      color: var(--f-text-3);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }

    /* ── Forms ── */
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 13px; font-weight: 400; color: var(--f-text-2); }

    /* ── Cards (PrimeNG p-card media headers) ── */
    .card-media {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      border-radius: 8px 8px 0 0;
    }
    .card-media--blue   {
      background: var(--f-layer-0);
      border-bottom: 1px solid var(--f-stroke-sd);
      box-shadow: inset 0 -1px 0 rgba(126,200,227,0.12);
      i { color: var(--f-accent-light); }
    }
    .card-media--purple {
      background: var(--f-layer-0);
      border-bottom: 1px solid var(--f-stroke-sd);
      box-shadow: inset 0 -1px 0 rgba(107,191,160,0.18);
      i { color: var(--kr-crystal-light); }
    }
    .card-media--emerald {
      background: var(--f-layer-0);
      border-bottom: 1px solid var(--f-stroke-sd);
      box-shadow: inset 0 -1px 0 rgba(200,148,58,0.18);
      i { color: var(--kr-corona-light); }
    }

    /* ── Icon tiles ── */
    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 14px;
      border-radius: 4px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-2);
      font-size: 12px;
      cursor: default;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
    }

    /* ── Inline code ── */
    .code-tag {
      font-family: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
      font-size: 12px;
      background: var(--kr-primary-ghost);
      color: var(--f-accent-light);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--f-stroke-sd);
    }
  `],
})
export class HomePage {
  private readonly svc     = inject(AppService);
  private readonly msgSvc  = inject(MessageService);

  constructor() {
    inject(Title).setTitle('Home — Waltkerovoz');
    this.svc.getEmployees().subscribe(d => this.employees.set(d));
  }

  protected employees   = signal<Employee[]>([]);
  protected activeChips = signal(['Angular 21', 'PrimeNG', 'AG Grid', 'Tailwind', 'FontAwesome']);

  protected loadingBtn:    boolean = false;
  protected dialogBasic:   boolean = false;
  protected dialogConfirm: boolean = false;
  protected formName:      string  = '';
  protected formEmail:     string  = '';
  protected formSearch:    string  = '';

  protected readonly showcaseIcons: Array<{ class: string; label: string }> = [
    { class: 'fas fa-house',           label: 'house'    },
    { class: 'fas fa-user',            label: 'user'     },
    { class: 'fas fa-gear',            label: 'gear'     },
    { class: 'fas fa-bell',            label: 'bell'     },
    { class: 'fas fa-magnifying-glass',label: 'search'   },
    { class: 'fas fa-envelope',        label: 'envelope' },
    { class: 'fas fa-star',            label: 'star'     },
    { class: 'fas fa-heart',           label: 'heart'    },
    { class: 'fas fa-lock',            label: 'lock'     },
    { class: 'fas fa-cloud',           label: 'cloud'    },
    { class: 'fas fa-database',        label: 'database' },
    { class: 'fas fa-chart-bar',       label: 'chart-bar'},
    { class: 'fas fa-file-code',       label: 'file-code'},
    { class: 'fas fa-shield-halved',   label: 'shield'   },
    { class: 'fas fa-rocket',          label: 'rocket'   },
    { class: 'fab fa-github',          label: 'github'   },
  ];

  protected readonly colDefs: ColDef<Employee>[] = [
    { field: 'name',       headerName: 'Name',       flex: 1.5, sortable: true, filter: true },
    { field: 'role',       headerName: 'Role',       flex: 1.5, sortable: true, filter: true },
    { field: 'department', headerName: 'Department', flex: 1,   sortable: true, filter: true },
    { field: 'location',   headerName: 'Location',   flex: 1,   sortable: true               },
    {
      field: 'salary', headerName: 'Salary', flex: 1, sortable: true,
      valueFormatter: p => p.value ? `$${p.value.toLocaleString()}` : '',
    },
    {
      field: 'status', headerName: 'Status', flex: 1, sortable: true,
      cellStyle: p => {
        const map: Record<string, string> = {
          'Active':   'var(--kr-success)',
          'Inactive': 'var(--f-text-2)',
          'On Leave': 'var(--kr-warning)',
        };
        return { color: map[p.value] ?? 'var(--f-text-1)', fontWeight: '500' };
      },
    },
  ];

  protected readonly gridOptions: GridOptions<Employee> = {
    defaultColDef:    { resizable: true, minWidth: 80 },
    rowSelection:     'multiple' as const,
    suppressCellFocus: true,
  };

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  protected triggerLoading(): void {
    this.loadingBtn = true;
    setTimeout(() => (this.loadingBtn = false), 1800);
  }

  protected removeChip(chip: string): void {
    this.activeChips.update(chips => chips.filter(c => c !== chip));
  }

  protected showDialog(type: 'basic' | 'confirm'): void {
    if (type === 'basic')   this.dialogBasic   = true;
    if (type === 'confirm') this.dialogConfirm = true;
  }

  protected onConfirmDelete(): void {
    this.dialogConfirm = false;
    this.msgSvc.add({ severity: 'success', summary: 'Done', detail: 'Record deleted (demo).' });
  }
}
