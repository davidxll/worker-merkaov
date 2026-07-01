export type { WizardStep } from '../../models/models.js';

export type EngineId       = 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'redis';
export type DbType         = 'relational' | 'document' | 'key-value' | 'in-memory';
export type PoolStrategyId = 'round-robin' | 'least-connections' | 'random';
export type CacheStrategyId = 'lru' | 'lfu' | 'write-through' | 'write-back';
export type IndexType      = 'btree' | 'hash' | 'gist' | 'gin';

export interface EngineOption {
  readonly id:          EngineId;
  readonly name:        string;
  readonly icon:        string;
  readonly tagline:     string;
  readonly type:        DbType;
  readonly defaultPort: number;
  readonly color:       string;
}

export interface PoolStrategyOption {
  readonly id:          PoolStrategyId;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
}

export interface CacheStrategyOption {
  readonly id:          CacheStrategyId;
  readonly name:        string;
  readonly description: string;
}

export interface IndexOption {
  readonly id:          IndexType;
  readonly name:        string;
  readonly description: string;
  readonly icon:        string;
}

export interface DbConfig {
  readonly engine:               EngineId | null;
  readonly minConnections:       number;
  readonly maxConnections:       number;
  readonly idleTimeoutMs:        number;
  readonly connectionTimeoutMs:  number;
  readonly poolStrategy:         PoolStrategyId;
  readonly indexes:              readonly IndexType[];
  readonly cacheStrategy:        CacheStrategyId;
  readonly cacheSizeMb:          number;
  readonly queryTimeoutMs:       number | null;
  readonly slowQueryThresholdMs: number;
}

export interface DbConfigChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}
