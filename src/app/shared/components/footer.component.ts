import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="page-footer">
      <div class="footer-divider"></div>
      <p class="footer-text">
        Built with Angular 21 &middot; Krypton UI &middot; AG Grid &middot; Tailwind CSS &middot; FontAwesome
      </p>
    </footer>
  `,
  styles: [`
    .page-footer {
      padding: 0 40px 32px;
      background: var(--f-layer-0);
    }
    .footer-divider {
      height: 1px;
      background: var(--f-stroke);
      margin-bottom: 24px;
    }
    .footer-text {
      margin: 0;
      font-size: 12px;
      color: var(--f-text-3);
      text-align: center;
    }
  `],
})
export class FooterComponent {}
