import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="k-chip">
      {{ label() }}
      @if (removable()) {
        <button type="button" class="k-chip-remove" (click)="remove.emit()" [attr.aria-label]="'Remove ' + label()">
          <i class="fas fa-xmark" aria-hidden="true"></i>
        </button>
      }
    </span>
  `,
  styles: [`
    .k-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border-radius: var(--kr-radius);
      background: var(--kr-layer-2);
      color: var(--kr-text-2);
      border: 1px solid var(--kr-stroke);
      font-size: 12px;
      letter-spacing: var(--kr-tracking);
    }
    .k-chip-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--f-text-3);
      cursor: pointer;
      border-radius: 50%;
      font-size: 9px;
      transition: color 150ms var(--f-ease), background 150ms var(--f-ease);
      &:hover { color: var(--kr-error); background: rgba(200,90,90,0.14); }
    }
  `],
})
export class AppChipComponent {
  public readonly label     = input('');
  public readonly removable = input(false);

  public readonly remove = output<void>();
}
