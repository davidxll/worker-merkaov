import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService, type ToastSeverity } from './toast.service.js';

const SEVERITY_ICONS: Record<ToastSeverity, string> = {
  success: 'fas fa-circle-check',
  info:    'fas fa-circle-info',
  warn:    'fas fa-triangle-exclamation',
  danger:  'fas fa-circle-exclamation',
};

@Component({
  selector: 'app-toast-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="k-toast-host">
      @for (msg of toastSvc.messages(); track msg.id) {
        <div class="k-toast" [attr.data-severity]="msg.severity">
          <i [class]="severityIcons[msg.severity]" aria-hidden="true"></i>
          <div class="k-toast-body">
            <div class="k-toast-summary">{{ msg.summary }}</div>
            @if (msg.detail) { <div class="k-toast-detail">{{ msg.detail }}</div> }
          </div>
          <button type="button" class="k-toast-close" (click)="toastSvc.remove(msg.id)" aria-label="Dismiss">
            <i class="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .k-toast-host {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 360px;
    }
    .k-toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: var(--kr-radius-lg);
      background: var(--kr-layer-1);
      border: 1px solid var(--kr-stroke-sd);
      box-shadow: var(--kr-shadow-8);
      animation: k-toast-in 200ms var(--kr-ease-out);

      i:first-child { font-size: 16px; margin-top: 1px; }
      &[data-severity="success"] i:first-child { color: var(--kr-success); }
      &[data-severity="info"]    i:first-child { color: var(--kr-info); }
      &[data-severity="warn"]    i:first-child { color: var(--kr-warning); }
      &[data-severity="danger"]  i:first-child { color: var(--kr-error); }
    }
    .k-toast-body { flex: 1; min-width: 0; }
    .k-toast-summary { font-size: 13px; font-weight: 600; color: var(--kr-text-1); }
    .k-toast-detail  { font-size: 12px; color: var(--f-text-2); margin-top: 2px; }
    .k-toast-close {
      border: none;
      background: transparent;
      color: var(--f-text-3);
      cursor: pointer;
      padding: 0;
      width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      &:hover { color: var(--f-text-1); }
    }
    @keyframes k-toast-in { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
  `],
})
export class ToastHostComponent {
  protected readonly toastSvc = inject(ToastService);
  protected readonly severityIcons = SEVERITY_ICONS;
}
