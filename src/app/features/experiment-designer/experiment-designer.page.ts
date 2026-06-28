import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ApparatusPreviewComponent } from './components/apparatus-preview.component.js';
import { ExperimentDesignerService, WIZARD_STEPS } from './experiment-designer.service.js';
import { WizardStepDirective, WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  CONTAINMENT_OPTIONS, EXCITATION_OPTIONS,
  DETECTOR_OPTIONS, OUTPUT_FORMAT_OPTIONS,
} from './experiment-designer.mock.js';

@Component({
  selector: 'app-experiment-designer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ApparatusPreviewComponent, WizardStepDirective, WizardResultComponent],
  providers: [{ provide: WIZARD_STEP_SERVICE, useExisting: ExperimentDesignerService }],
  template: `
    <div class="ed-root">

      <!-- ══════════════════════════════════════════════
           STICKY HUD
      ══════════════════════════════════════════════ -->
      <div class="ed-hud">
        <div class="hud-preview-wrap">
          <app-apparatus-preview
            [config]="eds.config()"
            [compact]="true"
            class="hud-preview-svg" />
        </div>

        <div class="hud-info">
          <div class="hud-chips">
            @for (chip of eds.configChips(); track chip.label) {
              <span class="hud-chip" [class.empty]="!chip.value">
                <i [class]="chip.icon + ' mr-1 opacity-70'"></i>
                {{ chip.value ?? chip.label }}
              </span>
            }
          </div>
          <div class="hud-stats">
            @if (eds.containmentStats()) {
              <span class="hud-stat" title="Vacuum pressure">
                <i class="fas fa-gauge mr-1 opacity-50"></i>10<sup>{{ eds.containmentStats()!.pressureExp }}</sup> Torr
              </span>
              <span class="hud-sep">·</span>
              <span class="hud-stat" title="Operating temperature">{{ eds.containmentStats()!.tempK }} K</span>
            }
            @if (eds.excitationStats()) {
              <span class="hud-sep">·</span>
              @if (eds.excitationStats()!.wavelengthNm) {
                <span class="hud-stat wavelength" title="Wavelength">
                  {{ eds.excitationStats()!.wavelengthNm }} nm
                </span>
                <span class="hud-sep">·</span>
              }
              <span class="hud-stat" title="Power">{{ eds.excitationStats()!.powerMw >= 1000
                ? (eds.excitationStats()!.powerMw / 1000).toFixed(1) + ' W'
                : eds.excitationStats()!.powerMw + ' mW' }}</span>
            }
          </div>
        </div>

        <div class="hud-tabs">
          @for (step of steps; track $index) {
            <button
              class="hud-tab"
              [class.active]="eds.currentStep() === $index + 1"
              [class.done]="$index + 1 < eds.currentStep()"
              (click)="eds.jumpToStep($index + 1)"
              type="button"
              [title]="step.sublabel">
              @if ($index + 1 < eds.currentStep()) {
                <i class="fas fa-check text-emerald-400 text-xs mr-1.5"></i>
              } @else {
                <i [class]="step.icon + ' text-xs mr-1.5'"></i>
              }
              <span class="hud-tab-label">{{ step.label }}</span>
            </button>
          }
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           STEP CONTENT
      ══════════════════════════════════════════════ -->
      <div class="ed-body">

        <!-- ── STEP 1: CONTAINMENT ──────────────────── -->
        @if (eds.currentStep() === 1) {
          <section
            class="step-section step-1-bg"
            wizardStep
            [stepIndex]="1"
            [stepDef]="steps[0]"
            #containStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="containStep.icon() + ' mr-3 text-primary-400'"></i>
                  Choose Your {{ containStep.label() }}
                </h2>
                <p class="step-desc">
                  The containment geometry defines how krypton atoms or ions are isolated,
                  cooled, and held in the interaction region.
                </p>
              </div>
              <div class="step-head-actions">
                <div class="qs-wrap" title="Jump to option">
                  <i class="fas fa-bolt qs-icon"></i>
                  <select class="qs-select" (change)="eds.selectContainment($any($event.target).value)">
                    <option value="" [selected]="!eds.config().containment">Jump to…</option>
                    @for (o of containmentOptions; track o.id) {
                      <option [value]="o.id" [selected]="eds.config().containment === o.id">{{ o.name }}</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <div class="options-grid">
              @for (opt of containmentOptions; track opt.id) {
                <div class="opt-card"
                     [class.selected]="eds.config().containment === opt.id"
                     (click)="eds.selectContainment(opt.id)"
                     role="button" tabindex="0"
                     (keydown.enter)="eds.selectContainment(opt.id)"
                     (keydown.space)="eds.selectContainment(opt.id)">
                  <div class="opt-card-header">
                    <i [class]="opt.icon + ' opt-icon'"></i>
                    <div class="opt-card-titles">
                      <span class="opt-name">{{ opt.name }}</span>
                      <span class="opt-tagline">{{ opt.tagline }}</span>
                    </div>
                    @if (eds.config().containment === opt.id) {
                      <i class="fas fa-circle-check opt-check"></i>
                    }
                  </div>
                  <p class="opt-desc">{{ opt.description }}</p>

                  <!-- Stats -->
                  <div class="opt-stats">
                    <div class="opt-stat-item">
                      <span class="stat-label">Pressure</span>
                      <span class="stat-val">10<sup>{{ opt.stats.pressureExp }}</sup> Torr</span>
                    </div>
                    <div class="opt-stat-item">
                      <span class="stat-label">Temperature</span>
                      <span class="stat-val">{{ opt.stats.tempK }} K</span>
                    </div>
                    <div class="opt-stat-item">
                      <span class="stat-label">Capacity</span>
                      <span class="stat-val">~10<sup>{{ opt.stats.capacityLog }}</sup> particles</span>
                    </div>
                  </div>

                  <!-- Collapsible spec panel -->
                  <button class="panel-toggle" (click)="$event.stopPropagation(); eds.togglePanel(opt.id)"
                          type="button">
                    <i class="fas" [class.fa-chevron-down]="!eds.isPanelOpen(opt.id)"
                                   [class.fa-chevron-up]="eds.isPanelOpen(opt.id)"></i>
                    {{ eds.isPanelOpen(opt.id) ? 'Hide' : 'Show' }} specs
                  </button>
                  @if (eds.isPanelOpen(opt.id)) {
                    <div class="spec-panel">
                      <div class="spec-row">
                        <span>Chamber type</span><span>{{ opt.name }}</span>
                      </div>
                      <div class="spec-row">
                        <span>Base pressure</span><span>10<sup>{{ opt.stats.pressureExp }}</sup> Torr</span>
                      </div>
                      <div class="spec-row">
                        <span>Operating temp.</span><span>{{ opt.stats.tempK }} K</span>
                      </div>
                      <div class="spec-row">
                        <span>Max particle count</span><span>~10<sup>{{ opt.stats.capacityLog }}</sup></span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- ── STEP 2: EXCITATION ────────────────────── -->
        @if (eds.currentStep() === 2) {
          <section
            class="step-section step-2-bg"
            wizardStep
            [stepIndex]="2"
            [stepDef]="steps[1]"
            #exciteStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="exciteStep.icon() + ' mr-3 text-primary-400'"></i>
                  Choose Your {{ exciteStep.label() }} Source
                </h2>
                <p class="step-desc">
                  The excitation source drives transitions in krypton —
                  from precision laser spectroscopy to broadband discharge excitation.
                </p>
              </div>
              <div class="step-head-actions">
                <div class="qs-wrap">
                  <i class="fas fa-bolt qs-icon"></i>
                  <select class="qs-select" (change)="eds.selectExcitation($any($event.target).value)">
                    <option value="" [selected]="!eds.config().excitation">Jump to…</option>
                    @for (o of excitationOptions; track o.id) {
                      <option [value]="o.id" [selected]="eds.config().excitation === o.id">{{ o.name }}</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <div class="options-grid">
              @for (opt of excitationOptions; track opt.id) {
                <div class="opt-card"
                     [class.selected]="eds.config().excitation === opt.id"
                     (click)="eds.selectExcitation(opt.id)"
                     role="button" tabindex="0"
                     (keydown.enter)="eds.selectExcitation(opt.id)"
                     (keydown.space)="eds.selectExcitation(opt.id)">
                  <div class="opt-card-header">
                    <i [class]="opt.icon + ' opt-icon'"
                       [style.color]="opt.accentColor"></i>
                    <div class="opt-card-titles">
                      <span class="opt-name">{{ opt.name }}</span>
                      <span class="opt-tagline">{{ opt.tagline }}</span>
                    </div>
                    @if (eds.config().excitation === opt.id) {
                      <i class="fas fa-circle-check opt-check"></i>
                    }
                  </div>
                  <div class="opt-stats">
                    @if (opt.stats.wavelengthNm) {
                      <div class="opt-stat-item">
                        <span class="stat-label">Wavelength</span>
                        <span class="stat-val" [style.color]="opt.accentColor">{{ opt.stats.wavelengthNm }} nm</span>
                      </div>
                    } @else {
                      <div class="opt-stat-item">
                        <span class="stat-label">Type</span>
                        <span class="stat-val">{{ opt.type | titlecase }}</span>
                      </div>
                    }
                    <div class="opt-stat-item">
                      <span class="stat-label">Power</span>
                      <span class="stat-val">{{ opt.stats.powerMw >= 1000
                        ? (opt.stats.powerMw / 1000).toFixed(1) + ' W'
                        : opt.stats.powerMw + ' mW' }}</span>
                    </div>
                    <div class="opt-stat-item">
                      <span class="stat-label">Linewidth</span>
                      <span class="stat-val">{{ opt.stats.linewidthMHz >= 1000
                        ? (opt.stats.linewidthMHz / 1000).toFixed(0) + ' GHz'
                        : opt.stats.linewidthMHz + ' MHz' }}</span>
                    </div>
                  </div>

                  <button class="panel-toggle" (click)="$event.stopPropagation(); eds.togglePanel(opt.id)"
                          type="button">
                    <i class="fas" [class.fa-chevron-down]="!eds.isPanelOpen(opt.id)"
                                   [class.fa-chevron-up]="eds.isPanelOpen(opt.id)"></i>
                    {{ eds.isPanelOpen(opt.id) ? 'Hide' : 'Show' }} specs
                  </button>
                  @if (eds.isPanelOpen(opt.id)) {
                    <div class="spec-panel">
                      <div class="spec-row">
                        <span>Source type</span><span>{{ opt.type | titlecase }}</span>
                      </div>
                      @if (opt.stats.wavelengthNm) {
                        <div class="spec-row">
                          <span>Central wavelength</span><span>{{ opt.stats.wavelengthNm }} nm</span>
                        </div>
                      }
                      <div class="spec-row">
                        <span>Output power</span>
                        <span>{{ opt.stats.powerMw >= 1000
                          ? (opt.stats.powerMw / 1000).toFixed(1) + ' W'
                          : opt.stats.powerMw + ' mW' }}</span>
                      </div>
                      <div class="spec-row">
                        <span>Linewidth</span>
                        <span>{{ opt.stats.linewidthMHz >= 1000
                          ? (opt.stats.linewidthMHz / 1000).toFixed(0) + ' GHz'
                          : opt.stats.linewidthMHz + ' MHz' }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- ── STEP 3: DETECTION ─────────────────────── -->
        @if (eds.currentStep() === 3) {
          <section
            class="step-section step-3-bg"
            wizardStep
            [stepIndex]="3"
            [stepDef]="steps[2]"
            #detectStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="detectStep.icon() + ' mr-3 text-primary-400'"></i>
                  Configure {{ detectStep.label() }}
                </h2>
                <p class="step-desc">
                  Select a detector and output format to complete your experiment configuration.
                </p>
              </div>
            </div>

            <!-- Detector cards -->
            <h3 class="sub-section-label">Detector</h3>
            <div class="options-grid">
              @for (opt of detectorOptions; track opt.id) {
                <div class="opt-card"
                     [class.selected]="eds.config().detector === opt.id"
                     (click)="eds.selectDetector(opt.id)"
                     role="button" tabindex="0"
                     (keydown.enter)="eds.selectDetector(opt.id)"
                     (keydown.space)="eds.selectDetector(opt.id)">
                  <div class="opt-card-header">
                    <i [class]="opt.icon + ' opt-icon'"></i>
                    <div class="opt-card-titles">
                      <span class="opt-name">{{ opt.name }}</span>
                      <span class="opt-tagline">{{ opt.tagline }}</span>
                    </div>
                    @if (eds.config().detector === opt.id) {
                      <i class="fas fa-circle-check opt-check"></i>
                    }
                  </div>
                  <p class="opt-desc">{{ opt.description }}</p>
                  <div class="opt-stats">
                    <div class="opt-stat-item">
                      <span class="stat-label">Efficiency</span>
                      <span class="stat-val">{{ opt.stats.qePct }}%</span>
                    </div>
                    <div class="opt-stat-item">
                      <span class="stat-label">Spectral range</span>
                      <span class="stat-val">{{ opt.stats.spectralRange }}</span>
                    </div>
                    <div class="opt-stat-item">
                      <span class="stat-label">Dynamic range</span>
                      <span class="stat-val">{{ opt.stats.dynamicRangeDb }} dB</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Output format -->
            <h3 class="sub-section-label" style="margin-top: 2.5rem">Output Format</h3>
            <div class="format-grid">
              @for (fmt of outputFormatOptions; track fmt.id) {
                <div class="format-card"
                     [class.selected]="eds.config().outputFormat === fmt.id"
                     (click)="eds.selectOutputFormat(fmt.id)"
                     role="button" tabindex="0"
                     (keydown.enter)="eds.selectOutputFormat(fmt.id)"
                     (keydown.space)="eds.selectOutputFormat(fmt.id)">
                  <i [class]="fmt.icon + ' fmt-icon'"></i>
                  <div class="fmt-texts">
                    <span class="fmt-name">{{ fmt.name }}</span>
                    <span class="fmt-ext">{{ fmt.extension }}</span>
                  </div>
                  <p class="fmt-desc">{{ fmt.description }}</p>
                  @if (eds.config().outputFormat === fmt.id) {
                    <i class="fas fa-circle-check opt-check fmt-check"></i>
                  }
                </div>
              }
            </div>
          </section>
        }
      </div>

      <!-- ══════════════════════════════════════════════
           STICKY BOTTOM NAV
      ══════════════════════════════════════════════ -->
      @if (!eds.isComplete()) {
      <div class="ed-bottom-bar">
        <div class="bottom-bar-inner">
          <div class="bottom-summary">
            @if (eds.hasConfigStarted()) {
              <i class="fas fa-flask mr-2 opacity-60"></i>
              <span>{{ eds.containmentName() || '—' }}</span>
              @if (eds.excitationName()) {
                <span class="summary-sep">·</span>
                <span>{{ eds.excitationName() }}</span>
              }
              @if (eds.detectorName()) {
                <span class="summary-sep">·</span>
                <span>{{ eds.detectorName() }}</span>
              }
            } @else {
              <span class="opacity-40">Configure your experiment above</span>
            }
          </div>

          <div class="bottom-actions">
            <button class="btn-back" (click)="eds.prevStep()" type="button"
                    [disabled]="eds.currentStep() === 1">
              <i class="fas fa-arrow-left mr-1.5"></i>Back
            </button>

            @if (eds.currentStep() < eds.totalSteps) {
              <button class="btn-continue" (click)="eds.nextStep()" type="button"
                      [disabled]="!eds.canAdvance()">
                Continue<i class="fas fa-arrow-right ml-1.5"></i>
              </button>
            } @else {
              <button class="btn-finish" (click)="eds.finish()" type="button"
                      [disabled]="!eds.canFinish()">
                <i class="fas fa-circle-check mr-1.5"></i>Save Configuration
              </button>
            }
          </div>
        </div>
      </div>
      }

      <!-- ══════════════════════════════════════════════
           RESULT STEP
      ══════════════════════════════════════════════ -->
      @if (eds.isComplete()) {
        <app-wizard-result
          [title]="eds.resultData().title"
          [description]="eds.resultData().description"
          [data]="eds.resultData()">
          <app-apparatus-preview [config]="eds.config()" [compact]="false" />
          <button resultActions class="btn-reset" (click)="eds.reset()" type="button">
            <i class="fas fa-rotate-left mr-1.5"></i>New Configuration
          </button>
        </app-wizard-result>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* ── Root layout ── */
    .ed-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--f-layer-0);
      padding-bottom: 80px; /* bottom bar height */
    }

    /* ── HUD ── */
    .ed-hud {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      border-bottom: 1px solid var(--f-stroke);
      @media (max-width: 767px)                         { padding: 0.5rem 1rem; flex-wrap: wrap; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 0.5rem 1.25rem; }
    }

    .hud-preview-wrap {
      flex-shrink: 0;
      width: 180px;
      @media (max-width: 767px)                         { display: none; }
      @media (min-width: 768px) and (max-width: 1023px) { width: 120px; }
    }

    .hud-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .hud-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .hud-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-family: 'Jura', sans-serif;
      letter-spacing: 0.04em;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-1);

      &.empty {
        opacity: 0.4;
        border-style: dashed;
      }
    }

    .hud-stats {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: var(--f-text-2);
      font-family: 'Jura', sans-serif;
    }

    .hud-stat { color: var(--f-text-1); }
    .hud-stat.wavelength { color: var(--f-accent); }
    .hud-sep { opacity: 0.4; }

    .hud-tabs {
      display: flex;
      gap: 0.25rem;
    }

    .hud-tab {
      display: flex;
      align-items: center;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--f-text-2);
      cursor: pointer;
      font-size: 0.8rem;
      font-family: 'Jura', sans-serif;
      transition: all 0.15s;

      &:hover { background: var(--f-layer-2); color: var(--f-text-1); }

      &.active {
        background: var(--f-layer-2);
        border-color: var(--f-stroke);
        color: var(--f-text-1);
      }

      &.done { color: #34d399; }
    }

    /* ── Body ── */
    .ed-body { flex: 1; }

    /* ── Step sections ── */
    .step-section {
      padding: 2.5rem 2rem 3rem;
      min-height: 100%;
      @media (max-width: 767px)                         { padding: 1.5rem 1rem 2rem; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 2rem 1.5rem 2.5rem; }
    }

    .step-1-bg { background: radial-gradient(ellipse at 20% 20%, rgba(125,211,252,0.05) 0%, transparent 60%); }
    .step-2-bg { background: radial-gradient(ellipse at 80% 10%, rgba(192,132,252,0.06) 0%, transparent 60%); }
    .step-3-bg { background: radial-gradient(ellipse at 50% 10%, rgba(251,191,36,0.05) 0%, transparent 60%); }

    .step-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .step-head-text { flex: 1; min-width: 0; }

    .step-title {
      font-family: 'Jura', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--f-text-1);
      letter-spacing: 0.04em;
      margin: 0 0 0.4rem;
    }

    .step-desc {
      font-size: 0.875rem;
      color: var(--f-text-2);
      margin: 0;
      max-width: 55ch;
      line-height: 1.6;
    }

    .step-head-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .qs-wrap {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      border-radius: 6px;
      padding: 0 0.75rem;
    }

    .qs-icon { font-size: 0.7rem; color: var(--f-accent); opacity: 0.8; }

    .qs-select {
      background: transparent;
      border: none;
      outline: none;
      color: var(--f-text-1);
      font-size: 0.8rem;
      font-family: 'Jura', sans-serif;
      padding: 0.45rem 0;
      cursor: pointer;
    }

    .sub-section-label {
      font-family: 'Jura', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--f-text-3);
      text-transform: uppercase;
      margin: 0 0 1rem;
    }

    /* ── Options grid ── */
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .opt-card {
      background: var(--f-layer-1);
      border: 1.5px solid var(--f-stroke);
      border-radius: 10px;
      padding: 1.25rem;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;

      &:hover {
        border-color: var(--f-accent);
        box-shadow: 0 0 0 1px rgba(125,211,252,0.15);
        transform: translateY(-1px);
      }

      &.selected {
        border-color: var(--f-accent);
        background: color-mix(in srgb, var(--f-accent) 8%, var(--f-layer-1));
        box-shadow: 0 0 0 1px var(--f-accent);
      }
    }

    .opt-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.6rem;
    }

    .opt-icon {
      font-size: 1.25rem;
      color: var(--f-accent);
      width: 1.5rem;
      text-align: center;
      flex-shrink: 0;
    }

    .opt-card-titles {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .opt-name {
      font-family: 'Jura', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--f-text-1);
      letter-spacing: 0.02em;
    }

    .opt-tagline {
      font-size: 0.75rem;
      color: var(--f-text-3);
      font-family: 'Jura', sans-serif;
    }

    .opt-check {
      font-size: 1rem;
      color: var(--f-accent);
      flex-shrink: 0;
    }

    .opt-desc {
      font-size: 0.8rem;
      color: var(--f-text-2);
      line-height: 1.55;
      margin: 0 0 0.75rem;
    }

    .opt-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .opt-stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding: 0.4rem 0.5rem;
      background: var(--f-layer-2);
      border-radius: 6px;
    }

    .stat-label {
      font-size: 0.65rem;
      color: var(--f-text-3);
      font-family: 'Jura', sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat-val {
      font-size: 0.78rem;
      color: var(--f-text-1);
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
    }

    /* ── Spec panel ── */
    .panel-toggle {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: var(--f-text-3);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: 'Jura', sans-serif;

      &:hover { color: var(--f-text-2); }
    }

    .spec-panel {
      margin-top: 0.6rem;
      border-top: 1px solid var(--f-stroke);
      padding-top: 0.6rem;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      font-size: 0.78rem;
      color: var(--f-text-2);
      border-bottom: 1px solid rgba(255,255,255,0.04);

      &:last-child { border-bottom: none; }

      & > span:first-child { color: var(--f-text-3); }
      & > span:last-child  { font-family: 'JetBrains Mono', monospace; color: var(--f-text-1); }
    }

    /* ── Output format grid ── */
    .format-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
    }

    .format-card {
      position: relative;
      background: var(--f-layer-1);
      border: 1.5px solid var(--f-stroke);
      border-radius: 10px;
      padding: 1rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: border-color 0.15s, box-shadow 0.15s;

      &:hover { border-color: var(--f-accent); }

      &.selected {
        border-color: var(--f-accent);
        background: color-mix(in srgb, var(--f-accent) 8%, var(--f-layer-1));
        box-shadow: 0 0 0 1px var(--f-accent);
      }
    }

    .fmt-icon {
      font-size: 1.1rem;
      color: var(--f-accent);
    }

    .fmt-texts {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .fmt-name {
      font-family: 'Jura', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--f-text-1);
    }

    .fmt-ext {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: var(--f-text-3);
    }

    .fmt-desc {
      font-size: 0.78rem;
      color: var(--f-text-2);
      line-height: 1.5;
      margin: 0;
    }

    .fmt-check {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    }

    /* ── Bottom bar ── */
    .ed-bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 40;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      border-top: 1px solid var(--f-stroke);
    }

    .bottom-bar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
    }

    .bottom-summary {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: var(--f-text-2);
      font-family: 'Jura', sans-serif;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .summary-sep { opacity: 0.4; }

    .bottom-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-back, .btn-continue, .btn-finish {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: 'Jura', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      border: none;

      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }

    .btn-back {
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-2);

      &:not(:disabled):hover { color: var(--f-text-1); background: var(--f-layer-1); }
    }

    .btn-continue {
      background: var(--f-accent);
      color: #000;

      &:not(:disabled):hover { opacity: 0.9; }
    }

    .btn-finish {
      background: #34d399;
      color: #000;

      &:not(:disabled):hover { opacity: 0.9; }
    }

    /* ── Completion modal ── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      backdrop-filter: blur(4px);
    }

    .modal-card {
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      border-radius: 14px;
      max-width: 680px;
      width: 100%;
      overflow: hidden;
    }

    .modal-schematic {
      background: var(--f-layer-0);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--f-stroke);
    }

    .modal-body { padding: 1.75rem 2rem 2rem; }

    .modal-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: rgba(52,211,153,0.12);
      border: 1px solid rgba(52,211,153,0.35);
      color: #34d399;
      font-size: 0.7rem;
      font-family: 'Jura', sans-serif;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }

    .modal-title {
      font-family: 'Jura', sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--f-text-1);
      letter-spacing: 0.04em;
      margin: 0 0 0.4rem;
    }

    .modal-subtitle {
      font-size: 0.85rem;
      color: var(--f-text-2);
      margin: 0 0 1.5rem;
    }

    .modal-summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
      margin-bottom: 1.75rem;
    }

    .modal-summary-row {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
      background: var(--f-layer-2);
      border-radius: 8px;
      border: 1px solid var(--f-stroke);
    }

    .modal-summary-label {
      font-size: 0.7rem;
      color: var(--f-text-3);
      font-family: 'Jura', sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .modal-summary-val {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--f-text-1);
      font-family: 'Jura', sans-serif;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: 'Jura', sans-serif;
      font-weight: 600;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-2);
      cursor: pointer;

      &:hover { color: var(--f-text-1); }
    }

    .btn-close-modal {
      display: inline-flex;
      align-items: center;
      padding: 0.55rem 1.5rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: 'Jura', sans-serif;
      font-weight: 700;
      background: var(--f-accent);
      border: none;
      color: #000;
      cursor: pointer;

      &:hover { opacity: 0.9; }
    }
  `],
})
export class ExperimentDesignerPage {
  protected readonly eds   = inject(ExperimentDesignerService);
  constructor() { inject(Title).setTitle('Experiment Designer — Waltkerovoz'); }
  protected readonly steps = WIZARD_STEPS;

  protected readonly containmentOptions  = CONTAINMENT_OPTIONS;
  protected readonly excitationOptions   = EXCITATION_OPTIONS;
  protected readonly detectorOptions     = DETECTOR_OPTIONS;
  protected readonly outputFormatOptions = OUTPUT_FORMAT_OPTIONS;
}
