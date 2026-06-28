import type {
  ChemElement, LayoutOption, ColorOption, DetailOption, FilterOption, WizardStep,
} from './element-explorer.types.js';

// ── Wizard step definitions ────────────────────────────────────────────────────

export const WIZARD_STEPS: WizardStep[] = [
  { label: 'Layout',  icon: 'fas fa-table-cells-large', sublabel: 'Arrangement'  },
  { label: 'Colors',  icon: 'fas fa-palette',           sublabel: 'Color scheme' },
  { label: 'Detail',  icon: 'fas fa-list',              sublabel: 'Info density' },
  { label: 'Filter',  icon: 'fas fa-filter',            sublabel: 'Element set'  },
];

// ── Wizard option definitions ─────────────────────────────────────────────────

export const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: 'classic', name: 'Classic Grid',    icon: 'fas fa-table-cells-large', description: 'Standard 18-column periodic table with f-block rows at the bottom.' },
  { id: 'compact', name: 'Compact Grid',    icon: 'fas fa-compress',          description: 'Tighter spacing — perfect for getting the whole table in one glance.' },
  { id: 'wide',    name: 'Wide View',       icon: 'fas fa-expand',            description: 'Spacious cells with extra breathing room for rich detail.' },
  { id: 'alpha',   name: 'Alphabetical',    icon: 'fas fa-arrow-down-a-z',    description: 'All elements sorted by name in a responsive masonry grid.' },
];

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'category',
    name: 'By Category',
    icon: 'fas fa-shapes',
    description: 'Each element family gets its own hue — metals, gases, and everything in between.',
    swatches: ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#dc2626'],
  },
  {
    id: 'state',
    name: 'By State of Matter',
    icon: 'fas fa-temperature-half',
    description: 'Solid, liquid, or gas at room temperature — immediately visible at a glance.',
    swatches: ['#64748b','#06b6d4','#a855f7','#374151'],
  },
  {
    id: 'block',
    name: 'By Electron Block',
    icon: 'fas fa-layer-group',
    description: 'Colour-codes the s, p, d, and f electron orbital blocks.',
    swatches: ['#f97316','#3b82f6','#22c55e','#f43f5e'],
  },
  {
    id: 'period',
    name: 'By Period',
    icon: 'fas fa-arrows-left-right',
    description: 'A gradient across the 7 periods — lighter for period 1, deeper for period 7.',
    swatches: ['#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af'],
  },
  {
    id: 'mono',
    name: 'Monochrome',
    icon: 'fas fa-circle-half-stroke',
    description: 'Single accent colour with opacity scaled by electronegativity.',
    swatches: ['rgba(58,143,200,0.15)','rgba(58,143,200,0.35)','rgba(58,143,200,0.55)','rgba(58,143,200,0.85)'],
  },
];

export const DETAIL_OPTIONS: DetailOption[] = [
  {
    id: 'symbol',
    name: 'Symbol Only',
    description: 'Clean and minimal — just the chemical symbol. Great for quizzing yourself.',
    lines: ['Fe'],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Atomic number above, symbol large — the classic reference card format.',
    lines: ['26', 'Fe'],
  },
  {
    id: 'full',
    name: 'Full Card',
    description: 'Everything: atomic number, symbol, full name, and atomic mass.',
    lines: ['26', 'Fe', 'Iron', '55.85'],
  },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all',        name: 'All Elements',      icon: 'fas fa-atom',            description: 'The complete periodic table — all 118 confirmed elements.',  count: 118 },
  { id: 'metals',     name: 'Metals Only',        icon: 'fas fa-coins',           description: 'Alkali metals, alkaline earths, transition metals, and more.', count: 91  },
  { id: 'nonmetals',  name: 'Nonmetals & Halogs', icon: 'fas fa-wind',            description: 'Nonmetals, halogens — the reactive non-metallic elements.',    count: 17  },
  { id: 'noble',      name: 'Noble Gases',        icon: 'fas fa-star',            description: 'The inert group 18 — He, Ne, Ar, Kr, Xe, Rn, Og.',           count: 7   },
  { id: 'radioactive',name: 'Radioactive',        icon: 'fas fa-radiation',       description: 'Elements with no stable isotopes — handle with care.',         count: 38  },
];

// ── Color maps used by the service ────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  'alkali-metal':           '#ef4444',
  'alkaline-earth-metal':   '#f97316',
  'transition-metal':       '#eab308',
  'post-transition-metal':  '#22c55e',
  'metalloid':              '#14b8a6',
  'nonmetal':               '#3b82f6',
  'halogen':                '#8b5cf6',
  'noble-gas':              '#ec4899',
  'lanthanide':             '#f43f5e',
  'actinide':               '#dc2626',
};

export const STATE_COLORS: Record<string, string> = {
  solid:   '#64748b',
  liquid:  '#06b6d4',
  gas:     '#a855f7',
  unknown: '#374151',
};

export const BLOCK_COLORS: Record<string, string> = {
  s: '#f97316',
  p: '#3b82f6',
  d: '#22c55e',
  f: '#f43f5e',
};

export const PERIOD_COLORS: Record<number, string> = {
  1: '#bfdbfe',
  2: '#93c5fd',
  3: '#60a5fa',
  4: '#3b82f6',
  5: '#2563eb',
  6: '#1d4ed8',
  7: '#1e40af',
};

// ── Element data ──────────────────────────────────────────────────────────────
// group=null + fRow/fCol → Ce–Lu (annex row 9) and Th–Lr (annex row 10)

export const ELEMENTS: ChemElement[] = [
  // Period 1
  { number:  1, symbol:'H',  name:'Hydrogen',     atomicMass:'1.008',  category:'nonmetal',             block:'s', state:'gas',     period:1, group: 1,  fRow:null,fCol:null, electronegativity:2.20, radioactive:false },
  { number:  2, symbol:'He', name:'Helium',        atomicMass:'4.003',  category:'noble-gas',            block:'s', state:'gas',     period:1, group:18,  fRow:null,fCol:null, electronegativity:null, radioactive:false },
  // Period 2
  { number:  3, symbol:'Li', name:'Lithium',       atomicMass:'6.941',  category:'alkali-metal',         block:'s', state:'solid',   period:2, group: 1,  fRow:null,fCol:null, electronegativity:0.98, radioactive:false },
  { number:  4, symbol:'Be', name:'Beryllium',     atomicMass:'9.012',  category:'alkaline-earth-metal', block:'s', state:'solid',   period:2, group: 2,  fRow:null,fCol:null, electronegativity:1.57, radioactive:false },
  { number:  5, symbol:'B',  name:'Boron',         atomicMass:'10.81',  category:'metalloid',            block:'p', state:'solid',   period:2, group:13,  fRow:null,fCol:null, electronegativity:2.04, radioactive:false },
  { number:  6, symbol:'C',  name:'Carbon',        atomicMass:'12.01',  category:'nonmetal',             block:'p', state:'solid',   period:2, group:14,  fRow:null,fCol:null, electronegativity:2.55, radioactive:false },
  { number:  7, symbol:'N',  name:'Nitrogen',      atomicMass:'14.01',  category:'nonmetal',             block:'p', state:'gas',     period:2, group:15,  fRow:null,fCol:null, electronegativity:3.04, radioactive:false },
  { number:  8, symbol:'O',  name:'Oxygen',        atomicMass:'16.00',  category:'nonmetal',             block:'p', state:'gas',     period:2, group:16,  fRow:null,fCol:null, electronegativity:3.44, radioactive:false },
  { number:  9, symbol:'F',  name:'Fluorine',      atomicMass:'19.00',  category:'halogen',              block:'p', state:'gas',     period:2, group:17,  fRow:null,fCol:null, electronegativity:3.98, radioactive:false },
  { number: 10, symbol:'Ne', name:'Neon',          atomicMass:'20.18',  category:'noble-gas',            block:'p', state:'gas',     period:2, group:18,  fRow:null,fCol:null, electronegativity:null, radioactive:false },
  // Period 3
  { number: 11, symbol:'Na', name:'Sodium',        atomicMass:'22.99',  category:'alkali-metal',         block:'s', state:'solid',   period:3, group: 1,  fRow:null,fCol:null, electronegativity:0.93, radioactive:false },
  { number: 12, symbol:'Mg', name:'Magnesium',     atomicMass:'24.31',  category:'alkaline-earth-metal', block:'s', state:'solid',   period:3, group: 2,  fRow:null,fCol:null, electronegativity:1.31, radioactive:false },
  { number: 13, symbol:'Al', name:'Aluminium',     atomicMass:'26.98',  category:'post-transition-metal',block:'p', state:'solid',   period:3, group:13,  fRow:null,fCol:null, electronegativity:1.61, radioactive:false },
  { number: 14, symbol:'Si', name:'Silicon',       atomicMass:'28.09',  category:'metalloid',            block:'p', state:'solid',   period:3, group:14,  fRow:null,fCol:null, electronegativity:1.90, radioactive:false },
  { number: 15, symbol:'P',  name:'Phosphorus',    atomicMass:'30.97',  category:'nonmetal',             block:'p', state:'solid',   period:3, group:15,  fRow:null,fCol:null, electronegativity:2.19, radioactive:false },
  { number: 16, symbol:'S',  name:'Sulfur',        atomicMass:'32.07',  category:'nonmetal',             block:'p', state:'solid',   period:3, group:16,  fRow:null,fCol:null, electronegativity:2.58, radioactive:false },
  { number: 17, symbol:'Cl', name:'Chlorine',      atomicMass:'35.45',  category:'halogen',              block:'p', state:'gas',     period:3, group:17,  fRow:null,fCol:null, electronegativity:3.16, radioactive:false },
  { number: 18, symbol:'Ar', name:'Argon',         atomicMass:'39.95',  category:'noble-gas',            block:'p', state:'gas',     period:3, group:18,  fRow:null,fCol:null, electronegativity:null, radioactive:false },
  // Period 4
  { number: 19, symbol:'K',  name:'Potassium',     atomicMass:'39.10',  category:'alkali-metal',         block:'s', state:'solid',   period:4, group: 1,  fRow:null,fCol:null, electronegativity:0.82, radioactive:false },
  { number: 20, symbol:'Ca', name:'Calcium',       atomicMass:'40.08',  category:'alkaline-earth-metal', block:'s', state:'solid',   period:4, group: 2,  fRow:null,fCol:null, electronegativity:1.00, radioactive:false },
  { number: 21, symbol:'Sc', name:'Scandium',      atomicMass:'44.96',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 3,  fRow:null,fCol:null, electronegativity:1.36, radioactive:false },
  { number: 22, symbol:'Ti', name:'Titanium',      atomicMass:'47.87',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 4,  fRow:null,fCol:null, electronegativity:1.54, radioactive:false },
  { number: 23, symbol:'V',  name:'Vanadium',      atomicMass:'50.94',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 5,  fRow:null,fCol:null, electronegativity:1.63, radioactive:false },
  { number: 24, symbol:'Cr', name:'Chromium',      atomicMass:'52.00',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 6,  fRow:null,fCol:null, electronegativity:1.66, radioactive:false },
  { number: 25, symbol:'Mn', name:'Manganese',     atomicMass:'54.94',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 7,  fRow:null,fCol:null, electronegativity:1.55, radioactive:false },
  { number: 26, symbol:'Fe', name:'Iron',          atomicMass:'55.85',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 8,  fRow:null,fCol:null, electronegativity:1.83, radioactive:false },
  { number: 27, symbol:'Co', name:'Cobalt',        atomicMass:'58.93',  category:'transition-metal',     block:'d', state:'solid',   period:4, group: 9,  fRow:null,fCol:null, electronegativity:1.88, radioactive:false },
  { number: 28, symbol:'Ni', name:'Nickel',        atomicMass:'58.69',  category:'transition-metal',     block:'d', state:'solid',   period:4, group:10,  fRow:null,fCol:null, electronegativity:1.91, radioactive:false },
  { number: 29, symbol:'Cu', name:'Copper',        atomicMass:'63.55',  category:'transition-metal',     block:'d', state:'solid',   period:4, group:11,  fRow:null,fCol:null, electronegativity:1.90, radioactive:false },
  { number: 30, symbol:'Zn', name:'Zinc',          atomicMass:'65.38',  category:'transition-metal',     block:'d', state:'solid',   period:4, group:12,  fRow:null,fCol:null, electronegativity:1.65, radioactive:false },
  { number: 31, symbol:'Ga', name:'Gallium',       atomicMass:'69.72',  category:'post-transition-metal',block:'p', state:'solid',   period:4, group:13,  fRow:null,fCol:null, electronegativity:1.81, radioactive:false },
  { number: 32, symbol:'Ge', name:'Germanium',     atomicMass:'72.63',  category:'metalloid',            block:'p', state:'solid',   period:4, group:14,  fRow:null,fCol:null, electronegativity:2.01, radioactive:false },
  { number: 33, symbol:'As', name:'Arsenic',       atomicMass:'74.92',  category:'metalloid',            block:'p', state:'solid',   period:4, group:15,  fRow:null,fCol:null, electronegativity:2.18, radioactive:false },
  { number: 34, symbol:'Se', name:'Selenium',      atomicMass:'78.97',  category:'nonmetal',             block:'p', state:'solid',   period:4, group:16,  fRow:null,fCol:null, electronegativity:2.55, radioactive:false },
  { number: 35, symbol:'Br', name:'Bromine',       atomicMass:'79.90',  category:'halogen',              block:'p', state:'liquid',  period:4, group:17,  fRow:null,fCol:null, electronegativity:2.96, radioactive:false },
  { number: 36, symbol:'Kr', name:'Krypton',       atomicMass:'83.80',  category:'noble-gas',            block:'p', state:'gas',     period:4, group:18,  fRow:null,fCol:null, electronegativity:3.00, radioactive:false },
  // Period 5
  { number: 37, symbol:'Rb', name:'Rubidium',      atomicMass:'85.47',  category:'alkali-metal',         block:'s', state:'solid',   period:5, group: 1,  fRow:null,fCol:null, electronegativity:0.82, radioactive:false },
  { number: 38, symbol:'Sr', name:'Strontium',     atomicMass:'87.62',  category:'alkaline-earth-metal', block:'s', state:'solid',   period:5, group: 2,  fRow:null,fCol:null, electronegativity:0.95, radioactive:false },
  { number: 39, symbol:'Y',  name:'Yttrium',       atomicMass:'88.91',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 3,  fRow:null,fCol:null, electronegativity:1.22, radioactive:false },
  { number: 40, symbol:'Zr', name:'Zirconium',     atomicMass:'91.22',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 4,  fRow:null,fCol:null, electronegativity:1.33, radioactive:false },
  { number: 41, symbol:'Nb', name:'Niobium',       atomicMass:'92.91',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 5,  fRow:null,fCol:null, electronegativity:1.60, radioactive:false },
  { number: 42, symbol:'Mo', name:'Molybdenum',    atomicMass:'95.95',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 6,  fRow:null,fCol:null, electronegativity:2.16, radioactive:false },
  { number: 43, symbol:'Tc', name:'Technetium',    atomicMass:'98',     category:'transition-metal',     block:'d', state:'solid',   period:5, group: 7,  fRow:null,fCol:null, electronegativity:1.90, radioactive:true  },
  { number: 44, symbol:'Ru', name:'Ruthenium',     atomicMass:'101.1',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 8,  fRow:null,fCol:null, electronegativity:2.20, radioactive:false },
  { number: 45, symbol:'Rh', name:'Rhodium',       atomicMass:'102.9',  category:'transition-metal',     block:'d', state:'solid',   period:5, group: 9,  fRow:null,fCol:null, electronegativity:2.28, radioactive:false },
  { number: 46, symbol:'Pd', name:'Palladium',     atomicMass:'106.4',  category:'transition-metal',     block:'d', state:'solid',   period:5, group:10,  fRow:null,fCol:null, electronegativity:2.20, radioactive:false },
  { number: 47, symbol:'Ag', name:'Silver',        atomicMass:'107.9',  category:'transition-metal',     block:'d', state:'solid',   period:5, group:11,  fRow:null,fCol:null, electronegativity:1.93, radioactive:false },
  { number: 48, symbol:'Cd', name:'Cadmium',       atomicMass:'112.4',  category:'transition-metal',     block:'d', state:'solid',   period:5, group:12,  fRow:null,fCol:null, electronegativity:1.69, radioactive:false },
  { number: 49, symbol:'In', name:'Indium',        atomicMass:'114.8',  category:'post-transition-metal',block:'p', state:'solid',   period:5, group:13,  fRow:null,fCol:null, electronegativity:1.78, radioactive:false },
  { number: 50, symbol:'Sn', name:'Tin',           atomicMass:'118.7',  category:'post-transition-metal',block:'p', state:'solid',   period:5, group:14,  fRow:null,fCol:null, electronegativity:1.96, radioactive:false },
  { number: 51, symbol:'Sb', name:'Antimony',      atomicMass:'121.8',  category:'metalloid',            block:'p', state:'solid',   period:5, group:15,  fRow:null,fCol:null, electronegativity:2.05, radioactive:false },
  { number: 52, symbol:'Te', name:'Tellurium',     atomicMass:'127.6',  category:'metalloid',            block:'p', state:'solid',   period:5, group:16,  fRow:null,fCol:null, electronegativity:2.10, radioactive:false },
  { number: 53, symbol:'I',  name:'Iodine',        atomicMass:'126.9',  category:'halogen',              block:'p', state:'solid',   period:5, group:17,  fRow:null,fCol:null, electronegativity:2.66, radioactive:false },
  { number: 54, symbol:'Xe', name:'Xenon',         atomicMass:'131.3',  category:'noble-gas',            block:'p', state:'gas',     period:5, group:18,  fRow:null,fCol:null, electronegativity:2.60, radioactive:false },
  // Period 6 — main-group and d-block (La at group 3 as f-block anchor)
  { number: 55, symbol:'Cs', name:'Caesium',       atomicMass:'132.9',  category:'alkali-metal',         block:'s', state:'solid',   period:6, group: 1,  fRow:null,fCol:null, electronegativity:0.79, radioactive:false },
  { number: 56, symbol:'Ba', name:'Barium',        atomicMass:'137.3',  category:'alkaline-earth-metal', block:'s', state:'solid',   period:6, group: 2,  fRow:null,fCol:null, electronegativity:0.89, radioactive:false },
  { number: 57, symbol:'La', name:'Lanthanum',     atomicMass:'138.9',  category:'lanthanide',           block:'f', state:'solid',   period:6, group: 3,  fRow:null,fCol:null, electronegativity:1.10, radioactive:false },
  { number: 72, symbol:'Hf', name:'Hafnium',       atomicMass:'178.5',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 4,  fRow:null,fCol:null, electronegativity:1.30, radioactive:false },
  { number: 73, symbol:'Ta', name:'Tantalum',      atomicMass:'180.9',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 5,  fRow:null,fCol:null, electronegativity:1.50, radioactive:false },
  { number: 74, symbol:'W',  name:'Tungsten',      atomicMass:'183.8',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 6,  fRow:null,fCol:null, electronegativity:2.36, radioactive:false },
  { number: 75, symbol:'Re', name:'Rhenium',       atomicMass:'186.2',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 7,  fRow:null,fCol:null, electronegativity:1.90, radioactive:false },
  { number: 76, symbol:'Os', name:'Osmium',        atomicMass:'190.2',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 8,  fRow:null,fCol:null, electronegativity:2.20, radioactive:false },
  { number: 77, symbol:'Ir', name:'Iridium',       atomicMass:'192.2',  category:'transition-metal',     block:'d', state:'solid',   period:6, group: 9,  fRow:null,fCol:null, electronegativity:2.20, radioactive:false },
  { number: 78, symbol:'Pt', name:'Platinum',      atomicMass:'195.1',  category:'transition-metal',     block:'d', state:'solid',   period:6, group:10,  fRow:null,fCol:null, electronegativity:2.28, radioactive:false },
  { number: 79, symbol:'Au', name:'Gold',          atomicMass:'197.0',  category:'transition-metal',     block:'d', state:'solid',   period:6, group:11,  fRow:null,fCol:null, electronegativity:2.54, radioactive:false },
  { number: 80, symbol:'Hg', name:'Mercury',       atomicMass:'200.6',  category:'transition-metal',     block:'d', state:'liquid',  period:6, group:12,  fRow:null,fCol:null, electronegativity:2.00, radioactive:false },
  { number: 81, symbol:'Tl', name:'Thallium',      atomicMass:'204.4',  category:'post-transition-metal',block:'p', state:'solid',   period:6, group:13,  fRow:null,fCol:null, electronegativity:1.62, radioactive:false },
  { number: 82, symbol:'Pb', name:'Lead',          atomicMass:'207.2',  category:'post-transition-metal',block:'p', state:'solid',   period:6, group:14,  fRow:null,fCol:null, electronegativity:1.87, radioactive:false },
  { number: 83, symbol:'Bi', name:'Bismuth',       atomicMass:'209.0',  category:'post-transition-metal',block:'p', state:'solid',   period:6, group:15,  fRow:null,fCol:null, electronegativity:2.02, radioactive:false },
  { number: 84, symbol:'Po', name:'Polonium',      atomicMass:'209',    category:'post-transition-metal',block:'p', state:'solid',   period:6, group:16,  fRow:null,fCol:null, electronegativity:2.00, radioactive:true  },
  { number: 85, symbol:'At', name:'Astatine',      atomicMass:'210',    category:'halogen',              block:'p', state:'solid',   period:6, group:17,  fRow:null,fCol:null, electronegativity:2.20, radioactive:true  },
  { number: 86, symbol:'Rn', name:'Radon',         atomicMass:'222',    category:'noble-gas',            block:'p', state:'gas',     period:6, group:18,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  // f-block annex row 9 — Ce through Lu
  { number: 58, symbol:'Ce', name:'Cerium',        atomicMass:'140.1',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 4,   electronegativity:1.12, radioactive:false },
  { number: 59, symbol:'Pr', name:'Praseodymium',  atomicMass:'140.9',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 5,   electronegativity:1.13, radioactive:false },
  { number: 60, symbol:'Nd', name:'Neodymium',     atomicMass:'144.2',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 6,   electronegativity:1.14, radioactive:false },
  { number: 61, symbol:'Pm', name:'Promethium',    atomicMass:'145',    category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 7,   electronegativity:1.13, radioactive:true  },
  { number: 62, symbol:'Sm', name:'Samarium',      atomicMass:'150.4',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 8,   electronegativity:1.17, radioactive:false },
  { number: 63, symbol:'Eu', name:'Europium',      atomicMass:'152.0',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol: 9,   electronegativity:1.20, radioactive:false },
  { number: 64, symbol:'Gd', name:'Gadolinium',    atomicMass:'157.3',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:10,   electronegativity:1.20, radioactive:false },
  { number: 65, symbol:'Tb', name:'Terbium',       atomicMass:'158.9',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:11,   electronegativity:1.20, radioactive:false },
  { number: 66, symbol:'Dy', name:'Dysprosium',    atomicMass:'162.5',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:12,   electronegativity:1.22, radioactive:false },
  { number: 67, symbol:'Ho', name:'Holmium',       atomicMass:'164.9',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:13,   electronegativity:1.23, radioactive:false },
  { number: 68, symbol:'Er', name:'Erbium',        atomicMass:'167.3',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:14,   electronegativity:1.24, radioactive:false },
  { number: 69, symbol:'Tm', name:'Thulium',       atomicMass:'168.9',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:15,   electronegativity:1.25, radioactive:false },
  { number: 70, symbol:'Yb', name:'Ytterbium',     atomicMass:'173.0',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:16,   electronegativity:1.10, radioactive:false },
  { number: 71, symbol:'Lu', name:'Lutetium',      atomicMass:'175.0',  category:'lanthanide',           block:'f', state:'solid',   period:6, group:null, fRow:9, fCol:17,   electronegativity:1.27, radioactive:false },
  // Period 7 — main-group and d-block (Ac at group 3 as f-block anchor)
  { number: 87, symbol:'Fr', name:'Francium',      atomicMass:'223',    category:'alkali-metal',         block:'s', state:'solid',   period:7, group: 1,  fRow:null,fCol:null, electronegativity:0.70, radioactive:true  },
  { number: 88, symbol:'Ra', name:'Radium',        atomicMass:'226',    category:'alkaline-earth-metal', block:'s', state:'solid',   period:7, group: 2,  fRow:null,fCol:null, electronegativity:0.90, radioactive:true  },
  { number: 89, symbol:'Ac', name:'Actinium',      atomicMass:'227',    category:'actinide',             block:'f', state:'solid',   period:7, group: 3,  fRow:null,fCol:null, electronegativity:1.10, radioactive:true  },
  { number:104, symbol:'Rf', name:'Rutherfordium', atomicMass:'267',    category:'transition-metal',     block:'d', state:'solid',   period:7, group: 4,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:105, symbol:'Db', name:'Dubnium',       atomicMass:'268',    category:'transition-metal',     block:'d', state:'solid',   period:7, group: 5,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:106, symbol:'Sg', name:'Seaborgium',    atomicMass:'271',    category:'transition-metal',     block:'d', state:'solid',   period:7, group: 6,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:107, symbol:'Bh', name:'Bohrium',       atomicMass:'270',    category:'transition-metal',     block:'d', state:'solid',   period:7, group: 7,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:108, symbol:'Hs', name:'Hassium',       atomicMass:'277',    category:'transition-metal',     block:'d', state:'solid',   period:7, group: 8,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:109, symbol:'Mt', name:'Meitnerium',    atomicMass:'276',    category:'transition-metal',     block:'d', state:'unknown', period:7, group: 9,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:110, symbol:'Ds', name:'Darmstadtium',  atomicMass:'281',    category:'transition-metal',     block:'d', state:'unknown', period:7, group:10,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:111, symbol:'Rg', name:'Roentgenium',   atomicMass:'282',    category:'transition-metal',     block:'d', state:'unknown', period:7, group:11,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:112, symbol:'Cn', name:'Copernicium',   atomicMass:'285',    category:'transition-metal',     block:'d', state:'unknown', period:7, group:12,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:113, symbol:'Nh', name:'Nihonium',      atomicMass:'286',    category:'post-transition-metal',block:'p', state:'unknown', period:7, group:13,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:114, symbol:'Fl', name:'Flerovium',     atomicMass:'289',    category:'post-transition-metal',block:'p', state:'unknown', period:7, group:14,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:115, symbol:'Mc', name:'Moscovium',     atomicMass:'290',    category:'post-transition-metal',block:'p', state:'unknown', period:7, group:15,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:116, symbol:'Lv', name:'Livermorium',   atomicMass:'293',    category:'post-transition-metal',block:'p', state:'unknown', period:7, group:16,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:117, symbol:'Ts', name:'Tennessine',    atomicMass:'294',    category:'halogen',              block:'p', state:'unknown', period:7, group:17,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  { number:118, symbol:'Og', name:'Oganesson',     atomicMass:'294',    category:'noble-gas',            block:'p', state:'unknown', period:7, group:18,  fRow:null,fCol:null, electronegativity:null, radioactive:true  },
  // f-block annex row 10 — Th through Lr
  { number: 90, symbol:'Th', name:'Thorium',       atomicMass:'232.0',  category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 4,   electronegativity:1.30, radioactive:true  },
  { number: 91, symbol:'Pa', name:'Protactinium',  atomicMass:'231.0',  category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 5,   electronegativity:1.50, radioactive:true  },
  { number: 92, symbol:'U',  name:'Uranium',       atomicMass:'238.0',  category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 6,   electronegativity:1.38, radioactive:true  },
  { number: 93, symbol:'Np', name:'Neptunium',     atomicMass:'237',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 7,   electronegativity:1.36, radioactive:true  },
  { number: 94, symbol:'Pu', name:'Plutonium',     atomicMass:'244',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 8,   electronegativity:1.28, radioactive:true  },
  { number: 95, symbol:'Am', name:'Americium',     atomicMass:'243',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol: 9,   electronegativity:1.13, radioactive:true  },
  { number: 96, symbol:'Cm', name:'Curium',        atomicMass:'247',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:10,   electronegativity:1.28, radioactive:true  },
  { number: 97, symbol:'Bk', name:'Berkelium',     atomicMass:'247',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:11,   electronegativity:1.30, radioactive:true  },
  { number: 98, symbol:'Cf', name:'Californium',   atomicMass:'251',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:12,   electronegativity:1.30, radioactive:true  },
  { number: 99, symbol:'Es', name:'Einsteinium',   atomicMass:'252',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:13,   electronegativity:1.30, radioactive:true  },
  { number:100, symbol:'Fm', name:'Fermium',       atomicMass:'257',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:14,   electronegativity:1.30, radioactive:true  },
  { number:101, symbol:'Md', name:'Mendelevium',   atomicMass:'258',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:15,   electronegativity:1.30, radioactive:true  },
  { number:102, symbol:'No', name:'Nobelium',      atomicMass:'259',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:16,   electronegativity:1.30, radioactive:true  },
  { number:103, symbol:'Lr', name:'Lawrencium',    atomicMass:'266',    category:'actinide',             block:'f', state:'solid',   period:7, group:null, fRow:10, fCol:17,   electronegativity:1.30, radioactive:true  },
];
