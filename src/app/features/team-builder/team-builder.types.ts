export type { WizardStep } from '../../models/models.js';

// ── IDs ──────────────────────────────────────────────────────────────────────

export type TeamMemberId = 'alice' | 'ben' | 'carla' | 'devon' | 'elena' | 'farid' | 'gwen' | 'hiro';
export type RoleId       = 'engineering' | 'design' | 'product' | 'qa' | 'data';
export type PriorityId   = 'low' | 'medium' | 'high';

// ── Roster & option shapes ───────────────────────────────────────────────────

export interface TeamMemberOption {
  readonly id:        TeamMemberId;
  readonly name:      string;
  readonly role:      RoleId;
  readonly roleLabel: string;
  readonly icon:       string;
  readonly color:      string;
  readonly initials:   string;
  readonly tagline:    string;
}

export interface PriorityOption {
  readonly id:    PriorityId;
  readonly label: string;
  readonly color: string;
}

// ── Project info (step 1) ────────────────────────────────────────────────────

export interface Goal {
  readonly id:   string;
  readonly text: string;
}

export interface Milestone {
  readonly id:      string;
  readonly text:    string;
  readonly dueDate: string | null;
}

export interface ProjectInfo {
  readonly name:        string;
  readonly description: string;
  readonly startDate:   string | null;
  readonly endDate:     string | null;
  readonly goals:       readonly Goal[];
  readonly milestones:  readonly Milestone[];
}

// ── Team & tasks (step 2) ────────────────────────────────────────────────────

export interface Task {
  readonly id:         string;
  readonly text:       string;
  readonly assigneeId: TeamMemberId | null;
  readonly priority:   PriorityId;
}

// ── Overall build state ──────────────────────────────────────────────────────

export interface TeamBuild {
  readonly project:       ProjectInfo;
  readonly teamMemberIds: readonly TeamMemberId[];
  readonly tasks:         readonly Task[];
}

export interface TeamConfigChip {
  readonly label: string;
  readonly icon:  string;
  readonly value: string | null;
}

export interface SavedTeamConfig {
  readonly id:      string;
  readonly savedAt: string;
  readonly build:   TeamBuild;
}
