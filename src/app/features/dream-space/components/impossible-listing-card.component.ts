import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DreamSpaceService } from '../dream-space.service.js';

@Component({
  selector: 'app-impossible-listing-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let listing = ds.impossibleListing();
    @let color   = ds.primaryAccentColor();

    <div class="listing-card" [style.--listing-accent]="color">

      <!-- Agency header -->
      <div class="agency-header">
        <div class="agency-mark" [style.color]="color">
          <i class="fas fa-wand-magic-sparkles"></i>
        </div>
        <div class="agency-name">Impossible Properties™</div>
        <div class="agency-tagline">Curators of the Unreachable</div>
        <div class="listing-badge">
          <i class="fas fa-circle-dot badge-dot"></i>
          Available
        </div>
      </div>

      <!-- Property identity -->
      <div class="listing-identity">
        <h2 class="listing-title">{{ listing.title }}</h2>
        <div class="listing-address">
          <i class="fas fa-location-dot address-icon"></i>
          {{ listing.address }}
        </div>
      </div>

      <!-- Description -->
      <div class="listing-description">
        <p class="listing-desc-text">{{ listing.description }}</p>
      </div>

      <!-- Amenities -->
      @if (listing.amenities.length > 0) {
        <div class="listing-amenities">
          <div class="amenities-label">INCLUDED</div>
          <div class="amenities-grid">
            @for (a of listing.amenities; track a) {
              <span class="amenity-pill">{{ a }}</span>
            }
          </div>
        </div>
      }

      <!-- Footer -->
      <div class="listing-footer">
        <div class="listing-price">
          <span class="price-label">Price</span>
          <span class="price-value">{{ listing.price }}</span>
        </div>
        <div class="listing-listed">
          <span class="listed-by">Listed by {{ listing.listed }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: flex; justify-content: center; padding: 28px 16px; }

    .listing-card {
      width: 100%; max-width: 560px;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); border-radius: 16px;
      overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 0 40px color-mix(in srgb, var(--listing-accent) 8%, transparent);
    }

    /* ── Agency header ── */
    .agency-header {
      display: flex; align-items: center; gap: 10px; padding: 14px 24px;
      background: var(--f-layer-3); border-bottom: 1px solid var(--f-stroke);
    }
    .agency-mark { font-size: 14px; flex-shrink: 0; }
    .agency-name { font-size: 12px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--f-text-2); flex: 1; }
    .agency-tagline { display: none; }
    .listing-badge {
      display: flex; align-items: center; gap: 4px; flex-shrink: 0;
      font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
      color: #4ade80; padding: 3px 9px; border-radius: 20px;
      background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.25);
    }
    .badge-dot { font-size: 7px; }

    /* ── Identity ── */
    .listing-identity { padding: 28px 24px 20px; border-bottom: 1px solid var(--f-stroke); }
    .listing-title {
      font-size: 24px; font-weight: 700; color: var(--f-text-1); margin: 0 0 10px;
      line-height: 1.2;
    }
    .listing-address {
      display: flex; align-items: center; gap: 7px;
      font-size: 13px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace;
    }
    .address-icon { color: var(--listing-accent); font-size: 11px; }

    /* ── Description ── */
    .listing-description { padding: 20px 24px; border-bottom: 1px solid var(--f-stroke); }
    .listing-desc-text {
      font-size: 14px; color: var(--f-text-2); line-height: 1.75; margin: 0;
      font-style: italic;
    }

    /* ── Amenities ── */
    .listing-amenities { padding: 20px 24px; border-bottom: 1px solid var(--f-stroke); }
    .amenities-label {
      font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: var(--listing-accent);
      margin-bottom: 12px;
    }
    .amenities-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .amenity-pill {
      font-size: 11px; padding: 4px 11px; border-radius: 20px;
      background: var(--f-layer-3); border: 1px solid var(--f-stroke); color: var(--f-text-2);
    }

    /* ── Footer ── */
    .listing-footer {
      display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;
      background: var(--f-layer-3);
    }
    .listing-price { display: flex; flex-direction: column; gap: 2px; }
    .price-label { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; color: var(--f-text-3); text-transform: uppercase; }
    .price-value { font-size: 16px; font-weight: 700; color: var(--listing-accent); }
    .listed-by   { font-size: 11px; color: var(--f-text-3); }
  `],
})
export class ImpossibleListingCardComponent {
  protected readonly ds = inject(DreamSpaceService);
}
