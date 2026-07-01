import { computed, Injectable, signal } from '@angular/core';
import {
  WIZARD_STEPS, REALM_OPTIONS, FORM_OPTIONS, IMPOSSIBLE_OPTIONS, ATMOSPHERE_OPTIONS,
} from './dream-space.mock.js';
import type {
  DreamSpace, RealmId, FormId, ImpossibleId, AtmosphereId, ImpossibleListing,
} from './dream-space.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { createWizardNav } from '../../shared/wizard-nav.js';

export interface SpaceChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

@Injectable({ providedIn: 'root' })
export class DreamSpaceService {

  // ── State ─────────────────────────────────────────────────────────────────

  private readonly stepSig  = signal<number>(1);
  private readonly dreamSig = signal<DreamSpace>({
    realm: null, form: null, impossible: null, atmosphere: null,
  });

  public readonly currentStep = this.stepSig.asReadonly();
  public readonly dream       = this.dreamSig.asReadonly();

  // ── Selected lookups ──────────────────────────────────────────────────────

  public readonly selectedRealm = computed(() =>
    REALM_OPTIONS.find(o => o.id === this.dreamSig().realm) ?? null,
  );
  public readonly selectedForm = computed(() =>
    FORM_OPTIONS.find(o => o.id === this.dreamSig().form) ?? null,
  );
  public readonly selectedImpossible = computed(() =>
    IMPOSSIBLE_OPTIONS.find(o => o.id === this.dreamSig().impossible) ?? null,
  );
  public readonly selectedAtmosphere = computed(() =>
    ATMOSPHERE_OPTIONS.find(o => o.id === this.dreamSig().atmosphere) ?? null,
  );

  // ── Derived state ─────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const d = this.dreamSig();
    switch (this.stepSig()) {
      case 1: return d.realm      !== null;
      case 2: return d.form       !== null;
      case 3: return d.impossible !== null;
      case 4: return d.atmosphere !== null;
      default: return false;
    }
  });

  public readonly primaryAccentColor = computed(() =>
    this.selectedRealm()?.accentColor ?? 'var(--f-accent)',
  );

  public readonly spaceChips = computed((): SpaceChip[] => [
    { label: 'Realm',      icon: 'fas fa-globe',               value: this.selectedRealm()?.name      ?? null },
    { label: 'Form',       icon: 'fas fa-shapes',              value: this.selectedForm()?.name       ?? null },
    { label: 'Impossible', icon: 'fas fa-wand-magic-sparkles', value: this.selectedImpossible()?.name ?? null },
    { label: 'Atmosphere', icon: 'fas fa-wind',                value: this.selectedAtmosphere()?.name ?? null },
  ]);

  // ── Listing generation ────────────────────────────────────────────────────

  public readonly impossibleListing = computed((): ImpossibleListing => {
    const realm = this.selectedRealm();
    const form  = this.selectedForm();
    const imp   = this.selectedImpossible();
    const atm   = this.selectedAtmosphere();

    const address = form && realm
      ? `${form.streetNumber} ${form.streetName}, ${realm.district}`
      : 'Address Undetermined';

    const title = atm && form && realm
      ? `${atm.adjective} ${form.name.replace(/^The /, '')} ${realm.name}`
      : 'Your Dream Space';

    const descParts: string[] = [];
    if (realm) descParts.push(realm.description);
    if (form)  descParts.push(`The structure takes the form of ${form.name.toLowerCase()} — ${form.tagline.toLowerCase()}.`);
    if (imp)   descParts.push(imp.description);
    if (atm)   descParts.push(`The overall feeling is one of ${atm.name.toLowerCase()}: ${atm.tagline.toLowerCase()}.`);

    const amenities: string[] = [
      ...(form?.baseAmenities ?? []),
      ...(imp ? [imp.name] : []),
      ...(realm?.naturalFeatures ?? []),
    ];

    return { title, address, description: descParts.join(' '), amenities, price: 'Beyond Valuation', listed: 'Impossible Properties™' };
  });

  public readonly resultData = computed((): WizardResultData => {
    const listing = this.impossibleListing();
    const realm   = this.selectedRealm();
    const form    = this.selectedForm();
    const imp     = this.selectedImpossible();
    const atm     = this.selectedAtmosphere();

    return {
      title:       'Your Impossible Home',
      description: 'This property does not exist — which is precisely why it is perfect for you.',
      rows: [
        { label: 'Property Title',     value: listing.title                          },
        { label: 'Address',            value: listing.address                        },
        { label: 'Realm',              value: realm?.name    ?? '—'                 },
        { label: 'Form',               value: form?.name     ?? '—'                 },
        { label: 'Impossible Feature', value: imp?.name      ?? '—'                 },
        { label: 'Atmosphere',         value: atm?.name      ?? '—'                 },
        { label: 'Listed By',          value: 'Impossible Properties™'              },
        { label: 'Market Status',      value: 'Available in Your Imagination'       },
        { label: 'Price',              value: 'Beyond Valuation'                    },
      ],
      jsonPayload: {
        title:             listing.title,
        address:           listing.address,
        realm:             realm?.id ?? null,
        form:              form?.id  ?? null,
        impossibleFeature: imp?.id   ?? null,
        atmosphere:        atm?.id   ?? null,
        amenities:         listing.amenities,
        listedBy:          'Impossible Properties™',
        price:             'Beyond Valuation',
      },
    };
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const d = this.dreamSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return d.realm !== null;
    if (n === 3) return d.realm !== null && d.form !== null;
    if (n === 4) return d.realm !== null && d.form !== null && d.impossible !== null;
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
    this.dreamSig.set({ realm: null, form: null, impossible: null, atmosphere: null });
    this.stepSig.set(1);
  }

  // ── Selection ─────────────────────────────────────────────────────────────

  public selectRealm(id: RealmId):           void { this.dreamSig.update(d => ({ ...d, realm: id })); }
  public selectForm(id: FormId):             void { this.dreamSig.update(d => ({ ...d, form: id })); }
  public selectImpossible(id: ImpossibleId): void { this.dreamSig.update(d => ({ ...d, impossible: id })); }
  public selectAtmosphere(id: AtmosphereId): void { this.dreamSig.update(d => ({ ...d, atmosphere: id })); }
}

export const DREAM_SPACE_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: DreamSpaceService,
};
