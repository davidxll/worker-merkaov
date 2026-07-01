import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { SeanceConfig } from '../seances.types.js';
import { DEITY_OPTIONS, VESSEL_OPTIONS } from '../seances.mock.js';

@Component({
  selector: 'app-valhalla-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (compact()) {

      <div class="compact-card">
        <div class="compact-flame" [style.color]="deityColor()">
          <i class="fas fa-fire-flame-curved text-lg"></i>
        </div>
        <div class="compact-info">
          <span class="compact-name">{{ compactTitle() }}</span>
          <span class="compact-sub">{{ compactSub() }}</span>
        </div>
        @if (config().offerings.length > 0) {
          <div class="compact-dots">
            @for (off of compactDots(); track $index) {
              <span class="offering-dot" [class.offering-dot--lit]="off"></span>
            }
          </div>
        }
      </div>

    } @else {

      <!-- Full Valhalla Hall SVG -->
      <div class="hall-wrap">
        <svg class="hall-svg" viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">

          <!-- ── Background space ── -->
          <rect width="700" height="360" fill="#03040a"/>

          <!-- Stars -->
          <circle cx="80"  cy="28"  r="1"   fill="rgba(255,255,255,0.55)"/>
          <circle cx="200" cy="12"  r="0.7" fill="rgba(255,255,255,0.40)"/>
          <circle cx="355" cy="7"   r="1.3" fill="rgba(255,255,255,0.65)"/>
          <circle cx="508" cy="20"  r="0.8" fill="rgba(255,255,255,0.35)"/>
          <circle cx="625" cy="38"  r="1"   fill="rgba(255,255,255,0.48)"/>
          <circle cx="145" cy="58"  r="0.6" fill="rgba(255,255,255,0.30)"/>
          <circle cx="597" cy="14"  r="0.9" fill="rgba(255,255,255,0.50)"/>
          <circle cx="415" cy="32"  r="0.6" fill="rgba(255,255,255,0.40)"/>
          <circle cx="672" cy="66"  r="1.1" fill="rgba(255,255,255,0.30)"/>
          <circle cx="28"  cy="82"  r="0.7" fill="rgba(255,255,255,0.42)"/>
          <circle cx="260" cy="44"  r="0.5" fill="rgba(255,255,255,0.28)"/>
          <circle cx="470" cy="52"  r="0.8" fill="rgba(255,255,255,0.36)"/>
          <circle cx="580" cy="78"  r="0.5" fill="rgba(255,255,255,0.25)"/>
          <circle cx="110" cy="40"  r="0.6" fill="rgba(255,255,255,0.33)"/>
          <circle cx="320" cy="18"  r="0.5" fill="rgba(255,255,255,0.38)"/>
          <circle cx="685" cy="30"  r="0.7" fill="rgba(255,255,255,0.32)"/>

          <!-- ── Hall geometry ── -->
          <!-- Ceiling block -->
          <polygon points="0,0 700,0 450,182 250,182" fill="#060810"/>
          <!-- Floor block -->
          <polygon points="0,360 700,360 450,182 250,182" fill="#0b0d18"/>
          <!-- Left side wall -->
          <polygon points="0,0 0,360 250,182" fill="#080a12"/>
          <!-- Right side wall -->
          <polygon points="700,0 700,360 450,182" fill="#080a12"/>

          <!-- Perspective lines on floor -->
          <line x1="0"   y1="360" x2="350" y2="182" stroke="#111524" stroke-width="1.2"/>
          <line x1="175" y1="360" x2="350" y2="182" stroke="#0e1020" stroke-width="0.6"/>
          <line x1="350" y1="360" x2="350" y2="182" stroke="#0e1020" stroke-width="0.6"/>
          <line x1="525" y1="360" x2="350" y2="182" stroke="#0e1020" stroke-width="0.6"/>
          <line x1="700" y1="360" x2="350" y2="182" stroke="#111524" stroke-width="1.2"/>
          <!-- Ceiling beams -->
          <line x1="0"   y1="0"   x2="350" y2="182" stroke="#0e1020" stroke-width="1"/>
          <line x1="700" y1="0"   x2="350" y2="182" stroke="#0e1020" stroke-width="1"/>

          <!-- ── Deity glow (layered ellipses, no filter needed) ── -->
          <ellipse cx="350" cy="182" rx="190" ry="130" [attr.fill]="deityColor()" opacity="0.03"/>
          <ellipse cx="350" cy="182" rx="120" ry="80"  [attr.fill]="deityColor()" opacity="0.06"/>
          <ellipse cx="350" cy="182" rx="72"  ry="48"  [attr.fill]="deityColor()" opacity="0.10"/>
          <ellipse cx="350" cy="182" rx="42"  ry="28"  [attr.fill]="deityColor()" opacity="0.16"/>
          <ellipse cx="350" cy="182" rx="22"  ry="15"  [attr.fill]="deityColor()" opacity="0.28"/>

          <!-- ── LEFT PILLARS ── -->
          <!-- Pillar 1 (front) -->
          <rect x="56"  y="192" width="30" height="168" fill="#121826" rx="1"/>
          <rect x="56"  y="192" width="30" height="4"   fill="#1e2840"/>
          <!-- Pillar 2 -->
          <rect x="135" y="218" width="21" height="138" fill="#0f1420" rx="1"/>
          <rect x="135" y="218" width="21" height="3"   fill="#192030"/>
          <!-- Pillar 3 -->
          <rect x="196" y="238" width="14" height="112" fill="#0c1018" rx="1"/>
          <rect x="196" y="238" width="14" height="2"   fill="#141c28"/>
          <!-- Pillar 4 (back) -->
          <rect x="240" y="252" width="10" height="90"  fill="#0a0e14" rx="1"/>

          <!-- ── RIGHT PILLARS (mirrored) ── -->
          <!-- Pillar 1 (front) -->
          <rect x="614" y="192" width="30" height="168" fill="#121826" rx="1"/>
          <rect x="614" y="192" width="30" height="4"   fill="#1e2840"/>
          <!-- Pillar 2 -->
          <rect x="544" y="218" width="21" height="138" fill="#0f1420" rx="1"/>
          <rect x="544" y="218" width="21" height="3"   fill="#192030"/>
          <!-- Pillar 3 -->
          <rect x="490" y="238" width="14" height="112" fill="#0c1018" rx="1"/>
          <rect x="490" y="238" width="14" height="2"   fill="#141c28"/>
          <!-- Pillar 4 (back) -->
          <rect x="450" y="252" width="10" height="90"  fill="#0a0e14" rx="1"/>

          <!-- ── FLAMES at pillar bases ── -->
          <!-- Left flames -->
          <ellipse cx="71"  cy="358" rx="14" ry="4.5" fill="#ff6b1a" opacity="0.65"/>
          <ellipse cx="71"  cy="352" rx="7"  ry="9"   fill="#ffaa30" opacity="0.30"/>
          <ellipse cx="145" cy="354" rx="9"  ry="3.5" fill="#ff6b1a" opacity="0.50"/>
          <ellipse cx="145" cy="349" rx="5"  ry="7"   fill="#ffaa30" opacity="0.22"/>
          <ellipse cx="203" cy="348" rx="6"  ry="2.5" fill="#ff6b1a" opacity="0.38"/>
          <ellipse cx="203" cy="344" rx="3"  ry="5"   fill="#ffaa30" opacity="0.18"/>
          <ellipse cx="245" cy="341" rx="4"  ry="2"   fill="#ff6b1a" opacity="0.28"/>
          <!-- Right flames -->
          <ellipse cx="629" cy="358" rx="14" ry="4.5" fill="#ff6b1a" opacity="0.65"/>
          <ellipse cx="629" cy="352" rx="7"  ry="9"   fill="#ffaa30" opacity="0.30"/>
          <ellipse cx="555" cy="354" rx="9"  ry="3.5" fill="#ff6b1a" opacity="0.50"/>
          <ellipse cx="555" cy="349" rx="5"  ry="7"   fill="#ffaa30" opacity="0.22"/>
          <ellipse cx="497" cy="348" rx="6"  ry="2.5" fill="#ff6b1a" opacity="0.38"/>
          <ellipse cx="497" cy="344" rx="3"  ry="5"   fill="#ffaa30" opacity="0.18"/>
          <ellipse cx="455" cy="341" rx="4"  ry="2"   fill="#ff6b1a" opacity="0.28"/>

          <!-- ── Deity portal at vanishing point ── -->
          <circle cx="350" cy="182" r="52" fill="none" [attr.stroke]="deityColor()" stroke-width="0.4" opacity="0.30"/>
          <circle cx="350" cy="182" r="38" fill="none" [attr.stroke]="deityColor()" stroke-width="0.7" opacity="0.50"/>
          <circle cx="350" cy="182" r="24" fill="none" [attr.stroke]="deityColor()" stroke-width="1.2" opacity="0.75"/>
          <circle cx="350" cy="182" r="14" [attr.fill]="deityColor()" opacity="0.22"/>

          <!-- Deity rune initial -->
          @if (config().deity) {
            <text x="350" y="178" text-anchor="middle"
                  fill="white" font-size="14" font-weight="bold" opacity="0.90"
                  style="font-family: serif;">{{ deityInitial() }}</text>
            <text x="350" y="196" text-anchor="middle"
                  fill="white" font-size="6.5" letter-spacing="2" opacity="0.55"
                  style="font-family: 'JetBrains Mono', monospace;">{{ deityName() }}</text>
          }

          <!-- Vessel text -->
          @if (config().vessel) {
            <text x="350" y="335" text-anchor="middle"
                  [attr.fill]="deityColor()" font-size="7" letter-spacing="3" opacity="0.45"
                  style="font-family: 'JetBrains Mono', monospace;">{{ vesselRoute() }}</text>
          }

          <!-- Hall label -->
          <text x="350" y="352" text-anchor="middle"
                fill="rgba(255,255,255,0.18)" font-size="7.5" letter-spacing="4"
                style="font-family: 'JetBrains Mono', monospace;">VALHÖLL · GREAT HALL</text>

        </svg>
      </div>

    }
  `,
  styles: [`
    :host { display: block; }

    /* ── Compact ── */
    .compact-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
      border-radius: 6px;
      height: 52px;
      box-sizing: border-box;
    }
    .compact-flame {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--f-layer-2);
      border-radius: 4px;
      font-size: 14px;
      flex-shrink: 0;
    }
    .compact-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      flex: 1;
      min-width: 0;
    }
    .compact-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--f-text-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .compact-sub {
      font-size: 10px;
      color: var(--f-text-3);
      white-space: nowrap;
    }
    .compact-dots { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
    .offering-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--f-stroke-sd);
      &.offering-dot--lit { background: #ff6b1a; }
    }

    /* ── Full hall ── */
    .hall-wrap {
      margin: 20px 32px;
      border: 1px solid var(--f-stroke-sd);
      border-radius: 8px;
      overflow: hidden;
      background: #03040a;
      @media (max-width: 600px) { margin: 12px; }
    }
    .hall-svg {
      display: block;
      width: 100%;
      height: auto;
    }
  `],
})
export class ValhallaPreviewComponent {
  public readonly config  = input.required<SeanceConfig>();
  public readonly compact = input<boolean>(false);

  protected readonly selectedDeity  = computed(() => DEITY_OPTIONS.find(d => d.id === this.config().deity)  ?? null);
  protected readonly selectedVessel = computed(() => VESSEL_OPTIONS.find(v => v.id === this.config().vessel) ?? null);

  protected readonly deityColor   = computed(() => this.selectedDeity()?.color   ?? '#7eb8e3');
  protected readonly deityInitial = computed(() => this.selectedDeity()?.initial  ?? '✦');
  protected readonly deityName    = computed(() => this.selectedDeity()?.name     ?? 'AWAITING');
  protected readonly vesselRoute  = computed(() => this.selectedVessel()?.route   ?? '');

  protected readonly compactTitle = computed((): string => {
    const d = this.selectedDeity();
    if (d) return d.name;
    const count = this.config().offerings.length;
    return count > 0 ? `${count} offering${count > 1 ? 's' : ''}` : 'No séance';
  });

  protected readonly compactSub = computed((): string => {
    const d = this.selectedDeity();
    if (d) return d.aspect;
    return 'ritual not yet begun';
  });

  protected readonly compactDots = computed((): boolean[] =>
    Array.from({ length: 5 }, (_, i) => i < this.config().offerings.length)
  );
}
