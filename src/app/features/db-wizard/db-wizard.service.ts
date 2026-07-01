import { computed, Injectable, signal } from '@angular/core';
import {
  WIZARD_STEPS, ENGINE_OPTIONS, POOL_STRATEGY_OPTIONS, CACHE_STRATEGY_OPTIONS,
} from './db-wizard.mock.js';
import type {
  DbConfig, EngineId, PoolStrategyId, CacheStrategyId, IndexType, DbConfigChip,
} from './db-wizard.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { createWizardNav } from '../../shared/wizard-nav.js';

@Injectable({ providedIn: 'root' })
export class DbWizardService {

  // ── State ──────────────────────────────────────────────────────────────────

  private readonly stepSig   = signal<number>(1);
  private readonly configSig = signal<DbConfig>({
    engine:               null,
    minConnections:       2,
    maxConnections:       10,
    idleTimeoutMs:        30_000,
    connectionTimeoutMs:  10_000,
    poolStrategy:         'round-robin',
    indexes:              ['btree'],
    cacheStrategy:        'lru',
    cacheSizeMb:          256,
    queryTimeoutMs:       30_000,
    slowQueryThresholdMs: 500,
  });

  public readonly currentStep = this.stepSig.asReadonly();
  public readonly config      = this.configSig.asReadonly();

  // ── Derived ────────────────────────────────────────────────────────────────

  private readonly selectedEngine = computed(() =>
    ENGINE_OPTIONS.find(e => e.id === this.configSig().engine) ?? null
  );

  public readonly engineColor = computed(() => this.selectedEngine()?.color ?? 'var(--f-text-3)');

  public readonly canAdvance = computed((): boolean => {
    const cfg = this.configSig();
    switch (this.stepSig()) {
      case 1: return cfg.engine !== null;
      case 2: return cfg.maxConnections > cfg.minConnections;
      case 3: return cfg.indexes.length > 0;
      default: return false;
    }
  });

  public readonly hasBuildStarted = computed(() => this.configSig().engine !== null);

  public readonly configChips = computed((): DbConfigChip[] => {
    const cfg  = this.configSig();
    const eng  = this.selectedEngine();
    const step = this.stepSig();
    const pool = POOL_STRATEGY_OPTIONS.find(p => p.id === cfg.poolStrategy);
    return [
      { label: 'Engine',   icon: 'fas fa-database',     value: eng?.name ?? null                                         },
      { label: 'Pool',     icon: 'fas fa-network-wired', value: step > 1 ? `${cfg.minConnections}–${cfg.maxConnections}` : null },
      { label: 'Strategy', icon: 'fas fa-shuffle',       value: step > 1 ? (pool?.name ?? null) : null                   },
      { label: 'Cache',    icon: 'fas fa-memory',        value: step > 2 ? `${cfg.cacheSizeMb} MB` : null                },
      { label: 'Indexes',  icon: 'fas fa-sitemap',       value: step > 2 ? cfg.indexes.map(i => i.toUpperCase()).join(', ') : null },
    ];
  });

  public readonly resultData = computed((): WizardResultData => {
    const cfg   = this.configSig();
    const eng   = this.selectedEngine();
    const pool  = POOL_STRATEGY_OPTIONS.find(p => p.id === cfg.poolStrategy);
    const cache = CACHE_STRATEGY_OPTIONS.find(c => c.id === cfg.cacheStrategy);
    return {
      title:       'Your Database is Configured!',
      description: 'The self-describing config below captures engine, pool, and performance settings. Export as JSON to bootstrap your database environment.',
      rows: [
        { label: 'Engine',           value: eng?.name      ?? '—'                                          },
        { label: 'Type',             value: eng?.type      ?? '—'                                          },
        { label: 'Port',             value: eng?.defaultPort ? String(eng.defaultPort) : 'embedded'        },
        { label: 'Pool Range',       value: `${cfg.minConnections}–${cfg.maxConnections} connections`      },
        { label: 'Pool Strategy',    value: pool?.name     ?? '—'                                          },
        { label: 'Idle Timeout',     value: `${cfg.idleTimeoutMs / 1000}s`                                 },
        { label: 'Cache Strategy',   value: cache?.name    ?? '—'                                          },
        { label: 'Cache Size',       value: `${cfg.cacheSizeMb} MB`                                        },
        { label: 'Indexes',          value: cfg.indexes.map(i => i.toUpperCase()).join(', ')               },
        { label: 'Query Timeout',    value: cfg.queryTimeoutMs ? `${cfg.queryTimeoutMs / 1000}s` : 'None' },
        { label: 'Slow Query Alert', value: `> ${cfg.slowQueryThresholdMs} ms`                             },
      ],
      jsonPayload: {
        $schema: 'https://dbwizard/config/v1',
        $meta: {
          engine:                             'Database engine — handles all storage I/O',
          'pool.min':                         'Minimum idle connections kept alive in the pool',
          'pool.max':                         'Maximum concurrent connections allowed',
          'pool.strategy':                    'Algorithm used to route requests to connections',
          'pool.idleTimeoutMs':               'Duration before idle connections are released',
          'pool.connectionTimeoutMs':         'Max wait time to acquire a connection from the pool',
          'performance.indexes':              'Index types built on the database',
          'performance.cache.strategy':       'Cache eviction/update algorithm',
          'performance.cache.sizeMb':         'Query result cache capacity in megabytes',
          'performance.queryTimeoutMs':       'Max query execution time (null = unlimited)',
          'performance.slowQueryThresholdMs': 'Queries exceeding this duration are flagged as slow',
        },
        engine: cfg.engine,
        port:   eng?.defaultPort ?? null,
        pool: {
          min:                 cfg.minConnections,
          max:                 cfg.maxConnections,
          strategy:            cfg.poolStrategy,
          idleTimeoutMs:       cfg.idleTimeoutMs,
          connectionTimeoutMs: cfg.connectionTimeoutMs,
        },
        performance: {
          indexes: [...cfg.indexes],
          cache: {
            strategy: cfg.cacheStrategy,
            sizeMb:   cfg.cacheSizeMb,
          },
          queryTimeoutMs:       cfg.queryTimeoutMs,
          slowQueryThresholdMs: cfg.slowQueryThresholdMs,
        },
      },
    };
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const cfg = this.configSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return cfg.engine !== null;
    if (n === 3) return cfg.engine !== null;
    return false;
  }

  private readonly nav = createWizardNav({
    stepSig:         this.stepSig,
    totalSteps:      WIZARD_STEPS.length,
    isStepReachable: n => this.isStepReachable(n),
    canAdvance:      () => this.canAdvance(),
  });

  public nextStep(): void   { this.nav.nextStep(); }
  public prevStep(): void   { this.nav.prevStep(); }
  public jumpToStep(n: number): void { this.nav.jumpToStep(n); }
  public finish(): void     { this.nav.finish(); }

  public reset(): void {
    this.configSig.set({
      engine:               null,
      minConnections:       2,
      maxConnections:       10,
      idleTimeoutMs:        30_000,
      connectionTimeoutMs:  10_000,
      poolStrategy:         'round-robin',
      indexes:              ['btree'],
      cacheStrategy:        'lru',
      cacheSizeMb:          256,
      queryTimeoutMs:       30_000,
      slowQueryThresholdMs: 500,
    });
    this.stepSig.set(1);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  public selectEngine(id: EngineId):          void { this.configSig.update(c => ({ ...c, engine: id }));              }
  public setMinConnections(n: number):        void { this.configSig.update(c => ({ ...c, minConnections: n }));        }
  public setMaxConnections(n: number):        void { this.configSig.update(c => ({ ...c, maxConnections: n }));        }
  public setIdleTimeout(ms: number):          void { this.configSig.update(c => ({ ...c, idleTimeoutMs: ms }));        }
  public setConnectionTimeout(ms: number):    void { this.configSig.update(c => ({ ...c, connectionTimeoutMs: ms }));  }
  public setPoolStrategy(id: PoolStrategyId): void { this.configSig.update(c => ({ ...c, poolStrategy: id }));         }
  public setCacheStrategy(id: CacheStrategyId): void { this.configSig.update(c => ({ ...c, cacheStrategy: id }));      }
  public setCacheSize(mb: number):            void { this.configSig.update(c => ({ ...c, cacheSizeMb: mb }));          }
  public setQueryTimeout(ms: number | null):  void { this.configSig.update(c => ({ ...c, queryTimeoutMs: ms }));       }
  public setSlowQueryThreshold(ms: number):   void { this.configSig.update(c => ({ ...c, slowQueryThresholdMs: ms })); }

  public toggleIndex(id: IndexType): void {
    this.configSig.update(c => {
      const has     = c.indexes.includes(id);
      const indexes = has ? c.indexes.filter(i => i !== id) : [...c.indexes, id];
      return { ...c, indexes };
    });
  }
}

export const DB_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: DbWizardService,
};
