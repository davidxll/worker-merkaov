import {
  ChangeDetectionStrategy, Component, HostListener, inject, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { GearBuilderService, WIZARD_STEPS, type CompareTarget } from './gear-builder.service.js';
import { ObjectPreviewComponent } from './components/object-preview.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  STRUCTURE_OPTIONS, DRIVE_OPTIONS, FINISH_OPTIONS, DETAIL_OPTIONS, MODULE_OPTIONS,
} from './gear-builder.mock.js';
import type { StructureId, DriveId, FinishId, DetailId, ModuleId } from './gear-builder.types.js';

@Component({
  selector: 'app-gear-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ObjectPreviewComponent, WizardResultComponent],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     OBJECT BUILDER PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="gb-page">

  <!-- ── Sticky HUD ───────────────────────────────────────────── -->
  <div class="hud">
    <div class="hud-inner">

      <!-- Mini preview -->
      <div class="hud-preview">
        <app-object-preview [build]="gb.buildSig()" [compact]="true"/>
      </div>

      <!-- Build chips + live stats -->
      <div class="hud-meta">
        <div class="hud-chips">
          @for (chip of gb.buildChips(); track chip.label) {
            <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
              <i [class]="chip.icon + ' mr-1 text-xs'"></i>
              {{ chip.value ?? chip.label }}
            </span>
          }
        </div>
        <div class="hud-stats">
          @if (gb.structureStats(); as ss) {
            <span class="hud-stat" title="Relative mass">
              <i class="fas fa-cube mr-1 opacity-50"></i>mass {{ ss.mass }}/10
            </span>
            <span class="hud-sep">·</span>
            <span class="hud-stat">rigidity {{ ss.rigidity }}/10</span>
          }
          @if (gb.driveStats(); as ds) {
            <span class="hud-sep">·</span>
            <span class="hud-stat hud-stat--power" title="Peak output">{{ ds.output }} u</span>
            <span class="hud-sep">·</span>
            <span class="hud-stat">{{ ds.efficiency }}% eff.</span>
          }
        </div>
      </div>

      <!-- Step tabs -->
      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="gb.stepSig() === i + 1"
                  [class.step-tab--done]="gb.stepSig() > i + 1"
                  [disabled]="!gb.isStepReachable(i + 1)"
                  (click)="gb.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ── Main content ─────────────────────────────────────────── -->
  <div class="gb-content">

    <!-- ══ STEP 1 — STRUCTURE ══════════════════════════════════ -->
    @if (gb.stepSig() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Choose a Structure</h2>
          <p class="step-desc">The structural form defines how material is arranged — solid, networked, enclosed, or segmented.</p>
        </div>

        <!-- Quick select -->
        <div class="quick-row">
          <label class="quick-label">Quick select</label>
          <select class="quick-select" [value]="gb.buildSig().structure ?? ''"
                  (change)="gb.selectStructure($any($event.target).value)">
            <option value="" disabled>— pick one —</option>
            @for (s of structures; track s.id) {
              <option [value]="s.id">{{ s.name }} — {{ s.tagline }}</option>
            }
          </select>
          <button class="compare-btn" (click)="gb.openCompare('structure')">
            <i class="fas fa-arrow-right-arrow-left mr-1.5"></i>Compare All
          </button>
        </div>

        <!-- Options grid -->
        <div class="opt-grid">
          @for (s of structures; track s.id) {
            <div class="opt-card" [class.opt-card--selected]="gb.buildSig().structure === s.id"
                 (click)="gb.selectStructure(s.id)">
              <div class="opt-card-header">
                <i [class]="s.icon + ' opt-icon'"></i>
                <div class="opt-card-name">
                  <span class="opt-name">{{ s.name }}</span>
                  <span class="opt-tagline">{{ s.tagline }}</span>
                </div>
                @if (gb.buildSig().structure === s.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <p class="opt-desc">{{ s.description }}</p>
              <div class="stat-row">
                <div class="stat-pill">
                  <span class="stat-label">Mass</span>
                  <div class="stat-bar"><div class="stat-fill" [style.width.%]="s.stats.mass * 10"></div></div>
                  <span class="stat-val">{{ s.stats.mass }}/10</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Rigidity</span>
                  <div class="stat-bar"><div class="stat-fill" [style.width.%]="s.stats.rigidity * 10"></div></div>
                  <span class="stat-val">{{ s.stats.rigidity }}/10</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Surface</span>
                  <div class="stat-bar"><div class="stat-fill" [style.width.%]="s.stats.surface * 10"></div></div>
                  <span class="stat-val">{{ s.stats.surface }}/10</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Expandable specs panel -->
        @if (gb.buildSig().structure; as sid) {
          <div class="specs-panel">
            <button class="specs-toggle" (click)="gb.togglePanel('structure-specs')">
              <i class="fas fa-chevron-right specs-caret" [class.rotate-90]="gb.isPanelOpen('structure-specs')"></i>
              Detailed Specs — {{ structureName(sid) }}
            </button>
            @if (gb.isPanelOpen('structure-specs')) {
              <div class="specs-body">
                @for (s of structures; track s.id) {
                  @if (s.id === sid) {
                    <div class="specs-grid">
                      <div class="spec-row"><span class="spec-k">Form type</span><span class="spec-v">{{ s.name }}</span></div>
                      <div class="spec-row"><span class="spec-k">Tagline</span><span class="spec-v">{{ s.tagline }}</span></div>
                      <div class="spec-row"><span class="spec-k">Mass index</span><span class="spec-v">{{ s.stats.mass }}/10</span></div>
                      <div class="spec-row"><span class="spec-k">Rigidity index</span><span class="spec-v">{{ s.stats.rigidity }}/10</span></div>
                      <div class="spec-row"><span class="spec-k">Surface index</span><span class="spec-v">{{ s.stats.surface }}/10</span></div>
                    </div>
                    <p class="spec-full-desc">{{ s.description }}</p>
                  }
                }
              </div>
            }
          </div>
        }
      </section>
    }

    <!-- ══ STEP 2 — DRIVE ══════════════════════════════════════ -->
    @if (gb.stepSig() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Choose a Drive</h2>
          <p class="step-desc">The drive system defines how energy moves through the object — its cycle, output, and efficiency profile.</p>
        </div>

        <div class="quick-row">
          <label class="quick-label">Quick select</label>
          <select class="quick-select" [value]="gb.buildSig().drive ?? ''"
                  (change)="gb.selectDrive($any($event.target).value)">
            <option value="" disabled>— pick one —</option>
            @for (d of drives; track d.id) {
              <option [value]="d.id">{{ d.name }} — {{ d.tagline }}</option>
            }
          </select>
          <button class="compare-btn" (click)="gb.openCompare('drive')">
            <i class="fas fa-arrow-right-arrow-left mr-1.5"></i>Compare All
          </button>
        </div>

        <div class="opt-grid">
          @for (d of drives; track d.id) {
            <div class="opt-card" [class.opt-card--selected]="gb.buildSig().drive === d.id"
                 (click)="gb.selectDrive(d.id)">
              <div class="opt-card-header">
                <i [class]="d.icon + ' opt-icon'" [style.color]="d.accentColor"></i>
                <div class="opt-card-name">
                  <span class="opt-name">{{ d.name }}</span>
                  <span class="opt-tagline">{{ d.tagline }}</span>
                </div>
                <span class="cycle-badge cycle-badge--{{ d.cycleType }}">{{ d.cycleType }}</span>
                @if (gb.buildSig().drive === d.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <div class="stat-row">
                <div class="stat-pill">
                  <span class="stat-label">Output</span>
                  <div class="stat-bar">
                    <div class="stat-fill" [style.width.%]="(d.stats.output / 920) * 100" [style.background]="d.accentColor"></div>
                  </div>
                  <span class="stat-val">{{ d.stats.output }} u</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Efficiency</span>
                  <div class="stat-bar">
                    <div class="stat-fill" [style.width.%]="d.stats.efficiency" [style.background]="d.accentColor"></div>
                  </div>
                  <span class="stat-val">{{ d.stats.efficiency }}%</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Cycle</span>
                  <span class="stat-val">{{ d.stats.cycleMs === 0 ? '—' : d.stats.cycleMs + ' ms' }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        @if (gb.buildSig().drive; as did) {
          <div class="specs-panel">
            <button class="specs-toggle" (click)="gb.togglePanel('drive-specs')">
              <i class="fas fa-chevron-right specs-caret" [class.rotate-90]="gb.isPanelOpen('drive-specs')"></i>
              Detailed Specs — {{ driveName(did) }}
            </button>
            @if (gb.isPanelOpen('drive-specs')) {
              <div class="specs-body">
                @for (d of drives; track d.id) {
                  @if (d.id === did) {
                    <div class="specs-grid">
                      <div class="spec-row"><span class="spec-k">Drive type</span><span class="spec-v">{{ d.name }}</span></div>
                      <div class="spec-row"><span class="spec-k">Cycle mode</span><span class="spec-v">{{ d.cycleType }}</span></div>
                      <div class="spec-row"><span class="spec-k">Peak output</span><span class="spec-v">{{ d.stats.output }} u</span></div>
                      <div class="spec-row"><span class="spec-k">Efficiency</span><span class="spec-v">{{ d.stats.efficiency }}%</span></div>
                      <div class="spec-row"><span class="spec-k">Cycle time</span><span class="spec-v">{{ d.stats.cycleMs === 0 ? 'Continuous' : d.stats.cycleMs + ' ms' }}</span></div>
                    </div>
                  }
                }
              </div>
            }
          </div>
        }
      </section>
    }

    <!-- ══ STEP 3 — FINISH + DETAIL + MODULE ════════════════════ -->
    @if (gb.stepSig() === 3) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Finish Your Build</h2>
          <p class="step-desc">Select a surface finish, edge detail treatment, and optional module attachment.</p>
        </div>

        <!-- Finish -->
        <div class="styling-section">
          <h3 class="styling-title"><i class="fas fa-palette mr-2 opacity-60"></i>Surface Finish</h3>
          <div class="finish-grid">
            @for (f of finishes; track f.id) {
              <button class="finish-swatch" [class.finish-swatch--selected]="gb.buildSig().finish === f.id"
                      (click)="gb.selectFinish(f.id)" [title]="f.name">
                <span class="swatch-circle" [style.background]="f.hex"
                      [class.metallic]="f.metallic"></span>
                <span class="swatch-name">{{ f.name }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Detail -->
        <div class="styling-section">
          <h3 class="styling-title"><i class="fas fa-vector-square mr-2 opacity-60"></i>Edge Detail</h3>
          <div class="detail-grid">
            @for (d of details; track d.id) {
              <div class="detail-card" [class.detail-card--selected]="gb.buildSig().detail === d.id"
                   (click)="gb.selectDetail(d.id)">
                <!-- Small SVG pattern preview -->
                <svg viewBox="0 0 48 48" class="detail-pattern" [attr.stroke]="d.edgeColor" fill="none">
                  @switch (d.id) {
                    @case ('minimal') {
                      <circle cx="24" cy="24" r="5" stroke-width="1.5"/>
                      <circle cx="24" cy="24" r="10" stroke-width="0.75" opacity="0.4"/>
                    }
                    @case ('radiator') {
                      <line x1="24" y1="4"  x2="24" y2="12" stroke-width="1.5"/>
                      <line x1="24" y1="36" x2="24" y2="44" stroke-width="1.5"/>
                      <line x1="4"  y1="24" x2="12" y2="24" stroke-width="1.5"/>
                      <line x1="36" y1="24" x2="44" y2="24" stroke-width="1.5"/>
                      <line x1="8"  y1="8"  x2="14" y2="14" stroke-width="1.5"/>
                      <line x1="34" y1="34" x2="40" y2="40" stroke-width="1.5"/>
                      <line x1="8"  y1="40" x2="14" y2="34" stroke-width="1.5"/>
                      <line x1="34" y1="14" x2="40" y2="8"  stroke-width="1.5"/>
                      <circle cx="24" cy="24" r="8" stroke-width="1" opacity="0.5"/>
                    }
                    @case ('fractal') {
                      <rect x="4"  y="4"  width="40" height="40" rx="1" stroke-width="1.5"/>
                      <rect x="12" y="12" width="24" height="24" rx="1" stroke-width="1"    opacity="0.6"/>
                      <rect x="18" y="18" width="12" height="12" rx="0.5" stroke-width="0.75" opacity="0.4"/>
                    }
                    @case ('mirror') {
                      <line x1="4"  y1="4"  x2="20" y2="20" stroke-width="1.5"/>
                      <line x1="44" y1="4"  x2="28" y2="20" stroke-width="1.5"/>
                      <line x1="4"  y1="44" x2="20" y2="28" stroke-width="1.5"/>
                      <line x1="44" y1="44" x2="28" y2="28" stroke-width="1.5"/>
                      <rect x="20" y="20" width="8" height="8" stroke-width="1" opacity="0.5"/>
                    }
                  }
                </svg>
                <div class="detail-meta">
                  <span class="detail-name">{{ d.name }}</span>
                  <span class="detail-desc">{{ d.description }}</span>
                </div>
                @if (gb.buildSig().detail === d.id) {
                  <i class="fas fa-circle-check detail-check"></i>
                }
              </div>
            }
          </div>
        </div>

        <!-- Module -->
        <div class="styling-section">
          <h3 class="styling-title"><i class="fas fa-plug mr-2 opacity-60"></i>Module Attachment</h3>
          <div class="module-grid">
            @for (m of modules; track m.id) {
              <div class="module-card" [class.module-card--selected]="gb.buildSig().module === m.id"
                   (click)="gb.selectModule(m.id)">
                <div class="module-card-header">
                  <i [class]="m.icon + ' module-icon'"></i>
                  <span class="module-name">{{ m.name }}</span>
                  @if (gb.buildSig().module === m.id) {
                    <i class="fas fa-circle-check module-check"></i>
                  }
                </div>
                <p class="module-desc">{{ m.description }}</p>
                @if (m.adds.length > 0) {
                  <ul class="module-adds">
                    @for (add of m.adds; track add) {
                      <li><i class="fas fa-plus mr-1.5 opacity-50 text-xs"></i>{{ add }}</li>
                    }
                  </ul>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- ══ STEP 4 — RESULT ══════════════════════════════════════ -->
    @if (gb.stepSig() === 4) {
      <section class="step-section result-section">
        <app-wizard-result
          [title]="gb.resultData().title"
          [description]="gb.resultData().description"
          [data]="gb.resultData()">
          <app-object-preview [build]="gb.buildSig()"/>
        </app-wizard-result>
        <div class="result-actions">
          <button class="start-over-btn" (click)="gb.reset()">
            <i class="fas fa-arrow-rotate-left mr-2"></i>Start Over
          </button>
        </div>
      </section>
    }

  </div><!-- /gb-content -->

  <!-- ── Bottom sticky nav ─────────────────────────────────────── -->
  @if (gb.stepSig() < 4) {
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        <button class="nav-btn nav-btn--back" [disabled]="gb.stepSig() === 1" (click)="gb.prevStep()">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div class="nav-progress">
          Step {{ gb.stepSig() }} of {{ steps.length }}
        </div>
        @if (gb.stepSig() < steps.length) {
          <button class="nav-btn nav-btn--next" [disabled]="!gb.canAdvance()" (click)="gb.nextStep()">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--finish" [disabled]="!gb.canAdvance()" (click)="gb.finish()">
            <i class="fas fa-check mr-2"></i>Finish Build
          </button>
        }
      </div>
    </div>
  }

  <!-- ── Compare modal ─────────────────────────────────────────── -->
  @if (gb.compareOpenSig()) {
    <div class="modal-backdrop" (click)="gb.closeCompare()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ gb.compareTitle() }}</h3>
          <button class="modal-close" (click)="gb.closeCompare()">
            <i class="fas fa-xmark"></i>
          </button>
        </div>

        <!-- Structure compare -->
        @if (gb.compareTargetSig() === 'structure') {
          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th></th>
                  @for (s of structures; track s.id) {
                    <th [class.cmp-selected]="gb.buildSig().structure === s.id">
                      <i [class]="s.icon + ' mr-1'"></i>{{ s.name }}
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                <tr><td class="cmp-label">Tagline</td>
                  @for (s of structures; track s.id) {
                    <td [class.cmp-selected]="gb.buildSig().structure === s.id">{{ s.tagline }}</td>
                  }
                </tr>
                <tr><td class="cmp-label">Mass (1–10)</td>
                  @for (s of structures; track s.id) {
                    <td [class.cmp-selected]="gb.buildSig().structure === s.id">{{ s.stats.mass }}</td>
                  }
                </tr>
                <tr><td class="cmp-label">Rigidity (1–10)</td>
                  @for (s of structures; track s.id) {
                    <td [class.cmp-selected]="gb.buildSig().structure === s.id">{{ s.stats.rigidity }}</td>
                  }
                </tr>
                <tr><td class="cmp-label">Surface (1–10)</td>
                  @for (s of structures; track s.id) {
                    <td [class.cmp-selected]="gb.buildSig().structure === s.id">{{ s.stats.surface }}</td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <div class="compare-actions">
            @for (s of structures; track s.id) {
              <button class="cmp-select-btn" [class.cmp-select-btn--active]="gb.buildSig().structure === s.id"
                      (click)="gb.selectStructure(s.id); gb.closeCompare()">
                {{ gb.buildSig().structure === s.id ? 'Selected' : 'Select ' + s.name }}
              </button>
            }
          </div>
        }

        <!-- Drive compare -->
        @if (gb.compareTargetSig() === 'drive') {
          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th></th>
                  @for (d of drives; track d.id) {
                    <th [class.cmp-selected]="gb.buildSig().drive === d.id">
                      <i [class]="d.icon + ' mr-1'" [style.color]="d.accentColor"></i>{{ d.name }}
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                <tr><td class="cmp-label">Cycle mode</td>
                  @for (d of drives; track d.id) {
                    <td [class.cmp-selected]="gb.buildSig().drive === d.id">{{ d.cycleType }}</td>
                  }
                </tr>
                <tr><td class="cmp-label">Peak output</td>
                  @for (d of drives; track d.id) {
                    <td [class.cmp-selected]="gb.buildSig().drive === d.id">{{ d.stats.output }} u</td>
                  }
                </tr>
                <tr><td class="cmp-label">Efficiency</td>
                  @for (d of drives; track d.id) {
                    <td [class.cmp-selected]="gb.buildSig().drive === d.id">{{ d.stats.efficiency }}%</td>
                  }
                </tr>
                <tr><td class="cmp-label">Cycle time</td>
                  @for (d of drives; track d.id) {
                    <td [class.cmp-selected]="gb.buildSig().drive === d.id">
                      {{ d.stats.cycleMs === 0 ? 'Continuous' : d.stats.cycleMs + ' ms' }}
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <div class="compare-actions">
            @for (d of drives; track d.id) {
              <button class="cmp-select-btn" [class.cmp-select-btn--active]="gb.buildSig().drive === d.id"
                      (click)="gb.selectDrive(d.id); gb.closeCompare()">
                {{ gb.buildSig().drive === d.id ? 'Selected' : 'Select ' + d.name }}
              </button>
            }
          </div>
        }

      </div><!-- /modal-panel -->
    </div><!-- /modal-backdrop -->
  }

</div><!-- /gb-page -->
  `,
  styles: [`
    /* ── Page shell ──────────────────────────────────────────────────────── */
    .gb-page { display: flex; flex-direction: column; min-height: 100%; position: relative; }
    .gb-content { flex: 1; padding: 24px 24px 120px; max-width: 900px; margin: 0 auto; width: 100%; }

    /* ── HUD ────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky; top: 0; z-index: 40;
      background: var(--f-layer-2); border-bottom: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .hud-inner { display: grid; grid-template-columns: 120px 1fr auto; align-items: center; gap: 16px; padding: 10px 24px; }
    .hud-preview { width: 120px; }
    .hud-meta { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .hud-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .hud-chip {
      font-size: 11px; padding: 2px 8px; border-radius: 4px;
      background: var(--f-layer-3); color: var(--f-text-3); border: 1px solid var(--f-stroke);
      transition: color 0.2s, border-color 0.2s;
    }
    .hud-chip--set { color: var(--f-text-1); border-color: var(--f-accent); }
    .hud-stats { display: flex; flex-wrap: wrap; gap: 4px; font-size: 12px; color: var(--f-text-2); font-family: 'JetBrains Mono', monospace; }
    .hud-stat { white-space: nowrap; }
    .hud-stat--power { color: var(--kr-primary-light); }
    .hud-sep { opacity: 0.4; }
    .hud-steps { display: flex; gap: 2px; }
    .step-tab {
      display: flex; flex-direction: column; align-items: center; padding: 8px 16px;
      border-radius: 6px; border: 1px solid transparent; background: transparent;
      cursor: pointer; color: var(--f-text-3); transition: all 0.2s; gap: 1px;
    }
    .step-tab:hover:not(:disabled) { background: var(--f-layer-3); color: var(--f-text-1); }
    .step-tab--active { background: var(--f-layer-3); color: var(--f-text-1); border-color: var(--f-accent); }
    .step-tab--done { color: var(--kr-crystal); }
    .step-tab:disabled { opacity: 0.4; cursor: default; }
    .step-icon { font-size: 14px; }
    .step-label { font-size: 11px; font-weight: 600; line-height: 1; }
    .step-sub { font-size: 9px; opacity: 0.6; line-height: 1; }

    /* ── Step sections ──────────────────────────────────────────────────── */
    .step-section { display: flex; flex-direction: column; gap: 28px; }
    .step-header { display: flex; flex-direction: column; gap: 6px; }
    .step-title { font-size: 22px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .step-desc { font-size: 14px; color: var(--f-text-2); margin: 0; line-height: 1.6; }

    /* ── Quick row ──────────────────────────────────────────────────────── */
    .quick-row { display: flex; align-items: center; gap: 12px; }
    .quick-label { font-size: 12px; color: var(--f-text-3); white-space: nowrap; }
    .quick-select {
      flex: 1; max-width: 320px; padding: 6px 10px; border-radius: 6px;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); color: var(--f-text-1); font-size: 13px;
    }
    .compare-btn {
      padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); color: var(--f-text-2);
      cursor: pointer; white-space: nowrap; transition: all 0.2s;
    }
    .compare-btn:hover { border-color: var(--f-accent); color: var(--f-text-1); }

    /* ── Option grid ────────────────────────────────────────────────────── */
    .opt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .opt-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 18px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.2s; position: relative;
    }
    .opt-card:hover { border-color: var(--f-accent); background: var(--f-layer-3); }
    .opt-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .opt-card-header { display: flex; align-items: flex-start; gap: 12px; }
    .opt-icon { font-size: 20px; color: var(--f-accent); margin-top: 2px; flex-shrink: 0; }
    .opt-card-name { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .opt-name { font-size: 15px; font-weight: 600; color: var(--f-text-1); }
    .opt-tagline { font-size: 12px; color: var(--f-text-3); }
    .opt-check { color: var(--kr-primary); font-size: 18px; flex-shrink: 0; }
    .opt-desc { font-size: 13px; color: var(--f-text-2); line-height: 1.5; margin: 0; }

    /* ── Stat row ───────────────────────────────────────────────────────── */
    .stat-row { display: flex; flex-direction: column; gap: 5px; }
    .stat-pill { display: flex; align-items: center; gap: 8px; }
    .stat-label { font-size: 10px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; width: 54px; flex-shrink: 0; }
    .stat-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--f-layer-3); overflow: hidden; }
    .stat-fill { height: 100%; border-radius: 2px; background: var(--f-accent); transition: width 0.4s ease; }
    .stat-val { font-size: 10px; color: var(--f-text-2); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }

    /* ── Specs panel ────────────────────────────────────────────────────── */
    .specs-panel { border: 1px solid var(--f-stroke); border-radius: 8px; overflow: hidden; }
    .specs-toggle {
      width: 100%; display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      background: var(--f-layer-2); border: 0; cursor: pointer; color: var(--f-text-2); font-size: 13px;
      text-align: left;
    }
    .specs-toggle:hover { background: var(--f-layer-3); }
    .specs-caret { transition: transform 0.2s; font-size: 11px; }
    .rotate-90 { transform: rotate(90deg); }
    .specs-body { padding: 16px; background: var(--f-layer-1); border-top: 1px solid var(--f-stroke); }
    .specs-grid { display: grid; grid-template-columns: auto 1fr; gap: 6px 24px; margin-bottom: 12px; }
    .spec-row { display: contents; }
    .spec-k { font-size: 12px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; white-space: nowrap; padding: 3px 0; }
    .spec-v { font-size: 12px; color: var(--f-text-1); padding: 3px 0; }
    .spec-full-desc { font-size: 13px; color: var(--f-text-2); line-height: 1.6; margin: 0; }

    /* ── Cycle badge ────────────────────────────────────────────────────── */
    .cycle-badge {
      font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 3px;
      letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid;
    }
    .cycle-badge--pulsed    { color: #38bdf8; border-color: rgba(56,189,248,0.4); background: rgba(56,189,248,0.08);  }
    .cycle-badge--continuous{ color: #a3e635; border-color: rgba(163,230,53,0.4); background: rgba(163,230,53,0.08); }
    .cycle-badge--ambient   { color: #c084fc; border-color: rgba(192,132,252,0.4);background: rgba(192,132,252,0.08);}
    .cycle-badge--mechanical{ color: #fb923c; border-color: rgba(251,146,60,0.4); background: rgba(251,146,60,0.08);  }

    /* ── Styling sections (step 3) ──────────────────────────────────────── */
    .styling-section { display: flex; flex-direction: column; gap: 14px; }
    .styling-title { font-size: 13px; font-weight: 600; color: var(--f-text-2); margin: 0; letter-spacing: 0.04em; }

    /* Finish grid */
    .finish-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .finish-swatch {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 10px 14px; border-radius: 8px; border: 1px solid var(--f-stroke);
      background: var(--f-layer-2); cursor: pointer; transition: all 0.2s;
    }
    .finish-swatch:hover { border-color: var(--f-accent); }
    .finish-swatch--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.1); }
    .swatch-circle {
      width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.12);
    }
    .swatch-circle.metallic { box-shadow: inset 0 2px 6px rgba(255,255,255,0.3); }
    .swatch-name { font-size: 11px; color: var(--f-text-2); white-space: nowrap; }

    /* Detail grid */
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
    .detail-card {
      border: 1px solid var(--f-stroke); border-radius: 8px; padding: 14px;
      background: var(--f-layer-2); cursor: pointer; display: flex; align-items: center; gap: 14px;
      position: relative; transition: all 0.2s;
    }
    .detail-card:hover { border-color: var(--f-accent); }
    .detail-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .detail-pattern { width: 48px; height: 48px; flex-shrink: 0; }
    .detail-meta { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
    .detail-name { font-size: 13px; font-weight: 600; color: var(--f-text-1); }
    .detail-desc { font-size: 11px; color: var(--f-text-3); line-height: 1.4; }
    .detail-check { position: absolute; top: 10px; right: 10px; color: var(--kr-primary); font-size: 14px; }

    /* Module grid */
    .module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .module-card {
      border: 1px solid var(--f-stroke); border-radius: 8px; padding: 16px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 8px;
      position: relative; transition: all 0.2s;
    }
    .module-card:hover { border-color: var(--f-accent); }
    .module-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .module-card-header { display: flex; align-items: center; gap: 10px; }
    .module-icon { font-size: 16px; color: var(--f-accent); }
    .module-name { font-size: 14px; font-weight: 600; color: var(--f-text-1); flex: 1; }
    .module-check { color: var(--kr-primary); font-size: 16px; }
    .module-desc { font-size: 12px; color: var(--f-text-2); line-height: 1.5; margin: 0; }
    .module-adds { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
    .module-adds li { font-size: 11px; color: var(--kr-crystal); }

    /* ── Result ─────────────────────────────────────────────────────────── */
    .result-section { align-items: center; }
    .result-actions { margin-top: 24px; }
    .start-over-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); color: var(--f-text-2);
      cursor: pointer; transition: all 0.2s;
    }
    .start-over-btn:hover { border-color: var(--f-accent); color: var(--f-text-1); }

    /* ── Bottom nav ─────────────────────────────────────────────────────── */
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
      background: var(--f-layer-2); border-top: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .bottom-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; max-width: 900px; margin: 0 auto; }
    .nav-progress { font-size: 12px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }
    .nav-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; border: 1px solid var(--f-stroke);
    }
    .nav-btn:disabled { opacity: 0.4; cursor: default; }
    .nav-btn--back  { background: transparent; color: var(--f-text-2); }
    .nav-btn--back:hover:not(:disabled) { color: var(--f-text-1); border-color: var(--f-accent); }
    .nav-btn--next  { background: var(--kr-primary); border-color: var(--kr-primary); color: #fff; }
    .nav-btn--next:hover:not(:disabled) { filter: brightness(1.15); }
    .nav-btn--finish { background: var(--kr-crystal); border-color: var(--kr-crystal); color: var(--kr-void); font-weight: 600; }
    .nav-btn--finish:hover:not(:disabled) { filter: brightness(1.1); }

    /* ── Compare modal ──────────────────────────────────────────────────── */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 60; background: rgba(3,4,10,0.75); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-panel {
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); border-radius: 12px;
      width: 100%; max-width: 780px; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid var(--f-stroke); flex-shrink: 0;
    }
    .modal-title { font-size: 17px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .modal-close {
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      border-radius: 6px; border: 1px solid var(--f-stroke); background: transparent;
      cursor: pointer; color: var(--f-text-2); transition: all 0.15s;
    }
    .modal-close:hover { border-color: var(--f-accent); color: var(--f-text-1); }
    .compare-table-wrap { padding: 20px 24px; overflow-x: auto; }
    .compare-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .compare-table th, .compare-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--f-stroke); }
    .compare-table th { font-size: 12px; font-weight: 600; color: var(--f-text-2); background: var(--f-layer-3); }
    .compare-table td { color: var(--f-text-1); }
    .cmp-label { color: var(--f-text-3); font-size: 12px; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
    .cmp-selected { background: rgba(58,143,200,0.08) !important; }
    .compare-actions { display: flex; flex-wrap: wrap; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--f-stroke); }
    .cmp-select-btn {
      padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;
      border: 1px solid var(--f-stroke); background: var(--f-layer-3); color: var(--f-text-2); cursor: pointer; transition: all 0.2s;
    }
    .cmp-select-btn:hover { border-color: var(--f-accent); color: var(--f-text-1); }
    .cmp-select-btn--active { border-color: var(--kr-primary); color: var(--kr-primary); background: rgba(58,143,200,0.1); }
  `],
})
export class GearBuilderPage implements OnInit {
  protected readonly gb = inject(GearBuilderService);

  protected readonly steps      = WIZARD_STEPS;
  protected readonly structures = STRUCTURE_OPTIONS;
  protected readonly drives     = DRIVE_OPTIONS;
  protected readonly finishes   = FINISH_OPTIONS;
  protected readonly details    = DETAIL_OPTIONS;
  protected readonly modules    = MODULE_OPTIONS;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Object Builder — Waltkerovoz');
  }

  protected structureName(id: StructureId): string {
    return STRUCTURE_OPTIONS.find(s => s.id === id)?.name ?? id;
  }

  protected driveName(id: DriveId): string {
    return DRIVE_OPTIONS.find(d => d.id === id)?.name ?? id;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.gb.compareOpenSig()) this.gb.closeCompare();
  }
}
