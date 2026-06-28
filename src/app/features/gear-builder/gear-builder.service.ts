import { Injectable, computed, signal } from '@angular/core';
import {
  CHASSIS_OPTIONS, ENGINE_OPTIONS, COLOR_OPTIONS,
  RIM_OPTIONS, BODY_KIT_OPTIONS,
} from './gear-builder.mock.js';
import type {
  GearBuild, WizardStep,
  ChassisId, EngineId, ColorId, RimId, BodyKitId,
} from './gear-builder.types.js';

export type CompareTarget = 'chassis' | 'engine' | 'color' | 'rim';

export interface BuildChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Chassis', icon: 'fas fa-car-side', sublabel: 'Body type'   },
  { label: 'Engine',  icon: 'fas fa-gears',    sublabel: 'Powertrain'  },
  { label: 'Styling', icon: 'fas fa-palette',  sublabel: 'Look & feel' },
];

const EMPTY_BUILD: GearBuild = {
  chassis: null, engine: null, color: null, rim: null, bodyKit: null,
};

@Injectable({ providedIn: 'root' })
export class GearBuilderService {

  // ── Raw state ───────────────────────────────────────────────────────────────

  private readonly stepSig          = signal<number>(1);
  private readonly buildSig         = signal<GearBuild>(EMPTY_BUILD);
  private readonly openPanelsSig    = signal<ReadonlySet<string>>(new Set());
  private readonly compareOpenSig   = signal<boolean>(false);
  private readonly compareTargetSig = signal<CompareTarget>('chassis');
  private readonly completeSig      = signal<boolean>(false);

  // ── Public read-only signals ────────────────────────────────────────────────

  public readonly currentStep   = this.stepSig.asReadonly();
  public readonly build         = this.buildSig.asReadonly();
  public readonly compareOpen   = this.compareOpenSig.asReadonly();
  public readonly compareTarget = this.compareTargetSig.asReadonly();
  public readonly isComplete    = this.completeSig.asReadonly();
  public readonly totalSteps    = WIZARD_STEPS.length;

  // ── Derived state ───────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const b = this.buildSig();
    switch (this.stepSig()) {
      case 1: return b.chassis !== null;
      case 2: return b.engine  !== null;
      case 3: return this.canFinish();
      default: return false;
    }
  });

  public readonly canFinish = computed((): boolean => {
    const b = this.buildSig();
    return b.color !== null && b.rim !== null && b.bodyKit !== null;
  });

  public readonly hasBuildStarted = computed((): boolean => {
    const b = this.buildSig();
    return !!(b.chassis || b.engine || b.color || b.rim || b.bodyKit);
  });

  public readonly buildChips = computed((): BuildChip[] => {
    const b = this.buildSig();
    return [
      { label: 'Chassis', icon: 'fas fa-car-side',
        value: CHASSIS_OPTIONS.find(o => o.id === b.chassis)?.name ?? null },
      { label: 'Engine',  icon: 'fas fa-gears',
        value: ENGINE_OPTIONS.find(o => o.id === b.engine)?.name ?? null },
      { label: 'Color',   icon: 'fas fa-droplet',
        value: COLOR_OPTIONS.find(o => o.id === b.color)?.name ?? null },
      { label: 'Rims',    icon: 'fas fa-circle-dot',
        value: RIM_OPTIONS.find(o => o.id === b.rim)?.name ?? null },
      { label: 'Kit',     icon: 'fas fa-rocket',
        value: BODY_KIT_OPTIONS.find(o => o.id === b.bodyKit)?.name ?? null },
    ];
  });

  public readonly chassisStats = computed(() =>
    CHASSIS_OPTIONS.find(o => o.id === this.buildSig().chassis)?.stats ?? null
  );
  public readonly engineStats = computed(() =>
    ENGINE_OPTIONS.find(o => o.id === this.buildSig().engine)?.stats ?? null
  );
  public readonly chassisName = computed(() =>
    CHASSIS_OPTIONS.find(o => o.id === this.buildSig().chassis)?.name ?? ''
  );
  public readonly engineName = computed(() =>
    ENGINE_OPTIONS.find(o => o.id === this.buildSig().engine)?.name ?? ''
  );
  public readonly colorName = computed(() =>
    COLOR_OPTIONS.find(o => o.id === this.buildSig().color)?.name ?? ''
  );
  public readonly isElectric = computed(() =>
    this.buildSig().engine === 'electric'
  );
  public readonly compareTitle = computed((): string => ({
    chassis: 'Chassis Types',
    engine:  'Engine Options',
    color:   'Paint Colors',
    rim:     'Wheel Styles',
  })[this.compareTargetSig()]);

  // ── Panel state ─────────────────────────────────────────────────────────────

  public isPanelOpen(key: string): boolean {
    return this.openPanelsSig().has(key);
  }

  public togglePanel(key: string): void {
    this.openPanelsSig.update(s => {
      const next = new Set(s);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  public nextStep(): void {
    if (this.stepSig() < this.totalSteps) this.stepSig.update(s => s + 1);
  }

  public prevStep(): void {
    if (this.stepSig() > 1) {
      this.stepSig.update(s => s - 1);
      this.completeSig.set(false);
    }
  }

  public isStepReachable(n: number): boolean {
    const b = this.buildSig();
    return (
      n <= this.stepSig() ||
      (n === 2 && b.chassis !== null) ||
      (n === 3 && b.engine  !== null)
    );
  }

  public jumpToStep(n: number): void {
    if (this.isStepReachable(n)) this.stepSig.set(n);
  }

  public finish(): void {
    if (this.canFinish()) this.completeSig.set(true);
  }

  public reset(): void {
    this.buildSig.set(EMPTY_BUILD);
    this.stepSig.set(1);
    this.completeSig.set(false);
    this.openPanelsSig.set(new Set());
    this.compareOpenSig.set(false);
  }

  // ── Selection ───────────────────────────────────────────────────────────────

  public selectChassis(id: ChassisId | string): void {
    const valid = CHASSIS_OPTIONS.find(o => o.id === id);
    if (valid) this.buildSig.update(b => ({ ...b, chassis: valid.id }));
  }
  public selectEngine(id: EngineId | string): void {
    const valid = ENGINE_OPTIONS.find(o => o.id === id);
    if (valid) this.buildSig.update(b => ({ ...b, engine: valid.id }));
  }
  public selectColor(id: ColorId): void {
    this.buildSig.update(b => ({ ...b, color: id }));
  }
  public selectRim(id: RimId): void {
    this.buildSig.update(b => ({ ...b, rim: id }));
  }
  public selectBodyKit(id: BodyKitId): void {
    this.buildSig.update(b => ({ ...b, bodyKit: id }));
  }

  // ── Compare modal ───────────────────────────────────────────────────────────

  public openCompare(target: CompareTarget): void {
    this.compareTargetSig.set(target);
    this.compareOpenSig.set(true);
  }

  public closeCompare(): void {
    this.compareOpenSig.set(false);
  }
}
