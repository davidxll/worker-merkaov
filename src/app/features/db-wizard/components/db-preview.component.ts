import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { DbConfig } from '../db-wizard.types.js';
import { ENGINE_OPTIONS } from '../db-wizard.mock.js';

@Component({
  selector: 'app-db-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (compact()) {

      <div class="compact-card">
        <div class="compact-icon" [style.color]="engineColor()">
          <i [class]="engineIcon() + ' text-xl'"></i>
        </div>
        <div class="compact-info">
          <span class="compact-name">{{ engineName() }}</span>
          <span class="compact-type">{{ engineType() }}</span>
        </div>
        @if (config().engine) {
          <div class="compact-dots">
            @for (active of poolDots(); track $index) {
              <span class="pool-dot" [class.pool-dot--active]="active"></span>
            }
          </div>
        }
      </div>

    } @else {

      <div class="db-card">

        <!-- Server rack header -->
        <div class="rack-header" [style.border-left-color]="engineColor()">
          <div class="rack-led" [style.background]="engineColor()"></div>
          <i [class]="engineIcon() + ' rack-engine-icon'" [style.color]="engineColor()"></i>
          <div class="rack-title-block">
            <span class="rack-name">{{ engineName() }}</span>
            <span class="rack-type">{{ engineType() }}</span>
          </div>
          <span class="rack-port">{{ portLabel() }}</span>
        </div>

        <!-- Connection pool -->
        <div class="rack-section">
          <span class="rack-label">Connection Pool</span>
          <div class="pool-dots-row">
            @for (dot of allDots(); track $index) {
              <span class="pool-dot-full"
                    [class.pool-dot-full--min]="$index < config().minConnections"
                    [class.pool-dot-full--avail]="$index >= config().minConnections && $index < config().maxConnections">
              </span>
            }
          </div>
          <div class="pool-range-labels">
            <span>min {{ config().minConnections }}</span>
            <span>max {{ config().maxConnections }}</span>
          </div>
        </div>

        <!-- Cache bar -->
        <div class="rack-section">
          <span class="rack-label">Cache — {{ config().cacheStrategy.toUpperCase() }}</span>
          <div class="cache-track">
            <div class="cache-fill" [style.width]="cacheFillPct()"></div>
          </div>
          <span class="cache-size-txt">{{ config().cacheSizeMb }} MB</span>
        </div>

        <!-- Active indexes -->
        <div class="rack-section">
          <span class="rack-label">Active Indexes</span>
          <div class="index-badges">
            @for (idx of config().indexes; track idx) {
              <span class="index-badge">{{ idx.toUpperCase() }}</span>
            }
          </div>
        </div>

      </div>

    }
  `,
  styles: [`
    :host { display: block; }

    /* ── Compact HUD mode ── */
    .compact-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      border-radius: 6px;
      height: 52px;
      box-sizing: border-box;
    }
    .compact-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--f-layer-2);
      border-radius: 4px;
      font-size: 14px;
      flex-shrink: 0;
    }
    .compact-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      flex: 1;
      min-width: 0;
    }
    .compact-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--f-text-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .compact-type {
      font-size: 10px;
      color: var(--f-text-3);
      white-space: nowrap;
    }
    .compact-dots {
      display: flex;
      gap: 3px;
      align-items: center;
      flex-shrink: 0;
    }
    .pool-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--f-stroke-sd);
      &.pool-dot--active { background: var(--f-accent-light); }
    }

    /* ── Full card mode ── */
    .db-card {
      margin: 20px 32px;
      border: 1px solid var(--f-stroke-sd);
      border-radius: 8px;
      background: var(--f-layer-1);
      overflow: hidden;
      @media (max-width: 600px) { margin: 16px; }
    }

    .rack-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: var(--f-layer-0);
      border-bottom: 1px solid var(--f-stroke);
      border-left: 3px solid transparent;
    }
    .rack-led {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .rack-engine-icon { font-size: 18px; flex-shrink: 0; }
    .rack-title-block { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .rack-name  { font-size: 14px; font-weight: 700; color: var(--f-text-1); }
    .rack-type  { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--f-text-3); }
    .rack-port  {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--f-text-3);
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      padding: 3px 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .rack-section {
      padding: 12px 20px;
      border-bottom: 1px solid var(--f-stroke);
      &:last-child { border-bottom: none; }
    }
    .rack-label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--f-text-3);
      margin-bottom: 8px;
    }

    .pool-dots-row { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
    .pool-dot-full {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--f-stroke-sd);
      transition: background 200ms;
      &.pool-dot-full--min   { background: var(--f-accent); }
      &.pool-dot-full--avail { background: rgba(62,143,200,0.30); }
    }
    .pool-range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--f-text-3);
    }

    .cache-track {
      height: 8px;
      background: var(--f-layer-2);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }
    .cache-fill {
      height: 100%;
      background: var(--f-accent);
      border-radius: 4px;
      transition: width 300ms var(--f-ease);
    }
    .cache-size-txt { font-size: 11px; color: var(--f-text-3); }

    .index-badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .index-badge {
      display: inline-flex;
      align-items: center;
      height: 22px;
      padding: 0 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      background: rgba(62,143,200,0.15);
      color: var(--f-accent-light);
      border: 1px solid rgba(62,143,200,0.25);
    }
  `],
})
export class DbPreviewComponent {
  public readonly config  = input.required<DbConfig>();
  public readonly compact = input<boolean>(false);

  protected readonly engineOption = computed(() =>
    ENGINE_OPTIONS.find(e => e.id === this.config().engine) ?? null
  );
  protected readonly engineName  = computed(() => this.engineOption()?.name  ?? 'No engine selected');
  protected readonly engineType  = computed(() => this.engineOption()?.type  ?? '—');
  protected readonly engineIcon  = computed(() => this.engineOption()?.icon  ?? 'fas fa-database');
  protected readonly engineColor = computed(() => this.engineOption()?.color ?? 'var(--f-text-3)');

  protected readonly portLabel = computed((): string => {
    const eng = this.engineOption();
    if (!eng) return '—';
    return eng.defaultPort ? `:${eng.defaultPort}` : 'embedded';
  });

  protected readonly poolDots = computed((): boolean[] =>
    Array.from({ length: Math.min(this.config().maxConnections, 8) }, (_, i) => i < this.config().minConnections)
  );

  protected readonly allDots = computed((): null[] =>
    Array.from({ length: Math.min(this.config().maxConnections, 24) })
  );

  protected readonly cacheFillPct = computed((): string =>
    `${Math.min((this.config().cacheSizeMb / 1024) * 100, 100)}%`
  );
}
