import type {
  WizardStep, PropertyTypeOption, PriceRangeOption, BedOption, BathOption, FeatureOption,
} from './mls-composer.types.js';

// ── Wizard step definitions ───────────────────────────────────────────────────

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Property', icon: 'fas fa-home',         sublabel: 'Type'         },
  { label: 'Budget',   icon: 'fas fa-dollar-sign',  sublabel: 'Price range'  },
  { label: 'Layout',   icon: 'fas fa-bed',           sublabel: 'Beds & baths' },
  { label: 'Features', icon: 'fas fa-star',          sublabel: 'Must-haves'  },
];

// ── Property type options ─────────────────────────────────────────────────────

export const PROPERTY_TYPE_OPTIONS: readonly PropertyTypeOption[] = [
  {
    id: 'single-family', name: 'Single Family', tagline: 'Standalone residential home',
    description: 'A detached home on its own lot. Full ownership of structure and land. Best for buyers wanting privacy, yard space, and no shared walls.',
    icon: 'fas fa-house', mlsCode: 'RESI', accentColor: '#38bdf8',
  },
  {
    id: 'condo', name: 'Condo / Townhouse', tagline: 'Shared-structure ownership',
    description: 'Own your unit within a larger building or complex. HOA typically manages exterior maintenance and common areas — lower upkeep, less control.',
    icon: 'fas fa-building', mlsCode: 'COND', accentColor: '#a3e635',
  },
  {
    id: 'multi-family', name: 'Multi-Family', tagline: '2–4 unit investment property',
    description: 'A property with 2–4 residential units. Live in one and rent the others (house hacking), or hold all units as a pure income investment.',
    icon: 'fas fa-city', mlsCode: 'MULT', accentColor: '#fb923c',
  },
  {
    id: 'land', name: 'Land / Lot', tagline: 'Raw or improved lot',
    description: 'Vacant land for building or investment. May be raw land, subdivided lots, or improved parcels with utilities already run to the site.',
    icon: 'fas fa-mountain-sun', mlsCode: 'LAND', accentColor: '#4ade80',
  },
  {
    id: 'commercial', name: 'Commercial', tagline: 'Business or income property',
    description: 'Retail, office, industrial, or mixed-use properties. Valued on income potential (cap rate) rather than residential comparable sales.',
    icon: 'fas fa-store', mlsCode: 'COMM', accentColor: '#c084fc',
  },
];

// ── Price range options ────────────────────────────────────────────────────────

export const PRICE_RANGE_OPTIONS: readonly PriceRangeOption[] = [
  { id: 'starter',   name: 'Starter',   tagline: 'Under $250K',   icon: 'fas fa-seedling',      min: 0,       max: 250000  },
  { id: 'mid',       name: 'Mid-Range', tagline: '$250K – $500K', icon: 'fas fa-house-chimney', min: 250000,  max: 500000  },
  { id: 'upper-mid', name: 'Upper-Mid', tagline: '$500K – $800K', icon: 'fas fa-star-half-stroke', min: 500000, max: 800000 },
  { id: 'premium',   name: 'Premium',   tagline: '$800K – $1.5M', icon: 'fas fa-gem',           min: 800000,  max: 1500000 },
  { id: 'luxury',    name: 'Luxury',    tagline: '$1.5M+',        icon: 'fas fa-crown',         min: 1500000, max: null    },
];

// ── Bedroom options ────────────────────────────────────────────────────────────

export const BED_OPTIONS: readonly BedOption[] = [
  { id: 'any',   label: 'Any',  min: 0 },
  { id: '1',     label: '1+',   min: 1 },
  { id: '2',     label: '2+',   min: 2 },
  { id: '3',     label: '3+',   min: 3 },
  { id: '4',     label: '4+',   min: 4 },
  { id: '5plus', label: '5+',   min: 5 },
];

// ── Bathroom options ───────────────────────────────────────────────────────────

export const BATH_OPTIONS: readonly BathOption[] = [
  { id: '1',     label: '1+',   display: '1',  min: 1   },
  { id: '1h',    label: '1½+',  display: '1½', min: 1.5 },
  { id: '2',     label: '2+',   display: '2',  min: 2   },
  { id: '2h',    label: '2½+',  display: '2½', min: 2.5 },
  { id: '3',     label: '3+',   display: '3',  min: 3   },
  { id: '4plus', label: '4+',   display: '4',  min: 4   },
];

// ── Feature / amenity options ─────────────────────────────────────────────────

export const FEATURE_OPTIONS: readonly FeatureOption[] = [
  { id: 'garage',           name: 'Garage',          icon: 'fas fa-warehouse',      mlsAmenity: 'Garage'           },
  { id: 'pool',             name: 'Pool',             icon: 'fas fa-water',          mlsAmenity: 'Pool'             },
  { id: 'basement',         name: 'Basement',         icon: 'fas fa-layer-group',    mlsAmenity: 'Basement'         },
  { id: 'waterfront',       name: 'Waterfront',       icon: 'fas fa-anchor',         mlsAmenity: 'Waterfront'       },
  { id: 'new-construction', name: 'New Construction', icon: 'fas fa-hard-hat',       mlsAmenity: 'New Construction' },
  { id: 'no-hoa',           name: 'No HOA',           icon: 'fas fa-shield-halved',  mlsAmenity: 'No HOA'           },
  { id: 'fireplace',        name: 'Fireplace',        icon: 'fas fa-fire',           mlsAmenity: 'Fireplace'        },
  { id: 'ac',               name: 'Central A/C',      icon: 'fas fa-snowflake',      mlsAmenity: 'Central Air'      },
];
