import { computed, Injectable, signal } from '@angular/core';
import { WIZARD_STEPS, TEAM_MEMBER_OPTIONS } from './team-builder.mock.js';
import type {
  TeamBuild, TeamMemberId, PriorityId, TeamConfigChip, SavedTeamConfig,
} from './team-builder.types.js';
import type { WizardResultData } from '../../shared/wizard-result.types.js';
import { WIZARD_STEP_SERVICE } from '../../shared/wizard-step.directive.js';
import { createWizardNav } from '../../shared/wizard-nav.js';

const STORAGE_KEY = 'waltkerovoz.team-builder.saved-configs';

function emptyBuild(): TeamBuild {
  return {
    project: {
      name: '', description: '', startDate: null, endDate: null,
      goals: [], milestones: [],
    },
    teamMemberIds: [],
    tasks: [],
  };
}

@Injectable({ providedIn: 'root' })
export class TeamBuilderService {

  // ── State ────────────────────────────────────────────────────────────────

  private readonly stepSig  = signal<number>(1);
  private readonly buildSig = signal<TeamBuild>(emptyBuild());

  private readonly savedConfigsSig = signal<SavedTeamConfig[]>(this.loadSavedConfigs());
  private readonly justSavedSig    = signal<boolean>(false);

  public readonly currentStep  = this.stepSig.asReadonly();
  public readonly build        = this.buildSig.asReadonly();
  public readonly savedConfigs = this.savedConfigsSig.asReadonly();
  public readonly justSaved    = this.justSavedSig.asReadonly();

  // ── Derived lookups ──────────────────────────────────────────────────────

  public readonly selectedMembers = computed(() => {
    const ids = this.buildSig().teamMemberIds;
    return TEAM_MEMBER_OPTIONS.filter(m => ids.includes(m.id));
  });

  // ── Derived state ────────────────────────────────────────────────────────

  public readonly canAdvance = computed((): boolean => {
    const b = this.buildSig();
    switch (this.stepSig()) {
      case 1: return b.project.name.trim() !== '' && b.project.goals.length > 0;
      case 2: return b.teamMemberIds.length > 0 && b.tasks.length > 0;
      default: return false;
    }
  });

  public readonly hasBuildStarted = computed((): boolean => {
    const b = this.buildSig();
    return b.project.name.trim() !== '' || b.teamMemberIds.length > 0;
  });

  public readonly teamConfigChips = computed((): TeamConfigChip[] => {
    const b = this.buildSig();
    return [
      { label: 'Project',    icon: 'fas fa-clipboard-list', value: b.project.name || null },
      { label: 'Goals',      icon: 'fas fa-bullseye',       value: b.project.goals.length      ? String(b.project.goals.length)      : null },
      { label: 'Milestones', icon: 'fas fa-flag-checkered', value: b.project.milestones.length ? String(b.project.milestones.length) : null },
      { label: 'Team',       icon: 'fas fa-users',          value: b.teamMemberIds.length       ? String(b.teamMemberIds.length)       : null },
      { label: 'Tasks',      icon: 'fas fa-list-check',     value: b.tasks.length               ? String(b.tasks.length)               : null },
    ];
  });

  public readonly resultData = computed((): WizardResultData => {
    const b       = this.buildSig();
    const members = this.selectedMembers();

    const goalsText      = b.project.goals.map(g => g.text).join(', ') || '—';
    const milestonesText = b.project.milestones
      .map(m => m.dueDate ? `${m.text} (${m.dueDate})` : m.text)
      .join(', ') || '—';
    const teamText = members.map(m => m.name).join(', ') || '—';

    const byPriority: Record<PriorityId, number> = { low: 0, medium: 0, high: 0 };
    for (const t of b.tasks) byPriority[t.priority]++;

    return {
      title:       'Your Team & Project Are Configured!',
      description: 'Review the plan below, then save it so you can pick up where you left off.',
      rows: [
        { label: 'Project',     value: b.project.name || '—' },
        { label: 'Description', value: b.project.description || '—' },
        { label: 'Timeline',    value: b.project.startDate && b.project.endDate ? `${b.project.startDate} → ${b.project.endDate}` : '—' },
        { label: 'Goals',       value: goalsText },
        { label: 'Milestones',  value: milestonesText },
        { label: 'Team Size',   value: String(members.length) },
        { label: 'Team',        value: teamText },
        { label: 'Tasks',       value: `${b.tasks.length} total — ${byPriority.high} high, ${byPriority.medium} medium, ${byPriority.low} low` },
      ],
      jsonPayload: {
        project: b.project,
        team: members.map(m => ({ id: m.id, name: m.name, role: m.roleLabel })),
        tasks: b.tasks.map(t => ({
          text:     t.text,
          priority: t.priority,
          assignee: members.find(m => m.id === t.assigneeId)?.name ?? 'Unassigned',
        })),
      },
    };
  });

  // ── Step navigation ──────────────────────────────────────────────────────

  public isStepReachable(n: number): boolean {
    const b = this.buildSig();
    if (n <= this.stepSig()) return true;
    if (n === 2) return b.project.name.trim() !== '' && b.project.goals.length > 0;
    return false;
  }

  private readonly nav = createWizardNav({
    stepSig:         this.stepSig,
    totalSteps:      WIZARD_STEPS.length,
    isStepReachable: n => this.isStepReachable(n),
    canAdvance:      () => this.canAdvance(),
  });

  public nextStep(): void   { this.nav.nextStep(); }
  public prevStep(): void   { this.nav.prevStep(); }
  public jumpToStep(n: number): void { this.nav.jumpToStep(n); }
  public finish(): void     { this.nav.finish(); }

  public reset(): void {
    this.buildSig.set(emptyBuild());
    this.justSavedSig.set(false);
    this.stepSig.set(1);
  }

  // ── Project info mutations ───────────────────────────────────────────────

  public setProjectName(name: string): void {
    this.buildSig.update(b => ({ ...b, project: { ...b.project, name } }));
  }

  public setProjectDescription(description: string): void {
    this.buildSig.update(b => ({ ...b, project: { ...b.project, description } }));
  }

  public setStartDate(startDate: string | null): void {
    this.buildSig.update(b => ({ ...b, project: { ...b.project, startDate } }));
  }

  public setEndDate(endDate: string | null): void {
    this.buildSig.update(b => ({ ...b, project: { ...b.project, endDate } }));
  }

  public addGoal(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.buildSig.update(b => ({
      ...b,
      project: { ...b.project, goals: [...b.project.goals, { id: this.newId(), text: trimmed }] },
    }));
  }

  public removeGoal(id: string): void {
    this.buildSig.update(b => ({
      ...b,
      project: { ...b.project, goals: b.project.goals.filter(g => g.id !== id) },
    }));
  }

  public addMilestone(text: string, dueDate: string | null): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.buildSig.update(b => ({
      ...b,
      project: { ...b.project, milestones: [...b.project.milestones, { id: this.newId(), text: trimmed, dueDate }] },
    }));
  }

  public removeMilestone(id: string): void {
    this.buildSig.update(b => ({
      ...b,
      project: { ...b.project, milestones: b.project.milestones.filter(m => m.id !== id) },
    }));
  }

  // ── Team & task mutations ────────────────────────────────────────────────

  public toggleTeamMember(id: TeamMemberId): void {
    this.buildSig.update(b => {
      const selected = b.teamMemberIds.includes(id);
      const teamMemberIds = selected
        ? b.teamMemberIds.filter(m => m !== id)
        : [...b.teamMemberIds, id];

      // Removing a member shouldn't delete the tasks they were doing — it
      // just orphans them back to "Unassigned" so the work stays visible.
      const tasks = selected
        ? b.tasks.map(t => t.assigneeId === id ? { ...t, assigneeId: null } : t)
        : b.tasks;

      return { ...b, teamMemberIds, tasks };
    });
  }

  public addTask(text: string, assigneeId: TeamMemberId | null, priority: PriorityId): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.buildSig.update(b => ({
      ...b,
      tasks: [...b.tasks, { id: this.newId(), text: trimmed, assigneeId, priority }],
    }));
  }

  public removeTask(id: string): void {
    this.buildSig.update(b => ({ ...b, tasks: b.tasks.filter(t => t.id !== id) }));
  }

  // ── Save / persistence ───────────────────────────────────────────────────

  public saveConfig(): void {
    const entry: SavedTeamConfig = { id: this.newId(), savedAt: new Date().toISOString(), build: this.buildSig() };
    const next = [entry, ...this.savedConfigsSig()];
    this.savedConfigsSig.set(next);
    this.persistSavedConfigs(next);
    this.justSavedSig.set(true);
  }

  private loadSavedConfigs(): SavedTeamConfig[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as SavedTeamConfig[] : [];
    } catch {
      return [];
    }
  }

  private persistSavedConfigs(configs: readonly SavedTeamConfig[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    } catch {
      // localStorage unavailable (private browsing, quota) — saving silently no-ops.
    }
  }

  private newId(): string {
    return crypto.randomUUID();
  }
}

export const TEAM_BUILDER_WIZARD_PROVIDER = {
  provide:     WIZARD_STEP_SERVICE,
  useExisting: TeamBuilderService,
};
