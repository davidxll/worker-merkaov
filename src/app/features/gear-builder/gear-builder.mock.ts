import type {
  ChassisConfig, ChassisId, ChassisOption,
  ColorOption, EngineOption, RimOption, BodyKitOption,
} from './gear-builder.types.js';

// ── Chassis options ──────────────────────────────────────────────────────────

export const CHASSIS_OPTIONS: readonly ChassisOption[] = [
  {
    id: 'sedan', name: 'Sedan', tagline: 'The refined classic',
    description: 'A timeless 4-door silhouette balancing comfort, efficiency, and everyday practicality.',
    icon: 'fas fa-car',
    stats: { weight: 1420, seats: 5, dragCoeff: 0.27 },
  },
  {
    id: 'suv', name: 'SUV', tagline: 'Command every road',
    description: 'Elevated ride height, spacious cabin, and genuine off-road capability in a modern package.',
    icon: 'fas fa-truck-monster',
    stats: { weight: 2040, seats: 7, dragCoeff: 0.38 },
  },
  {
    id: 'truck', name: 'Pickup Truck', tagline: 'Built to haul',
    description: 'Full-size crew cab with a 6-ft payload bed — power and utility without compromise.',
    icon: 'fas fa-truck-pickup',
    stats: { weight: 2250, seats: 5, dragCoeff: 0.44 },
  },
  {
    id: 'coupe', name: 'Sports Coupe', tagline: 'Born on the track',
    description: 'Low-slung fastback with aggressive aero, wide stance, and a driver-focused cockpit.',
    icon: 'fas fa-gauge-high',
    stats: { weight: 1280, seats: 2, dragCoeff: 0.22 },
  },
];

// ── Engine options ───────────────────────────────────────────────────────────

export const ENGINE_OPTIONS: readonly EngineOption[] = [
  {
    id: 'electric', name: 'Dual-Motor EV', tagline: 'Zero emissions, instant torque',
    icon: 'fas fa-bolt', accentColor: '#38bdf8', fuelType: 'electric',
    stats: { hp: 480, torqueNm: 720, efficiency: 120 },
  },
  {
    id: 'turbo4', name: 'Turbo 4-Cylinder', tagline: 'Punchy and efficient',
    icon: 'fas fa-wind', accentColor: '#a3e635', fuelType: 'gasoline',
    stats: { hp: 265, torqueNm: 400, efficiency: 38 },
  },
  {
    id: 'v6', name: 'Naturally-Aspirated V6', tagline: 'Smooth power delivery',
    icon: 'fas fa-circle-dot', accentColor: '#fb923c', fuelType: 'gasoline',
    stats: { hp: 325, torqueNm: 380, efficiency: 28 },
  },
  {
    id: 'v8', name: 'Supercharged V8', tagline: 'Brute force, no apologies',
    icon: 'fas fa-fire-flame-curved', accentColor: '#f43f5e', fuelType: 'gasoline',
    stats: { hp: 650, torqueNm: 820, efficiency: 18 },
  },
];

// ── Color options ────────────────────────────────────────────────────────────

export const COLOR_OPTIONS: readonly ColorOption[] = [
  { id: 'midnight', name: 'Midnight Black',  hex: '#111827', metallic: true  },
  { id: 'arctic',   name: 'Arctic White',    hex: '#f1f5f9', metallic: false },
  { id: 'racing',   name: 'Racing Red',      hex: '#dc2626', metallic: false },
  { id: 'ocean',    name: 'Ocean Blue',      hex: '#1d4ed8', metallic: true  },
  { id: 'forest',   name: 'Forest Green',    hex: '#15803d', metallic: true  },
  { id: 'sunset',   name: 'Sunset Orange',   hex: '#ea580c', metallic: false },
];

// ── Rim options ──────────────────────────────────────────────────────────────

export const RIM_OPTIONS: readonly RimOption[] = [
  { id: 'steel',  name: 'Standard Steel',       description: 'Durable factory fitment',          hubColor: '#64748b', spokeColor: '#94a3b8', spokeCount: 5,  spokeWidth: 4 },
  { id: 'alloy',  name: 'Alloy Sport',           description: '10-spoke performance alloy',       hubColor: '#cbd5e1', spokeColor: '#e2e8f0', spokeCount: 10, spokeWidth: 2 },
  { id: 'carbon', name: 'Carbon Fiber Racing',   description: 'Lightweight matte-black carbon',  hubColor: '#1e293b', spokeColor: '#334155', spokeCount: 5,  spokeWidth: 6 },
  { id: 'chrome', name: 'Chrome Classic',        description: 'Mirror-finish statement wheels',  hubColor: '#e2e8f0', spokeColor: '#f8fafc', spokeCount: 5,  spokeWidth: 3 },
];

// ── Body kit options ─────────────────────────────────────────────────────────

export const BODY_KIT_OPTIONS: readonly BodyKitOption[] = [
  { id: 'none',    name: 'No Kit',         description: 'Clean factory appearance',                     icon: 'fas fa-minus',          adds: []                                    },
  { id: 'sport',   name: 'Sport Kit',      description: 'Front lip splitter + rear spoiler',            icon: 'fas fa-flag-checkered', adds: ['Front lip', 'Rear spoiler']         },
  { id: 'offroad', name: 'Off-Road Pack',  description: 'Roof rack + underbody skid plates',            icon: 'fas fa-mountain',       adds: ['Roof rack', 'Skid plates']          },
  { id: 'aero',    name: 'Aero Package',   description: 'Full aero kit: splitter, diffuser, wing',      icon: 'fas fa-rocket',         adds: ['Splitter', 'Diffuser', 'Wing']      },
];

// ── SVG chassis configurations ───────────────────────────────────────────────
// ViewBox: 0 0 560 200   Ground: y≈185   Wheel bottoms: y≈190

export const CHASSIS_SVG: Record<ChassisId, ChassisConfig> = {

  sedan: {
    bodyPath:
      'M 45,160 L 42,140 Q 60,126 108,118 L 148,84 L 172,70 ' +
      'L 390,68 L 414,82 Q 452,108 490,124 L 516,140 L 518,160 Z',
    frontWindowPath:
      'M 151,86 L 172,72 L 276,70 L 276,84 Z',
    rearWindowPath:
      'M 280,69 L 392,68 L 413,83 L 314,95 L 280,84 Z',
    bPillarPath:
      'M 276,70 L 280,69 L 280,84 L 276,84 Z',
    truckBedPath: null,
    headlight:  { x: 40,  y: 134, w: 10, h: 18 },
    taillight:  { x: 510, y: 130, w: 10, h: 22 },
    leftWheel:  { cx: 115, cy: 160, r: 30 },
    rightWheel: { cx: 445, cy: 160, r: 30 },
    frontLipPath:
      'M 38,160 L 38,165 Q 50,168 78,168 L 78,160 Z',
    spoilerPath:
      'M 390,60 L 425,55 L 425,66 L 390,68 Z',
    roofRackSpec: null,
    badgePos: { x: 220, y: 132 },
  },

  suv: {
    bodyPath:
      'M 38,168 L 35,142 Q 52,127 96,120 L 98,72 L 124,57 ' +
      'L 420,57 L 443,71 L 462,120 Q 500,134 524,142 L 526,168 Z',
    frontWindowPath:
      'M 100,74 L 124,59 L 248,58 L 248,73 Z',
    rearWindowPath:
      'M 252,57 L 418,57 L 441,73 L 252,73 Z',
    bPillarPath:
      'M 248,58 L 252,57 L 252,73 L 248,73 Z',
    truckBedPath: null,
    headlight:  { x: 32,  y: 134, w: 12, h: 22 },
    taillight:  { x: 516, y: 132, w: 12, h: 26 },
    leftWheel:  { cx: 120, cy: 168, r: 35 },
    rightWheel: { cx: 445, cy: 168, r: 35 },
    frontLipPath:
      'M 30,168 L 30,174 Q 46,177 82,177 L 82,168 Z',
    spoilerPath:
      'M 418,48 L 456,43 L 456,55 L 418,57 Z',
    roofRackSpec: { x: 130, y: 50, w: 290, h: 5 },
    badgePos: { x: 220, y: 138 },
  },

  truck: {
    bodyPath:
      'M 42,170 L 40,142 Q 58,126 102,118 L 105,64 L 126,52 ' +
      'L 276,52 L 276,170 Z',
    frontWindowPath:
      'M 108,66 L 126,54 L 268,54 L 268,67 Z',
    rearWindowPath:
      'M 268,54 L 268,67 L 276,67 L 276,54 Z',
    bPillarPath: null,
    truckBedPath:
      'M 280,58 L 534,58 L 534,116 L 280,116 Z M 280,58 L 280,116 ' +
      'M 534,58 L 534,116 M 280,116 L 534,116',
    headlight:  { x: 37,  y: 134, w: 12, h: 22 },
    taillight:  { x: 522, y: 132, w: 12, h: 26 },
    leftWheel:  { cx: 120, cy: 170, r: 35 },
    rightWheel: { cx: 432, cy: 170, r: 35 },
    frontLipPath:
      'M 33,170 L 33,177 Q 50,180 85,180 L 85,170 Z',
    spoilerPath:
      'M 534,50 L 534,58 L 555,58 L 555,50 Z',
    roofRackSpec: { x: 108, y: 45, w: 165, h: 5 },
    badgePos: { x: 155, y: 135 },
  },

  coupe: {
    bodyPath:
      'M 28,157 L 32,140 Q 52,128 102,118 L 134,88 L 163,72 ' +
      'L 360,69 L 426,78 Q 477,100 512,128 L 524,148 L 526,157 Z',
    frontWindowPath:
      'M 137,90 L 163,74 L 276,71 L 276,84 Z',
    rearWindowPath:
      'M 280,70 L 361,69 L 424,79 Q 466,98 498,124 L 402,106 L 280,84 Z',
    bPillarPath: null,
    truckBedPath: null,
    headlight:  { x: 24,  y: 132, w: 14, h: 14 },
    taillight:  { x: 514, y: 130, w: 14, h: 22 },
    leftWheel:  { cx: 108, cy: 157, r: 28 },
    rightWheel: { cx: 452, cy: 157, r: 28 },
    frontLipPath:
      'M 22,157 L 22,163 Q 38,167 70,167 L 70,157 Z',
    spoilerPath:
      'M 355,58 L 430,65 L 430,72 L 355,65 Z',
    roofRackSpec: null,
    badgePos: { x: 200, y: 130 },
  },
};
