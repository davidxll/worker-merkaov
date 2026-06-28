import type {
  ContainmentOption, ExcitationOption, DetectorOption,
  OutputFormatOption, WizardStep,
} from './experiment-designer.types.js';

// ── Wizard steps ─────────────────────────────────────────────────────────────

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Containment', icon: 'fas fa-flask',      sublabel: 'Chamber setup'    },
  { label: 'Excitation',  icon: 'fas fa-bolt-lightning', sublabel: 'Energy source' },
  { label: 'Detection',   icon: 'fas fa-satellite-dish', sublabel: 'Measurement'   },
];

// ── Containment options ───────────────────────────────────────────────────────

export const CONTAINMENT_OPTIONS: readonly ContainmentOption[] = [
  {
    id: 'linear-trap',
    name: 'Linear Paul Trap',
    tagline: 'High-precision ion confinement',
    description:
      'RF quadrupole geometry confines krypton ions along a linear axis. ' +
      'Ideal for mass-selective storage and collinear laser spectroscopy.',
    icon: 'fas fa-magnet',
    stats: { pressureExp: -9, tempK: 300, capacityLog: 5 },
  },
  {
    id: 'quadrupole-trap',
    name: 'Quadrupole Ion Trap',
    tagline: 'Three-dimensional single-ion control',
    description:
      'Symmetric 3D RF trap enabling single-ion trapping and quantum state ' +
      'manipulation. Gold standard for hyperfine structure measurements.',
    icon: 'fas fa-atom',
    stats: { pressureExp: -10, tempK: 4, capacityLog: 3 },
  },
  {
    id: 'cryogenic-cell',
    name: 'Cryogenic Buffer-Gas Cell',
    tagline: 'Cooling via helium buffer gas',
    description:
      'Krypton atoms are cooled by collisions with cryogenic helium buffer gas. ' +
      'Produces slow, cold beams for downstream trapping or spectroscopy.',
    icon: 'fas fa-snowflake',
    stats: { pressureExp: -4, tempK: 4, capacityLog: 10 },
  },
  {
    id: 'flow-cell',
    name: 'Supersonic Flow Cell',
    tagline: 'Jet-cooled expansion',
    description:
      'High-pressure krypton expands supersonically through a nozzle, ' +
      'reaching rotational temperatures near 10 K with very high throughput.',
    icon: 'fas fa-wind',
    stats: { pressureExp: -3, tempK: 10, capacityLog: 12 },
  },
];

// ── Excitation options ────────────────────────────────────────────────────────

export const EXCITATION_OPTIONS: readonly ExcitationOption[] = [
  {
    id: 'diode-laser',
    name: 'Tunable Diode Laser',
    tagline: '769 nm Kr resonance line',
    icon: 'fas fa-laser-pointer',
    accentColor: '#38bdf8',
    type: 'optical',
    stats: { wavelengthNm: 769, powerMw: 50, linewidthMHz: 1 },
  },
  {
    id: 'ti-sapphire',
    name: 'Ti:Sapphire Laser',
    tagline: 'Broadband tunable, ultra-narrow linewidth',
    icon: 'fas fa-gem',
    accentColor: '#c084fc',
    type: 'optical',
    stats: { wavelengthNm: 800, powerMw: 2000, linewidthMHz: 0.1 },
  },
  {
    id: 'rf-discharge',
    name: 'RF Discharge Source',
    tagline: '13.56 MHz plasma excitation',
    icon: 'fas fa-broadcast-tower',
    accentColor: '#fb923c',
    type: 'rf',
    stats: { wavelengthNm: null, powerMw: 100000, linewidthMHz: 50000 },
  },
  {
    id: 'electron-beam',
    name: 'Electron Impact Source',
    tagline: 'Broadband ionisation and excitation',
    icon: 'fas fa-circle-radiation',
    accentColor: '#4ade80',
    type: 'electron',
    stats: { wavelengthNm: null, powerMw: 500, linewidthMHz: 1000000 },
  },
];

// ── Detector options ──────────────────────────────────────────────────────────

export const DETECTOR_OPTIONS: readonly DetectorOption[] = [
  {
    id: 'ccd-array',
    name: 'CCD Spectrometer',
    tagline: 'Full-spectrum simultaneous acquisition',
    description:
      'Back-illuminated CCD captures an entire spectral range in one shot. ' +
      'Optimal for survey spectroscopy and emission mapping.',
    icon: 'fas fa-grip',
    stats: { qePct: 92, spectralRange: '200 – 1100 nm', dynamicRangeDb: 72 },
  },
  {
    id: 'apd',
    name: 'Avalanche Photodiode',
    tagline: 'Single-photon counting sensitivity',
    description:
      'Silicon APD in Geiger mode for photon-by-photon detection. ' +
      'Ideal for laser-induced fluorescence and time-resolved measurements.',
    icon: 'fas fa-eye',
    stats: { qePct: 70, spectralRange: '400 – 1000 nm', dynamicRangeDb: 80 },
  },
  {
    id: 'channeltron',
    name: 'Channeltron Multiplier',
    tagline: 'Single-particle ion / electron detection',
    description:
      'Continuous dynode channel electron multiplier. Detects individual ' +
      'ions or electrons with nanosecond timing resolution.',
    icon: 'fas fa-microchip',
    stats: { qePct: 85, spectralRange: '10 eV – 2 keV', dynamicRangeDb: 90 },
  },
  {
    id: 'faraday-cup',
    name: 'Faraday Cup',
    tagline: 'Direct ion-current measurement',
    description:
      'Grounded metal cup collects ion current directly. Simple, robust, ' +
      'and quantitative — the reference standard for absolute ion flux.',
    icon: 'fas fa-circle-dot',
    stats: { qePct: 100, spectralRange: 'DC – 1 MHz', dynamicRangeDb: 100 },
  },
];

// ── Output format options ─────────────────────────────────────────────────────

export const OUTPUT_FORMAT_OPTIONS: readonly OutputFormatOption[] = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Plain tabular text — universally compatible, human-readable.',
    icon: 'fas fa-table',
    extension: '.csv',
  },
  {
    id: 'hdf5',
    name: 'HDF5',
    description: 'Hierarchical binary format for large multi-dimensional datasets.',
    icon: 'fas fa-database',
    extension: '.h5',
  },
  {
    id: 'live-stream',
    name: 'Live Stream',
    description: 'WebSocket real-time feed for in-situ monitoring dashboards.',
    icon: 'fas fa-signal',
    extension: 'ws://',
  },
  {
    id: 'fits',
    name: 'FITS',
    description: 'Flexible Image Transport System — the astronomical data standard.',
    icon: 'fas fa-star',
    extension: '.fits',
  },
];
