import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { VehiclePreviewComponent } from './components/vehicle-preview.component.js';
import { GearBuilderService, WIZARD_STEPS } from './gear-builder.service.js';
import { WizardStepDirective, WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import {
  CHASSIS_OPTIONS, ENGINE_OPTIONS, COLOR_OPTIONS,
  RIM_OPTIONS, BODY_KIT_OPTIONS,
} from './gear-builder.mock.js';
import { buildSpokes } from './gear-builder.utils.js';

@Component({
  selector: 'app-gear-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, VehiclePreviewComponent, WizardStepDirective],
  providers: [{ provide: WIZARD_STEP_SERVICE, useExisting: GearBuilderService }],
  template: `
    <div class="gb-root">

      <!-- ══════════════════════════════════════════════
           STICKY HUD  (vehicle preview + step tabs)
      ══════════════════════════════════════════════ -->
      <div class="gb-hud">
        <div class="hud-preview-wrap">
          <app-vehicle-preview [build]="gb.build()" [compact]="true" class="hud-preview-svg" />
        </div>

        <div class="hud-info">
          <div class="hud-chips">
            @for (chip of gb.buildChips(); track chip.label) {
              <span class="hud-chip" [class.empty]="!chip.value">
                <i [class]="chip.icon + ' mr-1 opacity-70'"></i>
                {{ chip.value ?? chip.label }}
              </span>
            }
          </div>
          <div class="hud-stats">
            @if (gb.chassisStats()) {
              <span class="hud-stat" title="Curb weight">
                <i class="fas fa-weight-hanging mr-1 opacity-50"></i>{{ gb.chassisStats()!.weight.toLocaleString() }} kg
              </span>
              <span class="hud-sep">·</span>
              <span class="hud-stat" title="Passenger seats">{{ gb.chassisStats()!.seats }} seats</span>
            }
            @if (gb.engineStats()) {
              <span class="hud-sep">·</span>
              <span class="hud-stat power" title="Peak horsepower">{{ gb.engineStats()!.hp }} hp</span>
              <span class="hud-sep">·</span>
              <span class="hud-stat" title="Peak torque">{{ gb.engineStats()!.torqueNm }} Nm</span>
            }
          </div>
        </div>

        <div class="hud-tabs">
          @for (step of steps; track $index) {
            <button
              class="hud-tab"
              [class.active]="gb.currentStep() === $index + 1"
              [class.done]="$index + 1 < gb.currentStep()"
              (click)="gb.jumpToStep($index + 1)"
              type="button"
              [title]="step.sublabel">
              @if ($index + 1 < gb.currentStep()) {
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
      <div class="gb-body">

        <!-- ── STEP 1: CHASSIS ──────────────────────── -->
        @if (gb.currentStep() === 1) {
          <section
            class="step-section step-1-bg"
            wizardStep
            [stepIndex]="1"
            [stepDef]="steps[0]"
            #chassisStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="chassisStep.icon() + ' mr-3 text-primary-400'"></i>
                  Choose Your {{ chassisStep.label() }}
                </h2>
                <p class="step-desc">
                  The chassis defines your vehicle's fundamental DNA —
                  silhouette, weight, and aero character.
                </p>
              </div>
              <div class="step-head-actions">
                <div class="qs-wrap" title="Quickly jump to an option">
                  <i class="fas fa-bolt qs-icon"></i>
                  <select class="qs-select" (change)="gb.selectChassis($any($event.target).value)">
                    <option value="" [selected]="!gb.build().chassis">Jump to…</option>
                    @for (o of chassisOptions; track o.id) {
                      <option [value]="o.id" [selected]="gb.build().chassis === o.id">{{ o.name }}</option>
                    }
                  </select>
                </div>
                <button class="compare-btn" (click)="gb.openCompare('chassis')" type="button"
                        title="Compare all chassis side-by-side">
                  <i class="fas fa-table-cells mr-1.5"></i>Compare All
                </button>
              </div>
            </div>

            <div class="options-grid">
              @for (opt of chassisOptions; track opt.id) {
                <div class="opt-card" [class.selected]="gb.build().chassis === opt.id"
                     (click)="gb.selectChassis(opt.id)" role="button" tabindex="0"
                     (keydown.enter)="gb.selectChassis(opt.id)">
                  <div class="opt-sel-stripe" [class.on]="gb.build().chassis === opt.id"></div>
                  <div class="opt-top">
                    <div class="opt-icon" [class.active]="gb.build().chassis === opt.id">
                      <i [class]="opt.icon + ' text-2xl'"></i>
                    </div>
                    <div class="opt-name-block">
                      <span class="opt-name">{{ opt.name }}</span>
                      <span class="opt-tagline">{{ opt.tagline }}</span>
                    </div>
                    @if (gb.build().chassis === opt.id) {
                      <span class="selected-badge"><i class="fas fa-circle-check mr-1"></i>Selected</span>
                    }
                  </div>
                  <p class="opt-desc">{{ opt.description }}</p>
                  <div class="stats-row">
                    <div class="stat-pill" title="Curb weight — lighter is more agile">
                      <i class="fas fa-weight-hanging text-slate-400 text-xs"></i>
                      <span class="stat-num">{{ opt.stats.weight.toLocaleString() }}</span>
                      <span class="stat-lbl">kg</span>
                    </div>
                    <div class="stat-pill" title="Passenger seating capacity">
                      <i class="fas fa-users text-slate-400 text-xs"></i>
                      <span class="stat-num">{{ opt.stats.seats }}</span>
                      <span class="stat-lbl">seats</span>
                    </div>
                    <div class="stat-pill" title="Drag coefficient — lower means better aerodynamics">
                      <i class="fas fa-wind text-slate-400 text-xs"></i>
                      <span class="stat-num">{{ opt.stats.dragCoeff }}</span>
                      <span class="stat-lbl">Cd</span>
                    </div>
                  </div>
                  <button class="details-toggle" (click)="onTogglePanel($event, 'ch-' + opt.id)" type="button">
                    <span>{{ gb.isPanelOpen('ch-' + opt.id) ? 'Hide' : 'Show' }} full specs</span>
                    <i class="fas text-xs ml-1.5"
                       [class.fa-chevron-up]="gb.isPanelOpen('ch-' + opt.id)"
                       [class.fa-chevron-down]="!gb.isPanelOpen('ch-' + opt.id)"></i>
                  </button>
                  @if (gb.isPanelOpen('ch-' + opt.id)) {
                    <div class="specs-panel">
                      <table class="specs-tbl">
                        <tbody>
                          <tr><td>Body style</td><td>{{ opt.name }}</td></tr>
                          <tr><td>Curb weight</td><td>{{ opt.stats.weight.toLocaleString() }} kg</td></tr>
                          <tr><td>Seating capacity</td><td>{{ opt.stats.seats }} passengers</td></tr>
                          <tr><td>Drag coefficient (Cd)</td><td>{{ opt.stats.dragCoeff }}</td></tr>
                          <tr><td>Character</td><td>{{ opt.tagline }}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- ── STEP 2: ENGINE ───────────────────────── -->
        @if (gb.currentStep() === 2) {
          <section
            class="step-section step-2-bg"
            wizardStep
            [stepIndex]="2"
            [stepDef]="steps[1]"
            #engineStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="engineStep.icon() + ' mr-3 text-primary-400'"></i>
                  Select an {{ engineStep.label() }}
                </h2>
                <p class="step-desc">
                  Define the heart of your machine — from silent electric torque to thunderous V8 fury.
                </p>
              </div>
              <div class="step-head-actions">
                <div class="qs-wrap">
                  <i class="fas fa-bolt qs-icon"></i>
                  <select class="qs-select" (change)="gb.selectEngine($any($event.target).value)">
                    <option value="" [selected]="!gb.build().engine">Jump to…</option>
                    @for (o of engineOptions; track o.id) {
                      <option [value]="o.id" [selected]="gb.build().engine === o.id">{{ o.name }}</option>
                    }
                  </select>
                </div>
                <button class="compare-btn" (click)="gb.openCompare('engine')" type="button">
                  <i class="fas fa-table-cells mr-1.5"></i>Compare All
                </button>
              </div>
            </div>

            <div class="options-grid">
              @for (opt of engineOptions; track opt.id) {
                <div class="opt-card" [class.selected]="gb.build().engine === opt.id"
                     (click)="gb.selectEngine(opt.id)" role="button" tabindex="0"
                     (keydown.enter)="gb.selectEngine(opt.id)">
                  <div class="opt-sel-stripe" [class.on]="gb.build().engine === opt.id"
                       [style.background]="opt.accentColor"></div>
                  <div class="opt-top">
                    <div class="opt-icon engine-icon" [style.color]="opt.accentColor">
                      <i [class]="opt.icon + ' text-2xl'"></i>
                    </div>
                    <div class="opt-name-block">
                      <span class="opt-name">{{ opt.name }}</span>
                      <span class="opt-tagline">{{ opt.tagline }}</span>
                    </div>
                    <span class="fuel-badge" [class]="'fuel-' + opt.fuelType">
                      {{ opt.fuelType === 'electric' ? '⚡ EV' : opt.fuelType === 'diesel' ? '🛢 Diesel' : '⛽ Gas' }}
                    </span>
                  </div>
                  <div class="stats-row">
                    <div class="stat-pill" title="Peak horsepower measured at the crankshaft">
                      <i class="fas fa-gauge-high text-xs" [style.color]="opt.accentColor"></i>
                      <span class="stat-num" [style.color]="opt.accentColor">{{ opt.stats.hp }}</span>
                      <span class="stat-lbl">hp</span>
                    </div>
                    <div class="stat-pill" title="Peak torque in Newton-meters — determines acceleration feel">
                      <i class="fas fa-rotate text-slate-400 text-xs"></i>
                      <span class="stat-num">{{ opt.stats.torqueNm }}</span>
                      <span class="stat-lbl">Nm</span>
                    </div>
                    <div class="stat-pill"
                         [title]="opt.fuelType === 'electric' ? 'Miles per gallon equivalent' : 'Miles per gallon'">
                      <i class="fas fa-leaf text-slate-400 text-xs"></i>
                      <span class="stat-num">{{ opt.stats.efficiency }}</span>
                      <span class="stat-lbl">{{ opt.fuelType === 'electric' ? 'MPGe' : 'mpg' }}</span>
                    </div>
                  </div>
                  <button class="details-toggle" (click)="onTogglePanel($event, 'en-' + opt.id)" type="button">
                    <span>{{ gb.isPanelOpen('en-' + opt.id) ? 'Hide' : 'Show' }} full specs</span>
                    <i class="fas text-xs ml-1.5"
                       [class.fa-chevron-up]="gb.isPanelOpen('en-' + opt.id)"
                       [class.fa-chevron-down]="!gb.isPanelOpen('en-' + opt.id)"></i>
                  </button>
                  @if (gb.isPanelOpen('en-' + opt.id)) {
                    <div class="specs-panel">
                      <table class="specs-tbl">
                        <tbody>
                          <tr><td>Engine type</td><td>{{ opt.name }}</td></tr>
                          <tr><td>Fuel type</td><td style="text-transform:capitalize">{{ opt.fuelType }}</td></tr>
                          <tr><td>Peak horsepower</td><td>{{ opt.stats.hp }} hp</td></tr>
                          <tr><td>Peak torque</td><td>{{ opt.stats.torqueNm }} Nm</td></tr>
                          <tr><td>Fuel efficiency</td><td>{{ opt.stats.efficiency }} {{ opt.fuelType === 'electric' ? 'MPGe' : 'mpg' }}</td></tr>
                          <tr><td>Character</td><td>{{ opt.tagline }}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }

        <!-- ── STEP 3: STYLING ──────────────────────── -->
        @if (gb.currentStep() === 3) {
          <section
            class="step-section step-3-bg"
            wizardStep
            [stepIndex]="3"
            [stepDef]="steps[2]"
            #stylingStep="wizardStep">

            <div class="step-head">
              <div class="step-head-text">
                <h2 class="step-title">
                  <i [class]="stylingStep.icon() + ' mr-3 text-primary-400'"></i>
                  {{ stylingStep.label() }} Your Build
                </h2>
                <p class="step-desc">Finish line. Choose paint, wheels, and body kit to complete your build.</p>
              </div>
            </div>

            <!-- Color -->
            <div class="style-block">
              <div class="style-block-head">
                <h3 class="style-block-title"><i class="fas fa-droplet mr-2 text-slate-400"></i>Paint Color</h3>
                <button class="compare-btn" (click)="gb.openCompare('color')" type="button">
                  <i class="fas fa-table-cells mr-1.5"></i>Compare
                </button>
              </div>
              <div class="color-grid">
                @for (c of colorOptions; track c.id) {
                  <button class="color-card" [class.selected]="gb.build().color === c.id"
                          (click)="gb.selectColor(c.id)"
                          [title]="c.name + (c.metallic ? ' — Metallic finish' : ' — Solid finish')"
                          type="button">
                    <div class="color-swatch" [style.background]="c.hex"></div>
                    <div class="color-meta">
                      <span class="color-name">{{ c.name }}</span>
                      @if (c.metallic) { <span class="metallic-tag">✦ Metallic</span> }
                    </div>
                    @if (gb.build().color === c.id) {
                      <i class="fas fa-circle-check text-primary-400 text-sm shrink-0"></i>
                    }
                  </button>
                }
              </div>
            </div>

            <!-- Rims -->
            <div class="style-block">
              <div class="style-block-head">
                <h3 class="style-block-title"><i class="fas fa-circle-dot mr-2 text-slate-400"></i>Wheels &amp; Rims</h3>
                <button class="compare-btn" (click)="gb.openCompare('rim')" type="button">
                  <i class="fas fa-table-cells mr-1.5"></i>Compare
                </button>
              </div>
              <div class="rim-grid">
                @for (r of rimOptions; track r.id) {
                  <button class="rim-card" [class.selected]="gb.build().rim === r.id"
                          (click)="gb.selectRim(r.id)" type="button"
                          [title]="r.name + ' — ' + r.description">
                    <svg viewBox="-24 -24 48 48" class="rim-svg">
                      <circle r="23" fill="#1c1c1c"/>
                      <circle r="16.5" [attr.fill]="r.hubColor"/>
                      @for (s of rimSpokeMap.get(r.id)!; track $index) {
                        <line [attr.x1]="s.x1" [attr.y1]="s.y1" [attr.x2]="s.x2" [attr.y2]="s.y2"
                              [attr.stroke]="r.spokeColor" [attr.stroke-width]="r.spokeWidth"
                              stroke-linecap="round"/>
                      }
                      <circle r="3.5" fill="#0f172a"/>
                      <circle r="1.5" fill="#64748b"/>
                    </svg>
                    <span class="rim-name">{{ r.name }}</span>
                    <span class="rim-desc">{{ r.description }}</span>
                    <span class="rim-spokes">{{ r.spokeCount }}-spoke</span>
                    @if (gb.build().rim === r.id) {
                      <i class="fas fa-circle-check text-primary-400 text-xs absolute top-2 right-2"></i>
                    }
                  </button>
                }
              </div>
            </div>

            <!-- Body kit -->
            <div class="style-block">
              <div class="style-block-head">
                <h3 class="style-block-title"><i class="fas fa-rocket mr-2 text-slate-400"></i>Body Kit</h3>
              </div>
              <div class="kit-grid">
                @for (k of kitOptions; track k.id) {
                  <button class="kit-card" [class.selected]="gb.build().bodyKit === k.id"
                          (click)="gb.selectBodyKit(k.id)" type="button"
                          [title]="k.name + ' — ' + k.description">
                    <i [class]="k.icon + ' text-3xl mb-2 text-primary-400'"></i>
                    <span class="kit-name">{{ k.name }}</span>
                    <span class="kit-desc">{{ k.description }}</span>
                    @if (k.adds.length) {
                      <div class="kit-adds">
                        @for (a of k.adds; track a) { <span class="add-chip">{{ a }}</span> }
                      </div>
                    }
                    @if (gb.build().bodyKit === k.id) {
                      <i class="fas fa-circle-check text-primary-400 text-xs absolute top-2 right-2"></i>
                    }
                  </button>
                }
              </div>
            </div>
          </section>
        }

      </div><!-- /gb-body -->

      <!-- ══════════════════════════════════════════════
           STICKY BOTTOM NAV BAR
      ══════════════════════════════════════════════ -->
      <div class="gb-bottom">
        <button class="btn-back" [disabled]="gb.currentStep() === 1" (click)="gb.prevStep()" type="button">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>

        <div class="bottom-summary">
          @for (chip of gb.buildChips(); track chip.label) {
            @if (chip.value) {
              <span class="sum-chip">
                <i [class]="chip.icon + ' mr-1 opacity-60'"></i>{{ chip.value }}
              </span>
            }
          }
          @if (!gb.hasBuildStarted()) {
            <span class="sum-empty">Make your first selection above</span>
          }
        </div>

        @if (gb.currentStep() < gb.totalSteps) {
          <button class="btn-next" [disabled]="!gb.canAdvance()" (click)="gb.nextStep()" type="button">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="btn-finish" [disabled]="!gb.canFinish()" (click)="gb.finish()" type="button">
            <i class="fas fa-flag-checkered mr-2"></i>Finish Build
          </button>
        }
      </div>

      <!-- ══════════════════════════════════════════════
           COMPARE MODAL
      ══════════════════════════════════════════════ -->
      @if (gb.compareOpen()) {
        <div class="modal-backdrop" (click)="gb.closeCompare()" (keydown.escape)="gb.closeCompare()" tabindex="-1">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">
                <i class="fas fa-table-cells mr-2 text-primary-400"></i>
                Compare {{ gb.compareTitle() }}
              </h2>
              <button class="modal-close" (click)="gb.closeCompare()" type="button">
                <i class="fas fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              @if (gb.compareTarget() === 'chassis') {
                <table class="cmp-table">
                  <thead><tr>
                    <th>Spec</th>
                    @for (o of chassisOptions; track o.id) {
                      <th [class.current]="gb.build().chassis === o.id">
                        {{ o.name }}
                        @if (gb.build().chassis === o.id) { <span class="cmp-badge">✓ Selected</span> }
                      </th>
                    }
                  </tr></thead>
                  <tbody>
                    <tr><td>Character</td>@for (o of chassisOptions; track o.id) { <td [class.current]="gb.build().chassis === o.id">{{ o.tagline }}</td> }</tr>
                    <tr><td>Weight (kg)</td>@for (o of chassisOptions; track o.id) { <td [class.current]="gb.build().chassis === o.id">{{ o.stats.weight.toLocaleString() }}</td> }</tr>
                    <tr><td>Seats</td>@for (o of chassisOptions; track o.id) { <td [class.current]="gb.build().chassis === o.id">{{ o.stats.seats }}</td> }</tr>
                    <tr><td>Drag (Cd)</td>@for (o of chassisOptions; track o.id) { <td [class.current]="gb.build().chassis === o.id">{{ o.stats.dragCoeff }}</td> }</tr>
                  </tbody>
                </table>
              }
              @if (gb.compareTarget() === 'engine') {
                <table class="cmp-table">
                  <thead><tr>
                    <th>Spec</th>
                    @for (o of engineOptions; track o.id) {
                      <th [class.current]="gb.build().engine === o.id">
                        {{ o.name }}
                        @if (gb.build().engine === o.id) { <span class="cmp-badge">✓ Selected</span> }
                      </th>
                    }
                  </tr></thead>
                  <tbody>
                    <tr><td>Character</td>@for (o of engineOptions; track o.id) { <td [class.current]="gb.build().engine === o.id">{{ o.tagline }}</td> }</tr>
                    <tr><td>Fuel type</td>@for (o of engineOptions; track o.id) { <td [class.current]="gb.build().engine === o.id" style="text-transform:capitalize">{{ o.fuelType }}</td> }</tr>
                    <tr><td>Horsepower</td>@for (o of engineOptions; track o.id) { <td [class.current]="gb.build().engine === o.id">{{ o.stats.hp }} hp</td> }</tr>
                    <tr><td>Torque (Nm)</td>@for (o of engineOptions; track o.id) { <td [class.current]="gb.build().engine === o.id">{{ o.stats.torqueNm }}</td> }</tr>
                    <tr><td>Efficiency</td>@for (o of engineOptions; track o.id) { <td [class.current]="gb.build().engine === o.id">{{ o.stats.efficiency }} {{ o.fuelType === 'electric' ? 'MPGe' : 'mpg' }}</td> }</tr>
                  </tbody>
                </table>
              }
              @if (gb.compareTarget() === 'color') {
                <table class="cmp-table">
                  <thead><tr>
                    <th>Property</th>
                    @for (c of colorOptions; track c.id) {
                      <th [class.current]="gb.build().color === c.id">
                        <span class="inline-swatch" [style.background]="c.hex"></span>{{ c.name }}
                        @if (gb.build().color === c.id) { <span class="cmp-badge">✓</span> }
                      </th>
                    }
                  </tr></thead>
                  <tbody>
                    <tr><td>Finish</td>@for (c of colorOptions; track c.id) { <td [class.current]="gb.build().color === c.id">{{ c.metallic ? 'Metallic ✦' : 'Solid' }}</td> }</tr>
                  </tbody>
                </table>
              }
              @if (gb.compareTarget() === 'rim') {
                <table class="cmp-table">
                  <thead><tr>
                    <th>Property</th>
                    @for (r of rimOptions; track r.id) {
                      <th [class.current]="gb.build().rim === r.id">
                        {{ r.name }}
                        @if (gb.build().rim === r.id) { <span class="cmp-badge">✓</span> }
                      </th>
                    }
                  </tr></thead>
                  <tbody>
                    <tr><td>Description</td>@for (r of rimOptions; track r.id) { <td [class.current]="gb.build().rim === r.id">{{ r.description }}</td> }</tr>
                    <tr><td>Spokes</td>@for (r of rimOptions; track r.id) { <td [class.current]="gb.build().rim === r.id">{{ r.spokeCount }}</td> }</tr>
                    <tr><td>Spoke width</td>@for (r of rimOptions; track r.id) { <td [class.current]="gb.build().rim === r.id">{{ r.spokeWidth }} px</td> }</tr>
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════
           COMPLETION MODAL
      ══════════════════════════════════════════════ -->
      @if (gb.isComplete()) {
        <div class="modal-backdrop">
          <div class="complete-modal">
            <div class="trophy">🏆</div>
            <h2 class="complete-title">Your Build is Complete!</h2>
            <p class="complete-sub">{{ gb.chassisName() }} · {{ gb.engineName() }} · {{ gb.colorName() }}</p>
            <table class="cmp-table complete-summary-table">
              <tbody>
                <tr><td>Chassis</td><td>{{ gb.chassisName() }}</td></tr>
                <tr><td>Engine</td><td>{{ gb.engineName() }}</td></tr>
                <tr><td>Color</td><td>{{ gb.colorName() }}</td></tr>
                <tr><td>Horsepower</td><td>{{ gb.engineStats()?.hp }} hp</td></tr>
                <tr><td>Torque</td><td>{{ gb.engineStats()?.torqueNm }} Nm</td></tr>
                <tr><td>Weight</td><td>{{ gb.chassisStats()?.weight?.toLocaleString() }} kg</td></tr>
                <tr><td>Seats</td><td>{{ gb.chassisStats()?.seats }}</td></tr>
              </tbody>
            </table>
            <button class="btn-back mt-2" (click)="gb.reset()" type="button">
              <i class="fas fa-rotate-left mr-2"></i>Start Over
            </button>
          </div>
        </div>
      }

    </div><!-- /gb-root -->
  `,
  styles: [`
    /* ══ ROOT ══ */
    .gb-root {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: var(--f-layer-0);
      position: relative;
      padding-bottom: 64px;
    }

    /* ══ HUD (acrylic command bar) ══ */
    .gb-hud {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 8px 32px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.5);
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.5);
      border-bottom: 1px solid var(--f-stroke);
    }
    @media (max-width: 767px) {
      .gb-hud { padding: 6px 12px; gap: 8px; }
      .hud-preview-wrap { display: none; }
    }
    @media (min-width: 768px) and (max-width: 1023px) { .gb-hud { padding: 8px 20px; } }
    .hud-preview-wrap { flex-shrink: 0; width: 112px; }
    .hud-preview-svg  { display: block; }
    .hud-info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
    .hud-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .hud-chip {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      padding: 2px 10px;
      border-radius: 4px;
      background: var(--f-layer-2);
      color: var(--f-text-1);
      border: 1px solid var(--f-stroke);
      &.empty { color: var(--f-text-3); background: transparent; }
    }
    .hud-stats { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 12px; color: var(--f-text-2); }
    .hud-stat  { font-variant-numeric: tabular-nums; }
    .hud-stat.power { color: var(--f-accent-light); font-weight: 600; }
    .hud-sep   { color: var(--f-stroke-sd); }

    /* Step tabs — WinUI pivot style */
    .hud-tabs { display: flex; align-items: center; gap: 0; flex-shrink: 0; border-bottom: 1px solid var(--f-stroke); }
    .hud-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 400;
      color: var(--f-text-2);
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: color 150ms var(--f-ease), border-color 150ms var(--f-ease);
      margin-bottom: -1px;
      &.active {
        color: var(--f-text-1);
        font-weight: 600;
        border-bottom-color: var(--f-accent);
      }
      &.done { color: var(--f-accent-light); }
      &:hover:not(.active) { color: var(--f-text-1); background: rgba(255,255,255,0.04); }
    }
    .hud-tab-label { @apply hidden sm:inline; }

    /* ══ BODY ══ */
    .gb-body { flex: 1; }

    .step-section {
      padding: 40px 32px 40px;
      min-height: 100vh;
      @apply lg:px-16;
      animation: gbStepIn 200ms var(--f-ease);
    }
    @keyframes gbStepIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    /* Subtle top accent per step */
    .step-1-bg { background: linear-gradient(180deg, rgba(0,120,212,0.06) 0%, transparent 320px); }
    .step-2-bg { background: linear-gradient(180deg, rgba(135,100,184,0.06) 0%, transparent 320px); }
    .step-3-bg { background: linear-gradient(180deg, rgba(0,120,212,0.04) 0%, transparent 320px); }

    /* ══ STEP HEADER ══ */
    .step-head {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 28px;
      @apply sm:flex-row sm:items-end sm:justify-between;
    }
    .step-head-text { display: flex; flex-direction: column; gap: 6px; }
    .step-title {
      font-size: 28px;
      font-weight: 600;
      color: var(--f-text-1);
      margin: 0;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      i { color: var(--f-accent-light); margin-right: 12px; font-size: 22px; }
    }
    .step-desc { font-size: 14px; color: var(--f-text-2); margin: 0; max-width: 560px; line-height: 1.5; }
    .step-head-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }

    /* Quick-select combo box */
    .qs-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 10px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      border-radius: 4px;
      transition: border-color 150ms var(--f-ease);
      &:focus-within { border-color: var(--f-accent); }
    }
    .qs-icon   { font-size: 11px; color: var(--f-accent-light); }
    .qs-select {
      background: transparent;
      color: var(--f-text-1);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      border: none;
      option { background: #2C2C2C; color: var(--f-text-1); }
    }

    /* Secondary command button */
    .compare-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 14px;
      font-size: 13px;
      font-weight: 400;
      color: var(--f-text-1);
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      border-radius: 4px;
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      &:hover { background: var(--f-layer-2); }
    }

    /* ══ OPTIONS GRID ══ */
    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      @apply sm:grid-cols-2 xl:grid-cols-4;
    }

    .opt-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      user-select: none;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease), box-shadow 150ms var(--f-ease);
      &:hover    { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.selected {
        background: var(--f-layer-2);
        border-color: var(--f-accent);
        box-shadow: inset 0 0 0 1px rgba(0,120,212,0.30);
      }
      &:focus { outline: 2px solid var(--f-accent); outline-offset: 2px; }
    }
    /* Left accent bar replaces stripe */
    .opt-sel-stripe {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      border-radius: 0;
      background: var(--f-accent);
      opacity: 0;
      transition: opacity 150ms var(--f-ease);
      &.on { opacity: 1; }
    }
    .opt-top        { display: flex; align-items: flex-start; gap: 12px; }
    .opt-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      color: var(--f-text-2);
      flex-shrink: 0;
      transition: background 150ms var(--f-ease), color 150ms var(--f-ease);
      &.active { background: rgba(0,120,212,0.20); color: var(--f-accent-light); }
    }
    .engine-icon { background: rgba(255,255,255,0.06); }
    .opt-name-block { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .opt-name    { color: var(--f-text-1); font-weight: 600; font-size: 14px; line-height: 1.3; }
    .opt-tagline { color: var(--f-accent-light); font-size: 12px; font-weight: 400; }
    .selected-badge {
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--f-accent-light);
      background: rgba(0,120,212,0.16);
      border: 1px solid rgba(0,120,212,0.30);
      padding: 2px 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .opt-desc { font-size: 12px; color: var(--f-text-2); line-height: 1.5; margin: 0; }

    .stats-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--f-stroke);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: default;
    }
    .stat-num { font-weight: 600; color: var(--f-text-1); font-variant-numeric: tabular-nums; }
    .stat-lbl { color: var(--f-text-3); }

    .fuel-badge {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .fuel-electric { background: rgba(0,120,212,0.15); color: #60CDFF; border: 1px solid rgba(0,120,212,0.30); }
    .fuel-gasoline  { background: rgba(202,80,16,0.15); color: #FC9352; border: 1px solid rgba(202,80,16,0.30); }
    .fuel-diesel    { background: rgba(135,100,9,0.15); color: #FCD116; border: 1px solid rgba(135,100,9,0.30); }

    .details-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-size: 12px;
      color: var(--f-text-3);
      padding-top: 10px;
      border-top: 1px solid var(--f-stroke);
      margin-top: 4px;
      cursor: pointer;
      background: none;
      border-left: none;
      border-right: none;
      border-bottom: none;
      transition: color 150ms var(--f-ease);
      &:hover { color: var(--f-text-1); }
    }
    .specs-panel {
      margin-top: 4px;
      border-radius: 4px;
      background: rgba(0,0,0,0.20);
      border: 1px solid var(--f-stroke);
      overflow: hidden;
      animation: panelIn 150ms var(--f-ease);
    }
    @keyframes panelIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .specs-tbl {
      width: 100%;
      font-size: 12px;
      border-collapse: collapse;
      td {
        padding: 7px 12px;
        border-bottom: 1px solid var(--f-stroke);
        color: var(--f-text-2);
      }
      td:first-child { color: var(--f-text-3); width: 40%; }
      td:last-child  { color: var(--f-text-1); font-weight: 500; }
      tr:last-child td { border-bottom: none; }
    }

    /* ══ STYLING STEP ══ */
    .style-block { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
    .style-block-head { display: flex; align-items: center; justify-content: space-between; }
    .style-block-title {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      color: var(--f-text-1);
      margin: 0;
      i { color: var(--f-text-3); margin-right: 8px; }
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      @apply sm:grid-cols-3 lg:grid-cols-6;
    }
    .color-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 4px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      text-align: left;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      &:hover:not(.selected) { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.selected { border-color: var(--f-accent); box-shadow: inset 0 0 0 1px rgba(0,120,212,0.25); }
    }
    .color-swatch  { width: 28px; height: 28px; border-radius: 4px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.25); }
    .color-meta    { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .color-name    { font-size: 12px; font-weight: 500; color: var(--f-text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .metallic-tag  { font-size: 11px; color: #FCD116; }

    .rim-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      @apply sm:grid-cols-4;
    }
    .rim-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      text-align: center;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease), box-shadow 150ms var(--f-ease);
      &:hover:not(.selected) { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.selected { border-color: var(--f-accent); box-shadow: inset 0 0 0 1px rgba(0,120,212,0.20); }
    }
    .rim-svg    { width: 72px; height: 72px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5)); }
    .rim-name   { font-size: 12px; font-weight: 600; color: var(--f-text-1); }
    .rim-desc   { font-size: 11px; color: var(--f-text-3); line-height: 1.3; }
    .rim-spokes { font-size: 11px; color: var(--f-text-3); }

    .kit-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      @apply sm:grid-cols-4;
    }
    .kit-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 20px 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      text-align: center;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      i { color: var(--f-accent-light); }
      &:hover:not(.selected) { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.selected { border-color: var(--f-accent); background: rgba(0,120,212,0.10); }
    }
    .kit-name { font-size: 14px; font-weight: 600; color: var(--f-text-1); }
    .kit-desc  { font-size: 12px; color: var(--f-text-2); line-height: 1.4; }
    .kit-adds  { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-top: 4px; }
    .add-chip  {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(16,137,62,0.15);
      color: #54C472;
      border: 1px solid rgba(16,137,62,0.25);
    }

    /* ══ BOTTOM COMMAND BAR ══ */
    .gb-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 32px;
      @media (max-width: 767px) { padding: 8px 12px; gap: 6px; flex-wrap: wrap; }
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-top: 1px solid var(--f-stroke);
    }
    .bottom-summary { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; overflow: hidden; font-size: 12px; }
    .sum-chip {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      height: 24px;
      padding: 0 10px;
      border-radius: 4px;
      background: var(--f-layer-2);
      color: var(--f-text-1);
      border: 1px solid var(--f-stroke);
    }
    .sum-empty { font-size: 12px; color: var(--f-text-3); font-style: italic; }

    /* WinUI-style buttons */
    .btn-back, .btn-next, .btn-finish {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      height: 32px;
      padding: 0 20px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 400;
      font-family: inherit;
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      &:disabled { opacity: 0.36; cursor: not-allowed; }
    }
    .btn-back {
      background: rgba(255,255,255,0.06);
      color: var(--f-text-1);
      border: 1px solid var(--f-stroke-sd);
      &:hover:not(:disabled) { background: rgba(255,255,255,0.10); }
    }
    .btn-next {
      background: var(--f-accent);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.08);
      font-weight: 600;
      &:hover:not(:disabled) { background: var(--f-accent-hover); }
      &:active:not(:disabled) { background: var(--f-accent-press); }
    }
    .btn-finish {
      background: #22c55e;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.08);
      font-weight: 600;
      &:hover:not(:disabled) { background: #16a34a; }
    }

    /* ══ MODALS (Fluent dialog) ══ */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.56);
      backdrop-filter: blur(8px);
    }
    .modal-box {
      display: flex;
      flex-direction: column;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      border-radius: 8px;
      width: 100%;
      max-width: 860px;
      max-height: 85vh;
      overflow: hidden;
      box-shadow: var(--f-shadow-16);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--f-stroke);
    }
    .modal-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: var(--f-text-1);
      margin: 0;
      i { color: var(--f-accent-light); margin-right: 10px; }
    }
    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      color: var(--f-text-2);
      cursor: pointer;
      transition: background 150ms var(--f-ease), color 150ms var(--f-ease);
      &:hover { background: rgba(255,255,255,0.06); color: var(--f-text-1); }
    }
    .modal-body { overflow: auto; padding: 20px; }

    /* Compare table */
    .cmp-table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
      th {
        text-align: left;
        padding: 10px 14px;
        color: var(--f-text-2);
        font-weight: 600;
        font-size: 12px;
        background: rgba(0,0,0,0.20);
        border-bottom: 1px solid var(--f-stroke);
        white-space: nowrap;
        &.current { color: var(--f-accent-light); background: rgba(0,120,212,0.12); }
      }
      td {
        padding: 9px 14px;
        color: var(--f-text-2);
        border-bottom: 1px solid var(--f-stroke);
        &:first-child { color: var(--f-text-3); font-weight: 500; }
        &.current { color: var(--f-text-1); background: rgba(0,120,212,0.07); }
      }
      tr:last-child td { border-bottom: none; }
    }
    .cmp-badge { margin-left: 6px; font-size: 11px; color: var(--f-accent-light); font-weight: 400; }
    .inline-swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; border: 1px solid rgba(0,0,0,0.25); }

    /* Completion modal */
    .complete-modal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke-sd);
      border-radius: 8px;
      padding: 32px;
      width: 100%;
      max-width: 400px;
      box-shadow: var(--f-shadow-16);
      text-align: center;
    }
    .trophy         { font-size: 48px; }
    .complete-title { font-size: 20px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .complete-sub   { font-size: 13px; color: var(--f-text-2); margin: 0; }
    .complete-summary-table { width: 100%; margin-top: 8px; }
  `],
})
export class GearBuilderPage {
  protected readonly gb    = inject(GearBuilderService);
  constructor() { inject(Title).setTitle('Gear Builder — Waltkerovoz'); }
  protected readonly steps = WIZARD_STEPS;

  // ── Static option lists (template-only data, not state) ─────────────────────
  protected readonly chassisOptions = CHASSIS_OPTIONS;
  protected readonly engineOptions  = ENGINE_OPTIONS;
  protected readonly colorOptions   = COLOR_OPTIONS;
  protected readonly rimOptions     = RIM_OPTIONS;
  protected readonly kitOptions     = BODY_KIT_OPTIONS;

  // ── Panel toggle (stops propagation before delegating to service) ───────────
  protected onTogglePanel(event: Event, key: string): void {
    event.stopPropagation();
    this.gb.togglePanel(key);
  }

  // Precomputed once per rim option — avoids recalculating on every change-detection cycle.
  protected readonly rimSpokeMap = new Map(
    RIM_OPTIONS.map(r => [r.id, buildSpokes(r.spokeCount, 3.5, 16)])
  );

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.gb.compareOpen()) this.gb.closeCompare();
  }
}
