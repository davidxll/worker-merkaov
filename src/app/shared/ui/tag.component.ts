import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

@Component({
  selector: 'app-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="k-tag" [attr.data-severity]="severity()">
      @if (icon()) { <i [class]="icon()" aria-hidden="true"></i> }
      {{ value() }}
    </span>
  `,
  styles: [`
    .k-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: var(--kr-radius);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: var(--kr-tracking);
      background: var(--kr-layer-2);
      color: var(--f-text-2);
      border: 1px solid var(--kr-stroke);

      i { font-size: 10px; }

      &[data-severity="success"] {
        background: rgba(107,191,160,0.14);
        color: var(--kr-success);
        border-color: rgba(107,191,160,0.30);
      }
      &[data-severity="warn"] {
        background: rgba(200,148,58,0.14);
        color: var(--kr-warning);
        border-color: rgba(200,148,58,0.30);
      }
      &[data-severity="danger"] {
        background: rgba(200,90,90,0.14);
        color: var(--kr-error);
        border-color: rgba(200,90,90,0.30);
      }
      &[data-severity="info"] {
        background: var(--kr-primary-ghost);
        color: var(--kr-primary-light);
        border-color: rgba(126,200,227,0.22);
      }
    }
  `],
})
export class AppTagComponent {
  public readonly value    = input('');
  public readonly severity = input<TagSeverity>('secondary');
  public readonly icon     = input('');
}
