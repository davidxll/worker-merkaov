import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import {
  AppButtonComponent, AppCardComponent, AppTagComponent, AppChipComponent,
  AppAvatarComponent, AppProgressBarComponent, AppDialogComponent,
  ToastService, ToastHostComponent,
} from '../../shared/ui/index.js';
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
  providers: [ToastService],
  imports: [
    CommonModule, FormsModule,
    AppButtonComponent, AppCardComponent, AppTagComponent, AppChipComponent,
    AppAvatarComponent, AppProgressBarComponent, AppDialogComponent, ToastHostComponent,
    AgGridAngular,
    HeroComponent, FeatureCardsComponent, FooterComponent,
  ],
  template: `
    <app-toast-host></app-toast-host>

    <app-hero></app-hero>
    <app-feature-cards></app-feature-cards>

    <!-- Buttons -->
    <section id="buttons" class="showcase-section alt-bg" aria-labelledby="h-buttons">
      <div class="showcase-header">
        <h2 id="h-buttons"><i class="fas fa-hand-pointer mr-3 text-primary-500" aria-hidden="true"></i>Buttons</h2>
        <p>
          <code class="code-tag">AppButtonComponent</code> provides severities, sizes, outlined,
          text, icon-only, and loading states — all driven by the Krypton design token system.
        </p>
      </div>
      <div class="demo-block">
        <p class="demo-label">Severities</p>
        <div class="flex flex-wrap gap-3">
          <app-button label="Primary"></app-button>
          <app-button label="Secondary" severity="secondary"></app-button>
          <app-button label="Success"   severity="success"></app-button>
          <app-button label="Warning"   severity="warn"></app-button>
          <app-button label="Danger"    severity="danger"></app-button>
          <app-button label="Info"      severity="info"></app-button>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">Styles</p>
        <div class="flex flex-wrap gap-3">
          <app-button label="Outlined" [outlined]="true"></app-button>
          <app-button label="Text"     [text]="true"></app-button>
          <app-button label="Rounded"  [rounded]="true"></app-button>
          <app-button label="Raised"   [raised]="true"></app-button>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">With Icons</p>
        <div class="flex flex-wrap gap-3">
          <app-button label="Save"    icon="fas fa-floppy-disk"></app-button>
          <app-button label="Delete"  icon="fas fa-trash" severity="danger"></app-button>
          <app-button icon="fas fa-heart" [rounded]="true" severity="danger" ariaLabel="Add to favourites"></app-button>
          <app-button icon="fas fa-share-nodes" [rounded]="true" [outlined]="true" ariaLabel="Share"></app-button>
          <app-button label="Loading" [loading]="loadingBtn()"
                    (clicked)="triggerLoading()" icon="fas fa-sync"></app-button>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section id="cards" class="showcase-section" aria-labelledby="h-cards">
      <div class="showcase-header">
        <h2 id="h-cards"><i class="fas fa-id-card mr-3 text-primary-500" aria-hidden="true"></i>Cards</h2>
        <p>
          <code class="code-tag">AppCardComponent</code> provides a flexible container with
          header, content, and footer zones. Ideal for dashboard widgets and summary panels.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-card>
          <div card-header class="card-media card-media--blue">
            <i class="fas fa-chart-line text-4xl text-white opacity-80" aria-hidden="true"></i>
          </div>
          <div card-title>Monthly Revenue</div>
          <div card-subtitle>Finance &middot; Q2 2026</div>
          <div card-content>
            <p class="card-body-text">Total revenue increased 18% compared to last quarter, driven by enterprise subscriptions.</p>
            <div class="mt-4">
              <div class="flex justify-between card-caption-text mb-1"><span>Target</span><span>74%</span></div>
              <app-progress-bar [value]="74" [showValue]="false"></app-progress-bar>
            </div>
          </div>
          <div card-footer>
            <app-button label="View Report" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></app-button>
          </div>
        </app-card>

        <app-card>
          <div card-header class="card-media card-media--purple">
            <i class="fas fa-users text-4xl text-white opacity-80" aria-hidden="true"></i>
          </div>
          <div card-title>Active Users</div>
          <div card-subtitle>Platform &middot; Today</div>
          <div card-content>
            <p class="card-body-text">3,842 users active across web and mobile. Peak hour was 2 PM with 612 concurrent sessions.</p>
            <div class="flex items-center gap-2 mt-4">
              <app-avatar icon="fas fa-user" shape="circle" styleClass="bg-primary-600 text-white"></app-avatar>
              <app-avatar icon="fas fa-user" shape="circle" styleClass="bg-purple-600 text-white"></app-avatar>
              <app-avatar icon="fas fa-user" shape="circle" styleClass="bg-emerald-600 text-white"></app-avatar>
              <span class="card-caption-text ml-1">+3,839 more</span>
            </div>
          </div>
          <div card-footer>
            <app-button label="Analytics" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></app-button>
          </div>
        </app-card>

        <app-card>
          <div card-header class="card-media card-media--emerald">
            <i class="fas fa-shield-halved text-4xl text-white opacity-80" aria-hidden="true"></i>
          </div>
          <div card-title>System Health</div>
          <div card-subtitle>Infrastructure &middot; Live</div>
          <div card-content>
            <p class="card-body-text">All services operational. Uptime at 99.97% over the last 30 days.</p>
            <div class="flex gap-2 mt-4 flex-wrap">
              <app-tag value="API" severity="success"></app-tag>
              <app-tag value="DB"  severity="success"></app-tag>
              <app-tag value="CDN" severity="success"></app-tag>
              <app-tag value="Auth" severity="success"></app-tag>
            </div>
          </div>
          <div card-footer>
            <app-button label="Status Page" icon="fas fa-arrow-right" iconPos="right" [text]="true" size="small"></app-button>
          </div>
        </app-card>
      </div>
    </section>

    <!-- Inputs -->
    <section id="inputs" class="showcase-section alt-bg" aria-labelledby="h-inputs">
      <div class="showcase-header">
        <h2 id="h-inputs"><i class="fas fa-keyboard mr-3 text-primary-500" aria-hidden="true"></i>Form Inputs</h2>
        <p>
          The <code class="code-tag">.k-input</code> class plugs into Angular template-driven
          and reactive forms with live two-way binding.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <div class="form-field">
          <label class="form-label" for="input-full-name">Full Name</label>
          <input class="k-input w-full" id="input-full-name" type="text" [(ngModel)]="formName" placeholder="Alice Martin" />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-email">Email Address</label>
          <input class="k-input w-full" id="input-email" type="email" [(ngModel)]="formEmail" placeholder="alice@example.com" />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-search">Search</label>
          <input class="k-input w-full" id="input-search" type="text" [(ngModel)]="formSearch" placeholder="Type to search..." />
        </div>
        <div class="form-field">
          <label class="form-label" for="input-api-key">API Key <span class="field-hint">(disabled)</span></label>
          <input class="k-input w-full opacity-50" id="input-api-key" type="text" value="sk-&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" [disabled]="true" />
        </div>
      </div>
      @if (formName) {
        <p class="mt-5" style="font-size:14px;color:var(--f-text-2);">
          Hello, <span style="color:var(--f-accent-light);font-weight:500;">{{ formName }}</span>! Live binding is working.
        </p>
      }
    </section>

    <!-- Tags / Chips -->
    <section id="tags" class="showcase-section" aria-labelledby="h-tags">
      <div class="showcase-header">
        <h2 id="h-tags"><i class="fas fa-tags mr-3 text-primary-500" aria-hidden="true"></i>Tags &amp; Chips</h2>
        <p>
          <code class="code-tag">AppTagComponent</code> and <code class="code-tag">AppChipComponent</code>
          provide compact labelling primitives for statuses and removable filter tokens.
        </p>
      </div>
      <div class="demo-block">
        <p class="demo-label">Tags</p>
        <div class="flex flex-wrap gap-3">
          <app-tag value="New Feature" severity="info"    icon="fas fa-star"></app-tag>
          <app-tag value="In Progress" severity="warn"    icon="fas fa-hourglass-half"></app-tag>
          <app-tag value="Completed"   severity="success" icon="fas fa-check"></app-tag>
          <app-tag value="Blocked"     severity="danger"  icon="fas fa-ban"></app-tag>
          <app-tag value="Draft"                          icon="fas fa-pencil"></app-tag>
        </div>
      </div>
      <div class="demo-block">
        <p class="demo-label">Chips — click X to remove</p>
        <div class="flex flex-wrap gap-3">
          @for (chip of activeChips(); track chip) {
            <app-chip [label]="chip" [removable]="true" (remove)="removeChip(chip)"></app-chip>
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
        <h2 id="h-dialog"><i class="fas fa-window-maximize mr-3 text-primary-500" aria-hidden="true"></i>Dialogs</h2>
        <p>
          <code class="code-tag">AppDialogComponent</code> renders modal overlays with customisable
          headers and footers, closing on backdrop click or Escape.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <app-button label="Basic Dialog"   icon="fas fa-message"             (clicked)="showDialog('basic')"></app-button>
        <app-button label="Confirm Dialog" icon="fas fa-triangle-exclamation" severity="warn" (clicked)="showDialog('confirm')"></app-button>
      </div>

      <app-dialog header="Welcome to Waltkerovoz" [(visible)]="dialogBasic" [modal]="true" width="480px">
        <p class="dialog-text">
          This is a hand-rolled dialog. It supports rich content, form controls, and custom footers.
          Press Escape or click the backdrop to close.
        </p>
        <ng-container dialogFooter>
          <app-button label="Cancel" [text]="true" severity="secondary" (clicked)="dialogBasic.set(false)"></app-button>
          <app-button label="Got it!" icon="fas fa-check" (clicked)="dialogBasic.set(false)"></app-button>
        </ng-container>
      </app-dialog>

      <app-dialog header="Confirm Action" [(visible)]="dialogConfirm" [modal]="true" width="400px">
        <div class="flex items-start gap-4">
          <i class="fas fa-triangle-exclamation shrink-0" style="color:var(--kr-warning);font-size:22px;margin-top:2px;" aria-hidden="true"></i>
          <p class="dialog-text">
            This action cannot be undone. Are you sure you want to permanently delete this record?
          </p>
        </div>
        <ng-container dialogFooter>
          <app-button label="Cancel" [text]="true" severity="secondary" (clicked)="dialogConfirm.set(false)"></app-button>
          <app-button label="Delete" icon="fas fa-trash" severity="danger" (clicked)="onConfirmDelete()"></app-button>
        </ng-container>
      </app-dialog>
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
    .k-input {
      display: block;
      height: 36px;
      padding: 0 12px;
      border-radius: var(--kr-radius);
      background: var(--kr-layer-2);
      color: var(--kr-text-1);
      border: 1px solid var(--kr-stroke-sd);
      font-family: inherit;
      font-size: 14px;
      transition: border-color 150ms var(--f-ease);
      &:hover:not(:disabled)  { border-color: var(--kr-primary); }
      &:focus                 { outline: none; border-color: var(--kr-primary); box-shadow: var(--kr-primary-glow); }
      &::placeholder          { color: var(--f-text-3); }
      &:disabled              { cursor: not-allowed; }
    }

    /* ── Cards (media headers) ── */
    .card-media {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
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
  private readonly toastSvc = inject(ToastService);

  constructor() {
    inject(Title).setTitle('Home — Waltkerovoz');
    this.svc.getEmployees().subscribe(d => this.employees.set(d));
  }

  protected employees   = signal<Employee[]>([]);
  protected activeChips = signal(['Angular 21', 'Krypton UI', 'AG Grid', 'Tailwind', 'FontAwesome']);

  protected loadingBtn    = signal(false);
  protected dialogBasic   = signal(false);
  protected dialogConfirm = signal(false);
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
    this.loadingBtn.set(true);
    setTimeout(() => this.loadingBtn.set(false), 1800);
  }

  protected removeChip(chip: string): void {
    this.activeChips.update(chips => chips.filter(c => c !== chip));
  }

  protected showDialog(type: 'basic' | 'confirm'): void {
    if (type === 'basic')   this.dialogBasic.set(true);
    if (type === 'confirm') this.dialogConfirm.set(true);
  }

  protected onConfirmDelete(): void {
    this.dialogConfirm.set(false);
    this.toastSvc.add({ severity: 'success', summary: 'Done', detail: 'Record deleted (demo).' });
  }
}
