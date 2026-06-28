import { Injectable, computed, signal } from '@angular/core';
import {
  CONTAINMENT_OPTIONS, EXCITATION_OPTIONS,
  DETECTOR_OPTIONS, OUTPUT_FORMAT_OPTIONS, WIZARD_STEPS,
} from './experiment-designer.mock.js';
import type {
  ExperimentConfig, WizardStep,
  ContainmentId, ExcitationId, DetectorId, OutputFormatId,
} from './experiment-designer.types.js';

export interface ConfigChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

export { WIZARD_STEPS };

const EMPTY_CONFIG: ExperimentConfig = {
  containment:  null,
  excitation:   null,
  detector:     null,
  outputFormat: null,
};

@Injectable({ providedIn: 'root' })
export class ExperimentDesignerService {

  // ── Raw state ───────────────────────────────────────────────────────────────

  private readonly stepSig        = signal<number>(1);
  private readonly configSig      = signal<ExperimentConfig>(EMPTY_CONFIG);
  private readonly openPanelsSig  = signal<ReadonlySet<string>>(new Set());
  private readonly compareOpenSig = signal<boolean>(false);
  private readonly completeSig    = signal<boolean>(false);

  // ── Public read-only signals ────────────────────────────────────────────────

  public readonly currentStep  = this.stepSig.asReadonly();
  public readonly config       = this.configSig.asReadonly();
  public readonly compareOpen  = this.compareOpenSig.asReadonly();
  public readonly isComplete   = this.completeSig.asReadonly();
  public readonly totalSteps   = WIZARD_STEPS.length;

  // ── Derived state ───────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const c = this.configSig();
    switch (this.stepSig()) {
      case 1: return c.containment !== null;
      case 2: return c.excitation  !== null;
      case 3: return this.canFinish();
      default: return false;
    }
  });

  public readonly canFinish = computed((): boolean => {
    const c = this.configSig();
    return c.detector !== null && c.outputFormat !== null;
  });

  public readonly hasConfigStarted = computed((): boolean => {
    const c = this.configSig();
    return !!(c.containment || c.excitation || c.detector || c.outputFormat);
  });

  public readonly configChips = computed((): ConfigChip[] => {
    const c = this.configSig();
    return [
      { label: 'Chamber',   icon: 'fas fa-flask',
        value: CONTAINMENT_OPTIONS.find(o => o.id === c.containment)?.name ?? null },
      { label: 'Source',    icon: 'fas fa-bolt-lightning',
        value: EXCITATION_OPTIONS.find(o => o.id === c.excitation)?.name ?? null },
      { label: 'Detector',  icon: 'fas fa-satellite-dish',
        value: DETECTOR_OPTIONS.find(o => o.id === c.detector)?.name ?? null },
      { label: 'Output',    icon: 'fas fa-file-export',
        value: OUTPUT_FORMAT_OPTIONS.find(o => o.id === c.outputFormat)?.name ?? null },
    ];
  });

  public readonly containmentStats = computed(() =>
    CONTAINMENT_OPTIONS.find(o => o.id === this.configSig().containment)?.stats ?? null
  );
  public readonly excitationStats = computed(() =>
    EXCITATION_OPTIONS.find(o => o.id === this.configSig().excitation)?.stats ?? null
  );
  public readonly containmentName = computed(() =>
    CONTAINMENT_OPTIONS.find(o => o.id === this.configSig().containment)?.name ?? ''
  );
  public readonly excitationName = computed(() =>
    EXCITATION_OPTIONS.find(o => o.id === this.configSig().excitation)?.name ?? ''
  );
  public readonly excitationAccent = computed(() =>
    EXCITATION_OPTIONS.find(o => o.id === this.configSig().excitation)?.accentColor ?? '#7dd3fc'
  );
  public readonly excitationType = computed(() =>
    EXCITATION_OPTIONS.find(o => o.id === this.configSig().excitation)?.type ?? null
  );
  public readonly detectorName = computed(() =>
    DETECTOR_OPTIONS.find(o => o.id === this.configSig().detector)?.name ?? ''
  );
  public readonly outputFormatName = computed(() =>
    OUTPUT_FORMAT_OPTIONS.find(o => o.id === this.configSig().outputFormat)?.name ?? ''
  );

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
    const c = this.configSig();
    return (
      n <= this.stepSig() ||
      (n === 2 && c.containment !== null) ||
      (n === 3 && c.excitation  !== null)
    );
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
    this.openPanelsSig.set(new Set());
    this.compareOpenSig.set(false);
  }

  // ── Selection ───────────────────────────────────────────────────────────────

  public selectContainment(id: ContainmentId | string): void {
    const valid = CONTAINMENT_OPTIONS.find(o => o.id === id);
    if (valid) this.configSig.update(c => ({ ...c, containment: valid.id }));
  }

  public selectExcitation(id: ExcitationId | string): void {
    const valid = EXCITATION_OPTIONS.find(o => o.id === id);
    if (valid) this.configSig.update(c => ({ ...c, excitation: valid.id }));
  }

  public selectDetector(id: DetectorId | string): void {
    const valid = DETECTOR_OPTIONS.find(o => o.id === id);
    if (valid) this.configSig.update(c => ({ ...c, detector: valid.id }));
  }

  public selectOutputFormat(id: OutputFormatId | string): void {
    const valid = OUTPUT_FORMAT_OPTIONS.find(o => o.id === id);
    if (valid) this.configSig.update(c => ({ ...c, outputFormat: valid.id }));
  }

  // ── Compare modal ───────────────────────────────────────────────────────────

  public openCompare(): void {
    this.compareOpenSig.set(true);
  }

  public closeCompare(): void {
    this.compareOpenSig.set(false);
  }
}
