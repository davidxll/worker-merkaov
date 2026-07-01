import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'warn' | 'danger' | 'info';
export type ButtonSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="k-btn"
      [class.k-btn--outlined]="outlined()"
      [class.k-btn--text]="text()"
      [class.k-btn--rounded]="rounded()"
      [class.k-btn--raised]="raised()"
      [class.k-btn--icon-only]="!label() && !!icon()"
      [class.k-btn--sm]="size() === 'small'"
      [class.k-btn--lg]="size() === 'large'"
      [attr.data-severity]="severity()"
      [disabled]="disabled() || loading()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
      } @else if (icon() && iconPos() === 'left') {
        <i [class]="icon()" aria-hidden="true"></i>
      }
      @if (label()) {
        <span>{{ label() }}</span>
      }
      @if (!loading() && icon() && iconPos() === 'right') {
        <i [class]="icon()" aria-hidden="true"></i>
      }
    </button>
  `,
  styles: [`
    .k-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 32px;
      padding: 0 16px;
      border-radius: var(--kr-radius);
      border: 1px solid transparent;
      background: var(--kr-primary);
      color: #fff;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: var(--kr-tracking);
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease),
                  opacity 150ms var(--f-ease), box-shadow 150ms var(--f-ease), filter 150ms var(--f-ease);

      i { font-size: 12px; }

      &:hover:not(:disabled)  { filter: brightness(1.12); }
      &:active:not(:disabled) { filter: brightness(0.88); }
      &:disabled              { opacity: 0.5; cursor: not-allowed; }
      &:focus-visible         { outline: none; box-shadow: var(--kr-primary-glow); }

      &.k-btn--sm { height: 28px; padding: 0 12px; font-size: 12px; }
      &.k-btn--lg { height: 38px; padding: 0 20px; font-size: 14px; }
      &.k-btn--rounded { border-radius: 999px; }
      &.k-btn--raised { box-shadow: var(--kr-shadow-4); }
      &.k-btn--raised:hover:not(:disabled) { box-shadow: var(--kr-shadow-8); }

      &.k-btn--icon-only { width: 32px; padding: 0; }
      &.k-btn--icon-only.k-btn--sm { width: 28px; }
      &.k-btn--icon-only.k-btn--lg { width: 38px; }

      &[data-severity="secondary"] {
        background: rgba(255,255,255,0.06);
        border-color: var(--f-stroke-sd);
        color: var(--f-text-1);
        &:hover:not(:disabled) { filter: none; background: rgba(255,255,255,0.10); }
      }
      &[data-severity="success"] { background: var(--kr-success); }
      &[data-severity="warn"]    { background: var(--kr-warning); }
      &[data-severity="danger"]  { background: var(--kr-error); }
      &[data-severity="info"]    { background: var(--kr-info); }

      &.k-btn--outlined {
        background: transparent;
        border-color: currentColor;
        color: var(--kr-primary);
        &:hover:not(:disabled) { filter: none; background: rgba(255,255,255,0.06); }
        &[data-severity="secondary"] { color: var(--f-text-1); }
        &[data-severity="success"]   { color: var(--kr-success); }
        &[data-severity="warn"]     { color: var(--kr-warning); }
        &[data-severity="danger"]  { color: var(--kr-error); }
        &[data-severity="info"]    { color: var(--kr-info); }
      }

      &.k-btn--text {
        background: transparent;
        border-color: transparent;
        color: var(--kr-primary);
        &:hover:not(:disabled) { filter: none; background: rgba(255,255,255,0.06); }
        &[data-severity="secondary"] { color: var(--f-text-2); }
        &[data-severity="success"]   { color: var(--kr-success); }
        &[data-severity="warn"]     { color: var(--kr-warning); }
        &[data-severity="danger"]  { color: var(--kr-error); }
        &[data-severity="info"]    { color: var(--kr-info); }
      }
    }
  `],
})
export class AppButtonComponent {
  public readonly label     = input('');
  public readonly severity  = input<ButtonSeverity>('primary');
  public readonly outlined  = input(false);
  public readonly text      = input(false);
  public readonly rounded   = input(false);
  public readonly raised    = input(false);
  public readonly loading   = input(false);
  public readonly disabled  = input(false);
  public readonly icon      = input('');
  public readonly iconPos   = input<'left' | 'right'>('left');
  public readonly size      = input<ButtonSize>('normal');
  public readonly ariaLabel = input('');

  public readonly clicked = output<void>();
}
