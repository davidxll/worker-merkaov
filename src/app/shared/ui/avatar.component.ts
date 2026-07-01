import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="hostClasses()">
      <i [class]="icon()" aria-hidden="true"></i>
    </span>
  `,
  styles: [`
    .k-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 15px;
      flex-shrink: 0;
    }
    .k-avatar--circle { border-radius: 50%; }
    .k-avatar--square  { border-radius: var(--kr-radius); }
  `],
})
export class AppAvatarComponent {
  public readonly icon       = input('');
  public readonly shape      = input<AvatarShape>('circle');
  public readonly styleClass = input('');

  protected readonly hostClasses = computed(() =>
    `k-avatar k-avatar--${this.shape()} ${this.styleClass()}`.trim(),
  );
}
