export type { WizardStep } from '../../models/models.js';

// ── Config option IDs ────────────────────────────────────────────────────────

export type ContainmentId  = 'linear-trap' | 'quadrupole-trap' | 'cryogenic-cell' | 'flow-cell';
export type ExcitationId   = 'diode-laser' | 'ti-sapphire' | 'rf-discharge' | 'electron-beam';
export type DetectorId     = 'ccd-array' | 'apd' | 'channeltron' | 'faraday-cup';
export type OutputFormatId = 'csv' | 'hdf5' | 'live-stream' | 'fits';

export interface ExperimentConfig {
  containment:  ContainmentId  | null;
  excitation:   ExcitationId   | null;
  detector:     DetectorId     | null;
  outputFormat: OutputFormatId | null;
}

// ── Option shapes ─────────────────────────────────────────────────────────────

export interface ContainmentOption {
  readonly id:          ContainmentId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly stats: {
    readonly pressureExp:  number;   // exponent: actual = 10^pressureExp Torr
    readonly tempK:        number;   // operating temperature in Kelvin
    readonly capacityLog:  number;   // log10 of max trapped particle count
  };
}

export interface ExcitationOption {
  readonly id:            ExcitationId;
  readonly name:          string;
  readonly tagline:       string;
  readonly icon:          string;
  readonly accentColor:   string;
  readonly type:          'optical' | 'rf' | 'electron';
  readonly stats: {
    readonly wavelengthNm:  number | null;   // null for non-optical sources
    readonly powerMw:       number;
    readonly linewidthMHz:  number;
  };
}

export interface DetectorOption {
  readonly id:          DetectorId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly stats: {
    readonly qePct:           number;   // quantum / detection efficiency %
    readonly spectralRange:   string;   // human-readable range label
    readonly dynamicRangeDb:  number;
  };
}

export interface OutputFormatOption {
  readonly id:          OutputFormatId;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
  readonly extension:   string;
}
