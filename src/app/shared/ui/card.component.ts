import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="k-card">
      <div class="k-card-header"><ng-content select="[card-header]" /></div>
      <div class="k-card-body">
        <div class="k-card-title"><ng-content select="[card-title]" /></div>
        <div class="k-card-subtitle"><ng-content select="[card-subtitle]" /></div>
        <div class="k-card-content"><ng-content select="[card-content]" /></div>
      </div>
      <div class="k-card-footer"><ng-content select="[card-footer]" /></div>
    </div>
  `,
  styles: [`
    .k-card {
      display: flex;
      flex-direction: column;
      background: var(--kr-layer-1);
      border: 1px solid var(--kr-stroke);
      border-radius: var(--kr-radius-lg);
      color: var(--kr-text-1);
      box-shadow: var(--kr-shadow-4);
      overflow: hidden;
      transition: border-color var(--kr-transition), box-shadow var(--kr-transition);

      &:hover {
        border-color: var(--kr-stroke-sd);
        box-shadow: var(--kr-shadow-8), 0 0 16px rgba(126,200,227,0.12);
      }
    }
    .k-card-header:empty { display: none; }
    .k-card-body { padding: 20px; }
    .k-card-title {
      font-weight: 500;
      font-size: 15px;
      letter-spacing: var(--kr-tracking);
      &:empty { display: none; }
    }
    .k-card-subtitle {
      font-size: 12px;
      color: var(--f-text-3);
      margin-top: 2px;
      &:empty { display: none; }
    }
    .k-card-content {
      color: var(--kr-text-2);
      font-size: 13px;
      margin-top: 10px;
      &:empty { display: none; }
    }
    .k-card-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--kr-stroke);
      &:empty { display: none; }
    }
  `],
})
export class AppCardComponent {}
