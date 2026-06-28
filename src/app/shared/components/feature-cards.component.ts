import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import type { FeatureCard } from '../../models/models';

@Component({
  selector: 'app-feature-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Stack Overview</h2>
        <p class="section-desc">The key libraries powering this application, each serving a distinct role in the UI layer.</p>
      </div>
      <div class="cards-grid">
        @for (card of cards(); track card.title) {
          <div class="f-card">
            <div class="f-card-icon">
              <i [class]="card.icon" aria-hidden="true"></i>
            </div>
            <div class="f-card-body">
              <div class="f-card-title-row">
                <span class="f-card-title">{{ card.title }}</span>
                @if (card.badge) {
                  <span class="f-badge">{{ card.badge }}</span>
                }
              </div>
              <p class="f-card-desc">{{ card.description }}</p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .section {
      padding: 48px 40px;
      background: var(--f-layer-0);
      @media (max-width: 767px)                         { padding: 24px 16px; }
      @media (min-width: 768px) and (max-width: 1023px) { padding: 32px 24px; }
    }
    .section-header { margin-bottom: 28px; }
    .section-title {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: var(--f-text-1);
    }
    .section-desc {
      margin: 0;
      font-size: 14px;
      color: var(--f-text-2);
      line-height: 1.5;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;

      @media (min-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
    }

    .f-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease), box-shadow 150ms var(--f-ease);

      &:hover {
        background: var(--f-layer-2);
        border-color: var(--f-stroke-sd);
        box-shadow: var(--f-shadow-2);
      }
    }

    .f-card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      background: rgba(0,120,212,0.15);
      color: var(--f-accent-light);
      font-size: 16px;
    }

    .f-card-body { display: flex; flex-direction: column; gap: 6px; }

    .f-card-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .f-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--f-text-1);
    }
    .f-badge {
      display: inline-flex;
      align-items: center;
      height: 18px;
      padding: 0 6px;
      border-radius: 4px;
      background: rgba(0,120,212,0.20);
      color: var(--f-accent-light);
      font-size: 11px;
      font-weight: 600;
    }
    .f-card-desc {
      margin: 0;
      font-size: 13px;
      color: var(--f-text-2);
      line-height: 1.5;
    }
  `],
})
export class FeatureCardsComponent {
  private readonly svc = inject(AppService);
  protected readonly cards = signal<FeatureCard[]>([]);
  constructor() { this.svc.getFeatureCards().subscribe(data => this.cards.set(data)); }
}
