import type { WizardStep, ColorOption, SizeOption } from "./my-workflow.types.js";

// ── Wizard step definitions ──────────────────────────────────────────────────

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Color', icon: 'fas fa-palette',  sublabel: 'Pick a colour' },
  { label: 'Size',  icon: 'fas fa-ruler',    sublabel: 'Pick a size'   },
];

// ── Color options ────────────────────────────────────────────────────────────

export const COLOR_OPTIONS: readonly ColorOption[] = [
  {
    id: 'red', name: 'Ember Red', tagline: 'Bold and energetic',
    description: 'A saturated crimson that commands attention. High contrast against dark surfaces; evokes urgency and intensity.',
    icon: 'fas fa-fire', hex: '#dc2626', textHex: '#fca5a5', feel: 'Intense',
  },
  {
    id: 'blue', name: 'Ocean Blue', tagline: 'Calm and focused',
    description: 'A deep saturated blue that reads as trustworthy and precise. Works well in both technical and professional contexts.',
    icon: 'fas fa-droplet', hex: '#1d4ed8', textHex: '#93c5fd', feel: 'Focused',
  },
  {
    id: 'green', name: 'Canopy Green', tagline: 'Fresh and grounded',
    description: 'A rich forest green anchored in nature. Reads as stable, reliable, and restorative against neutral backgrounds.',
    icon: 'fas fa-leaf', hex: '#15803d', textHex: '#86efac', feel: 'Stable',
  },
  {
    id: 'amber', name: 'Solar Amber', tagline: 'Warm and optimistic',
    description: 'A golden amber that carries warmth without aggression. Mid-range saturation for everyday contexts.',
    icon: 'fas fa-sun', hex: '#b45309', textHex: '#fcd34d', feel: 'Warm',
  },
  {
    id: 'violet', name: 'Deep Violet', tagline: 'Creative and distinct',
    description: 'A rich violet that sits apart from both warm and cool palettes. Strong personality; pairs well with neutral backgrounds.',
    icon: 'fas fa-star', hex: '#6d28d9', textHex: '#c4b5fd', feel: 'Distinct',
  },
];

// ── Size options ─────────────────────────────────────────────────────────────

export const SIZE_OPTIONS: readonly SizeOption[] = [
  {
    id: 'small', name: 'Small', tagline: 'Compact and discreet',
    description: 'Minimal footprint. Prioritises portability over presence — ideal when space is constrained.',
    icon: 'fas fa-circle', scale: 2, weight: 2, footprint: 2,
  },
  {
    id: 'medium', name: 'Medium', tagline: 'Balanced all-rounder',
    description: 'The default choice. Enough presence to feel intentional without dominating the space.',
    icon: 'fas fa-circle-half-stroke', scale: 5, weight: 5, footprint: 5,
  },
  {
    id: 'large', name: 'Large', tagline: 'Bold and prominent',
    description: 'Makes a statement. High visual weight — works best when the context warrants emphasis.',
    icon: 'fas fa-circle-dot', scale: 8, weight: 8, footprint: 8,
  },
  {
    id: 'xl', name: 'XL', tagline: 'Maximum impact',
    description: 'Full-scale presence. No subtlety — this occupies the space on its own terms.',
    icon: 'fas fa-burst', scale: 10, weight: 10, footprint: 10,
  },
];
