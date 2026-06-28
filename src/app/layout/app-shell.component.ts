import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <!-- ── Mobile topbar ── -->
    <header class="mobile-topbar md:hidden">
      <button class="topbar-hamburger" (click)="layout.openMobile()" aria-label="Open menu">
        <i class="fas fa-list-ul" aria-hidden="true"></i>
      </button>
      <span class="topbar-logo">Waltkerovoz</span>
    </header>

    <!-- ── App shell ── -->
    <div class="app-shell">
      <app-nav></app-nav>
      <main class="main-content" id="main-content" tabindex="-1">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .mobile-topbar {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
      padding: 0 16px;
      background: var(--f-acrylic-bg);
      backdrop-filter: blur(var(--f-acrylic-blur));
      -webkit-backdrop-filter: blur(var(--f-acrylic-blur));
      border-bottom: 1px solid var(--f-stroke);
    }
    .topbar-hamburger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 4px;
      color: var(--f-text-2);
      cursor: pointer;
      transition: background var(--f-ease-fast), color var(--f-ease-fast);
      &:hover { background: rgba(255,255,255,0.06); color: var(--f-text-1); }
    }
    .topbar-logo {
      color: var(--f-text-1);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0;
    }

    .app-shell {
      display: flex;
      background: var(--f-base);
      height: 100vh;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      width: 100%;
      height: calc(100vh - 48px);
      @apply md:h-screen;
    }
  `],
})
export class AppShellComponent {
  protected readonly layout = inject(LayoutService);
}
