import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppService } from '../services/app.service';
import { LayoutService } from '../services/layout.service';
import type { NavItem } from '../models/models';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- ── Mobile backdrop ── -->
    @if (layout.mobileOpen()) {
      <button class="mobile-backdrop" type="button" (click)="layout.closeMobile()" aria-label="Close navigation"></button>
    }

    <!-- ── Navigation pane (WinUI NavigationView) ── -->
    <aside class="nav-pane" aria-label="Site navigation" [class.collapsed]="layout.collapsed()" [class.mobile-open]="layout.mobileOpen()">

      <!-- Logo / pane header -->
      <a class="pane-header" routerLink="/welcome" aria-label="Go to landing page">
        <span class="pane-logo-icon">
          <i class="fas fa-gear" aria-hidden="true"></i>
        </span>
        @if (!layout.collapsed()) {
          <span class="pane-logo-text">Waltkerovoz</span>
        }
      </a>

      <!-- Collapse toggle (desktop only) -->
      <button class="collapse-btn" (click)="layout.toggle()"
              [attr.aria-label]="layout.collapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
        <i class="fas" aria-hidden="true"
           [class.fa-chevron-left]="!layout.collapsed()"
           [class.fa-chevron-right]="layout.collapsed()"></i>
      </button>

      <div class="pane-divider"></div>

      <!-- Nav items -->
      <nav class="pane-nav" aria-label="Main navigation">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-item"
            [attr.aria-label]="item.label"
            (click)="layout.closeMobile()">
            <span class="nav-sel-indicator"></span>
            <i [class]="item.icon + ' nav-icon'" aria-hidden="true"></i>
            @if (!layout.collapsed()) {
              <span class="nav-label">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Pane footer -->
      @if (!layout.collapsed()) {
        <div class="pane-footer">
          <span>Angular 21 PWA</span>
        </div>
      }
    </aside>
  `,
  styles: [`
    /* ── Backdrop ── */
    .mobile-backdrop {
      @apply fixed inset-0 z-40 md:hidden;
      background: rgba(0,0,0,0.5);
      border: none;
      padding: 0;
      cursor: default;
    }

    /* ── Navigation pane ── */
    .nav-pane {
      display: flex;
      flex-direction: column;
      width: 260px;
      height: 100vh;
      flex-shrink: 0;
      position: relative;
      z-index: 50;

      /* Acrylic material */
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.5);
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur)) saturate(1.5);
      border-right: 1px solid var(--f-stroke);

      padding: 0 4px 12px;

      transition: width 150ms var(--f-ease);

      /* Mobile: slide-in overlay */
      @apply fixed top-0 left-0 -translate-x-full;
      @apply md:relative md:translate-x-0 md:top-auto md:left-auto;

      /* Tablet: always show as collapsed sidebar, hide text elements */
      @media (min-width: 768px) and (max-width: 1023px) { width: 48px; overflow: hidden; }
    }
    .nav-pane.mobile-open { transform: translateX(0); }
    .nav-pane.collapsed   { width: 48px; }

    /* ── Pane header ── */
    .pane-header {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
      padding: 0 8px;
      overflow: hidden;
      text-decoration: none;
      cursor: pointer;
      border-radius: 4px;
      transition: background 150ms var(--f-ease);
      &:hover { background: rgba(255,255,255,0.06); }
    }
    .pane-logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 4px;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-accent-light);
      font-size: 15px;
    }
    .pane-logo-text {
      color: var(--f-text-1);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* ── Collapse button ── */
    .collapse-btn {
      @apply hidden lg:flex;
      position: absolute;
      right: -12px;
      top: 56px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--f-layer-2);
      border: 1px solid var(--f-stroke-sd);
      color: var(--f-text-3);
      align-items: center;
      justify-content: center;
      font-size: 11px;
      cursor: pointer;
      z-index: 10;
      transition: color var(--f-ease-fast), background var(--f-ease-fast);
      &:hover { background: var(--f-layer-3); color: var(--f-text-1); }
      /* Expand hit area to 44×44 without changing visual size */
      &::after {
        content: '';
        position: absolute;
        inset: -10px;
      }
    }

    /* ── Divider ── */
    .pane-divider {
      height: 1px;
      margin: 4px 8px;
      background: var(--f-stroke);
    }

    /* ── Nav items ── */
    .pane-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      overflow: hidden;
      padding: 4px 0;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 44px;
      padding: 0 8px;
      border-radius: 4px;
      color: var(--f-text-2);
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      overflow: hidden;
      cursor: pointer;
      transition: background var(--f-ease-fast), color var(--f-ease-fast);

      /* Reveal highlight (simplified) */
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 4px;
        opacity: 0;
        transition: opacity var(--f-ease-fast);
        background: radial-gradient(
          circle 80px at var(--rx, 50%) var(--ry, 50%),
          rgba(255,255,255,0.07),
          transparent 70%
        );
      }

      &:hover {
        background: rgba(255,255,255,0.06);
        color: var(--f-text-1);
        &::before { opacity: 1; }
      }

      &.active {
        background: rgba(58, 143, 200, 0.16);
        color: var(--f-text-1);
        font-weight: 600;
        .nav-sel-indicator { opacity: 1; }
      }
    }

    /* Active indicator — WinUI left bar */
    .nav-sel-indicator {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      border-radius: 0 2px 2px 0;
      background: var(--f-accent);
      opacity: 0;
      transition: opacity var(--f-ease-fast);
    }

    .nav-icon  { width: 16px; text-align: center; font-size: 14px; flex-shrink: 0; }
    .nav-label { white-space: nowrap; }

    /* ── Pane footer ── */
    .pane-footer {
      display: flex;
      align-items: center;
      padding: 0 12px;
      color: var(--f-text-3);
      font-size: 11px;
    }

    /* Tablet (768–1023px): force sidebar to 48px icon-only strip */
    @media (min-width: 768px) and (max-width: 1023px) {
      .pane-logo-text { display: none; }
      .nav-label      { display: none; }
      .pane-footer    { display: none; }
    }
  `],
})
export class NavComponent {
  protected readonly layout   = inject(LayoutService);
  protected readonly navItems = toSignal(inject(AppService).getNavItems(), { initialValue: [] as NavItem[] });
}
