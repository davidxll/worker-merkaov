import { Component, input, output, signal } from '@angular/core';
import { AppDialogComponent } from '../ui/dialog.component.js';
import { AppButtonComponent } from '../ui/button.component.js';
import type { ButtonSeverity } from '../ui/button.component.js';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [AppDialogComponent, AppButtonComponent],
  template: `
    <app-dialog
      [header]="header()"
      [(visible)]="visible"
      [modal]="true"
      width="420px"
      (hide)="dismissed.emit()"
    >
      <div class="flex items-start gap-4 py-2">
        <i [class]="iconClass() + ' text-2xl mt-0.5 shrink-0'"></i>
        <p class="text-slate-300 text-sm leading-relaxed m-0">{{ message() }}</p>
      </div>
      <ng-container dialogFooter>
        <app-button
          [label]="cancelLabel()"
          [text]="true"
          severity="secondary"
          (clicked)="onCancel()"
        ></app-button>
        <app-button
          [label]="confirmLabel()"
          [icon]="confirmIcon()"
          [severity]="confirmSeverity()"
          (clicked)="onConfirm()"
        ></app-button>
      </ng-container>
    </app-dialog>
  `,
})
export class ConfirmModal {
  header          = input('Confirm');
  message         = input('Are you sure?');
  confirmLabel    = input('Confirm');
  cancelLabel     = input('Cancel');
  confirmIcon     = input('fas fa-check');
  confirmSeverity = input<ButtonSeverity>('danger');
  iconClass       = input('fas fa-triangle-exclamation text-yellow-400');

  visible = signal(false);

  confirm   = output<void>();
  dismissed = output<void>();

  open()  { this.visible.set(true); }
  close() { this.visible.set(false); }

  onConfirm() {
    this.visible.set(false);
    this.confirm.emit();
  }

  onCancel() {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
