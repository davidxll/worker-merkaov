import { ChangeDetectionStrategy, Component, OnDestroy, input, model, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    @if (visible()) {
      <div
        class="k-dialog-backdrop"
        [class.k-dialog-backdrop--bare]="!modal()"
        (click)="onBackdropClick()"
      >
        <div
          class="k-dialog"
          [style.width]="width()"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
        >
          <div class="k-dialog-header">
            <h3 class="k-dialog-title">{{ header() }}</h3>
            <button type="button" class="k-dialog-close" (click)="close()" aria-label="Close dialog">
              <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
          <div class="k-dialog-body">
            <ng-content />
          </div>
          <div class="k-dialog-footer">
            <ng-content select="[dialogFooter]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .k-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(3,4,10,0.65);
      backdrop-filter: blur(2px);
      animation: k-dialog-fade 160ms var(--kr-ease-out);

      &.k-dialog-backdrop--bare {
        background: transparent;
        backdrop-filter: none;
        pointer-events: none;
        .k-dialog { pointer-events: auto; }
      }
    }
    .k-dialog {
      display: flex;
      flex-direction: column;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 64px);
      background: var(--kr-layer-1);
      border: 1px solid var(--kr-stroke-sd);
      border-radius: var(--kr-radius-xl);
      box-shadow: var(--kr-shadow-16);
      animation: k-dialog-pop 160ms var(--kr-ease-out);
    }
    .k-dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--kr-stroke);
      flex-shrink: 0;
    }
    .k-dialog-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--kr-text-1);
    }
    .k-dialog-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--f-text-3);
      cursor: pointer;
      border-radius: var(--kr-radius);
      transition: color 150ms var(--f-ease), background 150ms var(--f-ease);
      &:hover { color: var(--f-text-1); background: var(--kr-layer-2); }
    }
    .k-dialog-body {
      padding: 20px;
      overflow-y: auto;
      color: var(--f-text-2);
      font-size: 14px;
      line-height: 1.5;
    }
    .k-dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 20px;
      border-top: 1px solid var(--kr-stroke);
      flex-shrink: 0;
      &:empty { display: none; }
    }
    @keyframes k-dialog-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes k-dialog-pop  { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  `],
})
export class AppDialogComponent implements OnDestroy {
  public readonly visible = model(false);
  public readonly header  = input('');
  public readonly modal   = input(true);
  public readonly width   = input('480px');

  public readonly hide = output<void>();

  protected onBackdropClick(): void {
    if (this.modal()) this.close();
  }

  protected onEscape(): void {
    if (this.visible()) this.close();
  }

  protected close(): void {
    this.visible.set(false);
    this.hide.emit();
  }

  public ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
