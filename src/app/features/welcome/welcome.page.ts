import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- ── Top nav ── -->
    <nav class="wl-nav">
      <a class="wl-logo" routerLink="/welcome">
        <i class="fas fa-gear wl-logo-icon"></i>
        <span class="wl-logo-text">WALTKEROVOZ</span>
      </a>
      <div class="wl-nav-links">
        <a routerLink="/app/home">Showcase</a>
        <a routerLink="/app/gear-builder">Gear Builder</a>
        <a routerLink="/app/experiment-designer">Experiment Designer</a>
        <a routerLink="/app/element-explorer">Element Explorer</a>
      </div>
      <a class="wl-launch-btn" routerLink="/app">
        Launch app <i class="fas fa-arrow-right"></i>
      </a>
    </nav>

    <!-- ── Hero ── -->
    <section class="wl-hero">
      <div class="wl-hero-body">
        <div class="wl-eyebrow">
          <span class="wl-eyebrow-dot"></span>
          ANGULAR 21 &nbsp;·&nbsp; PWA &nbsp;·&nbsp; KRYPTON SERIES
        </div>

        <h1 class="wl-title">
          Build fast.<br>
          Build <span class="wl-title-accent">beautifully.</span>
        </h1>

        <p class="wl-desc">
          Waltkerovoz is a reference-grade Angular 21 PWA — a living PrimeNG component
          showcase <strong>and</strong> a fully-built vehicle configurator — forged inside
          the <strong>Crystalline Torque</strong> design system. One theme file. Every
          component re-skinned in noble-gas light.
        </p>

        <div class="wl-actions">
          <a class="wl-btn-primary" routerLink="/app">
            Launch the demo <i class="fas fa-arrow-right"></i>
          </a>
          <a class="wl-btn-secondary" routerLink="/app/home">
            <i class="fas fa-code"></i> View source
          </a>
        </div>

        <div class="wl-chips">
          @for (chip of techChips; track chip) {
            <span class="wl-chip">{{ chip }}</span>
          }
        </div>
      </div>

      <div class="wl-hero-visual">
        <img src="logo_krypton_gear.png" alt="Kr·36 Gear" class="wl-gear-img" />
      </div>
    </section>

    <!-- ── Stats bar ── -->
    <div class="wl-stats">
      @for (stat of stats; track stat.label) {
        <div class="wl-stat">
          <span class="wl-stat-value">{{ stat.value }}</span>
          <span class="wl-stat-label">{{ stat.label }}</span>
        </div>
      }
    </div>

    <!-- ── Feature cards ── -->
    <section class="wl-features">
      @for (feat of features; track feat.title) {
        <div class="wl-feat-card">
          <span class="wl-feat-icon"><i [class]="feat.icon"></i></span>
          <h3 class="wl-feat-title">{{ feat.title }}</h3>
          <p class="wl-feat-desc">{{ feat.desc }}</p>
        </div>
      }
    </section>

    <!-- ── Gear Builder showcase ── -->
    <section class="wl-showcase">
      <div class="wl-showcase-eyebrow">
        <span class="wl-eyebrow-dot"></span> THE FLAGSHIP FLOW
      </div>
      <h2 class="wl-showcase-title">The Gear Builder</h2>
      <p class="wl-showcase-desc">
        Configure your machine in three interlocking moves. Every choice renders into a
        live vector preview — body, glass, rims and corona, assembled in real time.
      </p>
      <a class="wl-btn-primary wl-showcase-cta" routerLink="/app/gear-builder">
        Open Gear Builder <i class="fas fa-arrow-right"></i>
      </a>
    </section>

    <!-- ── Footer ── -->
    <footer class="wl-footer">
      <span class="wl-footer-logo">WALTKEROVOZ</span>
      <span class="wl-footer-sub">Kr · 36 · 83.798 u &nbsp;·&nbsp; CRYSTALLINE TORQUE DESIGN SYSTEM v1.0</span>
      <a class="wl-footer-link" routerLink="/app">Enter the app →</a>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--f-base);
      color: var(--f-text-1);
      font-family: var(--kr-font-ui, 'Jura', sans-serif);
    }

    /* ── Nav ── */
    .wl-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 0 40px;
      height: 56px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-bottom: 1px solid var(--f-stroke);
    }
    .wl-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .wl-logo-icon {
      font-size: 16px;
      color: var(--f-accent-light);
    }
    .wl-logo-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--f-text-1);
    }
    .wl-nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      flex: 1;
      a {
        font-size: 13px;
        color: var(--f-text-2);
        text-decoration: none;
        letter-spacing: 0.04em;
        transition: color 150ms;
        &:hover { color: var(--f-text-1); }
      }
    }
    @media (max-width: 1023px) { .wl-nav-links { display: none; } }
    @media (max-width: 767px)  { .wl-nav { padding: 0 16px; } .wl-launch-btn { display: none; } }

    .wl-launch-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      height: 34px;
      border-radius: 4px;
      background: var(--f-accent);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.04em;
      transition: background 150ms;
      flex-shrink: 0;
      &:hover { background: var(--f-accent-hover); color: var(--f-base); }
    }

    /* ── Hero ── */
    .wl-hero {
      display: flex;
      align-items: center;
      gap: 64px;
      padding: 96px 40px 80px;
      max-width: 1200px;
      margin: 0 auto;
      @media (max-width: 900px) {
        flex-direction: column;
        padding: 64px 24px 48px;
      }
    }
    .wl-hero-body {
      flex: 1;
      max-width: 540px;
    }
    .wl-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      color: var(--f-text-2);
      letter-spacing: 0.08em;
      margin-bottom: 24px;
      border: 1px solid var(--f-stroke-sd);
      padding: 5px 12px;
      border-radius: 4px;
      background: rgba(58,143,200,0.06);
    }
    .wl-eyebrow-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--f-accent);
      flex-shrink: 0;
    }
    .wl-title {
      font-size: clamp(40px, 6vw, 68px);
      font-weight: 600;
      line-height: 1.1;
      color: var(--f-text-1);
      margin: 0 0 24px;
      letter-spacing: -0.02em;
    }
    .wl-title-accent { color: var(--f-accent-light); }
    .wl-desc {
      font-size: 15px;
      line-height: 1.7;
      color: var(--f-text-2);
      margin: 0 0 36px;
      strong { color: var(--f-text-1); font-weight: 600; }
    }
    .wl-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }
    .wl-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      height: 40px;
      border-radius: 4px;
      background: var(--f-accent);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: background 150ms;
      &:hover { background: var(--f-accent-hover); color: var(--f-base); }
    }
    .wl-btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 20px;
      height: 40px;
      border-radius: 4px;
      background: transparent;
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-text-1);
      font-size: 14px;
      text-decoration: none;
      transition: background 150ms, border-color 150ms;
      &:hover { background: var(--f-layer-2); border-color: var(--f-stroke-fc); }
    }
    .wl-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .wl-chip {
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid var(--f-stroke);
      background: rgba(255,255,255,0.03);
      color: var(--f-text-2);
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.04em;
    }

    /* ── Gear image ── */
    .wl-hero-visual {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wl-gear-img {
      width: clamp(200px, 30vw, 340px);
      height: auto;
      opacity: 0.92;
      filter: drop-shadow(0 0 32px rgba(126,200,227,0.18));
    }

    /* ── Stats bar ── */
    .wl-stats {
      display: flex;
      justify-content: center;
      gap: 0;
      border-top: 1px solid var(--f-stroke);
      border-bottom: 1px solid var(--f-stroke);
      background: var(--f-layer-0);
    }
    .wl-stat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px 16px;
      border-right: 1px solid var(--f-stroke);
      &:last-child { border-right: none; }
    }
    .wl-stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--f-accent-light);
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: 6px;
    }
    @media (max-width: 639px) {
      .wl-stats { flex-wrap: wrap; }
      .wl-stat  { flex: 0 0 50%; border-right: 1px solid var(--f-stroke); }
      .wl-stat:nth-child(2n) { border-right: none; }
      .wl-stat:nth-child(1), .wl-stat:nth-child(2) { border-bottom: 1px solid var(--f-stroke); }
    }

    .wl-stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--f-text-3);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: center;
    }

    /* ── Feature cards ── */
    .wl-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1px;
      background: var(--f-stroke);
      border-top: 1px solid var(--f-stroke);
    }
    .wl-feat-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 40px 36px;
      background: var(--f-layer-1);
      transition: background 150ms;
      &:hover { background: var(--f-layer-2); }
    }
    .wl-feat-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-accent-light);
      font-size: 16px;
    }
    .wl-feat-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--f-text-1);
      margin: 0;
    }
    .wl-feat-desc {
      font-size: 14px;
      color: var(--f-text-2);
      line-height: 1.6;
      margin: 0;
    }

    /* ── Gear Builder showcase ── */
    .wl-showcase {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 96px 40px;
      background: var(--f-layer-0);
      border-top: 1px solid var(--f-stroke);
      border-bottom: 1px solid var(--f-stroke);
    }
    .wl-showcase-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--f-text-3);
      margin-bottom: 20px;
    }
    .wl-showcase-title {
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 700;
      color: var(--f-text-1);
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }
    .wl-showcase-desc {
      font-size: 15px;
      color: var(--f-text-2);
      line-height: 1.7;
      max-width: 560px;
      margin: 0 0 36px;
    }
    @media (max-width: 767px)                         { .wl-showcase { padding: 48px 20px; } }
    @media (min-width: 768px) and (max-width: 1023px) { .wl-showcase { padding: 64px 32px; } }
    .wl-showcase-cta { font-size: 15px; padding: 0 28px; height: 44px; }

    /* ── Footer ── */
    .wl-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 24px 40px;
      background: var(--f-base);
      border-top: 1px solid var(--f-stroke);
    }
    .wl-footer-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--f-text-3);
    }
    .wl-footer-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.08em;
      color: var(--f-text-3);
      text-transform: uppercase;
    }
    .wl-footer-link {
      font-size: 13px;
      color: var(--f-accent-light);
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
  `],
})
export class WelcomePage {
  readonly techChips = ['Angular 21', 'TypeScript', 'PrimeNG', 'AG Grid', 'Signals', 'SCSS'];

  readonly stats = [
    { value: '8',      label: 'Component Families' },
    { value: '2,000+', label: 'FontAwesome Icons'  },
    { value: '3',      label: 'Step Gear Builder'  },
    { value: '1',      label: 'SCSS Theme File'    },
  ];

  readonly features = [
    {
      icon: 'fas fa-icons',
      title: 'FontAwesome Free',
      desc: '2,000+ solid, regular and brand glyphs as plain CSS classes — no icon-font ceremony required.',
    },
    {
      icon: 'fab fa-angular',
      title: 'Standalone Angular 21',
      desc: 'Signals, standalone components and a zoneless-ready architecture — modern Angular, no NgModule boilerplate.',
    },
    {
      icon: 'fas fa-mobile-screen',
      title: 'Installable PWA',
      desc: 'Service worker, web manifest and an offline shell — Waltkerovoz installs to the home screen like a native app.',
    },
  ];
}
