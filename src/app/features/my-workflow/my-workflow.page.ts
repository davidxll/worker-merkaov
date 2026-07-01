import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MyWorkflowService, MY_WORKFLOW_WIZARD_PROVIDER } from './my-workflow.service.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import { WIZARD_STEPS, COLOR_OPTIONS, SIZE_OPTIONS } from './my-workflow.mock.js';

@Component({
  selector: 'app-my-workflow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, WizardResultComponent],
  providers: [MY_WORKFLOW_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     MY WORKFLOW PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="mw-page">
  @let build = svc.build();

  <!-- ── Sticky HUD ───────────────────────────────────────────── -->
  <div class="hud">
    <div class="hud-inner">

      <!-- Color preview swatch -->
      <div class="hud-swatch-wrap">
        <div class="hud-swatch"
             [style.background]="svc.colorHex() ?? 'var(--f-layer-3)'"
             [style.box-shadow]="svc.colorHex() ? '0 0 18px 2px ' + svc.colorHex() + '55' : 'none'">
        </div>
        @if (build.size) {
          <span class="hud-size-badge">{{ build.size.toUpperCase() }}</span>
        }
      </div>

      <!-- Chips -->
      <div class="hud-chips">
        @for (chip of svc.buildChips(); track chip.label) {
          <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
            <i [class]="chip.icon + ' mr-1 text-xs'"></i>
            {{ chip.value ?? chip.label }}
          </span>
        }
      </div>

      <!-- Step tabs -->
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

  <!-- ── Main content ─────────────────────────────────────────── -->
  <div class="mw-content">

    <!-- ══ STEP 1 — COLOR ══════════════════════════════════════ -->
    @if (svc.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Choose a Colour</h2>
          <p class="step-desc">Select the primary colour identity. Each colour carries its own tone, feel, and contrast profile.</p>
        </div>

        <div class="quick-row">
          <label class="quick-label">Quick select</label>
          <select class="quick-select" [value]="build.color ?? ''"
                  (change)="svc.selectColor($any($event.target).value)">
            <option value="" disabled>— pick one —</option>
            @for (c of colors; track c.id) {
              <option [value]="c.id">{{ c.name }} — {{ c.tagline }}</option>
            }
          </select>
        </div>

        <div class="opt-grid">
          @for (c of colors; track c.id) {
            <div class="opt-card" [class.opt-card--selected]="build.color === c.id"
                 (click)="svc.selectColor(c.id)">
              <div class="opt-card-header">
                <div class="color-dot" [style.background]="c.hex"
                     [style.box-shadow]="'0 0 10px 1px ' + c.hex + '66'"></div>
                <div class="opt-card-name">
                  <span class="opt-name">{{ c.name }}</span>
                  <span class="opt-tagline">{{ c.tagline }}</span>
                </div>
                <span class="feel-badge" [style.color]="c.textHex"
                      [style.border-color]="c.hex + '66'"
                      [style.background]="c.hex + '22'">{{ c.feel }}</span>
                @if (build.color === c.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <p class="opt-desc">{{ c.description }}</p>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 2 — SIZE ════════════════════════════════════════ -->
    @if (svc.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Choose a Size</h2>
          <p class="step-desc">Size determines the visual weight and footprint of the final output.</p>
        </div>

        <div class="size-grid">
          @for (s of sizes; track s.id) {
            <div class="size-card" [class.size-card--selected]="build.size === s.id"
                 (click)="svc.selectSize(s.id)"
                 [style.--accent]="svc.colorHex() ?? 'var(--f-accent)'">
              <div class="size-preview">
                <div class="size-dot"
                     [style.width.px]="10 + s.scale * 6"
                     [style.height.px]="10 + s.scale * 6"
                     [style.background]="svc.colorHex() ?? 'var(--f-accent)'">
                </div>
              </div>
              <div class="size-meta">
                <span class="size-name">{{ s.name }}</span>
                <span class="size-tagline">{{ s.tagline }}</span>
                <p class="size-desc">{{ s.description }}</p>
                <div class="stat-row">
                  <div class="stat-pill">
                    <span class="stat-label">Scale</span>
                    <div class="stat-bar">
                      <div class="stat-fill"
                           [style.width.%]="s.scale * 10"
                           [style.background]="svc.colorHex() ?? 'var(--f-accent)'"></div>
                    </div>
                    <span class="stat-val">{{ s.scale }}/10</span>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-label">Weight</span>
                    <div class="stat-bar">
                      <div class="stat-fill"
                           [style.width.%]="s.weight * 10"
                           [style.background]="svc.colorHex() ?? 'var(--f-accent)'"></div>
                    </div>
                    <span class="stat-val">{{ s.weight }}/10</span>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-label">Footprint</span>
                    <div class="stat-bar">
                      <div class="stat-fill"
                           [style.width.%]="s.footprint * 10"
                           [style.background]="svc.colorHex() ?? 'var(--f-accent)'"></div>
                    </div>
                    <span class="stat-val">{{ s.footprint }}/10</span>
                  </div>
                </div>
              </div>
              @if (build.size === s.id) {
                <i class="fas fa-circle-check size-check"></i>
              }
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 3 — RESULT ══════════════════════════════════════ -->
    @if (svc.currentStep() === 3) {
      @let rd = svc.resultData();
      <section class="step-section result-section">
        <app-wizard-result
          [title]="rd.title"
          [description]="rd.description"
          [data]="rd">
        </app-wizard-result>
        <div class="result-actions">
          <button class="start-over-btn" (click)="svc.reset()">
            <i class="fas fa-arrow-rotate-left mr-2"></i>Start Over
          </button>
        </div>
      </section>
    }

  </div><!-- /mw-content -->

  <!-- ── Bottom sticky nav ─────────────────────────────────────── -->
  @if (svc.currentStep() < 3) {
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        <button class="nav-btn nav-btn--back"
                [disabled]="svc.currentStep() === 1"
                (click)="svc.prevStep()">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div class="nav-progress">
          Step {{ svc.currentStep() }} of {{ steps.length }}
        </div>
        @if (svc.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--next"
                  [disabled]="!svc.canAdvance()"
                  (click)="svc.nextStep()">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--finish"
                  [disabled]="!svc.canAdvance()"
                  (click)="svc.finish()">
            <i class="fas fa-check mr-2"></i>Finish
          </button>
        }
      </div>
    </div>
  }

</div><!-- /mw-page -->
  `,
  styles: [`
    /* ── Page shell ─────────────────────────────────────────────────────── */
    .mw-page    { display: flex; flex-direction: column; min-height: 100%; position: relative; }
    .mw-content { flex: 1; padding: 24px 24px 120px; max-width: 860px; margin: 0 auto; width: 100%; }

    /* ── HUD ────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky; top: 0; z-index: 40;
      background: var(--f-layer-2); border-bottom: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .hud-inner { display: grid; grid-template-columns: 72px 1fr auto; align-items: center; gap: 16px; padding: 10px 24px; }
    .hud-swatch-wrap { position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; }
    .hud-swatch {
      width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--f-stroke);
      transition: background 0.4s ease, box-shadow 0.4s ease;
    }
    .hud-size-badge {
      position: absolute; bottom: -2px; right: -2px;
      font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke);
      border-radius: 3px; padding: 1px 4px; color: var(--f-text-2);
    }
    .hud-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .hud-chip {
      font-size: 11px; padding: 2px 8px; border-radius: 4px;
      background: var(--f-layer-3); color: var(--f-text-3); border: 1px solid var(--f-stroke);
      transition: color 0.2s, border-color 0.2s;
    }
    .hud-chip--set { color: var(--f-text-1); border-color: var(--f-accent); }
    .hud-steps { display: flex; gap: 2px; }
    .step-tab {
      display: flex; flex-direction: column; align-items: center; padding: 8px 16px;
      border-radius: 6px; border: 1px solid transparent; background: transparent;
      cursor: pointer; color: var(--f-text-3); transition: all 0.2s; gap: 1px;
    }
    .step-tab:hover:not(:disabled) { background: var(--f-layer-3); color: var(--f-text-1); }
    .step-tab--active { background: var(--f-layer-3); color: var(--f-text-1); border-color: var(--f-accent); }
    .step-tab--done   { color: var(--kr-crystal); }
    .step-tab:disabled { opacity: 0.4; cursor: default; }
    .step-icon  { font-size: 14px; }
    .step-label { font-size: 11px; font-weight: 600; line-height: 1; }
    .step-sub   { font-size: 9px; opacity: 0.6; line-height: 1; }

    /* ── Step sections ──────────────────────────────────────────────────── */
    .step-section { display: flex; flex-direction: column; gap: 28px; }
    .step-header  { display: flex; flex-direction: column; gap: 6px; }
    .step-title   { font-size: 22px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .step-desc    { font-size: 14px; color: var(--f-text-2); margin: 0; line-height: 1.6; }

    /* ── Quick row ──────────────────────────────────────────────────────── */
    .quick-row   { display: flex; align-items: center; gap: 12px; }
    .quick-label { font-size: 12px; color: var(--f-text-3); white-space: nowrap; }
    .quick-select {
      flex: 1; max-width: 320px; padding: 6px 10px; border-radius: 6px;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke);
      color: var(--f-text-1); font-size: 13px;
    }

    /* ── Option grid (step 1) ───────────────────────────────────────────── */
    .opt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .opt-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 18px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 12px;
      transition: all 0.2s; position: relative;
    }
    .opt-card:hover          { border-color: var(--f-accent); background: var(--f-layer-3); }
    .opt-card--selected      { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .opt-card-header         { display: flex; align-items: flex-start; gap: 12px; }
    .color-dot               { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; transition: box-shadow 0.3s; }
    .opt-card-name           { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .opt-name                { font-size: 15px; font-weight: 600; color: var(--f-text-1); }
    .opt-tagline             { font-size: 12px; color: var(--f-text-3); }
    .feel-badge              {
      font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 3px;
      letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid; white-space: nowrap;
    }
    .opt-check  { color: var(--kr-primary); font-size: 18px; flex-shrink: 0; }
    .opt-desc   { font-size: 13px; color: var(--f-text-2); line-height: 1.5; margin: 0; }

    /* ── Size grid (step 2) ─────────────────────────────────────────────── */
    .size-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
    .size-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 18px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 14px;
      transition: all 0.2s; position: relative;
    }
    .size-card:hover     { border-color: var(--f-accent); background: var(--f-layer-3); }
    .size-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .size-preview {
      height: 72px; display: flex; align-items: center; justify-content: center;
      border-radius: 6px; background: var(--f-layer-1);
    }
    .size-dot { border-radius: 50%; transition: width 0.3s, height 0.3s, background 0.4s; opacity: 0.9; }
    .size-meta  { display: flex; flex-direction: column; gap: 4px; }
    .size-name  { font-size: 16px; font-weight: 600; color: var(--f-text-1); }
    .size-tagline { font-size: 12px; color: var(--f-text-3); }
    .size-desc  { font-size: 12px; color: var(--f-text-2); line-height: 1.5; margin: 4px 0 0; }
    .size-check { position: absolute; top: 12px; right: 12px; color: var(--kr-primary); font-size: 16px; }

    /* ── Stat row ───────────────────────────────────────────────────────── */
    .stat-row   { display: flex; flex-direction: column; gap: 5px; margin-top: 8px; }
    .stat-pill  { display: flex; align-items: center; gap: 8px; }
    .stat-label { font-size: 10px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; width: 58px; flex-shrink: 0; }
    .stat-bar   { flex: 1; height: 3px; border-radius: 2px; background: var(--f-layer-3); overflow: hidden; }
    .stat-fill  { height: 100%; border-radius: 2px; transition: width 0.4s ease, background 0.4s ease; }
    .stat-val   { font-size: 10px; color: var(--f-text-2); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }

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
    .bottom-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; max-width: 860px; margin: 0 auto; }
    .nav-progress { font-size: 12px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }
    .nav-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; border: 1px solid var(--f-stroke);
    }
    .nav-btn:disabled { opacity: 0.4; cursor: default; }
    .nav-btn--back { background: transparent; color: var(--f-text-2); }
    .nav-btn--back:hover:not(:disabled) { color: var(--f-text-1); border-color: var(--f-accent); }
    .nav-btn--next { background: var(--kr-primary); border-color: var(--kr-primary); color: #fff; }
    .nav-btn--next:hover:not(:disabled) { filter: brightness(1.15); }
    .nav-btn--finish { background: var(--kr-crystal); border-color: var(--kr-crystal); color: var(--kr-void); font-weight: 600; }
    .nav-btn--finish:hover:not(:disabled) { filter: brightness(1.1); }
  `],
})
export class MyWorkflowPage implements OnInit {
  protected readonly svc   = inject(MyWorkflowService);
  protected readonly steps  = WIZARD_STEPS;
  protected readonly colors = COLOR_OPTIONS;
  protected readonly sizes  = SIZE_OPTIONS;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('My Workflow — Waltkerovoz');
  }
}
