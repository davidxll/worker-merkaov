import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SeancesService, SEANCES_WIZARD_PROVIDER } from './seances.service.js';
import { ValhallaPreviewComponent } from './components/valhalla-preview.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  WIZARD_STEPS, OFFERING_OPTIONS, DEITY_OPTIONS, VESSEL_OPTIONS,
} from './seances.mock.js';

@Component({
  selector: 'app-seances',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ValhallaPreviewComponent, WizardResultComponent],
  providers: [SEANCES_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     SÉANCES → VALHALLA PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="sv-page">
  @let cfg = svc.config();

  <!-- ── Sticky HUD ── -->
  <div class="hud">
    <div class="hud-inner">

      <div class="hud-preview">
        <app-valhalla-preview [config]="cfg" [compact]="true" />
      </div>

      <div class="hud-meta">
        <div class="hud-chips">
          @for (chip of svc.configChips(); track chip.label) {
            <span class="hud-chip" [class.hud-chip--set]="chip.value !== null"
                  [style.--chip-accent]="chip.value ? svc.deityColor() : null">
              <i [class]="chip.icon + ' mr-1 text-xs'"></i>
              {{ chip.value ?? chip.label }}
            </span>
          }
        </div>
      </div>

      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="svc.currentStep() === i + 1"
                  [class.step-tab--done]="svc.currentStep() > i + 1"
                  [disabled]="!svc.isStepReachable(i + 1)"
                  (click)="svc.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ── Content ── -->
  <div class="sv-content">

    <!-- ══ STEP 1 — RITUAL OFFERINGS ════════════════════════════ -->
    @if (svc.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <div class="step-eyebrow">
            <span class="eyebrow-dot"></span> STEP I — THE RITUAL CIRCLE
          </div>
          <h2 class="step-title">Prepare Your Offerings</h2>
          <p class="step-desc">The threshold between Midgard and Valhalla demands tribute. Choose the sacred items to present at the ritual circle. Each offering amplifies the power of your invocation.</p>
        </div>

        <div class="offering-grid">
          @for (off of offerings; track off.id) {
            <div class="offering-card"
                 [class.offering-card--selected]="cfg.offerings.includes(off.id)"
                 (click)="svc.toggleOffering(off.id)">
              <div class="offering-header">
                <div class="offering-icon-wrap">
                  <i [class]="off.icon + ' text-lg'"></i>
                </div>
                <div class="offering-info">
                  <span class="offering-name">{{ off.name }}</span>
                  <span class="offering-power">
                    <i class="fas fa-star-of-life text-xs mr-1"></i>{{ off.power }}
                  </span>
                </div>
                <i class="offering-check fas"
                   [class.fa-square-check]="cfg.offerings.includes(off.id)"
                   [class.fa-square]="!cfg.offerings.includes(off.id)"
                   [class.offering-check--on]="cfg.offerings.includes(off.id)">
                </i>
              </div>
              <p class="offering-desc">{{ off.description }}</p>
            </div>
          }
        </div>
        @if (cfg.offerings.length === 0) {
          <p class="field-hint"><i class="fas fa-triangle-exclamation mr-1"></i>Choose at least one offering to begin the ritual</p>
        }
      </section>
    }

    <!-- ══ STEP 2 — DEITY INVOCATION ════════════════════════════ -->
    @if (svc.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <div class="step-eyebrow">
            <span class="eyebrow-dot"></span> STEP II — THE INVOCATION
          </div>
          <h2 class="step-title">Invoke the Divine</h2>
          <p class="step-desc">Choose the Norse deity who will receive your offerings and guide your passage. Their domain shapes the nature of your eternal welcome in the great hall.</p>
        </div>

        <div class="deity-grid">
          @for (deity of deities; track deity.id) {
            <div class="deity-card"
                 [class.deity-card--selected]="cfg.deity === deity.id"
                 [style.--deity-color]="deity.color"
                 (click)="svc.selectDeity(deity.id)">
              <div class="deity-card-top">
                <div class="deity-icon-wrap" [style.color]="deity.color" [style.background]="deity.color + '18'">
                  <i [class]="deity.icon + ' text-2xl'"></i>
                </div>
                <div class="deity-title-block">
                  <span class="deity-name" [style.color]="cfg.deity === deity.id ? deity.color : null">{{ deity.name }}</span>
                  <span class="deity-title">{{ deity.title }}</span>
                  <span class="deity-realm"><i class="fas fa-location-dot mr-1 text-xs opacity-50"></i>{{ deity.realm }}</span>
                </div>
                @if (cfg.deity === deity.id) {
                  <i class="fas fa-circle-check deity-check" [style.color]="deity.color"></i>
                }
              </div>
              <p class="deity-desc">{{ deity.description }}</p>
              <div class="deity-aspect-badge" [style.background]="deity.color + '18'" [style.color]="deity.color" [style.border-color]="deity.color + '44'">
                {{ deity.aspect }}
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 3 — THE CROSSING ════════════════════════════════ -->
    @if (svc.currentStep() === 3) {
      <section class="step-section">
        <div class="step-header">
          <div class="step-eyebrow">
            <span class="eyebrow-dot"></span> STEP III — THE CROSSING
          </div>
          <h2 class="step-title">Choose Your Vessel</h2>
          <p class="step-desc">The journey from Midgard to the afterlife takes many forms. Choose the conveyance that matches your warrior's spirit and the deity who awaits you.</p>
        </div>

        <div class="vessel-grid">
          @for (vessel of vessels; track vessel.id) {
            <div class="vessel-card"
                 [class.vessel-card--selected]="cfg.vessel === vessel.id"
                 (click)="svc.selectVessel(vessel.id)">
              <div class="vessel-header">
                <i [class]="vessel.icon + ' vessel-icon'" [style.color]="cfg.vessel === vessel.id ? svc.deityColor() : null"></i>
                <div class="vessel-info">
                  <span class="vessel-name">{{ vessel.name }}</span>
                  <span class="vessel-route"><i class="fas fa-route mr-1 text-xs opacity-50"></i>{{ vessel.route }}</span>
                </div>
                @if (cfg.vessel === vessel.id) {
                  <i class="fas fa-circle-check vessel-check" [style.color]="svc.deityColor()"></i>
                }
              </div>
              <p class="vessel-desc">{{ vessel.description }}</p>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 4 — RESULT ═══════════════════════════════════════ -->
    @if (svc.currentStep() === 4) {
      <app-wizard-result
        [title]="svc.resultData().title"
        [description]="svc.resultData().description"
        [data]="svc.resultData()">
        <app-valhalla-preview [config]="cfg" />
        <div resultActions>
          <button class="reset-btn" type="button" (click)="svc.reset()">
            <i class="fas fa-rotate-left mr-2"></i>Begin Again
          </button>
        </div>
      </app-wizard-result>
    }

    <!-- ── Nav bar ── -->
    @if (svc.currentStep() < 4) {
      <div class="nav-bar">
        <button class="nav-btn nav-btn--secondary"
                [disabled]="svc.currentStep() === 1"
                (click)="svc.prevStep()">
          <i class="fas fa-chevron-left mr-1.5"></i>Back
        </button>

        <div class="nav-dots">
          @for (s of steps; track s.label; let i = $index) {
            <span class="nav-dot"
                  [class.nav-dot--active]="svc.currentStep() === i + 1"
                  [class.nav-dot--done]="svc.currentStep() > i + 1"
                  [style.background]="svc.currentStep() === i + 1 ? svc.deityColor() : null">
            </span>
          }
        </div>

        @if (svc.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--primary"
                  [disabled]="!svc.canAdvance()"
                  [style.background]="svc.canAdvance() ? svc.deityColor() : null"
                  [style.border-color]="svc.canAdvance() ? svc.deityColor() : null"
                  (click)="svc.nextStep()">
            Next<i class="fas fa-chevron-right ml-1.5"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--primary"
                  [disabled]="!svc.canAdvance()"
                  [style.background]="svc.canAdvance() ? svc.deityColor() : null"
                  [style.border-color]="svc.canAdvance() ? svc.deityColor() : null"
                  (click)="svc.finish()">
            <i class="fas fa-fire-flame-curved mr-1.5"></i>Enter Valhalla
          </button>
        }
      </div>
    }

  </div>
</div>
  `,
  styles: [`
    /* ── Page ── */
    .sv-page {
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
    .hud-preview { flex-shrink: 0; width: 200px; }
    .hud-meta    { flex: 1; min-width: 0; }
    .hud-chips   { display: flex; gap: 6px; flex-wrap: wrap; }
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
        background: rgba(255,255,255,0.06);
        border-color: var(--chip-accent, var(--f-stroke-sd));
        i { opacity: 1; }
      }
    }

    /* ── Step tabs ── */
    .hud-steps { display: flex; gap: 4px; flex-shrink: 0; }
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
        background: rgba(255,107,26,0.12);
        border-color: #ff6b1a;
        color: var(--f-text-1);
        .step-icon { color: #ff8c3a; }
      }
      &.step-tab--done {
        background: rgba(255,107,26,0.06);
        border-color: rgba(255,107,26,0.22);
        color: var(--f-text-2);
      }
    }
    .step-icon  { font-size: 13px; }
    .step-label { font-size: 11px; font-weight: 600; white-space: nowrap; }
    .step-sub   { font-size: 9px; opacity: 0.6; white-space: nowrap; }

    /* ── Content ── */
    .sv-content { flex: 1; display: flex; flex-direction: column; }

    /* ── Step sections ── */
    .step-section {
      padding: 40px;
      @media (max-width: 767px) { padding: 20px 16px; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 28px 24px; }
    }
    .step-header { margin-bottom: 32px; }
    .step-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--f-text-3);
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .eyebrow-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ff6b1a;
      flex-shrink: 0;
    }
    .step-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--f-text-1);
      margin: 0 0 10px;
    }
    .step-desc {
      font-size: 14px;
      color: var(--f-text-2);
      line-height: 1.65;
      margin: 0;
      max-width: 680px;
    }
    .field-hint {
      font-size: 12px;
      color: #f59e0b;
      margin: 16px 0 0;
    }

    /* ── Offering cards (multi-select) ── */
    .offering-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 10px;
    }
    .offering-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.offering-card--selected {
        border-color: #ff6b1a;
        background: rgba(255,107,26,0.07);
      }
    }
    .offering-header { display: flex; align-items: center; gap: 10px; }
    .offering-icon-wrap {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(255,107,26,0.12);
      color: #ff8c3a;
      font-size: 15px;
      flex-shrink: 0;
    }
    .offering-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .offering-name  { font-size: 13px; font-weight: 600; color: var(--f-text-1); }
    .offering-power { font-size: 10px; color: #ff8c3a; letter-spacing: 0.05em; }
    .offering-check {
      font-size: 16px;
      color: var(--f-stroke-sd);
      flex-shrink: 0;
      &.offering-check--on { color: #ff6b1a; }
    }
    .offering-desc { font-size: 12px; color: var(--f-text-2); line-height: 1.5; margin: 0; }

    /* ── Deity cards ── */
    .deity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .deity-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 18px;
      border-radius: 10px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease), box-shadow 150ms var(--f-ease);
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); box-shadow: var(--f-shadow-2); }
      &.deity-card--selected {
        border-color: var(--deity-color, var(--f-accent));
        background: color-mix(in srgb, var(--deity-color, var(--f-accent)) 8%, transparent);
        box-shadow: 0 0 0 1px var(--deity-color, var(--f-accent));
      }
    }
    .deity-card-top { display: flex; align-items: flex-start; gap: 12px; }
    .deity-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .deity-title-block { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .deity-name    { font-size: 16px; font-weight: 700; color: var(--f-text-1); transition: color 150ms; }
    .deity-title   { font-size: 12px; color: var(--f-text-2); }
    .deity-realm   { font-size: 11px; color: var(--f-text-3); }
    .deity-check   { font-size: 20px; flex-shrink: 0; }
    .deity-desc    { font-size: 13px; color: var(--f-text-2); line-height: 1.55; margin: 0; }
    .deity-aspect-badge {
      display: inline-flex;
      align-items: center;
      height: 22px;
      padding: 0 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      border: 1px solid;
      align-self: flex-start;
      text-transform: uppercase;
    }

    /* ── Vessel cards ── */
    .vessel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 10px;
    }
    .vessel-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: pointer;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-sd); }
      &.vessel-card--selected {
        border-color: var(--f-stroke-sd);
        background: rgba(255,255,255,0.04);
        box-shadow: 0 0 0 1px var(--f-stroke-sd);
      }
    }
    .vessel-header { display: flex; align-items: flex-start; gap: 12px; }
    .vessel-icon   { font-size: 18px; color: var(--f-text-2); margin-top: 2px; flex-shrink: 0; transition: color 150ms; }
    .vessel-info   { display: flex; flex-direction: column; gap: 3px; flex: 1; }
    .vessel-name   { font-size: 14px; font-weight: 600; color: var(--f-text-1); }
    .vessel-route  { font-size: 11px; color: var(--f-text-3); }
    .vessel-check  { font-size: 18px; flex-shrink: 0; }
    .vessel-desc   { font-size: 12px; color: var(--f-text-2); line-height: 1.5; margin: 0; }

    /* ── Nav bar ── */
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
      &.nav-dot--done { background: rgba(255,107,26,0.45); }
      &.nav-dot--active { transform: scale(1.4); }
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
      background: #ff6b1a;
      border: 1px solid #ff6b1a;
      color: #fff;
      &:not(:disabled):hover { opacity: 0.88; }
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
export class SeancesPage {
  protected readonly svc     = inject(SeancesService);
  protected readonly steps   = WIZARD_STEPS;
  protected readonly offerings = OFFERING_OPTIONS;
  protected readonly deities   = DEITY_OPTIONS;
  protected readonly vessels   = VESSEL_OPTIONS;

  constructor() {
    inject(Title).setTitle('Séances → Valhalla — Waltkerovoz');
  }
}
