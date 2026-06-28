import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DreamSpaceService, DREAM_SPACE_WIZARD_PROVIDER } from './dream-space.service.js';
import { ImpossibleListingCardComponent } from './components/impossible-listing-card.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  WIZARD_STEPS, REALM_OPTIONS, FORM_OPTIONS, IMPOSSIBLE_OPTIONS, ATMOSPHERE_OPTIONS,
} from './dream-space.mock.js';

@Component({
  selector: 'app-dream-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImpossibleListingCardComponent, WizardResultComponent],
  providers: [DREAM_SPACE_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     DREAM SPACE PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="ds-page">
  @let dream = ds.dream();

  <!-- ── Sticky HUD ───────────────────────────────────────────── -->
  <div class="hud">
    <div class="hud-inner">

      <div class="hud-icon-wrap">
        <div class="hud-icon-circle"
             [style.background]="ds.primaryAccentColor() + '1a'"
             [style.border-color]="ds.primaryAccentColor() + '55'">
          <i class="fas fa-wand-magic-sparkles hud-wand" [style.color]="ds.primaryAccentColor()"></i>
        </div>
      </div>

      <div class="hud-chips-wrap">
        <div class="hud-chips">
          @for (chip of ds.spaceChips(); track chip.label) {
            <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
              <i [class]="chip.icon + ' mr-1 text-xs'"></i>
              {{ chip.value ?? chip.label }}
            </span>
          }
        </div>
        <span class="hud-label">Dream Space Composer — Impossible Properties™</span>
      </div>

      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="ds.currentStep() === i + 1"
                  [class.step-tab--done]="ds.currentStep() > i + 1"
                  [disabled]="!ds.isStepReachable(i + 1)"
                  (click)="ds.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ── Main content ─────────────────────────────────────────── -->
  <div class="ds-content">

    <!-- ══ STEP 1 — REALM ═══════════════════════════════════════ -->
    @if (ds.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Where does your space exist?</h2>
          <p class="step-desc">
            Not every home needs to be on a street. Choose the world your space inhabits —
            the realm shapes everything that follows, from light to material to silence.
          </p>
        </div>

        <div class="opt-grid">
          @for (r of realms; track r.id) {
            <div class="opt-card"
                 [class.opt-card--selected]="dream.realm === r.id"
                 [style.--card-accent]="r.accentColor"
                 (click)="ds.selectRealm(r.id)">
              <div class="opt-card-header">
                <div class="opt-icon-wrap"
                     [style.background]="r.accentColor + '1a'"
                     [style.border-color]="r.accentColor + '44'">
                  <i [class]="r.icon + ' opt-icon'" [style.color]="r.accentColor"></i>
                </div>
                <div class="opt-card-name">
                  <span class="opt-name">{{ r.name }}</span>
                  <span class="opt-tagline">{{ r.tagline }}</span>
                </div>
                @if (dream.realm === r.id) {
                  <i class="fas fa-circle-check opt-check" [style.color]="r.accentColor"></i>
                }
              </div>
              <p class="opt-desc">{{ r.description }}</p>
              <div class="opt-footer">
                <span class="district-badge" [style.color]="r.accentColor" [style.border-color]="r.accentColor + '44'">
                  {{ r.district }}
                </span>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 2 — FORM ════════════════════════════════════════ -->
    @if (ds.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">What form does your space take?</h2>
          <p class="step-desc">
            The structure of a home is its first language. A tower says something different from a burrow,
            even in the same realm. Choose the shape that fits how you move through a space.
          </p>
        </div>

        <div class="opt-grid opt-grid--form">
          @for (f of forms; track f.id) {
            <div class="opt-card"
                 [class.opt-card--selected]="dream.form === f.id"
                 (click)="ds.selectForm(f.id)">
              <div class="opt-card-header">
                <div class="opt-icon-wrap form-icon-wrap">
                  <i [class]="f.icon + ' opt-icon form-icon'"></i>
                </div>
                <div class="opt-card-name">
                  <span class="opt-name">{{ f.name }}</span>
                  <span class="opt-tagline">{{ f.tagline }}</span>
                </div>
                @if (dream.form === f.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <p class="opt-desc">{{ f.description }}</p>
              <div class="opt-footer form-address">
                <i class="fas fa-location-dot form-addr-icon"></i>
                <span class="form-addr-text">{{ f.streetNumber }} {{ f.streetName }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 3 — IMPOSSIBLE FEATURE ══════════════════════════ -->
    @if (ds.currentStep() === 3) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">The one thing that cannot exist — but will.</h2>
          <p class="step-desc">
            Every impossible home has one feature that defies the laws of space, time, or physics.
            This is yours. It cannot be explained. It simply is.
          </p>
        </div>

        <div class="imp-grid">
          @for (imp of impossibles; track imp.id) {
            <div class="imp-card"
                 [class.imp-card--selected]="dream.impossible === imp.id"
                 [style.--imp-accent]="imp.accentColor"
                 (click)="ds.selectImpossible(imp.id)">
              <div class="imp-card-glow" [class.imp-card-glow--active]="dream.impossible === imp.id"></div>
              <div class="imp-card-top">
                <div class="imp-icon-wrap" [style.background]="imp.accentColor + '1a'" [style.border-color]="imp.accentColor + '44'">
                  <i [class]="imp.icon + ' imp-icon'" [style.color]="imp.accentColor"></i>
                </div>
                @if (dream.impossible === imp.id) {
                  <i class="fas fa-circle-check imp-check" [style.color]="imp.accentColor"></i>
                }
              </div>
              <div class="imp-name" [style.color]="dream.impossible === imp.id ? imp.accentColor : ''">{{ imp.name }}</div>
              <div class="imp-tagline">{{ imp.tagline }}</div>
              <p class="imp-desc">{{ imp.description }}</p>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 4 — ATMOSPHERE ═══════════════════════════════════ -->
    @if (ds.currentStep() === 4) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">What feeling does the space hold?</h2>
          <p class="step-desc">
            Beyond materials and structure, a home has a register — an emotional quality that arrives
            before any room is named. Choose the one that is already true for you.
          </p>
        </div>

        <div class="opt-grid opt-grid--atm">
          @for (a of atmospheres; track a.id) {
            <div class="opt-card atm-card"
                 [class.opt-card--selected]="dream.atmosphere === a.id"
                 [style.--card-accent]="a.accentColor"
                 (click)="ds.selectAtmosphere(a.id)">
              <div class="opt-card-header">
                <div class="opt-icon-wrap"
                     [style.background]="a.accentColor + '15'"
                     [style.border-color]="a.accentColor + '40'">
                  <i [class]="a.icon + ' opt-icon'" [style.color]="dream.atmosphere === a.id ? a.accentColor : ''"></i>
                </div>
                <div class="opt-card-name">
                  <span class="opt-name">{{ a.name }}</span>
                  <span class="opt-tagline">{{ a.tagline }}</span>
                </div>
                @if (dream.atmosphere === a.id) {
                  <i class="fas fa-circle-check opt-check" [style.color]="a.accentColor"></i>
                }
              </div>
              <p class="opt-desc">{{ a.description }}</p>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 5 — RESULT ════════════════════════════════════════ -->
    @if (ds.currentStep() === 5) {
      @let rd = ds.resultData();
      <section class="step-section result-section">
        <app-wizard-result
          [title]="rd.title"
          [description]="rd.description"
          [data]="rd">
          <app-impossible-listing-card />
        </app-wizard-result>
        <div class="result-actions">
          <button class="start-over-btn" (click)="ds.reset()">
            <i class="fas fa-arrow-rotate-left mr-2"></i>Dream Again
          </button>
        </div>
      </section>
    }

  </div><!-- /ds-content -->

  <!-- ── Bottom sticky nav ─────────────────────────────────────── -->
  @if (ds.currentStep() < 5) {
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        <button class="nav-btn nav-btn--back"
                [disabled]="ds.currentStep() === 1"
                (click)="ds.prevStep()">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div class="nav-progress">
          Step {{ ds.currentStep() }} of {{ steps.length }}
        </div>
        @if (ds.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--next"
                  [disabled]="!ds.canAdvance()"
                  (click)="ds.nextStep()">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--finish"
                  (click)="ds.finish()">
            <i class="fas fa-wand-magic-sparkles mr-2"></i>Generate My Home
          </button>
        }
      </div>
    </div>
  }

</div><!-- /ds-page -->
  `,
  styles: [`
    /* ── Page shell ──────────────────────────────────────────────────────── */
    .ds-page    { display: flex; flex-direction: column; min-height: 100%; position: relative; }
    .ds-content { flex: 1; padding: 24px 24px 120px; max-width: 900px; margin: 0 auto; width: 100%; }

    /* ── HUD ────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky; top: 0; z-index: 40;
      background: var(--f-layer-2); border-bottom: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .hud-inner { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 16px; padding: 10px 24px; }

    .hud-icon-wrap  { display: flex; align-items: center; justify-content: center; }
    .hud-icon-circle {
      width: 44px; height: 44px; border-radius: 10px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.3s, border-color 0.3s;
    }
    .hud-wand { font-size: 17px; transition: color 0.3s; }

    .hud-chips-wrap { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .hud-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .hud-chip {
      font-size: 11px; padding: 2px 8px; border-radius: 4px;
      background: var(--f-layer-3); color: var(--f-text-3); border: 1px solid var(--f-stroke);
      transition: color 0.2s, border-color 0.2s;
    }
    .hud-chip--set { color: var(--f-text-1); border-color: var(--f-accent); }
    .hud-label { font-size: 10px; color: var(--f-text-3); letter-spacing: 0.04em; }

    .hud-steps { display: flex; gap: 2px; }
    .step-tab {
      display: flex; flex-direction: column; align-items: center; padding: 8px 14px;
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
    .step-header  { display: flex; flex-direction: column; gap: 8px; }
    .step-title   { font-size: 22px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .step-desc    { font-size: 14px; color: var(--f-text-2); margin: 0; line-height: 1.65; }

    /* ── Option grid ────────────────────────────────────────────────────── */
    .opt-grid      { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .opt-grid--form { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .opt-grid--atm  { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    .opt-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 18px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 12px;
      transition: all 0.2s; position: relative;
    }
    .opt-card:hover     { border-color: color-mix(in srgb, var(--card-accent, var(--f-accent)) 70%, transparent); background: var(--f-layer-3); }
    .opt-card--selected { border-color: var(--card-accent, var(--f-accent)); background: color-mix(in srgb, var(--card-accent, var(--f-accent)) 6%, var(--f-layer-2)); }

    .opt-card-header { display: flex; align-items: flex-start; gap: 12px; }
    .opt-icon-wrap {
      width: 42px; height: 42px; border-radius: 9px; border: 1px solid;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .opt-icon  { font-size: 18px; color: var(--f-text-3); }
    .opt-card-name { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .opt-name   { font-size: 15px; font-weight: 600; color: var(--f-text-1); }
    .opt-tagline{ font-size: 12px; color: var(--f-text-3); }
    .opt-check  { color: var(--f-accent); font-size: 18px; flex-shrink: 0; }
    .opt-desc   { font-size: 13px; color: var(--f-text-2); line-height: 1.55; margin: 0; flex: 1; }
    .opt-footer { display: flex; align-items: center; }

    .district-badge {
      font-size: 10px; font-weight: 600; letter-spacing: 0.05em; font-style: italic;
      padding: 2px 8px; border-radius: 4px; border: 1px solid;
      background: transparent;
    }

    /* ── Form step address ── */
    .form-icon-wrap { background: var(--f-layer-3); border-color: var(--f-stroke); }
    .form-icon      { color: var(--f-text-3) !important; }
    .form-address   { display: flex; align-items: center; gap: 6px; }
    .form-addr-icon { font-size: 10px; color: var(--f-text-3); }
    .form-addr-text { font-size: 11px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }

    /* ── Impossible cards ───────────────────────────────────────────────── */
    .imp-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px;
    }
    .imp-card {
      border: 1px solid var(--f-stroke); border-radius: 12px; padding: 22px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.25s; position: relative; overflow: hidden;
    }
    .imp-card:hover     { border-color: color-mix(in srgb, var(--imp-accent) 70%, transparent); background: var(--f-layer-3); }
    .imp-card--selected { border-color: var(--imp-accent); background: color-mix(in srgb, var(--imp-accent) 7%, var(--f-layer-2)); }

    .imp-card-glow {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--imp-accent) 0%, transparent);
      transition: box-shadow 0.3s;
    }
    .imp-card-glow--active {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--imp-accent) 50%, transparent),
                  0 0 24px color-mix(in srgb, var(--imp-accent) 15%, transparent);
    }

    .imp-card-top  { display: flex; align-items: center; justify-content: space-between; }
    .imp-icon-wrap {
      width: 48px; height: 48px; border-radius: 10px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
    }
    .imp-icon  { font-size: 20px; }
    .imp-check { font-size: 18px; }
    .imp-name  { font-size: 16px; font-weight: 700; color: var(--f-text-1); line-height: 1.2; transition: color 0.2s; }
    .imp-tagline { font-size: 11px; color: var(--f-text-3); font-style: italic; }
    .imp-desc  { font-size: 13px; color: var(--f-text-2); line-height: 1.6; margin: 0; }

    /* ── Atmosphere cards ── */
    .atm-card { gap: 10px; }

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
    .bottom-nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 24px; max-width: 900px; margin: 0 auto;
    }
    .nav-progress { font-size: 12px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }
    .nav-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; border: 1px solid var(--f-stroke);
    }
    .nav-btn:disabled { opacity: 0.4; cursor: default; }
    .nav-btn--back   { background: transparent; color: var(--f-text-2); }
    .nav-btn--back:hover:not(:disabled) { color: var(--f-text-1); border-color: var(--f-accent); }
    .nav-btn--next   { background: var(--kr-primary); border-color: var(--kr-primary); color: #fff; }
    .nav-btn--next:hover:not(:disabled) { filter: brightness(1.15); }
    .nav-btn--finish {
      background: linear-gradient(135deg, var(--kr-crystal), var(--kr-primary));
      border: none; color: #fff; font-weight: 600;
    }
    .nav-btn--finish:hover { filter: brightness(1.12); }
  `],
})
export class DreamSpacePage implements OnInit {
  protected readonly ds = inject(DreamSpaceService);

  protected readonly steps       = WIZARD_STEPS;
  protected readonly realms      = REALM_OPTIONS;
  protected readonly forms       = FORM_OPTIONS;
  protected readonly impossibles = IMPOSSIBLE_OPTIONS;
  protected readonly atmospheres = ATMOSPHERE_OPTIONS;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Dream Space — Waltkerovoz');
  }
}
