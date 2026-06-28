import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  STRUCTURE_OPTIONS, DRIVE_OPTIONS, FINISH_OPTIONS, DETAIL_OPTIONS, MODULE_OPTIONS,
} from '../gear-builder.mock.js';
import type { ObjectBuild } from '../gear-builder.types.js';

@Component({
  selector: 'app-object-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="preview-wrap" [class.compact-wrap]="compact()">
      <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" class="object-svg">

        <!-- Background schematic grid -->
        <g opacity="0.05" stroke="var(--kr-primary-light)" stroke-width="0.5">
          <line x1="80"  y1="0" x2="80"  y2="200"/><line x1="160" y1="0" x2="160" y2="200"/>
          <line x1="240" y1="0" x2="240" y2="200"/><line x1="320" y1="0" x2="320" y2="200"/>
          <line x1="400" y1="0" x2="400" y2="200"/><line x1="480" y1="0" x2="480" y2="200"/>
          <line x1="0" y1="50"  x2="560" y2="50"/> <line x1="0" y1="100" x2="560" y2="100"/>
          <line x1="0" y1="150" x2="560" y2="150"/>
        </g>

        <!-- Viewport corner tick marks -->
        <g stroke="var(--kr-stroke-glow)" stroke-width="1" opacity="0.35" fill="none">
          <path d="M 16,20 L 16,8 L 28,8"/>
          <path d="M 532,8 L 544,8 L 544,20"/>
          <path d="M 16,180 L 16,192 L 28,192"/>
          <path d="M 532,192 L 544,192 L 544,180"/>
        </g>

        <!-- Placeholder when no structure selected -->
        @if (!build().structure) {
          <rect x="160" y="40" width="240" height="120" rx="2"
                fill="none" stroke="var(--kr-stroke-sd)" stroke-width="1.5" stroke-dasharray="6 4"/>
          @if (!compact()) {
            <text x="280" y="106" fill="var(--kr-text-3)" font-family="'JetBrains Mono', monospace"
                  font-size="10" text-anchor="middle" letter-spacing="0.1em" opacity="0.5">SELECT STRUCTURE</text>
          }
        }

        <!-- ── STRUCTURE FORM ── -->
        @if (build().structure) {
          @switch (build().structure) {
            @case ('monolith') {
              <rect x="160" y="40" width="240" height="120" rx="2" [attr.fill]="bodyColor()"/>
              <rect x="160" y="40" width="240" height="120" rx="2" fill="none"
                    [attr.stroke]="edgeColor()" stroke-width="1.5" opacity="0.4"/>
            }
            @case ('lattice') {
              <rect x="160" y="40" width="240" height="120" rx="2"
                    fill="none" [attr.stroke]="bodyColor()" stroke-width="2"/>
              <line x1="240" y1="40" x2="240" y2="160" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.45"/>
              <line x1="320" y1="40" x2="320" y2="160" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.45"/>
              <line x1="160" y1="80"  x2="400" y2="80"  [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.45"/>
              <line x1="160" y1="120" x2="400" y2="120" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.45"/>
              <!-- node circles at intersections -->
              <circle cx="240" cy="80"  r="2.5" [attr.fill]="bodyColor()" opacity="0.7"/>
              <circle cx="320" cy="80"  r="2.5" [attr.fill]="bodyColor()" opacity="0.7"/>
              <circle cx="240" cy="120" r="2.5" [attr.fill]="bodyColor()" opacity="0.7"/>
              <circle cx="320" cy="120" r="2.5" [attr.fill]="bodyColor()" opacity="0.7"/>
            }
            @case ('shell') {
              <rect x="160" y="40" width="240" height="120" rx="2"
                    fill="none" [attr.stroke]="bodyColor()" stroke-width="3.5"/>
              <rect x="176" y="56" width="208" height="88" rx="1"
                    fill="none" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.3"/>
            }
            @case ('modular') {
              <rect x="160" y="40"  width="240" height="33" rx="2" [attr.fill]="bodyColor()"/>
              <rect x="160" y="84"  width="240" height="33" rx="2" [attr.fill]="bodyColor()"/>
              <rect x="160" y="127" width="240" height="33" rx="2" [attr.fill]="bodyColor()"/>
              <line x1="210" y1="73" x2="210" y2="84" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
              <line x1="280" y1="73" x2="280" y2="84" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
              <line x1="350" y1="73" x2="350" y2="84" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
              <line x1="210" y1="117" x2="210" y2="127" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
              <line x1="280" y1="117" x2="280" y2="127" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
              <line x1="350" y1="117" x2="350" y2="127" [attr.stroke]="bodyColor()" stroke-width="1" opacity="0.4"/>
            }
          }
        }

        <!-- ── DRIVE CORE (centered at 280, 100) ── -->
        @if (build().drive) {
          @switch (build().drive) {
            @case ('pulse') {
              <path d="M 264,100 a 16,16 0 0 1 32,0"
                    [attr.stroke]="driveColor()" stroke-width="2.5" fill="none"/>
              <path d="M 254,100 a 26,26 0 0 1 52,0"
                    [attr.stroke]="driveColor()" stroke-width="1.5" fill="none" opacity="0.6"/>
              <path d="M 244,100 a 36,36 0 0 1 72,0"
                    [attr.stroke]="driveColor()" stroke-width="1" fill="none" opacity="0.3"/>
              <circle cx="280" cy="100" r="4.5" [attr.fill]="driveColor()"/>
            }
            @case ('wave') {
              <path d="M 245,100 Q 256,76 267,100 Q 278,124 289,100 Q 300,76 311,100 Q 322,124 333,100"
                    [attr.stroke]="driveColor()" stroke-width="2" fill="none"/>
              <circle cx="280" cy="100" r="3.5" [attr.fill]="driveColor()" opacity="0.9"/>
            }
            @case ('field') {
              @for (dot of fieldDots; track $index) {
                <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="2.5"
                        [attr.fill]="driveColor()" [attr.opacity]="dot.o"/>
              }
            }
            @case ('kinetic') {
              @for (s of kineticSpokes; track $index) {
                <line [attr.x1]="s.x1" [attr.y1]="s.y1" [attr.x2]="s.x2" [attr.y2]="s.y2"
                      [attr.stroke]="driveColor()" stroke-width="2" stroke-linecap="round"/>
              }
              <circle cx="280" cy="100" r="5.5" [attr.fill]="driveColor()"/>
              <circle cx="280" cy="100" r="2.5" fill="var(--kr-layer-1)"/>
            }
          }
        }

        <!-- ── DETAIL CORNERS ── -->
        @if (build().detail) {
          <g [attr.stroke]="detailColor()" stroke-width="1.5" fill="none">
            @switch (build().detail) {
              @case ('minimal') {
                <circle cx="164" cy="44"  r="3.5"/>
                <circle cx="396" cy="44"  r="3.5"/>
                <circle cx="164" cy="156" r="3.5"/>
                <circle cx="396" cy="156" r="3.5"/>
              }
              @case ('radiator') {
                <line x1="157" y1="44"  x2="171" y2="44"/> <line x1="164" y1="37"  x2="164" y2="51"/>
                <line x1="389" y1="44"  x2="403" y2="44"/> <line x1="396" y1="37"  x2="396" y2="51"/>
                <line x1="157" y1="156" x2="171" y2="156"/> <line x1="164" y1="149" x2="164" y2="163"/>
                <line x1="389" y1="156" x2="403" y2="156"/> <line x1="396" y1="149" x2="396" y2="163"/>
                <circle cx="164" cy="44"  r="3" stroke-width="1"/>
                <circle cx="396" cy="44"  r="3" stroke-width="1"/>
                <circle cx="164" cy="156" r="3" stroke-width="1"/>
                <circle cx="396" cy="156" r="3" stroke-width="1"/>
              }
              @case ('fractal') {
                <path d="M 153,52 L 153,42 L 163,42"/>
                <path d="M 407,52 L 407,42 L 397,42"/>
                <path d="M 153,148 L 153,158 L 163,158"/>
                <path d="M 407,148 L 407,158 L 397,158"/>
                <path d="M 159,58 L 159,50 L 167,50" opacity="0.45"/>
                <path d="M 401,58 L 401,50 L 393,50" opacity="0.45"/>
                <path d="M 159,142 L 159,150 L 167,150" opacity="0.45"/>
                <path d="M 401,142 L 401,150 L 393,150" opacity="0.45"/>
              }
              @case ('mirror') {
                <line x1="153" y1="44"  x2="171" y2="44"/> <line x1="153" y1="44" x2="153" y2="62"/>
                <line x1="407" y1="44"  x2="389" y2="44"/> <line x1="407" y1="44" x2="407" y2="62"/>
                <line x1="153" y1="156" x2="171" y2="156"/> <line x1="153" y1="156" x2="153" y2="138"/>
                <line x1="407" y1="156" x2="389" y2="156"/> <line x1="407" y1="156" x2="407" y2="138"/>
                <line x1="163" y1="44"  x2="163" y2="54"  opacity="0.4"/>
                <line x1="397" y1="44"  x2="397" y2="54"  opacity="0.4"/>
                <line x1="163" y1="156" x2="163" y2="146" opacity="0.4"/>
                <line x1="397" y1="156" x2="397" y2="146" opacity="0.4"/>
              }
            }
          </g>
        }

        <!-- ── MODULE ATTACHMENT (right side) ── -->
        @if (build().module && build().module !== 'none') {
          @switch (build().module) {
            @case ('amplifier') {
              <line x1="400" y1="100" x2="432" y2="100" stroke="var(--kr-primary-light)" stroke-width="2"/>
              <line x1="432" y1="68"  x2="432" y2="132" stroke="var(--kr-primary-light)" stroke-width="3"/>
              <line x1="432" y1="78"  x2="454" y2="70"  stroke="var(--kr-primary-light)" stroke-width="1.5" opacity="0.7"/>
              <line x1="432" y1="100" x2="462" y2="100" stroke="var(--kr-primary-light)" stroke-width="1.5" opacity="0.7"/>
              <line x1="432" y1="122" x2="454" y2="130" stroke="var(--kr-primary-light)" stroke-width="1.5" opacity="0.7"/>
            }
            @case ('stabiliser') {
              <line x1="400" y1="100" x2="416" y2="100" stroke="var(--kr-crystal-light)" stroke-width="1.5"/>
              <path d="M 412,62 L 428,62 L 428,138 L 412,138"
                    stroke="var(--kr-crystal-light)" stroke-width="1.5" fill="none"/>
              <line x1="428" y1="78"  x2="448" y2="78"  stroke="var(--kr-crystal-light)" stroke-width="1" opacity="0.5"/>
              <line x1="428" y1="100" x2="448" y2="100" stroke="var(--kr-crystal-light)" stroke-width="1" opacity="0.5"/>
              <line x1="428" y1="122" x2="448" y2="122" stroke="var(--kr-crystal-light)" stroke-width="1" opacity="0.5"/>
            }
            @case ('resonator') {
              <line x1="400" y1="100" x2="416" y2="100" stroke="var(--kr-corona-light)" stroke-width="1.5"/>
              <path d="M 416,100 Q 424,78 432,100 Q 440,122 448,100 Q 456,78 464,100 Q 472,122 480,100"
                    stroke="var(--kr-corona-light)" stroke-width="1.5" fill="none"/>
            }
          }
        }

        <!-- Measurement annotation (full-size only) -->
        @if (!compact() && build().structure) {
          <g opacity="0.22" stroke="var(--kr-text-3)" stroke-width="0.5">
            <line x1="160" y1="173" x2="400" y2="173"/>
            <line x1="160" y1="169" x2="160" y2="177"/>
            <line x1="400" y1="169" x2="400" y2="177"/>
          </g>
          <text x="280" y="186" fill="var(--kr-text-3)" font-family="'JetBrains Mono', monospace"
                font-size="9" text-anchor="middle" letter-spacing="0.12em" opacity="0.35">
            {{ structureLabel() | uppercase }}
          </text>
        }

        <!-- Drive badge -->
        @if (!compact() && build().drive) {
          <text x="164" y="35" [attr.fill]="driveColor()" font-family="'JetBrains Mono', monospace"
                font-size="9" letter-spacing="0.08em" opacity="0.75">{{ driveBadge() }}</text>
        }

      </svg>

      <!-- Build chips (full-size only) -->
      @if (!compact()) {
        <div class="build-chips">
          @if (structureLabel()) {
            <span class="chip"><i class="fas fa-cube mr-1.5 text-primary-400"></i>{{ structureLabel() }}</span>
          }
          @if (driveLabel()) {
            <span class="chip" [style.border-color]="driveColor()">
              <i class="fas fa-bolt mr-1.5" [style.color]="driveColor()"></i>{{ driveLabel() }}
            </span>
          }
          @if (finishLabel()) {
            <span class="chip">
              <span class="color-swatch" [style.background]="bodyColor()"></span>{{ finishLabel() }}
            </span>
          }
          @if (detailLabel()) {
            <span class="chip"><i class="fas fa-vector-square mr-1.5 text-slate-400"></i>{{ detailLabel() }}</span>
          }
          @if (moduleLabel()) {
            <span class="chip"><i class="fas fa-plug mr-1.5 text-amber-400"></i>{{ moduleLabel() }}</span>
          }
        </div>
        @if (!build().structure) {
          <p class="placeholder-hint">Select a structure to begin</p>
        }
      }
    </div>
  `,
  styles: [`
    .preview-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-radius: 12px;
      background: var(--f-layer-1);
      border: 1px solid var(--f-stroke);
    }
    .compact-wrap {
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 0;
      gap: 0;
    }
    .object-svg {
      width: 100%;
      max-width: 480px;
      filter: drop-shadow(0 6px 20px rgba(0,0,0,0.45));
      transition: all 0.35s cubic-bezier(0.34,1.2,0.64,1);
    }
    .build-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      min-height: 28px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      padding: 3px 10px;
      border-radius: 4px;
      background: var(--f-layer-2);
      color: var(--f-text-1);
      border: 1px solid var(--f-stroke);
    }
    .color-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      border: 1px solid rgba(0,0,0,0.25);
      flex-shrink: 0;
    }
    .placeholder-hint {
      font-size: 12px;
      color: var(--f-text-3);
      font-style: italic;
      margin: 0;
      text-align: center;
    }
  `],
})
export class ObjectPreviewComponent {
  public readonly build   = input.required<ObjectBuild>();
  public readonly compact = input<boolean>(false);

  // ── Finish / body color ──────────────────────────────────────────────────

  protected readonly bodyColor = computed((): string => {
    const f = FINISH_OPTIONS.find(o => o.id === this.build().finish);
    return f?.hex ?? '#334155';
  });

  protected readonly edgeColor = computed((): string => {
    const hex = this.bodyColor();
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.round(r * 0.6)},${Math.round(g * 0.6)},${Math.round(b * 0.6)})`;
  });

  // ── Drive ────────────────────────────────────────────────────────────────

  protected readonly driveColor = computed((): string =>
    DRIVE_OPTIONS.find(o => o.id === this.build().drive)?.accentColor ?? '#94a3b8'
  );

  protected readonly driveBadge = computed((): string => {
    switch (this.build().drive) {
      case 'pulse':   return 'PULSE';
      case 'wave':    return '~ WAVE';
      case 'field':   return 'FIELD';
      case 'kinetic': return 'KINETIC';
      default:        return '';
    }
  });

  // ── Detail ───────────────────────────────────────────────────────────────

  protected readonly detailColor = computed((): string =>
    DETAIL_OPTIONS.find(o => o.id === this.build().detail)?.edgeColor ?? '#64748b'
  );

  // ── Drive core geometry (static, computed once) ──────────────────────────

  protected readonly fieldDots = [
    { x: 266, y:  86, o: 0.35 }, { x: 280, y:  86, o: 0.55 }, { x: 294, y:  86, o: 0.35 },
    { x: 266, y: 100, o: 0.55 }, { x: 280, y: 100, o: 1.00 }, { x: 294, y: 100, o: 0.55 },
    { x: 266, y: 114, o: 0.35 }, { x: 280, y: 114, o: 0.55 }, { x: 294, y: 114, o: 0.35 },
  ];

  protected readonly kineticSpokes = [0, 60, 120, 180, 240, 300].map(deg => {
    const rad = (deg * Math.PI) / 180;
    return {
      x1: 280 + Math.cos(rad) * 8,
      y1: 100 + Math.sin(rad) * 8,
      x2: 280 + Math.cos(rad) * 26,
      y2: 100 + Math.sin(rad) * 26,
    };
  });

  // ── Labels ───────────────────────────────────────────────────────────────

  protected readonly structureLabel = computed((): string =>
    STRUCTURE_OPTIONS.find(o => o.id === this.build().structure)?.name ?? ''
  );
  protected readonly driveLabel = computed((): string =>
    DRIVE_OPTIONS.find(o => o.id === this.build().drive)?.name ?? ''
  );
  protected readonly finishLabel = computed((): string =>
    FINISH_OPTIONS.find(o => o.id === this.build().finish)?.name ?? ''
  );
  protected readonly detailLabel = computed((): string =>
    DETAIL_OPTIONS.find(o => o.id === this.build().detail)?.name ?? ''
  );
  protected readonly moduleLabel = computed((): string => {
    const m = this.build().module;
    return (m && m !== 'none') ? (MODULE_OPTIONS.find(o => o.id === m)?.name ?? '') : '';
  });
}
