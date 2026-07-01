import { computed, Injectable, signal } from '@angular/core';
import { WIZARD_STEPS, COLOR_OPTIONS, SIZE_OPTIONS } from './my-workflow.mock.js';
import type { MyBuild, ColorId, SizeId } from './my-workflow.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { createWizardNav } from '../../shared/wizard-nav.js';

// ── HUD chips ────────────────────────────────────────────────────────────────

export interface BuildChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class MyWorkflowService {

  // ── State ─────────────────────────────────────────────────────────────────

  private readonly stepSig  = signal<number>(1);
  private readonly buildSig = signal<MyBuild>({ color: null, size: null });

  public readonly currentStep = this.stepSig.asReadonly();
  public readonly build       = this.buildSig.asReadonly();

  // ── Selected lookups ──────────────────────────────────────────────────────

  private readonly selectedColor = computed(() =>
    COLOR_OPTIONS.find(o => o.id === this.buildSig().color) ?? null,
  );
  private readonly selectedSize = computed(() =>
    SIZE_OPTIONS.find(o => o.id === this.buildSig().size) ?? null,
  );

  // ── Derived state ─────────────────────────────────────────────────────────

  public readonly colorHex = computed(() => this.selectedColor()?.hex ?? null);
  public readonly colorTextHex = computed(() => this.selectedColor()?.textHex ?? null);

  public readonly canAdvance = computed((): boolean => {
    const b = this.buildSig();
    switch (this.stepSig()) {
      case 1: return b.color !== null;
      case 2: return b.size  !== null;
      default: return false;
    }
  });

  public readonly hasBuildStarted = computed((): boolean => {
    const b = this.buildSig();
    return !!(b.color || b.size);
  });

  public readonly buildChips = computed((): BuildChip[] => [
    { label: 'Color', icon: 'fas fa-palette', value: this.selectedColor()?.name ?? null },
    { label: 'Size',  icon: 'fas fa-ruler',   value: this.selectedSize()?.name  ?? null },
  ]);

  public readonly resultData = computed((): WizardResultData => {
    const color = this.selectedColor();
    const size  = this.selectedSize();
    return {
      title:       'Your selection is complete!',
      description: 'Configuration saved. Export as JSON to use this build downstream.',
      rows: [
        { label: 'Color',      value: color?.name    ?? '—' },
        { label: 'Tagline',    value: color?.tagline ?? '—' },
        { label: 'Feel',       value: color?.feel    ?? '—' },
        { label: 'Size',       value: size?.name     ?? '—' },
        { label: 'Scale',      value: size ? `${size.scale}/10`     : '—' },
        { label: 'Weight',     value: size ? `${size.weight}/10`    : '—' },
        { label: 'Footprint',  value: size ? `${size.footprint}/10` : '—' },
      ],
      jsonPayload: { color: this.buildSig().color, size: this.buildSig().size },
    };
  });

  // ── Step navigation ───────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const b = this.buildSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return b.color !== null;
    return false;
  }

  private readonly nav = createWizardNav({
    stepSig:         this.stepSig,
    totalSteps:      WIZARD_STEPS.length,
    isStepReachable: n => this.isStepReachable(n),
    canAdvance:      () => this.canAdvance(),
  });

  public nextStep(): void   { this.nav.nextStep(); }
  public prevStep(): void   { this.nav.prevStep(); }
  public jumpToStep(n: number): void { this.nav.jumpToStep(n); }
  public finish(): void     { this.nav.finish(); }

  public reset(): void {
    this.buildSig.set({ color: null, size: null });
    this.stepSig.set(1);
  }

  // ── Selection ─────────────────────────────────────────────────────────────

  public selectColor(id: ColorId): void { this.buildSig.update(b => ({ ...b, color: id })); }
  public selectSize(id: SizeId):   void { this.buildSig.update(b => ({ ...b, size: id  })); }
}

export const MY_WORKFLOW_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: MyWorkflowService,
};
