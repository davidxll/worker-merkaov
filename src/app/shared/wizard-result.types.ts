export interface WizardResultRow {
  readonly label: string;
  readonly value: string;
}

export interface WizardResultData {
  readonly title:       string;
  readonly description: string;
  readonly rows:        readonly WizardResultRow[];
  readonly jsonPayload: Record<string, unknown>;
}
