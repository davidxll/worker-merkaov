export interface WizardStep {
  readonly label:    string;
  readonly icon:     string;
  readonly sublabel: string;
}

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  location: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  badge?: string;
}
