import { Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  template: `
    <p-dialog
      [header]="header()"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '420px' }"
      [draggable]="false"
      (onHide)="cancel.emit()"
    >
      <div class="flex items-start gap-4 py-2">
        <i [class]="iconClass() + ' text-2xl mt-0.5 shrink-0'"></i>
        <p class="text-slate-300 text-sm leading-relaxed m-0">{{ message() }}</p>
      </div>
      <ng-template #footer>
        <p-button
          [label]="cancelLabel()"
          [text]="true"
          severity="secondary"
          (onClick)="onCancel()"
        ></p-button>
        <p-button
          [label]="confirmLabel()"
          [icon]="confirmIcon()"
          [severity]="confirmSeverity()"
          (onClick)="onConfirm()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ConfirmModal {
  header         = input('Confirm');
  message        = input('Are you sure?');
  confirmLabel   = input('Confirm');
  cancelLabel    = input('Cancel');
  confirmIcon    = input('fas fa-check');
  confirmSeverity = input<'success' | 'danger' | 'warn' | 'info'>('danger');
  iconClass      = input('fas fa-triangle-exclamation text-yellow-400');

  visible = false;

  confirm = output<void>();
  cancel  = output<void>();

  open()  { this.visible = true; }
  close() { this.visible = false; }

  onConfirm() {
    this.visible = false;
    this.confirm.emit();
  }

  onCancel() {
    this.visible = false;
    this.cancel.emit();
  }
}
