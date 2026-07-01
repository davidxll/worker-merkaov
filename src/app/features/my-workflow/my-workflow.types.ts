export type { WizardStep } from "../../models/models.js";

// ── Selection IDs ────────────────────────────────────────────────────────────

export type ColorId = 'red' | 'blue' | 'green' | 'amber' | 'violet';
export type SizeId  = 'small' | 'medium' | 'large' | 'xl';

// ── Build state ──────────────────────────────────────────────────────────────

export interface MyBuild {
  color: ColorId | null;
  size:  SizeId  | null;
}

// ── Option interfaces ────────────────────────────────────────────────────────

export interface ColorOption {
  readonly id:          ColorId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly hex:         string;
  readonly textHex:     string;
  readonly feel:        string;
}

export interface SizeOption {
  readonly id:          SizeId;
  readonly name:        string;
  readonly tagline:     string;
  readonly description: string;
  readonly icon:        string;
  readonly scale:       number; // 1–10
  readonly weight:      number; // 1–10
  readonly footprint:   number; // 1–10
}
