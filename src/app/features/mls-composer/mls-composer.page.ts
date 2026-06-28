import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MlsComposerService, MLS_COMPOSER_WIZARD_PROVIDER } from './mls-composer.service.js';
import { PropertyCriteriaCardComponent } from './components/property-criteria-card.component.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import {
  WIZARD_STEPS, PROPERTY_TYPE_OPTIONS, PRICE_RANGE_OPTIONS, BED_OPTIONS, BATH_OPTIONS, FEATURE_OPTIONS,
} from './mls-composer.mock.js';

@Component({
  selector: 'app-mls-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PropertyCriteriaCardComponent, WizardResultComponent],
  providers: [MLS_COMPOSER_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     MLS COMPOSER PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="mc-page">
  @let search = mls.search();

  <!-- ── Sticky HUD ───────────────────────────────────────────── -->
  <div class="hud">
    <div class="hud-inner">

      <!-- Property type icon -->
      <div class="hud-icon-wrap">
        <div class="hud-icon-circle" [style.background]="mls.propertyAccentColor() + '22'" [style.border-color]="mls.propertyAccentColor() + '55'">
          <i class="fas fa-search-location hud-search-icon" [style.color]="mls.propertyAccentColor()"></i>
        </div>
      </div>

      <!-- Search chips -->
      <div class="hud-chips-wrap">
        <div class="hud-chips">
          @for (chip of mls.searchChips(); track chip.label) {
            <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
              <i [class]="chip.icon + ' mr-1 text-xs'"></i>
              {{ chip.value ?? chip.label }}
            </span>
          }
        </div>
        <span class="hud-label">MLS Property Search Composer</span>
      </div>

      <!-- Step tabs -->
      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="mls.currentStep() === i + 1"
                  [class.step-tab--done]="mls.currentStep() > i + 1"
                  [disabled]="!mls.isStepReachable(i + 1)"
                  (click)="mls.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ── Main content ─────────────────────────────────────────── -->
  <div class="mc-content">

    <!-- ══ STEP 1 — PROPERTY TYPE ══════════════════════════════ -->
    @if (mls.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">What type of property are you looking for?</h2>
          <p class="step-desc">
            MLS listings are categorized by property type — choosing the right one narrows the search pool
            and ensures the aggregator filters match the correct MLS field (<code class="field-code">PropertyType</code>).
          </p>
        </div>

        <div class="opt-grid">
          @for (pt of propertyTypes; track pt.id) {
            <div class="opt-card" [class.opt-card--selected]="search.propertyType === pt.id"
                 [style.--card-accent]="pt.accentColor"
                 (click)="mls.selectPropertyType(pt.id)">
              <div class="opt-card-header">
                <div class="opt-icon-wrap" [style.background]="pt.accentColor + '1a'" [style.border-color]="pt.accentColor + '44'">
                  <i [class]="pt.icon + ' opt-icon'" [style.color]="pt.accentColor"></i>
                </div>
                <div class="opt-card-name">
                  <span class="opt-name">{{ pt.name }}</span>
                  <span class="opt-tagline">{{ pt.tagline }}</span>
                </div>
                @if (search.propertyType === pt.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <p class="opt-desc">{{ pt.description }}</p>
              <div class="opt-footer">
                <span class="mls-code-badge">MLS: {{ pt.mlsCode }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 2 — BUDGET ════════════════════════════════════ -->
    @if (mls.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">What is your budget?</h2>
          <p class="step-desc">
            This sets the <code class="field-code">ListPriceMin</code> and <code class="field-code">ListPriceMax</code>
            fields in your search. Most aggregators let you specify an exact range — the tier you pick here
            maps directly to those inputs.
          </p>
        </div>

        <div class="opt-grid opt-grid--5">
          @for (pr of priceRanges; track pr.id) {
            <div class="opt-card opt-card--price" [class.opt-card--selected]="search.priceRange === pr.id"
                 (click)="mls.selectPriceRange(pr.id)">
              <div class="price-card-top">
                <i [class]="pr.icon + ' price-icon'"></i>
                @if (search.priceRange === pr.id) {
                  <i class="fas fa-circle-check opt-check"></i>
                }
              </div>
              <div class="price-name">{{ pr.name }}</div>
              <div class="price-tagline">{{ pr.tagline }}</div>
              <div class="price-range-detail">
                <span class="price-range-label">{{ pr.tagline }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 3 — LAYOUT (BEDS + BATHS) ════════════════════ -->
    @if (mls.currentStep() === 3) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">What size home do you need?</h2>
          <p class="step-desc">
            Select minimum bedroom and bathroom counts. These map to
            <code class="field-code">BedsTotal</code> and <code class="field-code">BathsTotal</code> in the MLS query.
            Both are required to continue.
          </p>
        </div>

        <!-- Bedrooms -->
        <div class="layout-section">
          <div class="layout-section-header">
            <i class="fas fa-bed layout-icon"></i>
            <h3 class="layout-title">Bedrooms</h3>
            @if (search.beds) {
              <span class="layout-selection">{{ bedLabel(search.beds) }}</span>
            } @else {
              <span class="layout-hint">Select a minimum</span>
            }
          </div>
          <div class="count-row">
            @for (b of bedOptions; track b.id) {
              <button class="count-btn"
                      [class.count-btn--selected]="search.beds === b.id"
                      (click)="mls.selectBeds(b.id)">
                {{ b.label }}
              </button>
            }
          </div>
        </div>

        <!-- Bathrooms -->
        <div class="layout-section">
          <div class="layout-section-header">
            <i class="fas fa-bath layout-icon"></i>
            <h3 class="layout-title">Bathrooms</h3>
            @if (search.baths) {
              <span class="layout-selection">{{ bathLabel(search.baths) }}</span>
            } @else {
              <span class="layout-hint">Select a minimum</span>
            }
          </div>
          <div class="count-row">
            @for (b of bathOptions; track b.id) {
              <button class="count-btn"
                      [class.count-btn--selected]="search.baths === b.id"
                      (click)="mls.selectBaths(b.id)">
                {{ b.label }}
              </button>
            }
          </div>
        </div>

        @if (!mls.canAdvance()) {
          <p class="layout-warn">
            <i class="fas fa-circle-info mr-2"></i>Select both a bedroom and bathroom minimum to continue.
          </p>
        }
      </section>
    }

    <!-- ══ STEP 4 — FEATURES ══════════════════════════════════ -->
    @if (mls.currentStep() === 4) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Any must-have features?</h2>
          <p class="step-desc">
            These map to the MLS <code class="field-code">Amenities</code> array. You can select multiple —
            or skip this step entirely. Note that aggressive filtering here narrows the result pool significantly.
          </p>
        </div>

        <div class="feature-grid">
          @for (f of featureOptions; track f.id) {
            <div class="feature-card"
                 [class.feature-card--selected]="search.features.has(f.id)"
                 (click)="mls.toggleFeature(f.id)">
              <div class="feature-card-inner">
                <div class="feature-icon-wrap" [class.feature-icon-wrap--selected]="search.features.has(f.id)">
                  <i [class]="f.icon + ' feature-icon'"></i>
                </div>
                <span class="feature-name">{{ f.name }}</span>
              </div>
              @if (search.features.has(f.id)) {
                <i class="fas fa-circle-check feature-check"></i>
              }
            </div>
          }
        </div>

        @if (mls.selectedFeaturesArray().length > 0) {
          <div class="features-summary">
            <span class="features-summary-label">Selected:</span>
            @for (f of mls.selectedFeaturesArray(); track f.id) {
              <span class="feat-chip">
                <i [class]="f.icon + ' mr-1 text-xs'"></i>{{ f.name }}
              </span>
            }
          </div>
        }
      </section>
    }

    <!-- ══ STEP 5 — RESULT ════════════════════════════════════ -->
    @if (mls.currentStep() === 5) {
      @let rd = mls.resultData();
      <section class="step-section result-section">
        <app-wizard-result
          [title]="rd.title"
          [description]="rd.description"
          [data]="rd">
          <app-property-criteria-card/>
        </app-wizard-result>
        <div class="result-actions">
          <button class="start-over-btn" (click)="mls.reset()">
            <i class="fas fa-arrow-rotate-left mr-2"></i>Start Over
          </button>
        </div>
      </section>
    }

  </div><!-- /mc-content -->

  <!-- ── Bottom sticky nav ─────────────────────────────────────── -->
  @if (mls.currentStep() < 5) {
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        <button class="nav-btn nav-btn--back"
                [disabled]="mls.currentStep() === 1"
                (click)="mls.prevStep()">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div class="nav-progress">
          Step {{ mls.currentStep() }} of {{ steps.length }}
        </div>
        @if (mls.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--next"
                  [disabled]="!mls.canAdvance()"
                  (click)="mls.nextStep()">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--finish"
                  (click)="mls.finish()">
            <i class="fas fa-check mr-2"></i>Build Search Query
          </button>
        }
      </div>
    </div>
  }

</div><!-- /mc-page -->
  `,
  styles: [`
    /* ── Page shell ──────────────────────────────────────────────────────── */
    .mc-page    { display: flex; flex-direction: column; min-height: 100%; position: relative; }
    .mc-content { flex: 1; padding: 24px 24px 120px; max-width: 900px; margin: 0 auto; width: 100%; }

    /* ── HUD ────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky; top: 0; z-index: 40;
      background: var(--f-layer-2); border-bottom: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .hud-inner { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 16px; padding: 10px 24px; }

    .hud-icon-wrap { display: flex; align-items: center; justify-content: center; }
    .hud-icon-circle {
      width: 44px; height: 44px; border-radius: 10px; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.3s, border-color 0.3s;
    }
    .hud-search-icon { font-size: 18px; transition: color 0.3s; }

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
    .step-tab--done { color: var(--kr-crystal); }
    .step-tab:disabled { opacity: 0.4; cursor: default; }
    .step-icon  { font-size: 14px; }
    .step-label { font-size: 11px; font-weight: 600; line-height: 1; }
    .step-sub   { font-size: 9px; opacity: 0.6; line-height: 1; }

    /* ── Step sections ──────────────────────────────────────────────────── */
    .step-section { display: flex; flex-direction: column; gap: 28px; }
    .step-header  { display: flex; flex-direction: column; gap: 8px; }
    .step-title   { font-size: 22px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .step-desc    { font-size: 14px; color: var(--f-text-2); margin: 0; line-height: 1.6; }

    .field-code {
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke);
      padding: 1px 5px; border-radius: 4px; color: var(--kr-primary-light);
    }

    /* ── Option grid ────────────────────────────────────────────────────── */
    .opt-grid     { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .opt-grid--5  { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .opt-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 18px;
      background: var(--f-layer-2); cursor: pointer; display: flex; flex-direction: column; gap: 12px;
      transition: all 0.2s; position: relative;
    }
    .opt-card:hover      { border-color: var(--f-accent); background: var(--f-layer-3); }
    .opt-card--selected  { border-color: var(--kr-primary); background: rgba(58,143,200,0.07); }
    .opt-card-header { display: flex; align-items: flex-start; gap: 12px; }
    .opt-icon-wrap {
      width: 42px; height: 42px; border-radius: 9px; border: 1px solid;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .opt-icon   { font-size: 18px; }
    .opt-card-name { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .opt-name   { font-size: 15px; font-weight: 600; color: var(--f-text-1); }
    .opt-tagline{ font-size: 12px; color: var(--f-text-3); }
    .opt-check  { color: var(--kr-primary); font-size: 18px; flex-shrink: 0; }
    .opt-desc   { font-size: 13px; color: var(--f-text-2); line-height: 1.5; margin: 0; flex: 1; }
    .opt-footer { display: flex; align-items: center; }

    .mls-code-badge {
      font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
      padding: 2px 7px; border-radius: 3px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke); color: var(--f-text-3);
      font-family: 'JetBrains Mono', monospace;
    }
    .opt-card--selected .mls-code-badge { border-color: rgba(58,143,200,0.35); color: var(--kr-primary-light); }

    /* ── Price cards ────────────────────────────────────────────────────── */
    .opt-card--price { gap: 8px; }
    .price-card-top  { display: flex; align-items: center; justify-content: space-between; }
    .price-icon      { font-size: 22px; color: var(--f-accent); }
    .price-name        { font-size: 16px; font-weight: 700; color: var(--f-text-1); }
    .price-tagline     { font-size: 12px; color: var(--f-text-3); }
    .price-range-detail{ margin-top: 2px; }
    .price-range-label { font-size: 13px; font-weight: 600; color: var(--f-text-1); font-family: 'JetBrains Mono', monospace; }

    /* ── Layout step (beds + baths) ─────────────────────────────────────── */
    .layout-section { display: flex; flex-direction: column; gap: 14px; }
    .layout-section-header { display: flex; align-items: center; gap: 10px; }
    .layout-icon  { font-size: 16px; color: var(--f-text-3); }
    .layout-title { font-size: 14px; font-weight: 600; color: var(--f-text-2); margin: 0; }
    .layout-selection { font-size: 13px; font-weight: 600; color: var(--kr-primary-light); margin-left: auto; }
    .layout-hint  { font-size: 12px; color: var(--f-text-3); margin-left: auto; }

    .count-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .count-btn {
      padding: 10px 20px; border-radius: 8px; border: 1px solid var(--f-stroke);
      background: var(--f-layer-2); color: var(--f-text-2); font-size: 15px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; min-width: 64px; text-align: center;
    }
    .count-btn:hover      { border-color: var(--f-accent); color: var(--f-text-1); background: var(--f-layer-3); }
    .count-btn--selected  { border-color: var(--kr-primary); background: rgba(58,143,200,0.1); color: var(--kr-primary-light); }

    .layout-warn {
      font-size: 13px; color: var(--f-text-3); margin: 0;
      padding: 12px 16px; border-radius: 8px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke);
    }

    /* ── Feature grid ───────────────────────────────────────────────────── */
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
    .feature-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 16px;
      background: var(--f-layer-2); cursor: pointer; display: flex; align-items: center;
      justify-content: space-between; transition: all 0.2s; gap: 10px; position: relative;
    }
    .feature-card:hover     { border-color: var(--f-accent); background: var(--f-layer-3); }
    .feature-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.07); }
    .feature-card-inner { display: flex; align-items: center; gap: 12px; }
    .feature-icon-wrap {
      width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--f-stroke);
      background: var(--f-layer-3); display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s;
    }
    .feature-icon-wrap--selected { border-color: rgba(58,143,200,0.4); background: rgba(58,143,200,0.12); }
    .feature-icon  { font-size: 15px; color: var(--f-text-2); }
    .feature-icon-wrap--selected .feature-icon { color: var(--kr-primary-light); }
    .feature-name  { font-size: 13px; font-weight: 600; color: var(--f-text-1); }
    .feature-check { color: var(--kr-primary); font-size: 16px; flex-shrink: 0; }

    .features-summary {
      display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
      padding: 12px 16px; border-radius: 8px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke);
    }
    .features-summary-label { font-size: 11px; color: var(--f-text-3); font-weight: 600; letter-spacing: 0.05em; margin-right: 4px; }
    .feat-chip {
      font-size: 11px; padding: 3px 9px; border-radius: 20px;
      background: rgba(58,143,200,0.1); border: 1px solid rgba(58,143,200,0.3); color: var(--kr-primary-light);
    }

    /* ── Result ─────────────────────────────────────────────────────────── */
    .result-section  { align-items: center; }
    .result-actions  { margin-top: 24px; }
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
    .nav-btn--finish { background: var(--kr-crystal); border-color: var(--kr-crystal); color: var(--kr-void); font-weight: 600; }
    .nav-btn--finish:hover { filter: brightness(1.1); }
  `],
})
export class MlsComposerPage implements OnInit {
  protected readonly mls = inject(MlsComposerService);

  protected readonly steps         = WIZARD_STEPS;
  protected readonly propertyTypes = PROPERTY_TYPE_OPTIONS;
  protected readonly priceRanges   = PRICE_RANGE_OPTIONS;
  protected readonly bedOptions    = BED_OPTIONS;
  protected readonly bathOptions   = BATH_OPTIONS;
  protected readonly featureOptions = FEATURE_OPTIONS;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('MLS Composer — Waltkerovoz');
  }

  protected formatPrice(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString();
  }

  protected bedLabel(id: string): string {
    return BED_OPTIONS.find(b => b.id === id)?.label ?? id;
  }

  protected bathLabel(id: string): string {
    return BATH_OPTIONS.find(b => b.id === id)?.label ?? id;
  }
}
