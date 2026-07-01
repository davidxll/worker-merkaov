import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DbWizardService, DB_WIZARD_PROVIDER } from './db-wizard.service.js';
import { DbPreviewComponent } from './components/db-preview.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  WIZARD_STEPS, ENGINE_OPTIONS, POOL_STRATEGY_OPTIONS,
  CACHE_STRATEGY_OPTIONS, INDEX_OPTIONS,
  IDLE_TIMEOUT_OPTIONS, CONN_TIMEOUT_OPTIONS,
  CACHE_SIZE_OPTIONS, QUERY_TIMEOUT_OPTIONS, SLOW_QUERY_OPTIONS,
} from './db-wizard.mock.js';

@Component({
  selector: 'app-db-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DbPreviewComponent, WizardResultComponent],
  providers: [DB_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     DB WIZARD PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="dw-page">
  @let cfg = db.config();

  <!-- ── Sticky HUD ── -->
  <div class="hud">
    <div class="hud-inner">

      <div class="hud-preview">
        <app-db-preview [config]="cfg" [compact]="true" />
      </div>

      <div class="hud-meta">
        <div class="hud-chips">
          @for (chip of db.configChips(); track chip.label) {
            <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
              <i [class]="chip.icon + ' mr-1 text-xs'"></i>
              {{ chip.value ?? chip.label }}
            </span>
          }
        </div>
      </div>

      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="db.currentStep() === i + 1"
                  [class.step-tab--done]="db.currentStep() > i + 1"
                  [disabled]="!db.isStepReachable(i + 1)"
                  (click)="db.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>

    </div>
  </div>

  <!-- ── Main content ── -->
  <div class="dw-content">

    <!-- ══ STEP 1 — ENGINE ════════════════════════════════════ -->
    @if (db.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Choose a Database Engine</h2>
          <p class="step-desc">The engine defines the data model, storage format, and query language available to your application. All server optimization parameters will be stored inside the resulting config document.</p>
        </div>

        <div class="engine-grid">
          @for (eng of engines; track eng.id) {
            <div class="engine-card"
                 [class.engine-card--selected]="cfg.engine === eng.id"
                 (click)="db.selectEngine(eng.id)">
              <div class="engine-card-header">
                <div class="engine-icon-wrap" [style.color]="eng.color" [style.background]="eng.color + '22'">
                  <i [class]="eng.icon + ' text-xl'"></i>
                </div>
                <div class="engine-info">
                  <span class="engine-name">{{ eng.name }}</span>
                  <span class="engine-tagline">{{ eng.tagline }}</span>
                </div>
                @if (cfg.engine === eng.id) {
                  <i class="fas fa-circle-check engine-check" [style.color]="eng.color"></i>
                }
              </div>
              <div class="engine-meta">
                <span class="engine-type-badge">{{ eng.type }}</span>
                @if (eng.defaultPort) {
                  <span class="engine-port">:{{ eng.defaultPort }}</span>
                } @else {
                  <span class="engine-port">embedded</span>
                }
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 2 — POOL ══════════════════════════════════════ -->
    @if (db.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Configure Connection Pool</h2>
          <p class="step-desc">Connection pooling reuses database connections to reduce overhead. These settings are embedded directly in the self-describing config document.</p>
        </div>

        <div class="config-grid">

          <!-- Pool size -->
          <div class="config-block">
            <h3 class="config-block-title">Pool Size</h3>
            <div class="slider-field">
              <div class="slider-row">
                <label class="field-label">Min Connections</label>
                <span class="slider-val">{{ cfg.minConnections }}</span>
              </div>
              <input class="range-input" type="range" min="1" max="20"
                     [value]="cfg.minConnections"
                     (input)="db.setMinConnections(+$any($event.target).value)" />
            </div>
            <div class="slider-field">
              <div class="slider-row">
                <label class="field-label">Max Connections</label>
                <span class="slider-val">{{ cfg.maxConnections }}</span>
              </div>
              <input class="range-input" type="range" min="1" max="100"
                     [value]="cfg.maxConnections"
                     (input)="db.setMaxConnections(+$any($event.target).value)" />
            </div>
            @if (cfg.maxConnections <= cfg.minConnections) {
              <p class="field-error">
                <i class="fas fa-triangle-exclamation mr-1"></i>Max must be greater than min
              </p>
            }
          </div>

          <!-- Timeouts -->
          <div class="config-block">
            <h3 class="config-block-title">Timeouts</h3>
            <div class="select-field">
              <label class="field-label">Idle Timeout</label>
              <select class="field-select"
                      [value]="cfg.idleTimeoutMs"
                      (change)="db.setIdleTimeout(+$any($event.target).value)">
                @for (opt of idleTimeouts; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
            <div class="select-field">
              <label class="field-label">Connection Timeout</label>
              <select class="field-select"
                      [value]="cfg.connectionTimeoutMs"
                      (change)="db.setConnectionTimeout(+$any($event.target).value)">
                @for (opt of connTimeouts; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Routing strategy -->
          <div class="config-block config-block--wide">
            <h3 class="config-block-title">Routing Strategy</h3>
            <div class="strategy-grid">
              @for (strat of poolStrategies; track strat.id) {
                <div class="strategy-card"
                     [class.strategy-card--selected]="cfg.poolStrategy === strat.id"
                     (click)="db.setPoolStrategy(strat.id)">
                  <i [class]="strat.icon + ' strategy-icon'"></i>
                  <div class="strategy-info">
                    <span class="strategy-name">{{ strat.name }}</span>
                    <span class="strategy-desc">{{ strat.description }}</span>
                  </div>
                  @if (cfg.poolStrategy === strat.id) {
                    <i class="fas fa-circle-check strategy-check"></i>
                  }
                </div>
              }
            </div>
          </div>

        </div>
      </section>
    }

    <!-- ══ STEP 3 — PERFORMANCE ═══════════════════════════════ -->
    @if (db.currentStep() === 3) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Tune Performance</h2>
          <p class="step-desc">Select index types, cache strategy, and query settings that match your application's read/write patterns. All parameters are embedded as <code class="inline-code">$meta</code> annotations in the exported config.</p>
        </div>

        <div class="config-grid">

          <!-- Indexes (multi-select) -->
          <div class="config-block config-block--wide">
            <h3 class="config-block-title">Index Types <span class="config-block-hint">— select all that apply</span></h3>
            <div class="index-grid">
              @for (idx of indexOptions; track idx.id) {
                <div class="index-card"
                     [class.index-card--selected]="cfg.indexes.includes(idx.id)"
                     (click)="db.toggleIndex(idx.id)">
                  <i [class]="idx.icon + ' index-icon'"></i>
                  <div class="index-info">
                    <span class="index-name">{{ idx.name }}</span>
                    <span class="index-desc">{{ idx.description }}</span>
                  </div>
                  <i class="index-check"
                     [class.fas]="true"
                     [class.fa-square-check]="cfg.indexes.includes(idx.id)"
                     [class.fa-square]="!cfg.indexes.includes(idx.id)"
                     [class.index-check--on]="cfg.indexes.includes(idx.id)">
                  </i>
                </div>
              }
            </div>
            @if (cfg.indexes.length === 0) {
              <p class="field-error">
                <i class="fas fa-triangle-exclamation mr-1"></i>Select at least one index type
              </p>
            }
          </div>

          <!-- Cache -->
          <div class="config-block">
            <h3 class="config-block-title">Query Cache</h3>
            <div class="select-field">
              <label class="field-label">Eviction Strategy</label>
              <select class="field-select"
                      [value]="cfg.cacheStrategy"
                      (change)="db.setCacheStrategy($any($event.target).value)">
                @for (opt of cacheStrategies; track opt.id) {
                  <option [value]="opt.id">{{ opt.name }} — {{ opt.description }}</option>
                }
              </select>
            </div>
            <div class="select-field">
              <label class="field-label">Cache Size</label>
              <select class="field-select"
                      [value]="cfg.cacheSizeMb"
                      (change)="db.setCacheSize(+$any($event.target).value)">
                @for (opt of cacheSizes; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Query settings -->
          <div class="config-block">
            <h3 class="config-block-title">Query Settings</h3>
            <div class="select-field">
              <label class="field-label">Query Timeout</label>
              <select class="field-select"
                      [value]="cfg.queryTimeoutMs ?? 'null'"
                      (change)="db.setQueryTimeout($any($event.target).value === 'null' ? null : +$any($event.target).value)">
                @for (opt of queryTimeouts; track opt.label) {
                  <option [value]="opt.value ?? 'null'">{{ opt.label }}</option>
                }
              </select>
            </div>
            <div class="select-field">
              <label class="field-label">Slow Query Alert</label>
              <select class="field-select"
                      [value]="cfg.slowQueryThresholdMs"
                      (change)="db.setSlowQueryThreshold(+$any($event.target).value)">
                @for (opt of slowQueryThresholds; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

        </div>
      </section>
    }

    <!-- ══ STEP 4 — RESULT ════════════════════════════════════ -->
    @if (db.currentStep() === 4) {
      <app-wizard-result
        [title]="db.resultData().title"
        [description]="db.resultData().description"
        [data]="db.resultData()">
        <app-db-preview [config]="cfg" />
        <div resultActions>
          <button class="reset-btn" type="button" (click)="db.reset()">
            <i class="fas fa-rotate-left mr-2"></i>Configure Another
          </button>
        </div>
      </app-wizard-result>
    }

    <!-- ── Nav bar ── -->
    @if (db.currentStep() < 4) {
      <div class="nav-bar">
        <button class="nav-btn nav-btn--secondary"
                [disabled]="db.currentStep() === 1"
                (click)="db.prevStep()">
          <i class="fas fa-chevron-left mr-1.5"></i>Back
        </button>

        <div class="nav-dots">
          @for (s of steps; track s.label; let i = $index) {
            <span class="nav-dot"
                  [class.nav-dot--active]="db.currentStep() === i + 1"
                  [class.nav-dot--done]="db.currentStep() > i + 1">
            </span>
          }
        </div>

        @if (db.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--primary"
                  [disabled]="!db.canAdvance()"
                  (click)="db.nextStep()">
            Next<i class="fas fa-chevron-right ml-1.5"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--primary"
                  [disabled]="!db.canAdvance()"
                  (click)="db.finish()">
            <i class="fas fa-check mr-1.5"></i>Finish
          </button>
        }
      </div>
    }

  </div>
</div>
  `,
  styles: [`
    /* ── Page shell ── */
    .dw-page {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: var(--f-layer-0);
    }

    /* ── Sticky HUD ── */
    .hud {
      position: sticky;
      top: 0;
      z-index: 20;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.4);
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.4);
      border-bottom: 1px solid var(--f-stroke);
      @media (max-width: 767px) { display: none; }
    }
    .hud-inner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hud-preview {
      flex-shrink: 0;
      width: 200px;
    }
    .hud-meta { flex: 1; min-width: 0; }
    .hud-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .hud-chip {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
      color: var(--f-text-3);
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      white-space: nowrap;
      transition: color 150ms, border-color 150ms, background 150ms;
      i { opacity: 0.5; }
      &.hud-chip--set {
        color: var(--f-text-1);
        background: rgba(62,143,200,0.10);
        border-color: rgba(62,143,200,0.30);
        i { opacity: 1; color: var(--f-accent-light); }
      }
    }

    /* ── Step tabs ── */
    .hud-steps {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
    .step-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke);
      background: var(--f-layer-1);
      color: var(--f-text-3);
      cursor: pointer;
      transition: background 150ms, border-color 150ms, color 150ms;
      font-family: inherit;
      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &:not(:disabled):hover { background: var(--f-layer-2); color: var(--f-text-1); }
      &.step-tab--active {
        background: rgba(62,143,200,0.15);
        border-color: var(--f-accent);
        color: var(--f-text-1);
        .step-icon { color: var(--f-accent-light); }
      }
      &.step-tab--done {
        background: rgba(62,143,200,0.08);
        border-color: rgba(62,143,200,0.20);
        color: var(--f-text-2);
      }
    }
    .step-icon  { font-size: 13px; }
    .step-label { font-size: 11px; font-weight: 600; white-space: nowrap; }
    .step-sub   { font-size: 9px; opacity: 0.6; white-space: nowrap; }

    /* ── Content ── */
    .dw-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ── Step sections ── */
    .step-section {
      padding: 40px;
      @media (max-width: 767px) { padding: 20px 16px; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 28px 24px; }
    }
    .step-header { margin-bottom: 32px; }
    .step-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--f-text-1);
      margin: 0 0 8px;
    }
    .step-desc {
      font-size: 14px;
      color: var(--f-text-2);
      line-height: 1.6;
      margin: 0;
      max-width: 680px;
    }
    .inline-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      background: var(--kr-primary-ghost);
      color: var(--f-accent-light);
      padding: 1px 5px;
      border-radius: 3px;
    }

    /* ── Engine grid (step 1) ── */
    .engine-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
    }
    .engine-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease), box-shadow 150ms var(--f-ease);
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); box-shadow: var(--f-shadow-2); }
      &.engine-card--selected {
        border-color: var(--f-accent);
        background: rgba(62,143,200,0.08);
        box-shadow: 0 0 0 1px var(--f-accent);
      }
    }
    .engine-card-header { display: flex; align-items: center; gap: 12px; }
    .engine-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .engine-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
    .engine-name    { font-size: 14px; font-weight: 700; color: var(--f-text-1); }
    .engine-tagline { font-size: 12px; color: var(--f-text-2); line-height: 1.4; }
    .engine-check   { font-size: 18px; flex-shrink: 0; }
    .engine-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 4px;
      border-top: 1px solid var(--f-stroke);
    }
    .engine-type-badge {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--f-text-3);
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      padding: 2px 7px;
      border-radius: 4px;
    }
    .engine-port {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--f-text-3);
      margin-left: auto;
    }

    /* ── Config grid (steps 2 & 3) ── */
    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      align-items: start;
    }
    .config-block {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      border-radius: 8px;
      &.config-block--wide { grid-column: 1 / -1; }
    }
    .config-block-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--f-text-1);
      margin: 0;
    }
    .config-block-hint {
      font-weight: 400;
      color: var(--f-text-3);
      font-size: 12px;
    }

    /* ── Sliders ── */
    .slider-field { display: flex; flex-direction: column; gap: 8px; }
    .slider-row   { display: flex; justify-content: space-between; align-items: center; }
    .field-label  { font-size: 12px; color: var(--f-text-2); font-weight: 400; }
    .slider-val   { font-size: 13px; font-weight: 700; color: var(--f-accent-light); font-family: 'JetBrains Mono', monospace; }
    .range-input {
      width: 100%;
      accent-color: var(--f-accent);
      cursor: pointer;
    }

    /* ── Selects ── */
    .select-field { display: flex; flex-direction: column; gap: 6px; }
    .field-select {
      width: 100%;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke-sd);
      background: var(--f-layer-0);
      color: var(--f-text-1);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      &:focus { outline: none; border-color: var(--f-accent); }
    }

    .field-error {
      font-size: 12px;
      color: #f87171;
      margin: 0;
    }

    /* ── Strategy cards ── */
    .strategy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }
    .strategy-card {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke);
      background: var(--f-layer-0);
      cursor: pointer;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.strategy-card--selected {
        border-color: var(--f-accent);
        background: rgba(62,143,200,0.08);
      }
    }
    .strategy-icon { font-size: 14px; color: var(--f-accent-light); margin-top: 2px; flex-shrink: 0; }
    .strategy-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .strategy-name { font-size: 13px; font-weight: 600; color: var(--f-text-1); }
    .strategy-desc { font-size: 11px; color: var(--f-text-2); line-height: 1.4; }
    .strategy-check { font-size: 15px; color: var(--f-accent-light); flex-shrink: 0; margin-top: 2px; }

    /* ── Index cards ── */
    .index-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 8px;
    }
    .index-card {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke);
      background: var(--f-layer-0);
      cursor: pointer;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.index-card--selected {
        border-color: var(--f-accent);
        background: rgba(62,143,200,0.08);
      }
    }
    .index-icon   { font-size: 14px; color: var(--f-accent-light); margin-top: 2px; flex-shrink: 0; }
    .index-info   { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .index-name   { font-size: 13px; font-weight: 600; color: var(--f-text-1); }
    .index-desc   { font-size: 11px; color: var(--f-text-2); line-height: 1.4; }
    .index-check  { font-size: 15px; color: var(--f-stroke-sd); flex-shrink: 0; margin-top: 2px; &.index-check--on { color: var(--f-accent-light); } }

    /* ── Bottom nav bar ── */
    .nav-bar {
      position: sticky;
      bottom: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 40px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-top: 1px solid var(--f-stroke);
      @media (max-width: 767px) { padding: 10px 16px; }
    }
    .nav-dots { display: flex; gap: 6px; }
    .nav-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--f-stroke-sd);
      transition: background 200ms, transform 200ms;
      &.nav-dot--active { background: var(--f-accent); transform: scale(1.4); }
      &.nav-dot--done   { background: rgba(62,143,200,0.50); }
    }
    .nav-btn {
      display: inline-flex;
      align-items: center;
      height: 36px;
      padding: 0 20px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 150ms, border-color 150ms, opacity 150ms;
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
    .nav-btn--secondary {
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-text-2);
      &:not(:disabled):hover { background: var(--f-layer-2); color: var(--f-text-1); }
    }
    .nav-btn--primary {
      background: var(--f-accent);
      border: 1px solid var(--f-accent);
      color: #fff;
      &:not(:disabled):hover { background: var(--f-accent-light); border-color: var(--f-accent-light); }
    }

    /* ── Reset button ── */
    .reset-btn {
      display: inline-flex;
      align-items: center;
      height: 36px;
      padding: 0 20px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: var(--f-text-2);
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      cursor: pointer;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); color: var(--f-text-1); }
    }
  `],
})
export class DbWizardPage {
  protected readonly db              = inject(DbWizardService);
  protected readonly steps           = WIZARD_STEPS;
  protected readonly engines         = ENGINE_OPTIONS;
  protected readonly poolStrategies  = POOL_STRATEGY_OPTIONS;
  protected readonly cacheStrategies = CACHE_STRATEGY_OPTIONS;
  protected readonly indexOptions    = INDEX_OPTIONS;
  protected readonly idleTimeouts    = IDLE_TIMEOUT_OPTIONS;
  protected readonly connTimeouts    = CONN_TIMEOUT_OPTIONS;
  protected readonly cacheSizes      = CACHE_SIZE_OPTIONS;
  protected readonly queryTimeouts   = QUERY_TIMEOUT_OPTIONS;
  protected readonly slowQueryThresholds = SLOW_QUERY_OPTIONS;

  constructor() {
    inject(Title).setTitle('DB Wizard — Waltkerovoz');
  }
}
