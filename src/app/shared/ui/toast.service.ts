import { Injectable, signal } from '@angular/core';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'danger';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
}

export interface ToastRequest {
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable()
export class ToastService {
  private readonly messagesSig = signal<ToastMessage[]>([]);
  public readonly messages = this.messagesSig.asReadonly();

  private nextId = 0;

  public add(msg: ToastRequest): void {
    const id = this.nextId++;
    this.messagesSig.update(list => [...list, { id, severity: msg.severity, summary: msg.summary, detail: msg.detail }]);
    setTimeout(() => this.remove(id), msg.life ?? 3000);
  }

  public remove(id: number): void {
    this.messagesSig.update(list => list.filter(m => m.id !== id));
  }
}
