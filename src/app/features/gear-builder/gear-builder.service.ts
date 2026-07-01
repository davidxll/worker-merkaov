import { computed, Injectable, signal } from '@angular/core';
import {
  WIZARD_STEPS, STRUCTURE_OPTIONS, DRIVE_OPTIONS, FINISH_OPTIONS, DETAIL_OPTIONS, MODULE_OPTIONS,
} from './gear-builder.mock.js';
import type {
  ObjectBuild, StructureId, DriveId, FinishId, DetailId, ModuleId,
} from './gear-builder.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { createWizardNav } from '../../shared/wizard-nav.js';

// ── Compare ──────────────────────────────────────────────────────────────────

export type CompareTarget = 'structure' | 'drive';

// ── Build chips ──────────────────────────────────────────────────────────────

export interface BuildChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class GearBuilderService {

  // ── State ──────────────────────────────────────────────────────────────────

  private readonly stepSig          = signal<number>(1);
  private readonly buildSig         = signal<ObjectBuild>({ structure: null, drive: null, finish: null, detail: null, module: null });
  private readonly openPanelsSig    = signal<Set<string>>(new Set());
  private readonly compareOpenSig   = signal<boolean>(false);
  private readonly compareTargetSig = signal<CompareTarget>('structure');

  public readonly currentStep   = this.stepSig.asReadonly();
  public readonly build         = this.buildSig.asReadonly();
  public readonly compareOpen   = this.compareOpenSig.asReadonly();
  public readonly compareTarget = this.compareTargetSig.asReadonly();

  // ── Selected options (one scan per option type per build change) ───────────

  private readonly selectedStructure = computed(() => STRUCTURE_OPTIONS.find(o => o.id === this.buildSig().structure) ?? null);
  private readonly selectedDrive     = computed(() => DRIVE_OPTIONS.find(o => o.id === this.buildSig().drive) ?? null);
  private readonly selectedFinish    = computed(() => FINISH_OPTIONS.find(o => o.id === this.buildSig().finish) ?? null);
  private readonly selectedDetail    = computed(() => DETAIL_OPTIONS.find(o => o.id === this.buildSig().detail) ?? null);
  private readonly selectedModule    = computed(() => MODULE_OPTIONS.find(o => o.id === this.buildSig().module) ?? null);

  // ── Derived state ──────────────────────────────────────────────────────────

  public readonly structureStats   = computed(() => this.selectedStructure()?.stats ?? null);
  public readonly driveStats       = computed(() => this.selectedDrive()?.stats ?? null);
  public readonly driveAccentColor = computed(() => this.selectedDrive()?.accentColor ?? null);
  public readonly driveCycleType   = computed(() => this.selectedDrive()?.cycleType ?? null);
  public readonly finishHex        = computed(() => this.selectedFinish()?.hex ?? null);

  public readonly canAdvance = computed((): boolean => {
    const b = this.buildSig();
    switch (this.stepSig()) {
      case 1: return b.structure !== null;
      case 2: return b.drive !== null;
      case 3: return this.canFinish();
      default: return false;
    }
  });

  public readonly canFinish = computed((): boolean => {
    const b = this.buildSig();
    return b.finish !== null && b.detail !== null && b.module !== null;
  });

  public readonly hasBuildStarted = computed((): boolean => {
    const b = this.buildSig();
    return !!(b.structure || b.drive || b.finish || b.detail || b.module);
  });

  public readonly buildChips = computed((): BuildChip[] => [
    { label: 'Structure', icon: 'fas fa-cube',         value: this.selectedStructure()?.name ?? null },
    { label: 'Drive',     icon: 'fas fa-bolt',          value: this.selectedDrive()?.name ?? null     },
    { label: 'Finish',    icon: 'fas fa-palette',       value: this.selectedFinish()?.name ?? null    },
    { label: 'Detail',    icon: 'fas fa-vector-square', value: this.selectedDetail()?.name ?? null    },
    { label: 'Module',    icon: 'fas fa-plug',          value: this.selectedModule()?.name ?? null    },
  ]);

  public readonly compareTitle = computed((): string => {
    switch (this.compareTargetSig()) {
      case 'structure': return 'Compare Structures';
      case 'drive':     return 'Compare Drive Types';
      default:          return 'Compare';
    }
  });

  public readonly resultData = computed((): WizardResultData => {
    const b   = this.buildSig();
    const str = this.selectedStructure();
    const drv = this.selectedDrive();
    const fin = this.selectedFinish();
    const det = this.selectedDetail();
    const mod = this.selectedModule();
    return {
      title: 'Your Object is Complete!',
      description: 'Configuration saved. Export as JSON or CSV to use this build downstream.',
      rows: [
        { label: 'Structure',   value: str?.name ?? '—'                                    },
        { label: 'Drive',       value: drv?.name ?? '—'                                    },
        { label: 'Finish',      value: fin?.name ?? '—'                                    },
        { label: 'Detail',      value: det?.name ?? '—'                                    },
        { label: 'Module',      value: mod?.name ?? '—'                                    },
        { label: 'Output',      value: drv ? `${drv.stats.output} u`      : '—'            },
        { label: 'Efficiency',  value: drv ? `${drv.stats.efficiency}%`   : '—'            },
        { label: 'Mass',        value: str ? `${str.stats.mass}/10`        : '—'            },
        { label: 'Rigidity',    value: str ? `${str.stats.rigidity}/10`    : '—'            },
      ],
      jsonPayload: { structure: b.structure, drive: b.drive, finish: b.finish, detail: b.detail, module: b.module },
    };
  });

  // ── Step navigation ────────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const b = this.buildSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return b.structure !== null;
    if (n === 3) return b.structure !== null && b.drive !== null;
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
    this.buildSig.set({ structure: null, drive: null, finish: null, detail: null, module: null });
    this.stepSig.set(1);
    this.openPanelsSig.set(new Set());
    this.compareOpenSig.set(false);
  }

  // ── Selection ──────────────────────────────────────────────────────────────

  public selectStructure(id: StructureId): void { this.buildSig.update(b => ({ ...b, structure: id })); }
  public selectDrive(id: DriveId):         void { this.buildSig.update(b => ({ ...b, drive: id }));     }
  public selectFinish(id: FinishId):       void { this.buildSig.update(b => ({ ...b, finish: id }));    }
  public selectDetail(id: DetailId):       void { this.buildSig.update(b => ({ ...b, detail: id }));    }
  public selectModule(id: ModuleId):       void { this.buildSig.update(b => ({ ...b, module: id }));    }

  // ── Compare modal ──────────────────────────────────────────────────────────

  public openCompare(target: CompareTarget): void {
    this.compareTargetSig.set(target);
    this.compareOpenSig.set(true);
  }
  public closeCompare(): void { this.compareOpenSig.set(false); }

  // ── Expandable panels ──────────────────────────────────────────────────────

  public togglePanel(id: string): void {
    this.openPanelsSig.update(set => {
      const next = new Set(set);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  public isPanelOpen(id: string): boolean {
    return this.openPanelsSig().has(id);
  }
}

export const GEAR_BUILDER_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: GearBuilderService,
};
