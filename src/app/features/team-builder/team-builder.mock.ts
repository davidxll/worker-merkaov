import type { WizardStep, TeamMemberOption, PriorityOption } from './team-builder.types.js';

// ── Wizard step definitions ──────────────────────────────────────────────────

export const WIZARD_STEPS: readonly WizardStep[] = [
  { label: 'Project',      icon: 'fas fa-clipboard-list', sublabel: 'Goals & milestones' },
  { label: 'Team & Tasks', icon: 'fas fa-users',          sublabel: 'Assign the work'     },
];

// ── Team roster ───────────────────────────────────────────────────────────────

export const TEAM_MEMBER_OPTIONS: readonly TeamMemberOption[] = [
  { id: 'alice', name: 'Alice Martin', role: 'engineering', roleLabel: 'Frontend Engineer', icon: 'fas fa-code',             color: '#3a8fc8', initials: 'AM', tagline: 'Ships UI fast, obsesses over polish' },
  { id: 'ben',   name: 'Ben Chen',     role: 'engineering', roleLabel: 'Backend Engineer',  icon: 'fas fa-server',           color: '#3a8fc8', initials: 'BC', tagline: 'APIs, databases, and reliability' },
  { id: 'carla', name: 'Carla Diaz',   role: 'design',      roleLabel: 'Product Designer',  icon: 'fas fa-pen-nib',          color: '#8b5cf6', initials: 'CD', tagline: 'Turns rough ideas into clean flows' },
  { id: 'devon', name: 'Devon Kim',    role: 'product',     roleLabel: 'Product Manager',   icon: 'fas fa-compass',          color: '#f59e0b', initials: 'DK', tagline: 'Keeps scope honest and priorities clear' },
  { id: 'elena', name: 'Elena Rossi',  role: 'qa',          roleLabel: 'QA Engineer',       icon: 'fas fa-vial',             color: '#10b981', initials: 'ER', tagline: 'Finds the edge cases before users do' },
  { id: 'farid', name: 'Farid Haddad', role: 'data',        roleLabel: 'Data Analyst',      icon: 'fas fa-chart-line',       color: '#06b6d4', initials: 'FH', tagline: 'Turns raw numbers into decisions' },
  { id: 'gwen',  name: 'Gwen Walsh',   role: 'engineering', roleLabel: 'DevOps Engineer',   icon: 'fas fa-gears',            color: '#3a8fc8', initials: 'GW', tagline: 'Keeps the pipeline green and fast' },
  { id: 'hiro',  name: 'Hiro Tanaka',  role: 'design',      roleLabel: 'UX Researcher',     icon: 'fas fa-magnifying-glass', color: '#8b5cf6', initials: 'HT', tagline: "Talks to users so the team doesn't guess" },
];

// ── Priority options ──────────────────────────────────────────────────────────

export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  { id: 'low',    label: 'Low',    color: '#6b7280' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high',   label: 'High',   color: '#dc2626' },
];
