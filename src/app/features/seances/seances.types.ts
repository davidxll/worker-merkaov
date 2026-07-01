export type { WizardStep } from '../../models/models.js';

export type OfferingId  = 'mead' | 'runes' | 'crow-feather' | 'wolf-pelt' | 'ash-branch';
export type DeityId     = 'odin' | 'thor' | 'freya' | 'loki' | 'hel';
export type VesselId    = 'longship' | 'bifrost' | 'raven' | 'sleipnir';

export interface OfferingOption {
  readonly id:          OfferingId;
  readonly name:        string;
  readonly icon:        string;
  readonly description: string;
  readonly power:       string;
}

export interface DeityOption {
  readonly id:          DeityId;
  readonly name:        string;
  readonly title:       string;
  readonly icon:        string;
  readonly description: string;
  readonly realm:       string;
  readonly color:       string;
  readonly initial:     string;
  readonly aspect:      string;
}

export interface VesselOption {
  readonly id:          VesselId;
  readonly name:        string;
  readonly icon:        string;
  readonly description: string;
  readonly route:       string;
}

export interface SeanceConfig {
  readonly offerings: readonly OfferingId[];
  readonly deity:     DeityId | null;
  readonly vessel:    VesselId | null;
}

export interface SeanceChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}
