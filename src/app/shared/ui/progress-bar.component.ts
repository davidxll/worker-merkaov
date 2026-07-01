import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="k-progressbar">
      <div class="k-progressbar-value" [style.width.%]="value()"></div>
    </div>
    @if (showValue()) {
      <span class="k-progressbar-label">{{ value() }}%</span>
    }
  `,
  styles: [`
    :host { display: block; }
    .k-progressbar {
      position: relative;
      width: 100%;
      height: 3px;
      border-radius: 2px;
      background: var(--kr-layer-3);
      overflow: hidden;
    }
    .k-progressbar-value {
      height: 100%;
      background: linear-gradient(90deg, var(--kr-primary-dim), var(--kr-primary-light));
      transition: width 300ms var(--f-ease);
    }
    .k-progressbar-label {
      display: block;
      margin-top: 4px;
      font-size: 11px;
      color: var(--f-text-3);
    }
  `],
})
export class AppProgressBarComponent {
  public readonly value      = input(0);
  public readonly showValue  = input(true);
}
