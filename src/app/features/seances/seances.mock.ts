import type { WizardStep } from '../../models/models.js';
import type { OfferingOption, DeityOption, VesselOption } from './seances.types.js';

export const WIZARD_STEPS: WizardStep[] = [
  { label: 'Ritual',     icon: 'fas fa-fire-flame-curved', sublabel: 'Offerings'    },
  { label: 'Invocation', icon: 'fas fa-star-of-life',      sublabel: 'Choose deity' },
  { label: 'Crossing',   icon: 'fas fa-ship',              sublabel: 'Your vessel'  },
];

export const OFFERING_OPTIONS: OfferingOption[] = [
  {
    id: 'mead',
    name: 'Mead & Honeycomb',
    icon: 'fas fa-wine-glass',
    description: 'The drink of heroes — poured at the threshold to honor the fallen',
    power: 'Favor',
  },
  {
    id: 'runes',
    name: 'Elder Runes',
    icon: 'fas fa-star-of-life',
    description: 'Ancient wisdom carved in bone — the language of creation and cosmos',
    power: 'Wisdom',
  },
  {
    id: 'crow-feather',
    name: 'Crow Feather',
    icon: 'fas fa-feather',
    description: "Plucked from Odin's own ravens — Hugin and Munin watch your passage",
    power: 'Sight',
  },
  {
    id: 'wolf-pelt',
    name: 'Wolf Pelt',
    icon: 'fas fa-paw',
    description: "A tribute to Fenrir's kin — worn by berserkers who died in glory",
    power: 'Fury',
  },
  {
    id: 'ash-branch',
    name: 'Ash Branch',
    icon: 'fas fa-leaf',
    description: 'Cut from Yggdrasil, the world-tree — root of all nine realms',
    power: 'Life',
  },
];

export const DEITY_OPTIONS: DeityOption[] = [
  {
    id: 'odin',
    name: 'Odin',
    title: 'The All-Father',
    icon: 'fas fa-eye',
    description: 'Father of the gods, seeker of wisdom, master of war and poetry. He sacrificed an eye for knowledge and hung nine days on Yggdrasil for the runes.',
    realm: 'Asgard',
    color: '#7eb8e3',
    initial: 'ᚢ',
    aspect: 'Wisdom & War',
  },
  {
    id: 'thor',
    name: 'Thor',
    title: 'The Thunderer',
    icon: 'fas fa-bolt',
    description: 'Wielder of Mjolnir, protector of mankind, champion against the giants. His hammer returns always to his hand — as warriors return to glory.',
    realm: 'Asgard',
    color: '#ef4444',
    initial: 'ᚦ',
    aspect: 'Thunder & Strength',
  },
  {
    id: 'freya',
    name: 'Freya',
    title: 'The Völva',
    icon: 'fas fa-heart',
    description: 'Goddess of love, war, and the seiðr magic. She chooses half the slain — those who reach her meadow hall Fólkvangr know a different eternal joy.',
    realm: 'Fólkvangr',
    color: '#f59e0b',
    initial: 'ᚠ',
    aspect: 'Love & Seiðr',
  },
  {
    id: 'loki',
    name: 'Loki',
    title: 'The Shapeshifter',
    icon: 'fas fa-fire',
    description: 'Trickster, chaos-bringer, and blood-brother to Odin. His path to Valhalla is the least certain — but the most interesting.',
    realm: 'Unknown',
    color: '#4ade80',
    initial: 'ᛚ',
    aspect: 'Chaos & Change',
  },
  {
    id: 'hel',
    name: 'Hel',
    title: 'The Death-Keeper',
    icon: 'fas fa-skull',
    description: 'Ruler of Niflheim, the realm of the dead. Half her face is living flesh, half decayed bone. She receives those who die of old age — or choose rebirth.',
    realm: 'Niflheim',
    color: '#a78bfa',
    initial: 'ᚺ',
    aspect: 'Death & Rebirth',
  },
];

export const VESSEL_OPTIONS: VesselOption[] = [
  {
    id: 'longship',
    name: 'Dragon Longship',
    icon: 'fas fa-ship',
    description: 'A great serpent-prowed vessel, oarsmen of the eternal dead rowing in silence through worlds between worlds.',
    route: 'The Dragon Road',
  },
  {
    id: 'bifrost',
    name: 'The Bifrost',
    icon: 'fas fa-wand-magic-sparkles',
    description: 'The rainbow bridge spanning nine realms — built of fire, water, and air. Heimdall himself guards your crossing.',
    route: 'Rainbow Bridge',
  },
  {
    id: 'raven',
    name: "Raven Flight",
    icon: 'fas fa-feather-pointed',
    description: 'Carried on the wings of Hugin and Munin — thought and memory — across the void at the speed of a dying breath.',
    route: "Hugin's Wing",
  },
  {
    id: 'sleipnir',
    name: 'Sleipnir',
    icon: 'fas fa-horse',
    description: "Odin's eight-legged steed — the greatest of all horses, born of Loki, swift enough to traverse the boundary between life and death.",
    route: 'Eight-Legged Path',
  },
];
