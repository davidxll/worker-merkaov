import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { WizardStepDirective } from '../../shared/wizard-step.directive.js';
import {
  ElementExplorerService, ELEMENT_EXPLORER_WIZARD_PROVIDER, WIZARD_STEPS,
} from './element-explorer.service.js';
import { LAYOUT_OPTIONS, COLOR_OPTIONS, DETAIL_OPTIONS, FILTER_OPTIONS } from './element-explorer.mock.js';
import type { ChemElement } from './element-explorer.types.js';
import { ElementTableComponent } from './components/element-table.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';

@Component({
  selector: 'app-element-explorer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ELEMENT_EXPLORER_WIZARD_PROVIDER],
  imports: [CommonModule, WizardStepDirective, ElementTableComponent, WizardResultComponent],
  template: `
    <!-- ── Sticky HUD ─────────────────────────────────────────────────────── -->
    <header class="hud">
      <!-- Mini periodic table SVG preview -->
      <div class="hud-preview" aria-hidden="true">
        <svg [attr.viewBox]="'0 0 252 166'" class="pt-svg">
          <!-- Main table elements -->
          @for (el of svc.allElements; track el.number) {
            <rect
              [attr.x]="svc.getSvgX(el)"
              [attr.y]="svc.getSvgY(el)"
              width="12" height="14" rx="1"
              [attr.fill]="svc.config().colorScheme
                ? svc.getElementColor(el, svc.config().colorScheme!)
                : '#334155'"
              [attr.opacity]="isFiltered(el) ? 1 : 0.15" />
          }
          <!-- f-block gap line -->
          <line x1="0" y1="118" x2="252" y2="118" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        </svg>
      </div>

      <!-- Config chips -->
      <div class="hud-chips">
        @for (chip of svc.configChips(); track chip.label) {
          <div class="hud-chip" [class.hud-chip--set]="chip.value !== null">
            <i [class]="chip.icon + ' chip-icon'" aria-hidden="true"></i>
            <span class="chip-val">{{ chip.value ?? chip.label }}</span>
          </div>
        }
      </div>

      <!-- Step tabs -->
      <nav class="hud-steps" aria-label="Wizard steps">
        @for (step of WIZARD_STEPS; track step.label; let i = $index) {
          <div
            wizardStep
            [stepIndex]="i + 1"
            [stepDef]="step"
            #ws="wizardStep">
            <button
              class="step-tab"
              [class.step-tab--active]="ws.isActive()"
              [class.step-tab--done]="ws.isDone()"
              [disabled]="!ws.isReachable()"
              (click)="svc.jumpToStep(i + 1)"
              [attr.aria-label]="ws.label() + ': ' + ws.sublabel()">
              <span class="step-num">
                @if (ws.isDone()) {
                  <i class="fas fa-check" aria-hidden="true"></i>
                } @else {
                  {{ i + 1 }}
                }
              </span>
              <span class="step-meta">
                <span class="step-label">{{ ws.label() }}</span>
                <span class="step-sub">{{ ws.sublabel() }}</span>
              </span>
            </button>
          </div>
        }
      </nav>
    </header>

    <!-- ── Wizard steps (hidden once complete) ───────────────────────────── -->
    @if (!svc.isComplete()) {

    <!-- ── Step 1: Layout ─────────────────────────────────────────────────── -->
    @if (svc.currentStep() === 1) {
      <section class="step-section" id="main-content">
        <div class="step-header">
          <h2 class="step-title">
            <i class="fas fa-table-cells-large" aria-hidden="true"></i>
            Choose a Layout
          </h2>
          <p class="step-desc">How do you want the elements arranged?</p>
        </div>
        <div class="option-grid option-grid--2">
          @for (opt of LAYOUT_OPTIONS; track opt.id) {
            <button
              class="option-card"
              [class.option-card--selected]="svc.config().layout === opt.id"
              (click)="svc.selectLayout(opt.id)">
              <span class="opt-icon-wrap">
                <i [class]="opt.icon + ' opt-icon'" aria-hidden="true"></i>
              </span>
              <span class="opt-body">
                <span class="opt-name">{{ opt.name }}</span>
                <span class="opt-desc">{{ opt.description }}</span>
              </span>
              @if (svc.config().layout === opt.id) {
                <span class="opt-check"><i class="fas fa-circle-check" aria-hidden="true"></i></span>
              }
            </button>
          }
        </div>
      </section>
    }

    <!-- ── Step 2: Color Scheme ───────────────────────────────────────────── -->
    @if (svc.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">
            <i class="fas fa-palette" aria-hidden="true"></i>
            Pick a Color Scheme
          </h2>
          <p class="step-desc">Choose what property each colour communicates.</p>
        </div>
        <div class="option-grid option-grid--1">
          @for (opt of COLOR_OPTIONS; track opt.id) {
            <button
              class="option-card option-card--color"
              [class.option-card--selected]="svc.config().colorScheme === opt.id"
              (click)="svc.selectColorScheme(opt.id)">
              <span class="opt-icon-wrap">
                <i [class]="opt.icon + ' opt-icon'" aria-hidden="true"></i>
              </span>
              <span class="opt-body">
                <span class="opt-name">{{ opt.name }}</span>
                <span class="opt-desc">{{ opt.description }}</span>
                <!-- Colour swatch strip -->
                <span class="swatch-row">
                  @for (s of opt.swatches; track s) {
                    <span class="swatch" [style.background]="s"></span>
                  }
                </span>
              </span>
              @if (svc.config().colorScheme === opt.id) {
                <span class="opt-check"><i class="fas fa-circle-check" aria-hidden="true"></i></span>
              }
            </button>
          }
        </div>
      </section>
    }

    <!-- ── Step 3: Detail Level ───────────────────────────────────────────── -->
    @if (svc.currentStep() === 3) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">
            <i class="fas fa-list" aria-hidden="true"></i>
            How Much Detail?
          </h2>
          <p class="step-desc">Control the information density of each element cell.</p>
        </div>
        <div class="option-grid option-grid--3">
          @for (opt of DETAIL_OPTIONS; track opt.id) {
            <button
              class="option-card option-card--detail"
              [class.option-card--selected]="svc.config().detailLevel === opt.id"
              (click)="svc.selectDetailLevel(opt.id)">
              <!-- Live cell preview -->
              <span class="cell-preview"
                    [class.cell-preview--sym]="opt.id === 'symbol'"
                    [class.cell-preview--std]="opt.id === 'standard'"
                    [class.cell-preview--full]="opt.id === 'full'">
                @if (opt.lines.length >= 4) {
                  <span class="cp-num">{{ opt.lines[0] }}</span>
                }
                @if (opt.lines.length >= 2 && opt.id === 'standard') {
                  <span class="cp-num-sm">{{ opt.lines[0] }}</span>
                }
                <span class="cp-sym">{{ opt.id === 'symbol' ? opt.lines[0] : (opt.lines[1] || opt.lines[0]) }}</span>
                @if (opt.lines.length >= 4) {
                  <span class="cp-name">{{ opt.lines[2] }}</span>
                  <span class="cp-mass">{{ opt.lines[3] }}</span>
                }
              </span>
              <span class="opt-body">
                <span class="opt-name">{{ opt.name }}</span>
                <span class="opt-desc">{{ opt.description }}</span>
              </span>
              @if (svc.config().detailLevel === opt.id) {
                <span class="opt-check"><i class="fas fa-circle-check" aria-hidden="true"></i></span>
              }
            </button>
          }
        </div>
      </section>
    }

    <!-- ── Step 4: Filter ────────────────────────────────────────────────── -->
    @if (svc.currentStep() === 4) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">
            <i class="fas fa-filter" aria-hidden="true"></i>
            Filter Elements
          </h2>
          <p class="step-desc">Show all 118 elements or focus on a specific family.</p>
        </div>
        <div class="option-grid option-grid--1">
          @for (opt of FILTER_OPTIONS; track opt.id) {
            <button
              class="option-card option-card--filter"
              [class.option-card--selected]="svc.config().filter === opt.id"
              (click)="svc.selectFilter(opt.id)">
              <span class="opt-icon-wrap">
                <i [class]="opt.icon + ' opt-icon'" aria-hidden="true"></i>
              </span>
              <span class="opt-body">
                <span class="opt-name">{{ opt.name }}</span>
                <span class="opt-desc">{{ opt.description }}</span>
              </span>
              <span class="filter-count">{{ opt.count }}</span>
              @if (svc.config().filter === opt.id) {
                <span class="opt-check"><i class="fas fa-circle-check" aria-hidden="true"></i></span>
              }
            </button>
          }
        </div>
      </section>
    }

    <!-- ── Sticky bottom nav ─────────────────────────────────────────────── -->
      <footer class="bottom-nav">
        <div class="bottom-nav-inner">
          <button
            class="btn-back"
            [disabled]="svc.currentStep() === 1"
            (click)="svc.prevStep()">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
            Back
          </button>
          <span class="step-counter">{{ svc.currentStep() }} / {{ svc.totalSteps }}</span>
          @if (svc.currentStep() === svc.totalSteps) {
            <button
              class="btn-continue btn-finish"
              [disabled]="!svc.canFinish()"
              (click)="svc.finish()">
              <i class="fas fa-flask" aria-hidden="true"></i>
              Build My Table
            </button>
          } @else {
            <button
              class="btn-continue"
              [disabled]="!svc.canAdvance()"
              (click)="svc.nextStep()">
              Continue
              <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          }
        </div>
      </footer>
    }

    <!-- ── Completion: Full Periodic Table ───────────────────────────────── -->
    @if (svc.isComplete()) {
      <app-wizard-result
        [title]="svc.resultData().title"
        [description]="svc.resultData().description"
        [data]="svc.resultData()">

        <div class="table-stage">
          <div class="table-toolbar">
            <span class="table-title">
              <i class="fas fa-atom" aria-hidden="true"></i>
              Your Periodic Table
            </span>
            <span class="table-stats">
              {{ svc.filteredElements().length }} elements
              · {{ svc.config().colorScheme }} colours
              · {{ svc.config().detailLevel }} detail
            </span>

            <!-- View mode toggle -->
            <div class="view-toggle" role="group" aria-label="View mode">
              <button
                class="vt-btn"
                [class.vt-btn--active]="svc.viewMode() === 'grid'"
                (click)="svc.setViewMode('grid')"
                title="Periodic Table">
                <i class="fas fa-table-cells" aria-hidden="true"></i>
                Table
              </button>
              <button
                class="vt-btn"
                [class.vt-btn--active]="svc.viewMode() === 'data'"
                (click)="svc.setViewMode('data')"
                title="Data Grid">
                <i class="fas fa-database" aria-hidden="true"></i>
                Data
              </button>
            </div>
          </div>

        <!-- Data grid view -->
        @if (svc.viewMode() === 'data') {
          <div class="data-view">
            <app-element-table />
          </div>
        }

        <!-- Scrollable table wrapper -->
        <div class="table-scroll"
             [class.layout-compact]="svc.config().layout === 'compact'"
             [class.layout-wide]="svc.config().layout === 'wide'"
             [style.display]="svc.viewMode() === 'data' ? 'none' : null">

          @if (svc.config().layout !== 'alpha') {
            <!-- Classic / Compact / Wide grid layout -->
            <div class="pt-grid">

              <!-- f-block separator -->
              <div class="f-sep"></div>

              <!-- f-block annex labels -->
              <div class="f-annex-label f-annex-label--lan">Ce – Lu</div>
              <div class="f-annex-label f-annex-label--act">Th – Lr</div>

              <!-- All elements -->
              @for (el of svc.filteredElements(); track el.number) {
                <button
                  class="el-cell"
                  [class.el-cell--sym]="svc.config().detailLevel === 'symbol'"
                  [class.el-cell--std]="svc.config().detailLevel === 'standard'"
                  [class.el-cell--full]="svc.config().detailLevel === 'full'"
                  [class.el-cell--radio]="el.radioactive"
                  [style.grid-row]="svc.getGridRow(el)"
                  [style.grid-column]="svc.getGridCol(el)"
                  [style.--el-color]="svc.getElementColor(el, svc.config().colorScheme!)"
                  (click)="svc.selectElement(el)"
                  [attr.aria-label]="el.name + ' — atomic number ' + el.number"
                  [attr.aria-pressed]="svc.selectedElement()?.number === el.number">
                  @if (svc.config().detailLevel !== 'symbol') {
                    <span class="el-num">{{ el.number }}</span>
                  }
                  <span class="el-sym">{{ el.symbol }}</span>
                  @if (svc.config().detailLevel === 'full') {
                    <span class="el-name">{{ el.name }}</span>
                    <span class="el-mass">{{ el.atomicMass }}</span>
                  }
                </button>
              }
            </div>
          } @else {
            <!-- Alphabetical layout -->
            <div class="pt-alpha">
              @for (el of alphaElements(); track el.number) {
                <button
                  class="el-cell el-cell--std"
                  [class.el-cell--radio]="el.radioactive"
                  [style.--el-color]="svc.getElementColor(el, svc.config().colorScheme!)"
                  (click)="svc.selectElement(el)"
                  [attr.aria-label]="el.name + ' — atomic number ' + el.number">
                  <span class="el-num">{{ el.number }}</span>
                  <span class="el-sym">{{ el.symbol }}</span>
                  @if (svc.config().detailLevel === 'full') {
                    <span class="el-name">{{ el.name }}</span>
                    <span class="el-mass">{{ el.atomicMass }}</span>
                  }
                </button>
              }
            </div>
          }

          <!-- Legend -->
          <div class="pt-legend">
            @if (svc.config().colorScheme === 'category') {
              @for (entry of categoryLegend; track entry.label) {
                <span class="legend-item">
                  <span class="legend-dot" [style.background]="entry.color"></span>
                  <span class="legend-label">{{ entry.label }}</span>
                </span>
              }
            }
            @if (svc.config().colorScheme === 'state') {
              @for (entry of stateLegend; track entry.label) {
                <span class="legend-item">
                  <span class="legend-dot" [style.background]="entry.color"></span>
                  <span class="legend-label">{{ entry.label }}</span>
                </span>
              }
            }
            @if (svc.config().colorScheme === 'block') {
              @for (entry of blockLegend; track entry.label) {
                <span class="legend-item">
                  <span class="legend-dot" [style.background]="entry.color"></span>
                  <span class="legend-label">{{ entry.label }}-block</span>
                </span>
              }
            }
          </div>
        </div>

        <!-- Element detail drawer -->
        @if (svc.selectedElement(); as el) {
          <div class="el-drawer" role="dialog" [attr.aria-label]="el.name + ' details'">
            <button class="drawer-close" (click)="svc.selectElement(null)" aria-label="Close">
              <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>
            <div class="drawer-chip" [style.background]="svc.getElementColor(el, svc.config().colorScheme!)">
              <span class="dc-num">{{ el.number }}</span>
              <span class="dc-sym">{{ el.symbol }}</span>
              <span class="dc-name">{{ el.name }}</span>
              <span class="dc-mass">{{ el.atomicMass }}</span>
            </div>
            <dl class="drawer-props">
              <div class="dp-row"><dt>Category</dt><dd>{{ formatCategory(el.category) }}</dd></div>
              <div class="dp-row"><dt>Block</dt><dd>{{ el.block }}-block</dd></div>
              <div class="dp-row"><dt>State (STP)</dt><dd>{{ el.state }}</dd></div>
              <div class="dp-row"><dt>Period</dt><dd>{{ el.period }}</dd></div>
              @if (el.group !== null) {
                <div class="dp-row"><dt>Group</dt><dd>{{ el.group }}</dd></div>
              }
              @if (el.electronegativity !== null) {
                <div class="dp-row"><dt>Electronegativity</dt><dd>{{ el.electronegativity }} (Pauling)</dd></div>
              }
              @if (el.radioactive) {
                <div class="dp-row dp-row--warn">
                  <dt><i class="fas fa-radiation" aria-hidden="true"></i> Radioactive</dt>
                  <dd>No stable isotopes</dd>
                </div>
              }
            </dl>
          </div>
        }

        </div><!-- /table-stage -->

        <button resultActions class="btn-reset" (click)="svc.reset()" type="button">
          <i class="fas fa-rotate-left" aria-hidden="true"></i>
          Build Another
        </button>
      </app-wizard-result>
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--f-layer-0);
      padding-bottom: 80px;
    }

    /* ── HUD ─────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 10px 24px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.4);
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.4);
      border-bottom: 1px solid var(--f-stroke);
      flex-wrap: wrap;
      @media (max-width: 767px) { padding: 8px 16px; }
    }

    .hud-preview {
      flex-shrink: 0;
      @media (max-width: 767px) { display: none; }
    }

    .pt-svg {
      width: 168px;
      height: 110px;
      display: block;
    }

    /* ── HUD chips ───────────────────────────────────────────────────────── */
    .hud-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      flex: 1;
    }

    .hud-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-3);
      font-size: 11px;
      transition: background var(--f-ease-fast), color var(--f-ease-fast), border-color var(--f-ease-fast);
    }

    .hud-chip--set {
      background: rgba(58, 143, 200, 0.18);
      border-color: rgba(58, 143, 200, 0.4);
      color: var(--f-text-1);
    }

    .chip-icon { font-size: 10px; }
    .chip-val  { font-weight: 500; text-transform: capitalize; }

    /* ── HUD step tabs ───────────────────────────────────────────────────── */
    .hud-steps {
      display: flex;
      gap: 4px;
    }

    .step-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--f-text-3);
      cursor: pointer;
      font-size: 12px;
      transition: background var(--f-ease-fast), color var(--f-ease-fast), border-color var(--f-ease-fast);

      &:disabled { opacity: 0.4; cursor: not-allowed; }

      &:not(:disabled):hover {
        background: var(--f-layer-2);
        color: var(--f-text-2);
      }

      &.step-tab--active {
        background: rgba(58, 143, 200, 0.16);
        border-color: rgba(58, 143, 200, 0.35);
        color: var(--f-text-1);
      }

      &.step-tab--done {
        color: #22c55e;
      }
    }

    .step-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--f-layer-3);
      font-size: 11px;
      font-weight: 600;
      flex-shrink: 0;
      .step-tab--active & { background: var(--f-accent); color: #fff; }
      .step-tab--done & { background: rgba(34,197,94,.18); }
    }

    .step-meta {
      display: none;
      flex-direction: column;
      @media (min-width: 900px) { display: flex; }
    }
    .step-label { font-size: 12px; font-weight: 600; line-height: 1.2; }
    .step-sub   { font-size: 10px; color: var(--f-text-3); line-height: 1; }

    /* ── Step section ────────────────────────────────────────────────────── */
    .step-section {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 24px 24px;
      @media (max-width: 767px) { padding: 16px 16px 16px; }
    }

    .step-header { margin-bottom: 24px; }

    .step-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--f-text-1);
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 10px;

      i { color: var(--f-accent-light); font-size: 18px; }
    }

    .step-desc {
      margin: 0;
      font-size: 14px;
      color: var(--f-text-3);
    }

    /* ── Option grid ─────────────────────────────────────────────────────── */
    .option-grid {
      display: grid;
      gap: 12px;
    }

    .option-grid--1 { grid-template-columns: 1fr; }
    .option-grid--2 {
      grid-template-columns: 1fr;
      @media (min-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); }
    }
    .option-grid--3 { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }

    /* ── Option card ─────────────────────────────────────────────────────── */
    .option-card {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px solid var(--f-stroke);
      background: var(--f-layer-1);
      cursor: pointer;
      text-align: left;
      color: var(--f-text-1);
      transition: background var(--f-ease-fast), border-color var(--f-ease-fast), transform 100ms var(--f-ease);

      &:hover {
        background: var(--f-layer-2);
        border-color: var(--f-stroke-sd);
      }

      &:active { transform: scale(0.99); }

      &.option-card--selected {
        background: rgba(58, 143, 200, 0.12);
        border-color: rgba(58, 143, 200, 0.5);
      }

      &.option-card--detail {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 20px 16px;
      }
    }

    .opt-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke-sd);
      flex-shrink: 0;
    }

    .opt-icon { font-size: 18px; color: var(--f-accent-light); }

    .opt-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .opt-name { font-size: 14px; font-weight: 600; }
    .opt-desc { font-size: 12px; color: var(--f-text-3); line-height: 1.5; }

    .opt-check {
      position: absolute;
      top: 14px;
      right: 16px;
      color: var(--f-accent);
      font-size: 18px;
    }

    /* Colour swatch strip */
    .swatch-row {
      display: flex;
      gap: 4px;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .swatch {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.1);
      display: block;
    }

    /* Detail preview cell */
    .cell-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      background: rgba(58, 143, 200, 0.2);
      border: 1px solid rgba(58, 143, 200, 0.4);
      margin-bottom: 12px;
      gap: 0;
      line-height: 1.1;
    }

    .cp-num     { font-size: 9px; color: var(--f-text-3); }
    .cp-num-sm  { font-size: 10px; color: var(--f-text-3); }
    .cp-sym     { font-size: 22px; font-weight: 700; color: var(--f-text-1); }
    .cp-name    { font-size: 8px; color: var(--f-text-2); margin-top: 1px; }
    .cp-mass    { font-size: 8px; color: var(--f-text-3); }

    /* Filter count badge */
    .filter-count {
      font-size: 22px;
      font-weight: 700;
      color: var(--f-accent-light);
      margin-left: auto;
      padding-right: 8px;
    }

    /* ── Bottom nav ──────────────────────────────────────────────────────── */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 40;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-top: 1px solid var(--f-stroke);
      padding: 10px 24px;
    }

    .bottom-nav-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .step-counter {
      font-size: 13px;
      color: var(--f-text-3);
    }

    .btn-back, .btn-continue {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke-sd);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background var(--f-ease-fast), color var(--f-ease-fast);

      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .btn-back {
      background: var(--f-layer-2);
      color: var(--f-text-2);
      &:not(:disabled):hover { background: var(--f-layer-3); color: var(--f-text-1); }
    }

    .btn-continue {
      background: var(--f-accent);
      color: #fff;
      border-color: transparent;
      &:not(:disabled):hover { filter: brightness(1.1); }
    }

    .btn-finish {
      background: linear-gradient(135deg, var(--f-accent), #8b5cf6);
    }

    /* ── Table stage ─────────────────────────────────────────────────────── */
    .table-stage {
      padding: 24px 20px 48px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .table-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--f-text-1);
      display: flex;
      align-items: center;
      gap: 8px;
      i { color: var(--f-accent-light); }
    }

    .table-stats {
      font-size: 12px;
      color: var(--f-text-3);
      text-transform: capitalize;
      flex: 1;
    }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 6px;
      border: 1px solid var(--f-stroke-sd);
      background: var(--f-layer-2);
      color: var(--f-text-2);
      font-size: 13px;
      cursor: pointer;
      transition: background var(--f-ease-fast);
      &:hover { background: var(--f-layer-3); color: var(--f-text-1); }
    }

    /* ── View-mode toggle ────────────────────────────────────────────────── */
    .view-toggle {
      display: flex;
      border: 1px solid var(--f-stroke);
      border-radius: 6px;
      overflow: hidden;
    }

    .vt-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border: none;
      background: var(--f-layer-2);
      color: var(--f-text-3);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background var(--f-ease-fast), color var(--f-ease-fast);
      &:hover { background: var(--f-layer-3); color: var(--f-text-1); }
      &.vt-btn--active {
        background: rgba(58,143,200,0.22);
        color: var(--f-accent);
      }
      & + .vt-btn { border-left: 1px solid var(--f-stroke); }
    }

    /* ── Data grid view ──────────────────────────────────────────────────── */
    .data-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 600px;
      padding: 16px 24px;
    }

    .table-scroll {
      overflow-x: auto;
      padding-bottom: 8px;
    }

    /* ── CSS Grid periodic table ─────────────────────────────────────────── */
    .pt-grid {
      display: grid;
      grid-template-columns: repeat(18, minmax(48px, 1fr));
      grid-template-rows: repeat(10, auto);
      gap: 3px;
      min-width: 900px;
    }

    /* f-block visual separator occupies row 8 col 1–18 */
    .f-sep {
      grid-row: 8;
      grid-column: 1 / -1;
      height: 10px;
      background: transparent;
    }

    .f-annex-label {
      font-size: 9px;
      color: var(--f-text-3);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 4px;
      white-space: nowrap;
      grid-column: 1 / 4;
      &--lan { grid-row: 9; }
      &--act { grid-row: 10; }
    }

    /* ── Element cell ────────────────────────────────────────────────────── */
    .el-cell {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3px 2px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      background: color-mix(in srgb, var(--el-color, #334155) 35%, var(--f-layer-1) 65%);
      cursor: pointer;
      min-height: 44px;
      transition: background 120ms var(--f-ease), transform 80ms var(--f-ease), box-shadow 80ms var(--f-ease);
      color: var(--f-text-1);
      line-height: 1.1;

      &:hover {
        background: color-mix(in srgb, var(--el-color, #334155) 55%, var(--f-layer-1) 45%);
        border-color: var(--el-color, var(--f-stroke-sd));
        transform: scale(1.08);
        z-index: 5;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }

      &[aria-pressed="true"] {
        border-color: var(--f-accent);
        box-shadow: 0 0 0 2px var(--f-accent);
      }

      &.el-cell--radio::after {
        content: '☢';
        position: absolute;
        top: 1px;
        right: 2px;
        font-size: 7px;
        opacity: 0.5;
      }
    }

    .el-num  { font-size: 9px; color: var(--f-text-3); line-height: 1; }
    .el-sym  { font-size: 15px; font-weight: 700; line-height: 1.1; }
    .el-name { font-size: 7px; color: var(--f-text-2); line-height: 1.1; overflow: hidden; max-width: 100%; }
    .el-mass { font-size: 7px; color: var(--f-text-3); line-height: 1; }

    /* Compact: shrink cells */
    .layout-compact .el-cell { min-height: 32px; padding: 2px; }
    .layout-compact .el-sym  { font-size: 12px; }
    .layout-compact .el-num  { font-size: 8px; }
    .layout-compact .el-name,.layout-compact .el-mass { font-size: 6px; }
    .layout-compact .pt-grid { gap: 2px; }

    /* Wide: larger cells */
    .layout-wide .el-cell { min-height: 60px; padding: 6px 4px; }
    .layout-wide .el-sym  { font-size: 20px; }
    .layout-wide .el-num  { font-size: 11px; }
    .layout-wide .el-name { font-size: 9px; }
    .layout-wide .el-mass { font-size: 9px; }
    .layout-wide .pt-grid { gap: 4px; }

    /* ── Alphabetical layout ─────────────────────────────────────────────── */
    .pt-alpha {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 6px;
    }

    .pt-alpha .el-cell { min-height: 72px; border-radius: 8px; }
    .pt-alpha .el-sym  { font-size: 18px; }

    /* ── Legend ──────────────────────────────────────────────────────────── */
    .pt-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
      padding: 12px 16px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      border-radius: 8px;
      min-width: 900px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--f-text-2);
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    /* ── Element detail drawer ───────────────────────────────────────────── */
    .el-drawer {
      position: fixed;
      right: 24px;
      bottom: 24px;
      width: 280px;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke-sd);
      border-radius: 12px;
      padding: 20px;
      z-index: 50;
      box-shadow: var(--f-shadow-lg);
    }

    .drawer-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: var(--f-layer-3);
      color: var(--f-text-3);
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--f-ease-fast);
      &:hover { background: var(--f-stroke-sd); color: var(--f-text-1); }
    }

    .drawer-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      gap: 2px;
    }

    .dc-num  { font-size: 11px; color: rgba(255,255,255,0.7); }
    .dc-sym  { font-size: 44px; font-weight: 800; color: #fff; line-height: 1; }
    .dc-name { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; }
    .dc-mass { font-size: 11px; color: rgba(255,255,255,0.6); }

    .drawer-props {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;
    }

    .dp-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      font-size: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--f-stroke);

      &:last-child { border-bottom: none; padding-bottom: 0; }

      dt { color: var(--f-text-3); font-weight: 400; }
      dd { color: var(--f-text-1); font-weight: 500; text-transform: capitalize; margin: 0; text-align: right; }

      &.dp-row--warn {
        dt { color: #f97316; }
        dd { color: #f97316; }
      }
    }
  `],
})
export class ElementExplorerPage {
  protected readonly svc = inject(ElementExplorerService);
  constructor() { inject(Title).setTitle('Element Explorer — Waltkerovoz'); }

  protected readonly WIZARD_STEPS = WIZARD_STEPS;
  protected readonly LAYOUT_OPTIONS = LAYOUT_OPTIONS;
  protected readonly COLOR_OPTIONS = COLOR_OPTIONS;
  protected readonly DETAIL_OPTIONS = DETAIL_OPTIONS;
  protected readonly FILTER_OPTIONS = FILTER_OPTIONS;

  protected readonly categoryLegend = [
    { label: 'Alkali Metal',         color: '#ef4444' },
    { label: 'Alkaline Earth',       color: '#f97316' },
    { label: 'Transition Metal',     color: '#eab308' },
    { label: 'Post-Transition',      color: '#22c55e' },
    { label: 'Metalloid',            color: '#14b8a6' },
    { label: 'Nonmetal',             color: '#3b82f6' },
    { label: 'Halogen',              color: '#8b5cf6' },
    { label: 'Noble Gas',            color: '#ec4899' },
    { label: 'Lanthanide',           color: '#f43f5e' },
    { label: 'Actinide',             color: '#dc2626' },
  ];

  protected readonly stateLegend = [
    { label: 'Solid',   color: '#64748b' },
    { label: 'Liquid',  color: '#06b6d4' },
    { label: 'Gas',     color: '#a855f7' },
    { label: 'Unknown', color: '#374151' },
  ];

  protected readonly blockLegend = [
    { label: 's', color: '#f97316' },
    { label: 'p', color: '#3b82f6' },
    { label: 'd', color: '#22c55e' },
    { label: 'f', color: '#f43f5e' },
  ];

  protected alphaElements(): ChemElement[] {
    return [...this.svc.filteredElements()].sort((a, b) => a.name.localeCompare(b.name));
  }

  protected isFiltered(el: ChemElement): boolean {
    return this.svc.filteredElements().includes(el);
  }

  protected formatCategory(cat: string): string {
    return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this.svc.selectElement(null);
  }
}
