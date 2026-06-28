export type { WizardStep } from "../../models/models.js";

// ── Selection IDs ────────────────────────────────────────────────────────────

export type PropertyTypeId = 'single-family' | 'condo' | 'multi-family' | 'land' | 'commercial';
export type PriceRangeId   = 'starter' | 'mid' | 'upper-mid' | 'premium' | 'luxury';
export type BedCountId     = 'any' | '1' | '2' | '3' | '4' | '5plus';
export type BathCountId    = '1' | '1h' | '2' | '2h' | '3' | '4plus';
export type FeatureId      = 'garage' | 'pool' | 'basement' | 'waterfront' | 'new-construction' | 'no-hoa' | 'fireplace' | 'ac';

// ── Search state ─────────────────────────────────────────────────────────────

export interface MlsSearch {
  propertyType: PropertyTypeId | null;
  priceRange:   PriceRangeId   | null;
  beds:         BedCountId     | null;
  baths:        BathCountId    | null;
  features:     Set<FeatureId>;
}

// ── Option interfaces ─────────────────────────────────────────────────────────

export interface PropertyTypeOption {
  readonly id:          PropertyTypeId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly mlsCode:     string;
  readonly accentColor: string;
}

export interface PriceRangeOption {
  readonly id:      PriceRangeId;
  readonly name:    string;
  readonly tagline: string;
  readonly icon:    string;
  readonly min:     number;
  readonly max:     number | null;
}

export interface BedOption {
  readonly id:    BedCountId;
  readonly label: string;
  readonly min:   number;
}

export interface BathOption {
  readonly id:      BathCountId;
  readonly label:   string;
  readonly display: string;
  readonly min:     number;
}

export interface FeatureOption {
  readonly id:         FeatureId;
  readonly name:       string;
  readonly icon:       string;
  readonly mlsAmenity: string;
}
