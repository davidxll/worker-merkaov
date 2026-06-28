import { computed, Injectable, signal } from '@angular/core';
import {
  WIZARD_STEPS, PROPERTY_TYPE_OPTIONS, PRICE_RANGE_OPTIONS, BED_OPTIONS, BATH_OPTIONS, FEATURE_OPTIONS,
} from './mls-composer.mock.js';
import type {
  MlsSearch, PropertyTypeId, PriceRangeId, BedCountId, BathCountId, FeatureId,
} from './mls-composer.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';

// ── HUD chips ────────────────────────────────────────────────────────────────

export interface SearchChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class MlsComposerService {

  // ── State ─────────────────────────────────────────────────────────────────

  private readonly stepSig  = signal<number>(1);
  private readonly searchSig = signal<MlsSearch>({
    propertyType: null,
    priceRange:   null,
    beds:         null,
    baths:        null,
    features:     new Set<FeatureId>(),
  });

  public readonly currentStep = this.stepSig.asReadonly();
  public readonly search      = this.searchSig.asReadonly();

  // ── Selected lookups ──────────────────────────────────────────────────────

  private readonly selectedPropertyType = computed(() =>
    PROPERTY_TYPE_OPTIONS.find(o => o.id === this.searchSig().propertyType) ?? null,
  );
  private readonly selectedPriceRange = computed(() =>
    PRICE_RANGE_OPTIONS.find(o => o.id === this.searchSig().priceRange) ?? null,
  );
  private readonly selectedBeds = computed(() =>
    BED_OPTIONS.find(o => o.id === this.searchSig().beds) ?? null,
  );
  private readonly selectedBaths = computed(() =>
    BATH_OPTIONS.find(o => o.id === this.searchSig().baths) ?? null,
  );

  public readonly selectedFeaturesArray = computed(() =>
    FEATURE_OPTIONS.filter(f => this.searchSig().features.has(f.id)),
  );

  // ── Derived state ─────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const s = this.searchSig();
    switch (this.stepSig()) {
      case 1: return s.propertyType !== null;
      case 2: return s.priceRange   !== null;
      case 3: return s.beds !== null && s.baths !== null;
      case 4: return true;
      default: return false;
    }
  });

  public readonly hasCriteriaStarted = computed((): boolean => {
    const s = this.searchSig();
    return !!(s.propertyType || s.priceRange || s.beds || s.baths || s.features.size > 0);
  });

  public readonly propertyAccentColor = computed(() =>
    this.selectedPropertyType()?.accentColor ?? 'var(--f-accent)',
  );

  public readonly searchChips = computed((): SearchChip[] => {
    const feats = this.selectedFeaturesArray();
    return [
      { label: 'Type',     icon: 'fas fa-home',        value: this.selectedPropertyType()?.name ?? null },
      { label: 'Budget',   icon: 'fas fa-dollar-sign', value: this.selectedPriceRange()?.tagline ?? null },
      { label: 'Beds',     icon: 'fas fa-bed',          value: this.selectedBeds()?.label ?? null         },
      { label: 'Baths',    icon: 'fas fa-bath',         value: this.selectedBaths()?.label ?? null        },
      { label: 'Features', icon: 'fas fa-star',         value: feats.length > 0 ? `${feats.length} selected` : null },
    ];
  });

  // ── Result data ───────────────────────────────────────────────────────────

  public readonly resultData = computed((): WizardResultData => {
    const pr    = this.selectedPriceRange();
    const pt    = this.selectedPropertyType();
    const beds  = this.selectedBeds();
    const baths = this.selectedBaths();
    const feats = this.selectedFeaturesArray();

    const priceLabel = pr
      ? (pr.max
          ? `$${(pr.min / 1000).toFixed(0)}K – $${(pr.max / 1000).toFixed(0)}K`
          : `$${(pr.min / 1_000_000).toFixed(1)}M+`)
      : '—';

    return {
      title:       'Your MLS Search is Ready',
      description: 'Use the parameters below on Zillow, Redfin, or Realtor.com to find matching properties.',
      rows: [
        { label: 'Property Type',   value: pt?.name                                                        ?? '—'        },
        { label: 'MLS Code',        value: pt?.mlsCode                                                     ?? '—'        },
        { label: 'Price Range',     value: priceLabel                                                                    },
        { label: 'Min Price',       value: pr    ? `$${pr.min.toLocaleString()}`                           : '—'        },
        { label: 'Max Price',       value: pr?.max ? `$${pr.max.toLocaleString()}`                         : 'No limit' },
        { label: 'Bedrooms (min)',  value: beds  ? (beds.min === 0 ? 'Any' : `${beds.min}+`)               : '—'        },
        { label: 'Bathrooms (min)', value: baths ? `${baths.display}+`                                     : '—'        },
        { label: 'Listing Status',  value: 'Active'                                                                      },
        { label: 'Must-Haves',      value: feats.length > 0 ? feats.map(f => f.name).join(', ')           : 'None'     },
      ],
      jsonPayload: {
        PropertyType:   pt?.mlsCode  ?? null,
        ListPriceMin:   pr?.min      ?? null,
        ListPriceMax:   pr?.max      ?? null,
        BedsTotal:      beds?.min    ?? null,
        BathsTotal:     baths?.min   ?? null,
        StandardStatus: 'Active',
        Amenities:      feats.map(f => f.mlsAmenity),
      },
    };
  });

  // ── Step navigation ───────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const s = this.searchSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return s.propertyType !== null;
    if (n === 3) return s.propertyType !== null && s.priceRange !== null;
    if (n === 4) return s.propertyType !== null && s.priceRange !== null && s.beds !== null && s.baths !== null;
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

  public finish(): void { this.stepSig.set(5); }

  public reset(): void {
    this.searchSig.set({ propertyType: null, priceRange: null, beds: null, baths: null, features: new Set<FeatureId>() });
    this.stepSig.set(1);
  }

  // ── Selection ─────────────────────────────────────────────────────────────

  public selectPropertyType(id: PropertyTypeId): void { this.searchSig.update(s => ({ ...s, propertyType: id })); }
  public selectPriceRange(id: PriceRangeId):     void { this.searchSig.update(s => ({ ...s, priceRange: id   })); }
  public selectBeds(id: BedCountId):             void { this.searchSig.update(s => ({ ...s, beds: id         })); }
  public selectBaths(id: BathCountId):           void { this.searchSig.update(s => ({ ...s, baths: id        })); }

  public toggleFeature(id: FeatureId): void {
    this.searchSig.update(s => {
      const next = new Set(s.features);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return { ...s, features: next };
    });
  }
}

export const MLS_COMPOSER_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: MlsComposerService,
};
