import type { WritableSignal } from '@angular/core';

export interface WizardNav {
  nextStep(): void;
  prevStep(): void;
  jumpToStep(n: number): void;
  finish(): void;
}

export interface WizardNavConfig {
  readonly stepSig: WritableSignal<number>;
  readonly totalSteps: number;
  readonly isStepReachable: (n: number) => boolean;
  readonly canAdvance?: () => boolean;
  readonly canFinish?: () => boolean;
}

// Shared by every wizard feature service (see CLAUDE.md "Wizard feature file
// convention"). nextStep/prevStep/jumpToStep/finish were identical across all
// 9 services; isStepReachable/canAdvance/canFinish stay feature-specific since
// they encode each wizard's own per-step validation rules.
export function createWizardNav(config: WizardNavConfig): WizardNav {
  const { stepSig, totalSteps, isStepReachable, canAdvance, canFinish } = config;
  return {
    nextStep(): void {
      if (stepSig() < totalSteps && (canAdvance?.() ?? true)) {
        stepSig.update(s => s + 1);
      }
    },
    prevStep(): void {
      if (stepSig() > 1) stepSig.update(s => s - 1);
    },
    jumpToStep(n: number): void {
      if (isStepReachable(n)) stepSig.set(n);
    },
    finish(): void {
      if (canFinish?.() ?? true) stepSig.set(totalSteps + 1);
    },
  };
}
