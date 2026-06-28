export type { WizardStep } from "../../models/models.js";

// ── Selection IDs ────────────────────────────────────────────────────────────

export type StructureId = "monolith" | "lattice" | "shell" | "modular";
export type DriveId     = "pulse" | "wave" | "field" | "kinetic";
export type FinishId    = "void" | "frost" | "ember" | "tide" | "canopy" | "corona";
export type DetailId    = "minimal" | "radiator" | "fractal" | "mirror";
export type ModuleId    = "none" | "amplifier" | "stabiliser" | "resonator";

// ── Build state ──────────────────────────────────────────────────────────────

export interface ObjectBuild {
  structure: StructureId | null;
  drive:     DriveId     | null;
  finish:    FinishId    | null;
  detail:    DetailId    | null;
  module:    ModuleId    | null;
}

// ── Option interfaces ────────────────────────────────────────────────────────

export interface StructureOption {
  readonly id:          StructureId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly stats: {
    readonly mass:     number;   // relative 1-10
    readonly rigidity: number;   // relative 1-10
    readonly surface:  number;   // relative surface area 1-10
  };
}

export interface DriveOption {
  readonly id:          DriveId;
  readonly name:        string;
  readonly tagline:     string;
  readonly icon:        string;
  readonly accentColor: string;
  readonly cycleType:   "pulsed" | "continuous" | "ambient" | "mechanical";
  readonly stats: {
    readonly output:     number;  // peak output units
    readonly efficiency: number;  // percentage
    readonly cycleMs:    number;  // 0 = continuous
  };
}

export interface FinishOption {
  readonly id:       FinishId;
  readonly name:     string;
  readonly hex:      string;
  readonly metallic: boolean;
}

export interface DetailOption {
  readonly id:          DetailId;
  readonly name:        string;
  readonly description: string;
  readonly accentColor: string;
  readonly edgeColor:   string;
}

export interface ModuleOption {
  readonly id:          ModuleId;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
  readonly adds:        ReadonlyArray<string>;
}
