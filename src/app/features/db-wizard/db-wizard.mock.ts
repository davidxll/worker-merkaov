import type { WizardStep } from '../../models/models.js';
import type {
  EngineOption, PoolStrategyOption, CacheStrategyOption, IndexOption,
} from './db-wizard.types.js';

export const WIZARD_STEPS: WizardStep[] = [
  { label: 'Engine',      icon: 'fas fa-database',      sublabel: 'Choose DB'       },
  { label: 'Pool',        icon: 'fas fa-network-wired',  sublabel: 'Connections'     },
  { label: 'Performance', icon: 'fas fa-bolt',           sublabel: 'Indexes & cache' },
];

export const ENGINE_OPTIONS: EngineOption[] = [
  {
    id: 'postgresql', name: 'PostgreSQL', icon: 'fas fa-database',
    tagline: 'Advanced open-source relational database',
    type: 'relational', defaultPort: 5432, color: '#7eb8e3',
  },
  {
    id: 'mysql', name: 'MySQL', icon: 'fas fa-server',
    tagline: "World's most popular open-source DB",
    type: 'relational', defaultPort: 3306, color: '#f59e0b',
  },
  {
    id: 'sqlite', name: 'SQLite', icon: 'fas fa-file-code',
    tagline: 'Serverless, embedded file-based database',
    type: 'relational', defaultPort: 0, color: '#6bbfa0',
  },
  {
    id: 'mongodb', name: 'MongoDB', icon: 'fas fa-leaf',
    tagline: 'Flexible document-oriented NoSQL database',
    type: 'document', defaultPort: 27017, color: '#4ade80',
  },
  {
    id: 'redis', name: 'Redis', icon: 'fas fa-fire-flame-curved',
    tagline: 'Ultra-fast in-memory data structure store',
    type: 'in-memory', defaultPort: 6379, color: '#f87171',
  },
];

export const POOL_STRATEGY_OPTIONS: PoolStrategyOption[] = [
  {
    id: 'round-robin',
    name: 'Round Robin',
    description: 'Distributes queries evenly across connections in sequence',
    icon: 'fas fa-circle-notch',
  },
  {
    id: 'least-connections',
    name: 'Least Connections',
    description: 'Routes each request to the connection with fewest active queries',
    icon: 'fas fa-arrow-down-wide-short',
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Picks a random idle connection for each incoming request',
    icon: 'fas fa-shuffle',
  },
];

export const CACHE_STRATEGY_OPTIONS: CacheStrategyOption[] = [
  { id: 'lru',           name: 'LRU',           description: 'Least Recently Used — evicts oldest accessed entry'    },
  { id: 'lfu',           name: 'LFU',           description: 'Least Frequently Used — evicts lowest-access entry'    },
  { id: 'write-through', name: 'Write-Through', description: 'Writes to cache and DB simultaneously'                 },
  { id: 'write-back',    name: 'Write-Back',    description: 'Writes to cache first; syncs to DB asynchronously'     },
];

export const INDEX_OPTIONS: IndexOption[] = [
  { id: 'btree', name: 'B-Tree', icon: 'fas fa-sitemap',               description: 'Default; efficient for range and equality queries'          },
  { id: 'hash',  name: 'Hash',   icon: 'fas fa-hashtag',               description: 'O(1) exact-match lookups; not suitable for range scans'     },
  { id: 'gist',  name: 'GiST',   icon: 'fas fa-star-of-life',          description: 'Generalized tree for geometric, text, and custom types'     },
  { id: 'gin',   name: 'GIN',    icon: 'fas fa-magnifying-glass-plus', description: 'Inverted index for full-text search and JSON/array fields'  },
];

export const IDLE_TIMEOUT_OPTIONS: { value: number; label: string }[] = [
  { value:  10_000, label: '10 seconds' },
  { value:  30_000, label: '30 seconds' },
  { value:  60_000, label: '1 minute'   },
  { value: 300_000, label: '5 minutes'  },
];

export const CONN_TIMEOUT_OPTIONS: { value: number; label: string }[] = [
  { value:  5_000, label: '5 seconds'  },
  { value: 10_000, label: '10 seconds' },
  { value: 30_000, label: '30 seconds' },
];

export const CACHE_SIZE_OPTIONS: { value: number; label: string }[] = [
  { value:   64, label: '64 MB'  },
  { value:  128, label: '128 MB' },
  { value:  256, label: '256 MB' },
  { value:  512, label: '512 MB' },
  { value: 1024, label: '1 GB'   },
];

export const QUERY_TIMEOUT_OPTIONS: { value: number | null; label: string }[] = [
  { value:  5_000, label: '5 seconds'  },
  { value: 10_000, label: '10 seconds' },
  { value: 30_000, label: '30 seconds' },
  { value: 60_000, label: '1 minute'   },
  { value: null,   label: 'No limit'   },
];

export const SLOW_QUERY_OPTIONS: { value: number; label: string }[] = [
  { value:  100, label: '100 ms'    },
  { value:  500, label: '500 ms'    },
  { value: 1000, label: '1 second'  },
  { value: 5000, label: '5 seconds' },
];
