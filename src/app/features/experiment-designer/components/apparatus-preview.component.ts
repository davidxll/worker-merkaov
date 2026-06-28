import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ExperimentConfig } from '../experiment-designer.types.js';
import { EXCITATION_OPTIONS, CONTAINMENT_OPTIONS, DETECTOR_OPTIONS } from '../experiment-designer.mock.js';

// ViewBox: 0 0 560 200
// Layout: [SOURCE 40-130] --beam--> [CHAMBER 190-370] --signal--> [DETECTOR 430-520]

@Component({
  selector: 'app-apparatus-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="compact() ? '80 20 400 160' : '0 0 560 200'"
      xmlns="http://www.w3.org/2000/svg"
      [class.compact]="compact()"
      aria-label="Experiment apparatus schematic">

      <defs>
        <!-- Chamber glow gradient -->
        <radialGradient [id]="glowId()" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   [attr.stop-color]="beamColor()" stop-opacity="0.35" />
          <stop offset="100%" [attr.stop-color]="beamColor()" stop-opacity="0" />
        </radialGradient>

        <!-- Beam gradient (left→right) -->
        <linearGradient [id]="beamGradId()" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   [attr.stop-color]="beamColor()" stop-opacity="0.9" />
          <stop offset="100%" [attr.stop-color]="beamColor()" stop-opacity="0.3" />
        </linearGradient>

        <!-- Signal gradient (left→right) -->
        <linearGradient [id]="sigGradId()" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   [attr.stop-color]="beamColor()" stop-opacity="0.3" />
          <stop offset="100%" [attr.stop-color]="detectorColor()" stop-opacity="0.9" />
        </linearGradient>

        <!-- Source box gradient -->
        <linearGradient [id]="srcGradId()" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   [attr.stop-color]="beamColor()" stop-opacity="0.25" />
          <stop offset="100%" [attr.stop-color]="beamColor()" stop-opacity="0.05" />
        </linearGradient>

        <!-- Detector box gradient -->
        <linearGradient [id]="detGradId()" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   [attr.stop-color]="detectorColor()" stop-opacity="0.25" />
          <stop offset="100%" [attr.stop-color]="detectorColor()" stop-opacity="0.05" />
        </linearGradient>
      </defs>

      <!-- ── Ground rail ── -->
      <line x1="20" y1="185" x2="540" y2="185"
            stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.3" />

      <!-- ══ SOURCE BLOCK ══════════════════════════════ -->
      <!-- Box -->
      <rect x="32" y="68" width="88" height="68" rx="6"
            [attr.fill]="'url(#' + srcGradId() + ')'"
            stroke-width="1.5"
            [attr.stroke]="beamColor()"
            stroke-opacity="0.7" />

      <!-- Source icon symbol -->
      <text x="76" y="97" text-anchor="middle" font-size="22"
            [attr.fill]="beamColor()" font-family="Font Awesome 6 Free" font-weight="900"
            opacity="0.85">{{ sourceGlyph() }}</text>

      <!-- Source sub-label -->
      <text x="76" y="118" text-anchor="middle" font-size="8.5"
            fill="var(--f-text-2)" font-family="Jura, sans-serif" letter-spacing="0.05em">
        {{ sourceLabel() }}
      </text>

      <!-- Mount feet -->
      <line x1="52"  y1="136" x2="52"  y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />
      <line x1="100" y1="136" x2="100" y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />

      <!-- ══ BEAM PATH ════════════════════════════════ -->
      <!-- Beam line -->
      @if (config().excitation) {
        <line x1="120" y1="100" x2="190" y2="100"
              [attr.stroke]="'url(#' + beamGradId() + ')'"
              stroke-width="2.5"
              stroke-dasharray="6 3" />
        <!-- Arrowhead -->
        <polygon points="190,95 200,100 190,105"
                 [attr.fill]="beamColor()" opacity="0.8" />
      } @else {
        <line x1="120" y1="100" x2="200" y2="100"
              stroke="var(--f-stroke)" stroke-width="1.5"
              stroke-opacity="0.25" stroke-dasharray="4 4" />
      }

      <!-- ══ CHAMBER ══════════════════════════════════ -->
      <!-- Glow halo (only when excitation selected) -->
      @if (config().excitation) {
        <ellipse cx="280" cy="100" rx="95" ry="60"
                 [attr.fill]="'url(#' + glowId() + ')'" />
      }

      <!-- Vacuum chamber body -->
      <ellipse cx="280" cy="100" rx="80" ry="50"
               fill="var(--f-layer-1)"
               stroke-width="2"
               [attr.stroke]="chamberColor()"
               stroke-opacity="0.8" />

      <!-- Chamber inner ring -->
      <ellipse cx="280" cy="100" rx="68" ry="40"
               fill="none"
               stroke-width="1"
               [attr.stroke]="chamberColor()"
               stroke-opacity="0.3" />

      <!-- Kr label -->
      <text x="280" y="95" text-anchor="middle" font-size="18"
            fill="var(--f-text-1)" font-family="Jura, sans-serif"
            font-weight="700" letter-spacing="0.08em" opacity="0.9">Kr</text>
      <text x="280" y="110" text-anchor="middle" font-size="8"
            fill="var(--f-text-3)" font-family="Jura, sans-serif" letter-spacing="0.12em">
        {{ chamberLabel() }}
      </text>

      <!-- Krypton atom dots (visible when containment selected) -->
      @if (config().containment) {
        @for (dot of atomDots; track dot.id) {
          <circle [attr.cx]="dot.cx" [attr.cy]="dot.cy" [attr.r]="dot.r"
                  [attr.fill]="chamberColor()" [attr.opacity]="dot.op" />
        }
      }

      <!-- Viewport windows (flanges) -->
      <rect x="198" y="88" width="8" height="24" rx="2"
            [attr.fill]="chamberColor()" opacity="0.5" />
      <rect x="354" y="88" width="8" height="24" rx="2"
            [attr.fill]="chamberColor()" opacity="0.5" />

      <!-- Mount feet -->
      <line x1="240" y1="150" x2="240" y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />
      <line x1="320" y1="150" x2="320" y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />

      <!-- ══ SIGNAL PATH ═══════════════════════════════ -->
      @if (config().detector) {
        <line x1="362" y1="100" x2="428" y2="100"
              [attr.stroke]="'url(#' + sigGradId() + ')'"
              stroke-width="2.5"
              stroke-dasharray="6 3" />
        <polygon points="428,95 438,100 428,105"
                 [attr.fill]="detectorColor()" opacity="0.8" />
      } @else {
        <line x1="362" y1="100" x2="438" y2="100"
              stroke="var(--f-stroke)" stroke-width="1.5"
              stroke-opacity="0.25" stroke-dasharray="4 4" />
      }

      <!-- ══ DETECTOR BLOCK ════════════════════════════ -->
      <rect x="440" y="68" width="88" height="68" rx="6"
            [attr.fill]="'url(#' + detGradId() + ')'"
            stroke-width="1.5"
            [attr.stroke]="detectorColor()"
            stroke-opacity="0.7" />

      <text x="484" y="97" text-anchor="middle" font-size="22"
            [attr.fill]="detectorColor()" font-family="Font Awesome 6 Free" font-weight="900"
            opacity="0.85">{{ detectorGlyph() }}</text>

      <text x="484" y="118" text-anchor="middle" font-size="8.5"
            fill="var(--f-text-2)" font-family="Jura, sans-serif" letter-spacing="0.05em">
        {{ detectorLabel() }}
      </text>

      <!-- Mount feet -->
      <line x1="460" y1="136" x2="460" y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />
      <line x1="508" y1="136" x2="508" y2="185" stroke="var(--f-stroke)" stroke-width="1" stroke-opacity="0.4" />

      <!-- ══ LABELS ═════════════════════════════════════ -->
      @if (!compact()) {
        <text x="76"  y="170" text-anchor="middle" font-size="9"
              fill="var(--f-text-3)" font-family="Jura, sans-serif" letter-spacing="0.1em">SOURCE</text>
        <text x="280" y="170" text-anchor="middle" font-size="9"
              fill="var(--f-text-3)" font-family="Jura, sans-serif" letter-spacing="0.1em">CHAMBER</text>
        <text x="484" y="170" text-anchor="middle" font-size="9"
              fill="var(--f-text-3)" font-family="Jura, sans-serif" letter-spacing="0.1em">DETECTOR</text>
      }
    </svg>
  `,
  styles: [`
    :host { display: block; }
    svg { width: 100%; height: auto; overflow: visible; }
    svg.compact { max-height: 90px; }
  `],
})
export class ApparatusPreviewComponent {
  public readonly config  = input.required<ExperimentConfig>();
  public readonly compact = input<boolean>(false);

  // ── Unique gradient IDs (avoids collisions when two instances coexist) ──────
  private readonly uid     = Math.random().toString(36).slice(2, 6);
  protected readonly glowId     = computed(() => `ap-glow-${this.uid}`);
  protected readonly beamGradId = computed(() => `ap-beam-${this.uid}`);
  protected readonly sigGradId  = computed(() => `ap-sig-${this.uid}`);
  protected readonly srcGradId  = computed(() => `ap-src-${this.uid}`);
  protected readonly detGradId  = computed(() => `ap-det-${this.uid}`);

  // ── Colour derived from excitation selection ─────────────────────────────────
  protected readonly beamColor = computed((): string => {
    const exc = EXCITATION_OPTIONS.find(o => o.id === this.config().excitation);
    return exc?.accentColor ?? '#7dd3fc';
  });

  // ── Chamber colour from containment ─────────────────────────────────────────
  protected readonly chamberColor = computed((): string => {
    const map: Record<string, string> = {
      'linear-trap':      '#7dd3fc',
      'quadrupole-trap':  '#c084fc',
      'cryogenic-cell':   '#67e8f9',
      'flow-cell':        '#86efac',
    };
    return map[this.config().containment ?? ''] ?? '#4b5563';
  });

  protected readonly chamberLabel = computed((): string => {
    const opt = CONTAINMENT_OPTIONS.find(o => o.id === this.config().containment);
    return opt?.name.toUpperCase() ?? 'SELECT CHAMBER';
  });

  // ── Detector colour ──────────────────────────────────────────────────────────
  protected readonly detectorColor = computed((): string => {
    const map: Record<string, string> = {
      'ccd-array':   '#fbbf24',
      'apd':         '#f472b6',
      'channeltron': '#34d399',
      'faraday-cup': '#94a3b8',
    };
    return map[this.config().detector ?? ''] ?? '#4b5563';
  });

  // ── Source icon glyph (FontAwesome unicode) ──────────────────────────────────
  protected readonly sourceGlyph = computed((): string => {
    const map: Record<string, string> = {
      'diode-laser':   '',   // fa-lightbulb
      'ti-sapphire':   '',   // fa-gem
      'rf-discharge':  '',   // fa-broadcast-tower
      'electron-beam': '',   // fa-circle-radiation
    };
    return map[this.config().excitation ?? ''] ?? '';  // fa-question
  });

  protected readonly sourceLabel = computed((): string => {
    const opt = EXCITATION_OPTIONS.find(o => o.id === this.config().excitation);
    return opt?.name.toUpperCase() ?? 'SELECT SOURCE';
  });

  // ── Detector icon glyph ──────────────────────────────────────────────────────
  protected readonly detectorGlyph = computed((): string => {
    const map: Record<string, string> = {
      'ccd-array':   '',  // fa-grip
      'apd':         '',  // fa-eye
      'channeltron': '',  // fa-microchip
      'faraday-cup': '',  // fa-circle-dot
    };
    return map[this.config().detector ?? ''] ?? '';
  });

  protected readonly detectorLabel = computed((): string => {
    const opt = DETECTOR_OPTIONS.find(o => o.id === this.config().detector);
    return opt?.name.toUpperCase() ?? 'SELECT DETECTOR';
  });

  // ── Krypton atom positions (static, decorative) ──────────────────────────────
  protected readonly atomDots = [
    { id: 0, cx: 255, cy: 88,  r: 3, op: 0.7 },
    { id: 1, cx: 300, cy: 82,  r: 2, op: 0.5 },
    { id: 2, cx: 270, cy: 108, r: 3, op: 0.6 },
    { id: 3, cx: 310, cy: 106, r: 2, op: 0.4 },
    { id: 4, cx: 285, cy: 95,  r: 4, op: 0.8 },
    { id: 5, cx: 258, cy: 115, r: 2, op: 0.3 },
    { id: 6, cx: 305, cy: 92,  r: 2, op: 0.5 },
  ];
}
