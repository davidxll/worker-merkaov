import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero-body">

        <div class="hero-eyebrow">
          <span class="eyebrow-dot"></span>
          PRECISION MECHANICS · MINERAL AESTHETICS
        </div>

        <h1 class="hero-title">
          Form is not<br>
          <span class="hero-accent">grown from necessity.</span>
        </h1>

        <p class="hero-desc">
          Every element emerges from one governing principle: the union of
          mechanical precision and mineral inevitability. Like crystal lattices
          expanding outward from a molecular seed.
        </p>

        <div class="hero-actions">
          <button class="btn-accent" (click)="scrollTo('buttons')">
            <i class="fas fa-arrow-down" style="font-size:12px" aria-hidden="true"></i>
            Explore components
          </button>
          <button class="btn-subtle">
            <i class="fas fa-code" style="font-size:12px" aria-hidden="true"></i>
            View source
          </button>
        </div>

        <div class="hero-chips">
          @for (chip of techChips; track chip) {
            <span class="tech-chip">{{ chip }}</span>
          }
        </div>
      </div>

      <div class="hero-grid-wrap">
        <div class="icon-grid">
          @for (item of iconGrid; track item.icon) {
            <div class="icon-tile">
              <i [class]="item.icon + ' icon-tile-glyph'" aria-hidden="true"></i>
              <span class="icon-tile-label">{{ item.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 48px;
      min-height: 100vh;
      padding: 80px 40px;
      background: var(--f-layer-0);

      @media (min-width: 1024px) {
        flex-direction: row;
        align-items: center;
      }
    }

    .hero-body {
      flex: 1;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 400;
      color: var(--f-text-2);
      letter-spacing: 0.02em;
      margin-bottom: 20px;
    }
    .eyebrow-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--f-accent);
    }

    .hero-title {
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 600;
      color: var(--f-text-1);
      line-height: 1.15;
      margin: 0 0 20px;
      letter-spacing: -0.01em;
    }
    .hero-accent {
      color: var(--f-accent-light);
    }

    .hero-desc {
      font-size: 15px;
      color: var(--f-text-2);
      line-height: 1.6;
      margin: 0 0 32px;
      max-width: 440px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }

    .btn-accent {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 16px;
      border-radius: 4px;
      background: var(--f-accent);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 150ms var(--f-ease);
      &:hover { background: var(--f-accent-hover); }
      &:active { background: var(--f-accent-press); }
    }
    .btn-subtle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 16px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-text-1);
      font-size: 13px;
      font-weight: 400;
      cursor: pointer;
      transition: background 150ms var(--f-ease);
      &:hover { background: rgba(255,255,255,0.10); }
    }

    .hero-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tech-chip {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 10px;
      border-radius: 4px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      color: var(--f-text-2);
      font-size: 12px;
      font-weight: 400;
    }

    /* ── Icon grid ── */
    .hero-grid-wrap {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .icon-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 88px;
      height: 88px;
      border-radius: 8px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      cursor: default;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);
      &:hover {
        background: var(--f-layer-2);
        border-color: var(--f-stroke-sd);
      }
    }
    .icon-tile-glyph {
      font-size: 22px;
      color: var(--f-accent-light);
    }
    .icon-tile-label {
      font-size: 11px;
      color: var(--f-text-2);
      text-align: center;
    }
  `],
})
export class HeroComponent {
  public readonly techChips: string[] = ['Krypton', 'Crystal', 'Precision', 'Geometry', 'Torque'];

  public readonly iconGrid: Array<{ icon: string; label: string }> = [
    { icon: 'fas fa-cog',          label: 'Mechanics'   },
    { icon: 'fas fa-gem',          label: 'Crystal'     },
    { icon: 'fas fa-compass',      label: 'Precision'   },
    { icon: 'fas fa-square',       label: 'Geometry'    },
    { icon: 'fas fa-lightbulb',    label: 'Luminescence'},
    { icon: 'fas fa-wind',         label: 'Void'        },
    { icon: 'fas fa-flask',        label: 'Ionised'     },
    { icon: 'fas fa-layer-group',  label: 'Lattice'     },
    { icon: 'fas fa-bolt',         label: 'Discharge'   },
  ];

  public scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
