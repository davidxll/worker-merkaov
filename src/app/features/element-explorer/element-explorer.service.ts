import { Injectable, computed, signal } from '@angular/core';
import {
  ELEMENTS, WIZARD_STEPS,
  CATEGORY_COLORS, STATE_COLORS, BLOCK_COLORS, PERIOD_COLORS,
} from './element-explorer.mock.js';
import type {
  ChemElement, TableConfig, LayoutStyle, ColorScheme, DetailLevel, FilterMode, WizardStep,
} from './element-explorer.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';

export { WIZARD_STEPS };

export interface ConfigChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

const EMPTY_CONFIG: TableConfig = {
  layout:      null,
  colorScheme: null,
  detailLevel: null,
  filter:      null,
};

@Injectable({ providedIn: 'root' })
export class ElementExplorerService {

  // ── Raw state ───────────────────────────────────────────────────────────────

  private readonly stepSig           = signal<number>(1);
  private readonly configSig         = signal<TableConfig>(EMPTY_CONFIG);
  private readonly completeSig       = signal<boolean>(false);
  private readonly selectedElementSig = signal<ChemElement | null>(null);

  // ── Public read-only signals ────────────────────────────────────────────────

  public readonly currentStep     = this.stepSig.asReadonly();
  public readonly config          = this.configSig.asReadonly();
  public readonly isComplete      = this.completeSig.asReadonly();
  public readonly selectedElement = this.selectedElementSig.asReadonly();
  public readonly totalSteps      = WIZARD_STEPS.length;
  public readonly allElements     = ELEMENTS;

  // ── Derived state ───────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const c = this.configSig();
    switch (this.stepSig()) {
      case 1: return c.layout      !== null;
      case 2: return c.colorScheme !== null;
      case 3: return c.detailLevel !== null;
      case 4: return this.canFinish();
      default: return false;
    }
  });

  public readonly canFinish = computed((): boolean => {
    const c = this.configSig();
    return c.layout !== null && c.colorScheme !== null
        && c.detailLevel !== null && c.filter !== null;
  });

  public readonly hasConfigStarted = computed((): boolean => {
    const c = this.configSig();
    return !!(c.layout || c.colorScheme || c.detailLevel || c.filter);
  });

  public readonly configChips = computed((): ConfigChip[] => {
    const c = this.configSig();
    return [
      { label: 'Layout',  icon: 'fas fa-table-cells-large', value: c.layout      },
      { label: 'Colors',  icon: 'fas fa-palette',           value: c.colorScheme },
      { label: 'Detail',  icon: 'fas fa-list',              value: c.detailLevel },
      { label: 'Filter',  icon: 'fas fa-filter',            value: c.filter      },
    ];
  });

  public readonly filteredElements = computed((): ChemElement[] => {
    const mode = this.configSig().filter;
    if (!mode || mode === 'all') return ELEMENTS;
    const metalCats = new Set([
      'alkali-metal','alkaline-earth-metal','transition-metal',
      'post-transition-metal','lanthanide','actinide',
    ]);
    switch (mode) {
      case 'metals':      return ELEMENTS.filter(e => metalCats.has(e.category));
      case 'nonmetals':   return ELEMENTS.filter(e => e.category === 'nonmetal' || e.category === 'halogen' || e.category === 'metalloid');
      case 'noble':       return ELEMENTS.filter(e => e.category === 'noble-gas');
      case 'radioactive': return ELEMENTS.filter(e => e.radioactive);
      default:            return ELEMENTS;
    }
  });

  // ── Element colour calculation ──────────────────────────────────────────────
  //
  // TODO (your contribution): implement this method.
  //
  // Given an element and a color scheme, return any valid CSS colour string.
  // The maps CATEGORY_COLORS, STATE_COLORS, BLOCK_COLORS, PERIOD_COLORS are
  // imported above for your use.
  //
  // Schemes to handle:
  //   'category' — look up el.category in CATEGORY_COLORS
  //   'state'    — look up el.state in STATE_COLORS
  //   'block'    — look up el.block in BLOCK_COLORS
  //   'period'   — look up el.period in PERIOD_COLORS
  //   'mono'     — return var(--f-accent) at different opacity levels
  //                (hint: el.electronegativity ranges from ~0.7 to ~4.0)
  //
  // Return '#6b7280' (neutral gray) as a sensible fallback.
  //
  public getElementColor(el: ChemElement, scheme: ColorScheme): string {
    // ← replace this placeholder with your implementation (5–10 lines)
    return '#6b7280';
  }

  // ── Panel / navigation ──────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const c = this.configSig();
    return (
      n <= this.stepSig() ||
      (n === 2 && c.layout      !== null) ||
      (n === 3 && c.colorScheme !== null) ||
      (n === 4 && c.detailLevel !== null)
    );
  }

  public nextStep(): void {
    if (this.stepSig() < this.totalSteps) this.stepSig.update(s => s + 1);
  }

  public prevStep(): void {
    if (this.stepSig() > 1) {
      this.stepSig.update(s => s - 1);
      this.completeSig.set(false);
    }
  }

  public jumpToStep(n: number): void {
    if (this.isStepReachable(n)) this.stepSig.set(n);
  }

  public finish(): void {
    if (this.canFinish()) this.completeSig.set(true);
  }

  public reset(): void {
    this.configSig.set(EMPTY_CONFIG);
    this.stepSig.set(1);
    this.completeSig.set(false);
    this.selectedElementSig.set(null);
  }

  // ── Selections ──────────────────────────────────────────────────────────────

  public selectLayout(id: LayoutStyle): void {
    this.configSig.update(c => ({ ...c, layout: id }));
  }

  public selectColorScheme(id: ColorScheme): void {
    this.configSig.update(c => ({ ...c, colorScheme: id }));
  }

  public selectDetailLevel(id: DetailLevel): void {
    this.configSig.update(c => ({ ...c, detailLevel: id }));
  }

  public selectFilter(id: FilterMode): void {
    this.configSig.update(c => ({ ...c, filter: id }));
  }

  // ── Element detail panel ────────────────────────────────────────────────────

  public selectElement(el: ChemElement | null): void {
    this.selectedElementSig.set(el);
  }

  // ── Grid position helpers ───────────────────────────────────────────────────

  public getGridRow(el: ChemElement): number {
    return el.group !== null ? el.period : el.fRow!;
  }

  public getGridCol(el: ChemElement): number {
    return el.group !== null ? el.group : el.fCol!;
  }

  // SVG preview coordinates (14px col width, 16px row height, +4px gap before f-block)
  public getSvgX(el: ChemElement): number {
    return (this.getGridCol(el) - 1) * 14;
  }

  public getSvgY(el: ChemElement): number {
    const row = this.getGridRow(el);
    return row <= 7 ? (row - 1) * 16 : (row - 1) * 16 + 4;
  }
}

// Provide the wizard-step service token so WizardStepDirective can inject it.
export const ELEMENT_EXPLORER_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: ElementExplorerService,
};
