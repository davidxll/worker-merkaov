import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly collapsedSig  = signal<boolean>(false);
  private readonly mobileOpenSig = signal<boolean>(false);

  public readonly collapsed  = this.collapsedSig.asReadonly();
  public readonly mobileOpen = this.mobileOpenSig.asReadonly();

  public toggle(): void      { this.collapsedSig.update(v => !v); }
  public openMobile(): void  { this.mobileOpenSig.set(true); }
  public closeMobile(): void { this.mobileOpenSig.set(false); }
}
