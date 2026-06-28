import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { WizardResultData } from '../wizard-result.types.js';

@Component({
  selector: 'app-wizard-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wr-root">

      <div class="wr-header">
        <div class="wr-check"><i class="fas fa-circle-check"></i></div>
        <h2 class="wr-title">{{ title() }}</h2>
        <p class="wr-desc">{{ description() }}</p>
      </div>

      <div class="wr-viz">
        <ng-content />
      </div>

      <div class="wr-meta">
        <div class="wr-summary">
          <h3 class="wr-summary-label">Summary</h3>
          <table class="wr-table">
            @for (row of data().rows; track row.label) {
              <tr>
                <td class="wr-td-key">{{ row.label }}</td>
                <td class="wr-td-val">{{ row.value }}</td>
              </tr>
            }
          </table>
        </div>

        <div class="wr-export">
          <h3 class="wr-summary-label">Export</h3>
          <div class="wr-export-btns">
            <button class="wr-btn-export" (click)="exportJson()" type="button">
              <i class="fas fa-code mr-2"></i>JSON
            </button>
            <button class="wr-btn-export" (click)="exportCsv()" type="button">
              <i class="fas fa-file-csv mr-2"></i>CSV
            </button>
          </div>
        </div>
      </div>

      <div class="wr-actions">
        <ng-content select="[resultActions]" />
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .wr-root {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-height: 100%;
    }

    /* ── Header ── */
    .wr-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 48px 24px 32px;
      gap: 10px;
    }

    .wr-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.30);
      font-size: 26px;
      color: #4ade80;
      margin-bottom: 4px;
    }

    .wr-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--f-text-1);
      margin: 0;
    }

    .wr-desc {
      font-size: 14px;
      color: var(--f-text-2);
      margin: 0;
      max-width: 420px;
    }

    /* ── Visualization slot ── */
    .wr-viz {
      width: 100%;
    }

    /* ── Meta bar (summary + export side by side) ── */
    .wr-meta {
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
      padding: 32px 32px 0;
      max-width: 860px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
      @media (max-width: 600px) { padding: 24px 16px 0; gap: 24px; }
    }

    .wr-summary { flex: 1; min-width: 200px; }

    .wr-summary-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: var(--f-text-3);
      text-transform: uppercase;
      margin: 0 0 10px;
    }

    .wr-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;

      tr { border-bottom: 1px solid var(--f-stroke); }
      tr:last-child { border-bottom: none; }
    }

    .wr-td-key {
      padding: 8px 12px 8px 0;
      color: var(--f-text-3);
      font-weight: 500;
      white-space: nowrap;
      width: 40%;
    }

    .wr-td-val {
      padding: 8px 0;
      color: var(--f-text-1);
      font-weight: 500;
    }

    /* ── Export ── */
    .wr-export { flex-shrink: 0; }

    .wr-export-btns {
      display: flex;
      gap: 8px;
    }

    .wr-btn-export {
      display: inline-flex;
      align-items: center;
      height: 32px;
      padding: 0 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: var(--f-text-1);
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--f-stroke-sd);
      cursor: pointer;
      transition: background 150ms var(--f-ease), border-color 150ms var(--f-ease);

      &:hover { background: rgba(255,255,255,0.10); border-color: var(--f-accent); }
    }

    /* ── Actions slot ── */
    .wr-actions {
      display: flex;
      justify-content: center;
      padding: 24px 24px 48px;
    }
  `],
})
export class WizardResultComponent {
  public readonly title       = input.required<string>();
  public readonly description = input.required<string>();
  public readonly data        = input.required<WizardResultData>();

  protected exportJson(): void {
    const blob = new Blob(
      [JSON.stringify(this.data().jsonPayload, null, 2)],
      { type: 'application/json' },
    );
    this.triggerDownload(blob, 'result.json');
  }

  protected exportCsv(): void {
    const lines = [
      'Label,Value',
      ...this.data().rows.map(r => `"${r.label}","${r.value}"`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    this.triggerDownload(blob, 'result.csv');
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  }
}
