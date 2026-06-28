import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CHASSIS_SVG, CHASSIS_OPTIONS, ENGINE_OPTIONS, COLOR_OPTIONS, RIM_OPTIONS,
} from '../gear-builder.mock.js';
import type { GearBuild, ChassisConfig } from '../gear-builder.types.js';
import { buildSpokes, type SpokeCoord } from '../gear-builder.utils.js';

@Component({
  selector: 'app-vehicle-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="preview-wrap" [class.electric-active]="isElectric() && !compact()" [class.compact-wrap]="compact()">

      <!-- ── Vehicle SVG ──────────────────────────── -->
      <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" class="vehicle-svg">
        <defs>
          <linearGradient id="winGrad" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%"   stop-color="#c7e0ff" stop-opacity="0.92"/>
            <stop offset="100%" stop-color="#6ba0d8" stop-opacity="0.70"/>
          </linearGradient>
          <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
            <stop offset="50%"  stop-color="#000000" stop-opacity="0.00"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.30"/>
          </linearGradient>
          <filter id="glowFx" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="electricGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- ground shadow -->
        <ellipse cx="282" cy="193" rx="218" ry="7" fill="rgba(0,0,0,0.35)"/>

        <!-- ── TRUCK BED (behind body, so renders under wheel) ── -->
        @if (cfg().truckBedPath) {
          <!-- bed interior (dark open area) -->
          <rect x="282" y="62" width="248" height="54" fill="#0f172a" rx="2"/>
          <!-- bed outer walls -->
          <rect x="280" y="58" width="252" height="4"   [attr.fill]="bodyColor()" rx="1"/>
          <rect x="280" y="58" width="4"   height="110" [attr.fill]="bodyColor()"/>
          <rect x="528" y="58" width="4"   height="110" [attr.fill]="bodyColor()"/>
          <rect x="280" y="116" width="252" height="54" [attr.fill]="bodyColor()" rx="2"/>
          <!-- bed floor line -->
          <line x1="284" y1="116" x2="528" y2="116" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
        }

        <!-- ── BODY ── -->
        <path [attr.d]="cfg().bodyPath" [attr.fill]="bodyColor()"/>
        <path [attr.d]="cfg().bodyPath"  fill="url(#bodyShade)"/>

        <!-- ── WINDOWS ── -->
        <path [attr.d]="cfg().frontWindowPath" fill="url(#winGrad)"/>
        <path [attr.d]="cfg().rearWindowPath"  fill="url(#winGrad)"/>

        <!-- ── B-PILLAR ── -->
        @if (cfg().bPillarPath) {
          <path [attr.d]="cfg().bPillarPath!" [attr.fill]="darkBodyColor()"/>
        }

        <!-- ── HEADLIGHT ── -->
        <rect
          [attr.x]="cfg().headlight.x" [attr.y]="cfg().headlight.y"
          [attr.width]="cfg().headlight.w" [attr.height]="cfg().headlight.h"
          rx="2" fill="#fefce8" opacity="0.95"/>
        <!-- headlight inner -->
        <rect
          [attr.x]="cfg().headlight.x + 2" [attr.y]="cfg().headlight.y + 2"
          [attr.width]="cfg().headlight.w - 4" [attr.height]="cfg().headlight.h - 4"
          rx="1" fill="#fbbf24" opacity="0.6"/>

        <!-- ── TAILLIGHT ── -->
        <rect
          [attr.x]="cfg().taillight.x" [attr.y]="cfg().taillight.y"
          [attr.width]="cfg().taillight.w" [attr.height]="cfg().taillight.h"
          rx="2" fill="#dc2626" opacity="0.9"/>
        <rect
          [attr.x]="cfg().taillight.x + 2" [attr.y]="cfg().taillight.y + 2"
          [attr.width]="cfg().taillight.w - 4" [attr.height]="cfg().taillight.h - 4"
          rx="1" fill="#fca5a5" opacity="0.5"/>

        <!-- ── DOOR LINE / BODY CREASE ── -->
        @if (build().chassis !== 'truck') {
          <line
            [attr.x1]="cfg().headlight.x + cfg().headlight.w + 15"
            [attr.y1]="cfg().leftWheel.cy - cfg().leftWheel.r + 12"
            [attr.x2]="cfg().taillight.x - 10"
            [attr.y2]="cfg().leftWheel.cy - cfg().leftWheel.r + 12"
            stroke="rgba(0,0,0,0.18)" stroke-width="1.5" fill="none"/>
        }

        <!-- ── BODY KIT: FRONT LIP ── -->
        @if (kitEffects().frontLip) {
          <path [attr.d]="cfg().frontLipPath" [attr.fill]="darkBodyColor()"/>
        }

        <!-- ── BODY KIT: SPOILER / WING ── -->
        @if (kitEffects().spoiler) {
          <path [attr.d]="cfg().spoilerPath" [attr.fill]="darkBodyColor()" opacity="0.9"/>
          <!-- wing stanchion -->
          <line
            [attr.x1]="cfg().taillight.x - 18" [attr.y1]="cfg().taillight.y - 2"
            [attr.x2]="cfg().taillight.x - 18" [attr.y2]="cfg().taillight.y + 12"
            [attr.stroke]="darkBodyColor()" stroke-width="2"/>
        }

        <!-- ── BODY KIT: ROOF RACK ── -->
        @if (kitEffects().roofRack && cfg().roofRackSpec) {
          <rect
            [attr.x]="cfg().roofRackSpec!.x" [attr.y]="cfg().roofRackSpec!.y"
            [attr.width]="cfg().roofRackSpec!.w" height="5"
            fill="#475569" rx="2" opacity="0.9"/>
          <!-- rack cross bars -->
          @for (bar of roofRackBars(); track $index) {
            <line
              [attr.x1]="bar" [attr.y1]="cfg().roofRackSpec!.y"
              [attr.x2]="bar" [attr.y2]="cfg().roofRackSpec!.y + 5"
              stroke="#64748b" stroke-width="1.5"/>
          }
        }

        <!-- ── ELECTRIC ENGINE GLOW ── -->
        @if (isElectric()) {
          <ellipse
            [attr.cx]="cfg().badgePos.x" [attr.cy]="cfg().badgePos.y + 2"
            rx="36" ry="12"
            fill="#38bdf8" opacity="0.10"
            filter="url(#electricGlow)"/>
        }

        <!-- ── ENGINE BADGE ── -->
        @if (engineBadgeText()) {
          <text
            [attr.x]="cfg().badgePos.x" [attr.y]="cfg().badgePos.y + 6"
            [attr.fill]="engineBadgeColor()"
            font-size="11" font-family="monospace" font-weight="bold"
            text-anchor="middle"
            [attr.filter]="isElectric() ? 'url(#glowFx)' : 'none'"
            opacity="0.85">
            {{ engineBadgeText() }}
          </text>
        }

        <!-- ── LEFT WHEEL ── -->
        <g [attr.transform]="'translate(' + cfg().leftWheel.cx + ',' + cfg().leftWheel.cy + ')'">
          <circle [attr.r]="cfg().leftWheel.r"            fill="#1c1c1c"/>
          <circle [attr.r]="cfg().leftWheel.r * 0.73"     [attr.fill]="rimHubColor()"/>
          @for (s of spokesLeft(); track $index) {
            <line
              [attr.x1]="s.x1" [attr.y1]="s.y1"
              [attr.x2]="s.x2" [attr.y2]="s.y2"
              [attr.stroke]="rimSpokeColor()"
              [attr.stroke-width]="rimSpokeWidth()"
              stroke-linecap="round"/>
          }
          <circle [attr.r]="cfg().leftWheel.r * 0.16"  fill="#0f172a"/>
          <circle [attr.r]="cfg().leftWheel.r * 0.07"  fill="#64748b"/>
        </g>

        <!-- ── RIGHT WHEEL ── -->
        <g [attr.transform]="'translate(' + cfg().rightWheel.cx + ',' + cfg().rightWheel.cy + ')'">
          <circle [attr.r]="cfg().rightWheel.r"           fill="#1c1c1c"/>
          <circle [attr.r]="cfg().rightWheel.r * 0.73"    [attr.fill]="rimHubColor()"/>
          @for (s of spokesRight(); track $index) {
            <line
              [attr.x1]="s.x1" [attr.y1]="s.y1"
              [attr.x2]="s.x2" [attr.y2]="s.y2"
              [attr.stroke]="rimSpokeColor()"
              [attr.stroke-width]="rimSpokeWidth()"
              stroke-linecap="round"/>
          }
          <circle [attr.r]="cfg().rightWheel.r * 0.16" fill="#0f172a"/>
          <circle [attr.r]="cfg().rightWheel.r * 0.07" fill="#64748b"/>
        </g>
      </svg>

      <!-- ── Build summary chips (hidden in compact HUD mode) ── -->
      @if (!compact()) {
        <div class="build-chips">
          @if (chassisLabel()) {
            <span class="chip"><i class="fas fa-car mr-1.5 text-primary-400"></i>{{ chassisLabel() }}</span>
          }
          @if (engineLabel()) {
            <span class="chip" [style.border-color]="engineAccentColor()">
              <i [class]="engineIcon() + ' mr-1.5'" [style.color]="engineAccentColor()"></i>{{ engineLabel() }}
            </span>
          }
          @if (colorLabel()) {
            <span class="chip">
              <span class="color-swatch" [style.background]="bodyColor()"></span>{{ colorLabel() }}
            </span>
          }
          @if (rimLabel()) {
            <span class="chip"><i class="fas fa-circle-dot mr-1.5 text-slate-400"></i>{{ rimLabel() }}</span>
          }
          @if (kitLabel()) {
            <span class="chip"><i class="fas fa-bolt mr-1.5 text-amber-400"></i>{{ kitLabel() }}</span>
          }
        </div>

        @if (!build().chassis) {
          <p class="placeholder-hint">Select a chassis to begin building your vehicle</p>
        }
      }
    </div>
  `,
  styles: [`
    .preview-wrap {
      @apply flex flex-col items-center gap-4 p-6 rounded-2xl
             bg-surface-800 border border-slate-700 transition-all duration-500;
    }
    .compact-wrap {
      @apply p-0 bg-transparent border-0 rounded-none gap-0;
    }
    .electric-active {
      border-color: rgba(56,189,248,0.4);
      box-shadow: 0 0 24px rgba(56,189,248,0.12);
    }
    .vehicle-svg {
      @apply w-full max-w-lg;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
      transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }

    .build-chips {
      @apply flex flex-wrap justify-center gap-2 min-h-7;
    }
    .chip {
      @apply flex items-center text-xs font-medium text-slate-300 px-2.5 py-1
             rounded-full bg-surface-900 border border-slate-600;
    }
    .color-swatch {
      @apply inline-block w-3 h-3 rounded-full mr-1.5 border border-slate-500;
    }
    .placeholder-hint {
      @apply text-slate-500 text-xs text-center italic mt-1;
    }
  `],
})
export class VehiclePreviewComponent {
  public readonly build    = input.required<GearBuild>();
  public readonly compact  = input<boolean>(false);

  // ── chassis SVG config ───────────────────────────────────────────────────

  protected readonly cfg = computed((): ChassisConfig =>
    CHASSIS_SVG[this.build().chassis ?? 'sedan']
  );

  // ── body color ───────────────────────────────────────────────────────────

  protected readonly bodyColor = computed((): string => {
    const c = COLOR_OPTIONS.find(o => o.id === this.build().color);
    return c?.hex ?? '#334155';
  });

  protected readonly darkBodyColor = computed((): string => {
    const hex = this.bodyColor();
    // shift hex darker by blending with black
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const dr = Math.max(0, Math.round(r * 0.65)).toString(16).padStart(2, '0');
    const dg = Math.max(0, Math.round(g * 0.65)).toString(16).padStart(2, '0');
    const db = Math.max(0, Math.round(b * 0.65)).toString(16).padStart(2, '0');
    return `#${dr}${dg}${db}`;
  });

  // ── rim ──────────────────────────────────────────────────────────────────

  private readonly rimOption = computed(() =>
    RIM_OPTIONS.find(o => o.id === this.build().rim) ?? RIM_OPTIONS[0]
  );

  protected readonly rimHubColor    = computed(() => this.rimOption().hubColor);
  protected readonly rimSpokeColor  = computed(() => this.rimOption().spokeColor);
  protected readonly rimSpokeWidth  = computed(() => this.rimOption().spokeWidth);

  protected readonly spokesLeft = computed((): SpokeCoord[] => {
    const rim = this.rimOption();
    const r   = this.cfg().leftWheel.r;
    return buildSpokes(rim.spokeCount, r * 0.16, r * 0.72);
  });

  protected readonly spokesRight = computed((): SpokeCoord[] => {
    const rim = this.rimOption();
    const r   = this.cfg().rightWheel.r;
    return buildSpokes(rim.spokeCount, r * 0.16, r * 0.72);
  });

  // ── body kit ─────────────────────────────────────────────────────────────

  protected readonly kitEffects = computed(() => {
    const kit = this.build().bodyKit ?? '';
    return {
      frontLip: ['sport', 'aero'].includes(kit),
      spoiler:  ['sport', 'aero'].includes(kit),
      roofRack: kit === 'offroad',
    };
  });

  protected readonly roofRackBars = computed((): number[] => {
    const spec = this.cfg().roofRackSpec;
    if (!spec) return [];
    const count = 5;
    return Array.from({ length: count }, (_, i) =>
      spec.x + (spec.w / (count + 1)) * (i + 1)
    );
  });

  // ── engine ───────────────────────────────────────────────────────────────

  private readonly engineOption = computed(() =>
    ENGINE_OPTIONS.find(o => o.id === this.build().engine)
  );

  protected readonly isElectric = computed(() =>
    this.build().engine === 'electric'
  );

  protected readonly engineBadgeText = computed((): string => {
    switch (this.build().engine) {
      case 'electric': return '⚡ EV';
      case 'v8':       return '🔥 V8';
      case 'v6':       return 'V6';
      case 'turbo4':   return 'TURBO';
      default:         return '';
    }
  });

  protected readonly engineBadgeColor = computed((): string =>
    this.engineOption()?.accentColor ?? '#94a3b8'
  );

  protected readonly engineAccentColor = computed((): string =>
    this.engineOption()?.accentColor ?? '#94a3b8'
  );

  protected readonly engineIcon = computed((): string =>
    this.engineOption()?.icon ?? ''
  );

  // ── summary labels ───────────────────────────────────────────────────────

  protected readonly chassisLabel = computed((): string =>
    CHASSIS_OPTIONS.find(o => o.id === this.build().chassis)?.name ?? ''
  );

  protected readonly engineLabel = computed((): string =>
    this.engineOption()?.name ?? ''
  );

  protected readonly colorLabel = computed((): string =>
    COLOR_OPTIONS.find(o => o.id === this.build().color)?.name ?? ''
  );

  protected readonly rimLabel = computed((): string =>
    RIM_OPTIONS.find(o => o.id === this.build().rim)?.name ?? ''
  );

  protected readonly kitLabel = computed((): string => {
    const kit = this.build().bodyKit;
    return (kit && kit !== 'none') ? `${kit.charAt(0).toUpperCase()}${kit.slice(1)} Kit` : '';
  });
}
