import {
  ChangeDetectionStrategy, Component, computed,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, Module } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { ELEMENTS } from '../element-explorer.mock.js';
import { ELEMENT_EXTENDED } from '../element-explorer.grid-data.js';
import type { ChemElement } from '../element-explorer.types.js';
import type { ElementExtended } from '../element-explorer.grid-data.js';

export interface RichElement extends ChemElement, ElementExtended {}

function mergeElements(): RichElement[] {
  return ELEMENTS.map(el => ({
    ...el,
    ...(ELEMENT_EXTENDED[el.number] ?? {
      meltingPoint: null, boilingPoint: null, density: null,
      electronConfig: '—', oxidationStates: '—',
      ionizationEnergy: null, atomicRadius: null,
      yearDiscovered: null, discoveredBy: '—',
    }),
  }));
}

const RICH_ELEMENTS: RichElement[] = mergeElements();

const CATEGORY_BADGE: Record<string, string> = {
  'alkali metal':            '#ef4444',
  'alkaline earth metal':    '#f97316',
  'transition metal':        '#eab308',
  'post-transition metal':   '#84cc16',
  'metalloid':               '#22d3ee',
  'nonmetal':                '#3b82f6',
  'halogen':                 '#a855f7',
  'noble gas':               '#ec4899',
  'lanthanide':              '#14b8a6',
  'actinide':                '#f59e0b',
};

function fmt(val: number | null, unit: string, decimals = 1): string {
  return val != null ? val.toFixed(decimals) + ' ' + unit : '—';
}

const COL_DEFS: ColDef[] = [
  // ── Identity ────────────────────────────────────────────────────────────────
  { field: 'number',   headerName: '#',           width: 60,  pinned: 'left', sort: 'asc',
    cellStyle: (p: { value: number }) => ({ color: 'var(--f-text-3)', fontWeight: 600 }) },
  { field: 'symbol',   headerName: 'Symbol',      width: 76,  pinned: 'left',
    cellStyle: () => ({ fontWeight: 700, fontSize: '15px', color: 'var(--f-accent)' }) },
  { field: 'name',     headerName: 'Name',        width: 130, filter: true },
  { field: 'atomicMass', headerName: 'Atomic Mass', width: 116 },
  {
    field: 'category', headerName: 'Category', width: 186, filter: true,
    cellRenderer: (p: { value: string }) => {
      const color = CATEGORY_BADGE[p.value] ?? '#6b7280';
      return `<span style="display:inline-flex;align-items:center;gap:6px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
        <span style="text-transform:capitalize;">${(p.value ?? '').replace(/-/g,' ')}</span>
      </span>`;
    },
  },
  // ── Quantum ──────────────────────────────────────────────────────────────────
  { field: 'block',  headerName: 'Block',  width: 80,  filter: true, valueFormatter: (p: { value: string }) => p.value + '-block' },
  { field: 'period', headerName: 'Period', width: 76,  filter: true },
  { field: 'group',  headerName: 'Group',  width: 76,  valueFormatter: (p: { value: number | null }) => p.value != null ? String(p.value) : 'f-block' },
  { field: 'electronConfig',     headerName: 'e⁻ Config',       width: 196,
    cellStyle: () => ({ fontFamily: 'monospace', fontSize: '12px' }) },
  { field: 'electronegativity',  headerName: 'Electronegativity', width: 148,
    valueFormatter: (p: { value: number | null }) => p.value != null ? p.value + ' (Pauling)' : '—' },
  { field: 'oxidationStates',    headerName: 'Oxidation States', width: 148 },
  { field: 'atomicRadius',       headerName: 'Radius (pm)',      width: 110,
    valueFormatter: (p: { value: number | null }) => fmt(p.value, 'pm', 0) },
  // ── Physical ─────────────────────────────────────────────────────────────────
  { field: 'state',    headerName: 'State (STP)', width: 116, filter: true,
    cellRenderer: (p: { value: string }) => {
      const icons: Record<string, string> = { solid: '🪨', liquid: '💧', gas: '💨', unknown: '❓' };
      return `<span>${icons[p.value] ?? ''} ${p.value}</span>`;
    },
  },
  { field: 'meltingPoint',     headerName: 'Melting Pt (K)',  width: 132, valueFormatter: (p: { value: number | null }) => fmt(p.value, 'K', 1) },
  { field: 'boilingPoint',     headerName: 'Boiling Pt (K)',  width: 132, valueFormatter: (p: { value: number | null }) => fmt(p.value, 'K', 1) },
  { field: 'density',          headerName: 'Density (g/cm³)', width: 140,
    valueFormatter: (p: { value: number | null }) => p.value != null ? p.value.toPrecision(4) + ' g/cm³' : '—' },
  { field: 'ionizationEnergy', headerName: '1st IE (kJ/mol)', width: 140,
    valueFormatter: (p: { value: number | null }) => fmt(p.value, 'kJ/mol', 0) },
  { field: 'radioactive', headerName: 'Radioactive', width: 112, filter: true,
    cellRenderer: (p: { value: boolean }) =>
      p.value ? '<span style="color:#f97316;">☢ Yes</span>' : '<span style="color:var(--f-text-3);">No</span>',
  },
  // ── Discovery ────────────────────────────────────────────────────────────────
  { field: 'yearDiscovered', headerName: 'Year',         width: 90,
    valueFormatter: (p: { value: number | null }) => p.value != null ? String(p.value) : 'Ancient' },
  { field: 'discoveredBy',   headerName: 'Discovered By', width: 200, filter: true },
];

const GRID_OPTIONS: GridOptions = {
  defaultColDef: { resizable: true, sortable: true },
  animateRows: true,
  enableCellTextSelection: true,
  suppressCellFocus: true,
  rowHeight: 40,
  headerHeight: 36,
};

@Component({
  selector: 'app-element-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridAngular],
  template: `
    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <i class="fas fa-table tbl-icon" aria-hidden="true"></i>
        <span class="tbl-title">Element Data Table</span>
        <span class="tbl-count">{{ rowData().length }} rows · 19 columns</span>
        <span class="tbl-hint">
          <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
          Use column filters to explore
        </span>
      </div>
      <ag-grid-angular
        class="ag-theme-alpine tbl-grid"
        [rowData]="rowData()"
        [columnDefs]="colDefs"
        [gridOptions]="gridOptions"
        [modules]="agModules"
      />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .tbl-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .tbl-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-bottom: 1px solid var(--f-stroke);
      flex-shrink: 0;
    }

    .tbl-icon { color: var(--f-accent); font-size: 16px; }

    .tbl-title {
      font-weight: 700;
      font-size: 14px;
      color: var(--f-text-1);
    }

    .tbl-count {
      font-size: 12px;
      color: var(--f-text-3);
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      border-radius: 20px;
      padding: 2px 10px;
    }

    .tbl-hint {
      font-size: 12px;
      color: var(--f-text-3);
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 6px;
      opacity: 0.7;
    }

    .tbl-grid {
      width: 100%;
      height: calc(100vh - 220px);
      min-height: 480px;
    }

    /* AG Grid token overrides scoped to this component */
    .ag-theme-alpine {
      --ag-background-color:           var(--f-layer-1);
      --ag-foreground-color:           var(--f-text-1);
      --ag-header-background-color:    var(--f-layer-2);
      --ag-header-foreground-color:    var(--f-text-2);
      --ag-odd-row-background-color:   rgba(255,255,255,0.025);
      --ag-row-hover-color:            rgba(58,143,200,0.10);
      --ag-selected-row-background-color: rgba(58,143,200,0.18);
      --ag-border-color:               var(--f-stroke);
      --ag-cell-horizontal-border:     solid 1px var(--f-stroke);
      --ag-input-focus-border-color:   var(--f-accent);
      --ag-range-selection-border-color: var(--f-accent);
      --ag-font-size:                  13px;
      --ag-font-family:                inherit;
      --ag-floating-filter-height:     34px;
    }
  `],
})
export class ElementTableComponent {
  protected readonly agModules: Module[] = [AllCommunityModule];
  protected readonly rowData = computed(() => RICH_ELEMENTS);
  protected readonly colDefs: ColDef[] = COL_DEFS;
  protected readonly gridOptions: GridOptions = GRID_OPTIONS;
}
