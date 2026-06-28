export type { WizardStep } from '../../models/models.js';

// ── Build option IDs ─────────────────────────────────────────────────────────

export type ChassisId = 'sedan' | 'suv' | 'truck' | 'coupe';
export type EngineId  = 'electric' | 'turbo4' | 'v6' | 'v8';
export type ColorId   = 'midnight' | 'arctic' | 'racing' | 'ocean' | 'forest' | 'sunset';
export type RimId     = 'steel' | 'alloy' | 'carbon' | 'chrome';
export type BodyKitId = 'none' | 'sport' | 'offroad' | 'aero';

export interface GearBuild {
  chassis:  ChassisId | null;
  engine:   EngineId  | null;
  color:    ColorId   | null;
  rim:      RimId     | null;
  bodyKit:  BodyKitId | null;
}

export interface ChassisOption {
  readonly id:          ChassisId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly stats: {
    readonly weight:    number;  // kg
    readonly seats:     number;
    readonly dragCoeff: number;
  };
}

export interface EngineOption {
  readonly id:          EngineId;
  readonly name:        string;
  readonly tagline:     string;
  readonly icon:        string;
  readonly accentColor: string;
  readonly fuelType:    'electric' | 'gasoline' | 'diesel';
  readonly stats: {
    readonly hp:         number;
    readonly torqueNm:   number;
    readonly efficiency: number; // mpg / MPGe
  };
}

export interface ColorOption {
  readonly id:       ColorId;
  readonly name:     string;
  readonly hex:      string;
  readonly metallic: boolean;
}

export interface RimOption {
  readonly id:         RimId;
  readonly name:       string;
  readonly description: string;
  readonly hubColor:   string;
  readonly spokeColor: string;
  readonly spokeCount: number;
  readonly spokeWidth: number;
}

export interface BodyKitOption {
  readonly id:          BodyKitId;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
  readonly adds:        ReadonlyArray<string>;
}

// ── SVG vehicle config per chassis ──────────────────────────────────────────

export interface WheelSpec {
  readonly cx: number;
  readonly cy: number;
  readonly r:  number;
}

export interface RectSpec {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface ChassisConfig {
  readonly bodyPath:        string;
  readonly frontWindowPath: string;
  readonly rearWindowPath:  string;
  readonly bPillarPath:     string | null;
  readonly truckBedPath:    string | null;
  readonly headlight:       RectSpec;
  readonly taillight:       RectSpec;
  readonly leftWheel:       WheelSpec;
  readonly rightWheel:      WheelSpec;
  readonly frontLipPath:    string;
  readonly spoilerPath:     string;
  readonly roofRackSpec:    RectSpec | null;
  readonly badgePos:        { readonly x: number; readonly y: number };
}
