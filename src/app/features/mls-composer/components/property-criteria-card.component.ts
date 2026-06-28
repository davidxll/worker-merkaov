import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MlsComposerService } from '../mls-composer.service.js';

@Component({
  selector: 'app-property-criteria-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let color = mls.propertyAccentColor();
    @let feats = mls.selectedFeaturesArray();

    <div class="criteria-card">

      <!-- Hero: type + price ------------------------------------------------- -->
      <div class="card-hero">
        <div class="card-icon-wrap" [style.background]="color + '1a'" [style.border-color]="color + '55'">
          <i [class]="propertyIcon() + ' card-icon'" [style.color]="color"></i>
        </div>
        <div class="card-headline">
          <span class="card-type" [style.color]="color">{{ propertyTypeLabel() }}</span>
          <span class="card-price">{{ priceLabel() }}</span>
          <span class="card-mls-code">MLS: {{ mlsCode() }}</span>
        </div>
        <div class="card-status-badge">
          <i class="fas fa-circle-dot status-dot"></i>
          Active
        </div>
      </div>

      <!-- Counts: beds + baths ----------------------------------------------- -->
      <div class="card-counts">
        <div class="count-item">
          <i class="fas fa-bed count-icon"></i>
          <span class="count-value">{{ bedsLabel() }}</span>
          <span class="count-unit">bedrooms</span>
        </div>
        <div class="count-divider"></div>
        <div class="count-item">
          <i class="fas fa-bath count-icon"></i>
          <span class="count-value">{{ bathsLabel() }}</span>
          <span class="count-unit">bathrooms</span>
        </div>
      </div>

      <!-- Features ----------------------------------------------------------- -->
      @if (feats.length > 0) {
        <div class="card-features">
          @for (f of feats; track f.id) {
            <span class="feat-pill">
              <i [class]="f.icon + ' feat-icon'"></i>{{ f.name }}
            </span>
          }
        </div>
      } @else {
        <div class="card-no-features">
          <i class="fas fa-circle-info mr-2 opacity-50"></i>No must-have features selected
        </div>
      }

    </div>
  `,
  styles: [`
    :host { display: flex; justify-content: center; padding: 28px 16px; }

    .criteria-card {
      width: 100%; max-width: 460px;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); border-radius: 14px;
      overflow: hidden; display: flex; flex-direction: column;
    }

    /* ── Hero ── */
    .card-hero {
      display: flex; align-items: center; gap: 16px;
      padding: 20px 24px; border-bottom: 1px solid var(--f-stroke);
    }

    .card-icon-wrap {
      width: 56px; height: 56px; border-radius: 12px; border: 1px solid;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .card-icon { font-size: 22px; }

    .card-headline { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .card-type { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .card-price { font-size: 20px; font-weight: 700; color: var(--f-text-1); white-space: nowrap; }
    .card-mls-code { font-size: 11px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }

    .card-status-badge {
      display: flex; align-items: center; gap: 5px; flex-shrink: 0;
      font-size: 11px; font-weight: 600; color: #4ade80; letter-spacing: 0.04em;
      padding: 4px 10px; border-radius: 20px;
      background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.25);
    }
    .status-dot { font-size: 9px; }

    /* ── Counts ── */
    .card-counts {
      display: flex; align-items: center; padding: 20px 24px; gap: 20px;
      border-bottom: 1px solid var(--f-stroke);
    }
    .count-item { display: flex; align-items: baseline; gap: 6px; }
    .count-icon { font-size: 14px; color: var(--f-text-3); margin-right: 2px; }
    .count-value { font-size: 22px; font-weight: 700; color: var(--f-text-1); }
    .count-unit { font-size: 12px; color: var(--f-text-3); }
    .count-divider { width: 1px; height: 32px; background: var(--f-stroke); flex-shrink: 0; }

    /* ── Features ── */
    .card-features {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 16px 24px;
    }
    .feat-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; padding: 4px 10px; border-radius: 20px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke); color: var(--f-text-2);
    }
    .feat-icon { font-size: 10px; opacity: 0.7; }

    .card-no-features {
      padding: 14px 24px; font-size: 12px; color: var(--f-text-3);
    }
  `],
})
export class PropertyCriteriaCardComponent {
  protected readonly mls = inject(MlsComposerService);

  protected propertyIcon(): string {
    const map: Partial<Record<string, string>> = {
      'single-family': 'fas fa-house',
      'condo':         'fas fa-building',
      'multi-family':  'fas fa-city',
      'land':          'fas fa-mountain-sun',
      'commercial':    'fas fa-store',
    };
    return map[this.mls.search().propertyType ?? ''] ?? 'fas fa-home';
  }

  protected propertyTypeLabel(): string {
    const map: Partial<Record<string, string>> = {
      'single-family': 'Single Family',
      'condo':         'Condo / Townhouse',
      'multi-family':  'Multi-Family',
      'land':          'Land / Lot',
      'commercial':    'Commercial',
    };
    return map[this.mls.search().propertyType ?? ''] ?? '—';
  }

  protected mlsCode(): string {
    const map: Partial<Record<string, string>> = {
      'single-family': 'RESI',
      'condo':         'COND',
      'multi-family':  'MULT',
      'land':          'LAND',
      'commercial':    'COMM',
    };
    return map[this.mls.search().propertyType ?? ''] ?? '—';
  }

  protected priceLabel(): string {
    const map: Partial<Record<string, string>> = {
      'starter':   'Under $250K',
      'mid':       '$250K – $500K',
      'upper-mid': '$500K – $800K',
      'premium':   '$800K – $1.5M',
      'luxury':    '$1.5M+',
    };
    return map[this.mls.search().priceRange ?? ''] ?? '—';
  }

  protected bedsLabel(): string {
    const id = this.mls.search().beds;
    if (!id) return '—';
    if (id === 'any') return 'Any';
    const n = id === '5plus' ? '5' : id;
    return `${n}+`;
  }

  protected bathsLabel(): string {
    const map: Partial<Record<string, string>> = {
      '1': '1+', '1h': '1½+', '2': '2+', '2h': '2½+', '3': '3+', '4plus': '4+',
    };
    return map[this.mls.search().baths ?? ''] ?? '—';
  }
}
