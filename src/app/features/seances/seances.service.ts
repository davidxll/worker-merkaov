import { computed, Injectable, signal } from '@angular/core';
import {
  WIZARD_STEPS, OFFERING_OPTIONS, DEITY_OPTIONS, VESSEL_OPTIONS,
} from './seances.mock.js';
import type {
  SeanceConfig, OfferingId, DeityId, VesselId, SeanceChip,
} from './seances.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';

@Injectable({ providedIn: 'root' })
export class SeancesService {

  // ── State ──────────────────────────────────────────────────────────────────

  private readonly stepSig   = signal<number>(1);
  private readonly configSig = signal<SeanceConfig>({
    offerings: [],
    deity:     null,
    vessel:    null,
  });

  public readonly currentStep = this.stepSig.asReadonly();
  public readonly config      = this.configSig.asReadonly();

  // ── Derived ────────────────────────────────────────────────────────────────

  private readonly selectedDeity = computed(() =>
    DEITY_OPTIONS.find(d => d.id === this.configSig().deity) ?? null
  );

  private readonly selectedVessel = computed(() =>
    VESSEL_OPTIONS.find(v => v.id === this.configSig().vessel) ?? null
  );

  public readonly deityColor = computed(() => this.selectedDeity()?.color ?? 'var(--f-text-3)');

  public readonly canAdvance = computed((): boolean => {
    const cfg = this.configSig();
    switch (this.stepSig()) {
      case 1: return cfg.offerings.length > 0;
      case 2: return cfg.deity !== null;
      case 3: return cfg.vessel !== null;
      default: return false;
    }
  });

  public readonly hasBuildStarted = computed(() => this.configSig().offerings.length > 0);

  public readonly configChips = computed((): SeanceChip[] => {
    const cfg   = this.configSig();
    const step  = this.stepSig();
    const deity = this.selectedDeity();
    return [
      { label: 'Offerings', icon: 'fas fa-fire-flame-curved', value: cfg.offerings.length > 0 ? `${cfg.offerings.length} offered` : null },
      { label: 'Deity',     icon: 'fas fa-star-of-life',      value: step > 1 ? (deity?.name ?? null) : null                           },
      { label: 'Aspect',    icon: 'fas fa-eye',               value: step > 1 ? (deity?.aspect ?? null) : null                         },
      { label: 'Vessel',    icon: 'fas fa-ship',              value: step > 2 ? (this.selectedVessel()?.name ?? null) : null            },
    ];
  });

  public readonly resultData = computed((): WizardResultData => {
    const cfg    = this.configSig();
    const deity  = this.selectedDeity();
    const vessel = this.selectedVessel();
    const offeringNames = cfg.offerings
      .map(id => OFFERING_OPTIONS.find(o => o.id === id)?.name ?? id)
      .join(', ');
    return {
      title:       'The Gates of Valhalla Open.',
      description: 'Your passage manifest is sealed. The warriors who came before you raise their horns. Valhöll receives you.',
      rows: [
        { label: 'Deity',       value: deity ? `${deity.name} — ${deity.title}` : '—' },
        { label: 'Aspect',      value: deity?.aspect    ?? '—'                          },
        { label: 'Realm',       value: deity?.realm     ?? '—'                          },
        { label: 'Vessel',      value: vessel?.name     ?? '—'                          },
        { label: 'Route',       value: vessel?.route    ?? '—'                          },
        { label: 'Offerings',   value: offeringNames || '—'                             },
        { label: 'Circle',      value: 'Triple-bind, ash-and-iron'                      },
        { label: 'Destination', value: 'Valhöll, Great Hall of the Slain'               },
      ],
      jsonPayload: {
        $schema: 'https://seances/valhalla/passage/v1',
        $meta: {
          'ritual.offerings':  'Sacred tributes presented at the threshold between realms',
          'ritual.circle':     'The binding pattern used to open the passage',
          'invocation.deity':  'The Norse divinity invoked to guide and receive the traveller',
          'invocation.aspect': 'The divine domain channelled during the crossing',
          'invocation.realm':  'The divine realm of the invoked deity',
          'crossing.vessel':   'The conveyance used to cross from Midgard to the afterlife',
          'crossing.route':    'The named path taken between worlds',
          'crossing.arrival':  'The destination hall within the Norse afterlife',
        },
        ritual: {
          offerings: [...cfg.offerings],
          circle:    'triple-bind',
        },
        invocation: {
          deity:  cfg.deity,
          aspect: deity?.aspect ?? null,
          realm:  deity?.realm  ?? null,
        },
        crossing: {
          vessel:  cfg.vessel,
          route:   vessel?.route    ?? null,
          arrival: 'Valhöll — Great Hall of the Slain',
        },
      },
    };
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const cfg = this.configSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return cfg.offerings.length > 0;
    if (n === 3) return cfg.deity !== null;
    return false;
  }

  public nextStep(): void {
    if (this.stepSig() < WIZARD_STEPS.length && this.canAdvance()) {
      this.stepSig.update(s => s + 1);
    }
  }

  public prevStep(): void {
    if (this.stepSig() > 1) this.stepSig.update(s => s - 1);
  }

  public jumpToStep(n: number): void {
    if (this.isStepReachable(n)) this.stepSig.set(n);
  }

  public finish(): void { this.stepSig.set(4); }

  public reset(): void {
    this.configSig.set({ offerings: [], deity: null, vessel: null });
    this.stepSig.set(1);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  public toggleOffering(id: OfferingId): void {
    this.configSig.update(c => {
      const has       = c.offerings.includes(id);
      const offerings = has ? c.offerings.filter(o => o !== id) : [...c.offerings, id];
      return { ...c, offerings };
    });
  }

  public selectDeity(id: DeityId):   void { this.configSig.update(c => ({ ...c, deity: id }));  }
  public selectVessel(id: VesselId): void { this.configSig.update(c => ({ ...c, vessel: id })); }
}

export const SEANCES_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: SeancesService,
};
