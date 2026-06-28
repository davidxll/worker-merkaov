import type {
  StructureOption, DriveOption, FinishOption, DetailOption, ModuleOption,
} from "./gear-builder.types.js";

// ── Structure options ────────────────────────────────────────────────────────

export const STRUCTURE_OPTIONS: readonly StructureOption[] = [
  {
    id: "monolith", name: "Monolith", tagline: "Maximum integrity",
    description: "A single dense mass. No joints, no seams — unbroken structural continuity from surface to core.",
    icon: "fas fa-square",
    stats: { mass: 9, rigidity: 10, surface: 3 },
  },
  {
    id: "lattice", name: "Lattice", tagline: "Strength through network",
    description: "An open scaffold of interconnected nodes. Load distributes across the network rather than concentrating at a single point.",
    icon: "fas fa-border-all",
    stats: { mass: 4, rigidity: 8, surface: 9 },
  },
  {
    id: "shell", name: "Shell", tagline: "Minimal mass, maximum volume",
    description: "A thin outer casing enclosing an empty interior. Optimises for enclosed space rather than raw material strength.",
    icon: "fas fa-circle-notch",
    stats: { mass: 2, rigidity: 5, surface: 7 },
  },
  {
    id: "modular", name: "Modular", tagline: "Reconfigurable segments",
    description: "Discrete interlocking sections — each independently removable. Form follows function, and function can be changed.",
    icon: "fas fa-layer-group",
    stats: { mass: 5, rigidity: 6, surface: 6 },
  },
];

// ── Drive options ────────────────────────────────────────────────────────────

export const DRIVE_OPTIONS: readonly DriveOption[] = [
  {
    id: "pulse", name: "Pulse Drive", tagline: "Sharp peaks, instant response",
    icon: "fas fa-bolt", accentColor: "#38bdf8", cycleType: "pulsed",
    stats: { output: 920, efficiency: 71, cycleMs: 12 },
  },
  {
    id: "wave", name: "Wave Drive", tagline: "Smooth continuous flow",
    icon: "fas fa-wave-square", accentColor: "#a3e635", cycleType: "continuous",
    stats: { output: 540, efficiency: 94, cycleMs: 0 },
  },
  {
    id: "field", name: "Field Drive", tagline: "Ambient distributed energy",
    icon: "fas fa-atom", accentColor: "#c084fc", cycleType: "ambient",
    stats: { output: 310, efficiency: 99, cycleMs: 0 },
  },
  {
    id: "kinetic", name: "Kinetic Store", tagline: "Motion converted to force",
    icon: "fas fa-rotate", accentColor: "#fb923c", cycleType: "mechanical",
    stats: { output: 650, efficiency: 82, cycleMs: 44 },
  },
];

// ── Finish options ───────────────────────────────────────────────────────────

export const FINISH_OPTIONS: readonly FinishOption[] = [
  { id: "void",   name: "Void Black",   hex: "#0f172a", metallic: false },
  { id: "frost",  name: "Frost White",  hex: "#e2e8f0", metallic: false },
  { id: "ember",  name: "Ember Red",    hex: "#dc2626", metallic: false },
  { id: "tide",   name: "Tide Blue",    hex: "#1d4ed8", metallic: true  },
  { id: "canopy", name: "Canopy Green", hex: "#15803d", metallic: true  },
  { id: "corona", name: "Corona Gold",  hex: "#b45309", metallic: true  },
];

// ── Detail options ───────────────────────────────────────────────────────────

export const DETAIL_OPTIONS: readonly DetailOption[] = [
  { id: "minimal",  name: "Null Array",    description: "Unadorned terminus — raw geometric edge",     accentColor: "#64748b", edgeColor: "#94a3b8" },
  { id: "radiator", name: "Radial Grid",   description: "12-point heat dispersal lattice",            accentColor: "#7EC8E3", edgeColor: "#3A8FC8" },
  { id: "fractal",  name: "Fractal Mesh",  description: "Recursive tessellated corner brackets",      accentColor: "#8ECFA8", edgeColor: "#6BBFA0" },
  { id: "mirror",   name: "Mirror Plane",  description: "Reflective boundary — L-form interface",     accentColor: "#DEB86A", edgeColor: "#C8943A" },
];

// ── Module options ───────────────────────────────────────────────────────────

export const MODULE_OPTIONS: readonly ModuleOption[] = [
  { id: "none",       name: "No Module",           description: "Base configuration — clean geometric terminus",        icon: "fas fa-minus",         adds: []                                        },
  { id: "amplifier",  name: "Signal Amplifier",    description: "Extends output propagation range by 3x",               icon: "fas fa-signal",        adds: ["Extended range", "Gain +18 dB"]         },
  { id: "stabiliser", name: "Inertial Stabiliser", description: "Dampens oscillation across all operational axes",      icon: "fas fa-scale-balanced", adds: ["Oscillation damping", "Drift correction"]},
  { id: "resonator",  name: "Harmonic Resonator",  description: "Tunes output frequency for resonant efficiency peaks", icon: "fas fa-wave-square",   adds: ["Frequency lock", "Efficiency +12%"]     },
];
