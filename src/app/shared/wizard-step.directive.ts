import { Directive, InjectionToken, input, computed, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import type { WizardStep } from '../models/models.js';

export interface IWizardStepService {
  readonly currentStep: Signal<number>;
  isStepReachable(n: number): boolean;
}

export const WIZARD_STEP_SERVICE =
  new InjectionToken<IWizardStepService>('WizardStepService');

@Directive({
  selector: '[wizardStep]',
  standalone: true,
  exportAs: 'wizardStep',
})
export class WizardStepDirective {
  public readonly stepIndex = input.required<number>();
  public readonly stepDef   = input.required<WizardStep>();

  private readonly svc = inject(WIZARD_STEP_SERVICE);

  public readonly isActive    = computed(() => this.svc.currentStep() === this.stepIndex());
  public readonly isDone      = computed(() => this.svc.currentStep() > this.stepIndex());
  public readonly isReachable = computed(() => this.svc.isStepReachable(this.stepIndex()));
  public readonly label       = computed(() => this.stepDef().label);
  public readonly icon        = computed(() => this.stepDef().icon);
  public readonly sublabel    = computed(() => this.stepDef().sublabel);
}
