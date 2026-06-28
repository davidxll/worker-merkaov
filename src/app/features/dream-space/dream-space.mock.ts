import type {
  WizardStep, RealmOption, FormOption, ImpossibleOption, AtmosphereOption,
} from './dream-space.types.js';

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Realm',      icon: 'fas fa-globe',                sublabel: 'Where it is'    },
  { label: 'Form',       icon: 'fas fa-shapes',               sublabel: 'How it looks'   },
  { label: 'Impossible', icon: 'fas fa-wand-magic-sparkles',  sublabel: 'The one thing'  },
  { label: 'Atmosphere', icon: 'fas fa-wind',                 sublabel: 'How it feels'   },
];

export const REALM_OPTIONS: readonly RealmOption[] = [
  {
    id: 'floating', name: 'Above the Clouds', tagline: 'Suspended in open sky',
    description: 'Your home drifts gently above the cloud layer. Mornings arrive as seas of white fog below; evenings dissolve into unobstructed stars.',
    icon: 'fas fa-cloud', accentColor: '#7dd3fc', district: 'The Upper Reaches',
    naturalFeatures: ['Cloud Terrace', 'Unobstructed Horizon', 'Altitude Garden'],
  },
  {
    id: 'forest', name: 'Ancient Forest', tagline: 'Grown into the canopy',
    description: 'The home is inseparable from the forest itself — roots become floors, branches become rafters. The oldest trees predate recorded history by millennia.',
    icon: 'fas fa-tree', accentColor: '#86efac', district: 'The Ancient Grove',
    naturalFeatures: ['Root Cellar', 'Canopy Walkway', 'Moss Library'],
  },
  {
    id: 'underground', name: 'Beneath the Earth', tagline: 'Carved from living stone',
    description: 'Chambers of bioluminescent mineral and warm stone, lit by veins of light that pulse slowly like a heartbeat. Perfectly temperate, absolutely silent.',
    icon: 'fas fa-gem', accentColor: '#f9a8d4', district: 'The Deepstone Quarter',
    naturalFeatures: ['Crystal Atrium', 'Thermal Spring', 'Stone Gallery'],
  },
  {
    id: 'coastal', name: 'Edge of the Sea', tagline: 'Where the ocean begins',
    description: 'Perched at the exact point where land surrenders to water. The tide is always perfect — never flooding, never retreating beyond reach.',
    icon: 'fas fa-water', accentColor: '#67e8f9', district: 'The Endless Shore',
    naturalFeatures: ['Tidal Pool', 'Sea Glass Garden', 'Fog Bell Tower'],
  },
  {
    id: 'cosmic', name: 'In Orbit', tagline: 'Circling something vast',
    description: 'A home with a slow rotation that keeps one face always toward the sun and one always toward the dark. Every window frames a different planet.',
    icon: 'fas fa-meteor', accentColor: '#c4b5fd', district: 'The Orbital Belt',
    naturalFeatures: ['Observation Dome', 'Zero-G Lounge', 'Solar Promenade'],
  },
];

export const FORM_OPTIONS: readonly FormOption[] = [
  {
    id: 'tower', name: 'The Tall Tower', tagline: 'Singular and vertical',
    description: 'One room per floor, each with a different purpose and a different view. The stairs spiral — no two steps quite the same height.',
    icon: 'fas fa-chess-rook', streetNumber: '1', streetName: 'Spire Way',
    baseAmenities: ['360° Panorama', 'Spiral Staircase', 'Lantern Room'],
  },
  {
    id: 'warren', name: 'The Winding Warren', tagline: 'A maze of quiet discovery',
    description: 'Rooms reveal themselves as you wander. There is no floor plan — the layout seems to shift slightly every time you retrace your steps.',
    icon: 'fas fa-route', streetNumber: '7', streetName: 'Labyrinth Close',
    baseAmenities: ['Secret Passages', 'Nook Collection', 'Hidden Courtyards'],
  },
  {
    id: 'pavilion', name: 'The Open Pavilion', tagline: 'Inside and outside are one',
    description: 'No exterior walls — only columns, fabric, and shadow. The space breathes with the weather. When it rains, the sound is architectural.',
    icon: 'fas fa-umbrella', streetNumber: '∞', streetName: 'Open Court',
    baseAmenities: ['Covered Colonnades', 'Rain Gardens', 'Seamless Threshold'],
  },
  {
    id: 'vessel', name: 'The Vessel', tagline: 'A home that can move',
    description: 'Designed for slow drift. Has a helm, a hold, and a crow\'s nest — but the journey is measured in seasons, not miles.',
    icon: 'fas fa-sailboat', streetNumber: 'Hull 3', streetName: 'Drift Harbour',
    baseAmenities: ['Navigation Room', 'Supply Hold', 'Deck Garden'],
  },
  {
    id: 'burrow', name: 'The Hidden Burrow', tagline: 'Tucked away and intimate',
    description: 'Small on the outside, vast within. The entrance is deliberately hard to find. Once inside, every surface is warm and curved — nothing has a sharp edge.',
    icon: 'fas fa-circle-dot', streetNumber: 'Pocket 12', streetName: 'Hollow Lane',
    baseAmenities: ['Curved Ceilings', 'Hidden Entry', 'Deep Hearth'],
  },
];

export const IMPOSSIBLE_OPTIONS: readonly ImpossibleOption[] = [
  {
    id: 'infinite-room', name: 'A Room That Expands', tagline: 'Grows to fit the moment',
    description: 'One room has no fixed size. It contracts to a cozy den when you are alone, and opens silently to accommodate any gathering — no one notices the change.',
    icon: 'fas fa-expand', accentColor: '#fbbf24',
  },
  {
    id: 'time-garden', name: 'A Frozen Garden', tagline: 'The season you love, always',
    description: 'Step through the garden door into the exact day of the year you have always loved. The blossom, the light, the temperature — unchanged, no matter when you visit.',
    icon: 'fas fa-sun', accentColor: '#4ade80',
  },
  {
    id: 'portal-door', name: 'A Door to Anywhere', tagline: 'Walk through and choose',
    description: 'One door opens wherever you decide before touching the handle. This morning, a market in Marrakesh. Tomorrow, a high ridge in late autumn.',
    icon: 'fas fa-door-open', accentColor: '#a78bfa',
  },
  {
    id: 'echo-library', name: 'The Echo Library', tagline: 'Books written from your thoughts',
    description: 'Each time you sit at the reading chair, a new book waits — written in your favourite style, about something you have been quietly thinking about.',
    icon: 'fas fa-book-open', accentColor: '#fb923c',
  },
  {
    id: 'living-walls', name: 'Living Architecture', tagline: 'The house feels you',
    description: 'The walls, floors, and ceiling are alive in a quiet sense — they warm when you are cold, soften when you need rest, and open windows before you realize you want air.',
    icon: 'fas fa-seedling', accentColor: '#34d399',
  },
];

export const ATMOSPHERE_OPTIONS: readonly AtmosphereOption[] = [
  {
    id: 'cozy', name: 'Warm & Safe', tagline: 'Intimate even when vast',
    description: 'Layered textiles, low ceilings in the reading corners, the permanent suggestion of something slow-cooking. You never feel exposed here.',
    icon: 'fas fa-mug-hot', accentColor: '#f97316', adjective: 'Intimate',
  },
  {
    id: 'awe', name: 'Breathtaking', tagline: 'Perspective shifts when you enter',
    description: 'High ceilings, long sight-lines, materials that catch light in a way that makes you pause. You feel pleasantly small here.',
    icon: 'fas fa-star', accentColor: '#e879f9', adjective: 'Majestic',
  },
  {
    id: 'wild', name: 'Untamed', tagline: 'Nature alive around you',
    description: 'Something is always growing, moving, or arriving. Birds nest in the rafters by arrangement. Rain comes through in the right rooms.',
    icon: 'fas fa-leaf', accentColor: '#4ade80', adjective: 'Wild',
  },
  {
    id: 'serene', name: 'Still & Clear', tagline: 'Nothing is out of place',
    description: 'Every surface serves a purpose. Sound is absorbed before it accumulates. The light is always soft and directional. You breathe differently here.',
    icon: 'fas fa-droplet', accentColor: '#67e8f9', adjective: 'Serene',
  },
  {
    id: 'mysterious', name: 'Always One More Room', tagline: 'Something is always waiting',
    description: 'There is a door you have not opened yet. A room you glimpsed but could not find again. The house rewards curiosity and withholds itself from impatience.',
    icon: 'fas fa-eye', accentColor: '#818cf8', adjective: 'Enigmatic',
  },
];
