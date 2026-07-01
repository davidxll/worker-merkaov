import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TeamBuilderService, TEAM_BUILDER_WIZARD_PROVIDER } from './team-builder.service.js';
import { WizardResultComponent } from '../../shared/components/wizard-result.component.js';
import { WIZARD_STEPS, TEAM_MEMBER_OPTIONS, PRIORITY_OPTIONS } from './team-builder.mock.js';
import type { TeamMemberId, PriorityId } from './team-builder.types.js';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, WizardResultComponent],
  providers: [TEAM_BUILDER_WIZARD_PROVIDER],
  template: `
<!-- ═══════════════════════════════════════════════════════════
     TEAM BUILDER PAGE
     ═══════════════════════════════════════════════════════════ -->
<div class="tb-page">
  @let build = svc.build();

  <!-- ── Sticky HUD ───────────────────────────────────────────── -->
  <div class="hud">
    <div class="hud-inner">

      <div class="hud-icon-wrap">
        <i class="fas fa-diagram-project hud-icon"></i>
        @if (build.teamMemberIds.length) {
          <span class="hud-team-badge">{{ build.teamMemberIds.length }}</span>
        }
      </div>

      <div class="hud-chips">
        @for (chip of svc.teamConfigChips(); track chip.label) {
          <span class="hud-chip" [class.hud-chip--set]="chip.value !== null">
            <i [class]="chip.icon + ' mr-1 text-xs'"></i>
            {{ chip.value ?? chip.label }}
          </span>
        }
      </div>

      <div class="hud-steps">
        @for (step of steps; track step.label; let i = $index) {
          <button class="step-tab"
                  [class.step-tab--active]="svc.currentStep() === i + 1"
                  [class.step-tab--done]="svc.currentStep() > i + 1"
                  [disabled]="!svc.isStepReachable(i + 1)"
                  (click)="svc.jumpToStep(i + 1)">
            <i [class]="step.icon + ' step-icon'"></i>
            <span class="step-label">{{ step.label }}</span>
            <span class="step-sub">{{ step.sublabel }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ── Main content ─────────────────────────────────────────── -->
  <div class="tb-content">

    <!-- ══ STEP 1 — PROJECT INFO ═══════════════════════════════ -->
    @if (svc.currentStep() === 1) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Configure the Project</h2>
          <p class="step-desc">Name the project, describe what it's for, and capture the goals and milestones that define success.</p>
        </div>

        <div class="form-grid">
          <label class="field">
            <span class="field-label">Project name</span>
            <input class="field-input" type="text" placeholder="e.g. Q3 Platform Migration"
                   [value]="build.project.name"
                   (input)="svc.setProjectName($any($event.target).value)" />
          </label>
          <label class="field field--wide">
            <span class="field-label">Description</span>
            <textarea class="field-textarea" rows="2" placeholder="What is this project trying to achieve?"
                      [value]="build.project.description"
                      (input)="svc.setProjectDescription($any($event.target).value)"></textarea>
          </label>
          <label class="field">
            <span class="field-label">Start date</span>
            <input class="field-input" type="date"
                   [value]="build.project.startDate ?? ''"
                   (input)="svc.setStartDate($any($event.target).value || null)" />
          </label>
          <label class="field">
            <span class="field-label">End date</span>
            <input class="field-input" type="date"
                   [value]="build.project.endDate ?? ''"
                   (input)="svc.setEndDate($any($event.target).value || null)" />
          </label>
        </div>

        <!-- Goals -->
        <div class="list-block">
          <h3 class="list-title"><i class="fas fa-bullseye mr-2"></i>Goals</h3>
          <p class="list-hint">What does success look like? Add at least one goal to continue.</p>
          <div class="add-row">
            <input #goalInput class="add-input" type="text" placeholder="Add a goal…"
                   (keydown.enter)="addGoal(goalInput)" />
            <button class="add-btn" type="button" (click)="addGoal(goalInput)"><i class="fas fa-plus"></i></button>
          </div>
          @if (build.project.goals.length) {
            <ul class="item-list">
              @for (goal of build.project.goals; track goal.id) {
                <li class="item-row">
                  <i class="fas fa-bullseye item-icon"></i>
                  <span class="item-text">{{ goal.text }}</span>
                  <button class="item-remove" type="button" (click)="svc.removeGoal(goal.id)" aria-label="Remove goal">
                    <i class="fas fa-xmark"></i>
                  </button>
                </li>
              }
            </ul>
          } @else {
            <p class="empty-hint">No goals yet.</p>
          }
        </div>

        <!-- Milestones -->
        <div class="list-block">
          <h3 class="list-title"><i class="fas fa-flag-checkered mr-2"></i>Milestones</h3>
          <p class="list-hint">Key checkpoints along the way — optional, but keeps the timeline honest.</p>
          <div class="add-row add-row--milestone">
            <input #milestoneInput class="add-input" type="text" placeholder="Add a milestone…"
                   (keydown.enter)="addMilestone(milestoneInput, milestoneDateInput)" />
            <input #milestoneDateInput class="add-date" type="date" />
            <button class="add-btn" type="button" (click)="addMilestone(milestoneInput, milestoneDateInput)"><i class="fas fa-plus"></i></button>
          </div>
          @if (build.project.milestones.length) {
            <ul class="item-list">
              @for (milestone of build.project.milestones; track milestone.id) {
                <li class="item-row">
                  <i class="fas fa-flag-checkered item-icon"></i>
                  <span class="item-text">{{ milestone.text }}</span>
                  @if (milestone.dueDate) {
                    <span class="item-date">{{ milestone.dueDate }}</span>
                  }
                  <button class="item-remove" type="button" (click)="svc.removeMilestone(milestone.id)" aria-label="Remove milestone">
                    <i class="fas fa-xmark"></i>
                  </button>
                </li>
              }
            </ul>
          } @else {
            <p class="empty-hint">No milestones yet.</p>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 2 — TEAM & TASKS ════════════════════════════════ -->
    @if (svc.currentStep() === 2) {
      <section class="step-section">
        <div class="step-header">
          <h2 class="step-title">Pick the Team</h2>
          <p class="step-desc">Select who's executing this project, then break the work into tasks.</p>
        </div>

        <div class="member-grid">
          @for (m of members; track m.id) {
            @let isSelected = build.teamMemberIds.includes(m.id);
            <div class="member-card" [class.member-card--selected]="isSelected" (click)="svc.toggleTeamMember(m.id)">
              <div class="member-avatar"
                   [style.background]="m.color + '22'"
                   [style.color]="m.color"
                   [style.border-color]="m.color + '55'">
                {{ m.initials }}
              </div>
              <div class="member-meta">
                <span class="member-name">{{ m.name }}</span>
                <span class="member-role">{{ m.roleLabel }}</span>
                <p class="member-tagline">{{ m.tagline }}</p>
              </div>
              @if (isSelected) {
                <i class="fas fa-circle-check member-check"></i>
              }
            </div>
          }
        </div>

        <div class="list-block">
          <h3 class="list-title"><i class="fas fa-list-check mr-2"></i>Tasks</h3>
          <p class="list-hint">
            @if (svc.selectedMembers().length) {
              Break the project into tasks and assign them to the team.
            } @else {
              Select at least one team member above before assigning tasks.
            }
          </p>

          @if (svc.selectedMembers().length) {
            <div class="add-row add-row--task">
              <input #taskInput class="add-input" type="text" placeholder="Add a task…"
                     (keydown.enter)="addTask(taskInput, taskAssignee, taskPriority)" />
              <select #taskAssignee class="add-select">
                <option value="">Unassigned</option>
                @for (m of svc.selectedMembers(); track m.id) {
                  <option [value]="m.id">{{ m.name }}</option>
                }
              </select>
              <select #taskPriority class="add-select">
                @for (p of priorities; track p.id) {
                  <option [value]="p.id" [selected]="p.id === 'medium'">{{ p.label }}</option>
                }
              </select>
              <button class="add-btn" type="button" (click)="addTask(taskInput, taskAssignee, taskPriority)"><i class="fas fa-plus"></i></button>
            </div>
          }

          @if (build.tasks.length) {
            <ul class="item-list">
              @for (task of build.tasks; track task.id) {
                <li class="item-row">
                  <span class="priority-dot" [style.background]="priorityColor(task.priority)"></span>
                  <span class="item-text">{{ task.text }}</span>
                  <span class="item-assignee">{{ assigneeName(task.assigneeId) }}</span>
                  <button class="item-remove" type="button" (click)="svc.removeTask(task.id)" aria-label="Remove task">
                    <i class="fas fa-xmark"></i>
                  </button>
                </li>
              }
            </ul>
          } @else {
            <p class="empty-hint">No tasks yet.</p>
          }
        </div>
      </section>
    }

    <!-- ══ STEP 3 — REVIEW & SAVE ═══════════════════════════════ -->
    @if (svc.currentStep() === 3) {
      @let rd = svc.resultData();
      <section class="step-section result-section">
        <app-wizard-result [title]="rd.title" [description]="rd.description" [data]="rd">
          <div resultActions class="result-actions">
            <button class="save-btn" type="button" (click)="svc.saveConfig()">
              <i class="fas fa-floppy-disk mr-2"></i>{{ svc.justSaved() ? 'Saved!' : 'Save Team & Project' }}
            </button>
            <button class="start-over-btn" type="button" (click)="svc.reset()">
              <i class="fas fa-arrow-rotate-left mr-2"></i>Start Over
            </button>
          </div>
        </app-wizard-result>
        @if (svc.savedConfigs().length) {
          <p class="saved-count">
            <i class="fas fa-circle-check mr-1"></i>
            {{ svc.savedConfigs().length }} configuration{{ svc.savedConfigs().length === 1 ? '' : 's' }} saved in this browser.
          </p>
        }
      </section>
    }

  </div><!-- /tb-content -->

  <!-- ── Bottom sticky nav ─────────────────────────────────────── -->
  @if (svc.currentStep() < 3) {
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        <button class="nav-btn nav-btn--back"
                [disabled]="svc.currentStep() === 1"
                (click)="svc.prevStep()">
          <i class="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div class="nav-progress">
          Step {{ svc.currentStep() }} of {{ steps.length }}
        </div>
        @if (svc.currentStep() < steps.length) {
          <button class="nav-btn nav-btn--next"
                  [disabled]="!svc.canAdvance()"
                  (click)="svc.nextStep()">
            Continue<i class="fas fa-arrow-right ml-2"></i>
          </button>
        } @else {
          <button class="nav-btn nav-btn--finish"
                  [disabled]="!svc.canAdvance()"
                  (click)="svc.finish()">
            <i class="fas fa-check mr-2"></i>Finish
          </button>
        }
      </div>
    </div>
  }

</div><!-- /tb-page -->
  `,
  styles: [`
    /* ── Page shell ─────────────────────────────────────────────────────── */
    .tb-page    { display: flex; flex-direction: column; min-height: 100%; position: relative; }
    .tb-content { flex: 1; padding: 24px 24px 120px; max-width: 900px; margin: 0 auto; width: 100%; }

    /* ── HUD ────────────────────────────────────────────────────────────── */
    .hud {
      position: sticky; top: 0; z-index: 40;
      background: var(--f-layer-2); border-bottom: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .hud-inner { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 16px; padding: 10px 24px; }
    .hud-icon-wrap { position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
    .hud-icon {
      width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: var(--f-layer-3); border: 2px solid var(--f-stroke); color: var(--f-accent); font-size: 16px;
    }
    .hud-team-badge {
      position: absolute; bottom: -2px; right: -2px;
      font-size: 10px; font-weight: 700; min-width: 16px; text-align: center;
      background: var(--f-accent); color: #fff; border-radius: 8px; padding: 1px 4px;
    }
    .hud-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .hud-chip {
      font-size: 11px; padding: 2px 8px; border-radius: 4px;
      background: var(--f-layer-3); color: var(--f-text-3); border: 1px solid var(--f-stroke);
      transition: color 0.2s, border-color 0.2s;
    }
    .hud-chip--set { color: var(--f-text-1); border-color: var(--f-accent); }
    .hud-steps { display: flex; gap: 2px; }
    .step-tab {
      display: flex; flex-direction: column; align-items: center; padding: 8px 16px;
      border-radius: 6px; border: 1px solid transparent; background: transparent;
      cursor: pointer; color: var(--f-text-3); transition: all 0.2s; gap: 1px;
    }
    .step-tab:hover:not(:disabled) { background: var(--f-layer-3); color: var(--f-text-1); }
    .step-tab--active { background: var(--f-layer-3); color: var(--f-text-1); border-color: var(--f-accent); }
    .step-tab--done   { color: var(--kr-crystal); }
    .step-tab:disabled { opacity: 0.4; cursor: default; }
    .step-icon  { font-size: 14px; }
    .step-label { font-size: 11px; font-weight: 600; line-height: 1; }
    .step-sub   { font-size: 9px; opacity: 0.6; line-height: 1; }

    /* ── Step sections ──────────────────────────────────────────────────── */
    .step-section { display: flex; flex-direction: column; gap: 28px; }
    .step-header  { display: flex; flex-direction: column; gap: 6px; }
    .step-title   { font-size: 22px; font-weight: 600; color: var(--f-text-1); margin: 0; }
    .step-desc    { font-size: 14px; color: var(--f-text-2); margin: 0; line-height: 1.6; }

    /* ── Project form (step 1) ─────────────────────────────────────────── */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field--wide { grid-column: 1 / -1; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--f-text-3); }
    .field-input, .field-textarea {
      padding: 9px 12px; border-radius: 6px; background: var(--f-layer-2);
      border: 1px solid var(--f-stroke); color: var(--f-text-1); font-size: 13px; font-family: inherit;
    }
    .field-input:focus, .field-textarea:focus { outline: none; border-color: var(--f-accent); }
    .field-textarea { resize: vertical; }

    /* ── List blocks (goals / milestones / tasks) ─────────────────────────── */
    .list-block { display: flex; flex-direction: column; gap: 10px; }
    .list-title { font-size: 15px; font-weight: 600; color: var(--f-text-1); margin: 0; display: flex; align-items: center; }
    .list-hint  { font-size: 12px; color: var(--f-text-3); margin: -4px 0 0; }
    .empty-hint { font-size: 12px; color: var(--f-text-3); font-style: italic; margin: 0; }

    .add-row { display: flex; gap: 8px; }
    .add-input, .add-date, .add-select {
      padding: 8px 10px; border-radius: 6px; background: var(--f-layer-2);
      border: 1px solid var(--f-stroke); color: var(--f-text-1); font-size: 13px; font-family: inherit;
    }
    .add-input:focus, .add-date:focus, .add-select:focus { outline: none; border-color: var(--f-accent); }
    .add-row .add-input   { flex: 1; }
    .add-row--milestone .add-date { flex-shrink: 0; }
    .add-row--task .add-select { flex-shrink: 0; }
    .add-btn {
      display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
      border-radius: 6px; background: var(--kr-primary); border: 1px solid var(--kr-primary);
      color: #fff; cursor: pointer; flex-shrink: 0; transition: filter 0.2s;
    }
    .add-btn:hover { filter: brightness(1.15); }

    .item-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    .item-row {
      display: flex; align-items: center; gap: 10px; padding: 9px 12px;
      border: 1px solid var(--f-stroke); border-radius: 6px; background: var(--f-layer-2);
    }
    .item-icon { color: var(--f-accent); font-size: 12px; flex-shrink: 0; }
    .item-text { flex: 1; font-size: 13px; color: var(--f-text-1); }
    .item-date, .item-assignee {
      font-size: 11px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace;
      white-space: nowrap; flex-shrink: 0;
    }
    .item-remove {
      display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;
      border-radius: 4px; background: transparent; border: none; color: var(--f-text-3);
      cursor: pointer; flex-shrink: 0; transition: color 0.2s, background 0.2s;
    }
    .item-remove:hover { color: #f87171; background: rgba(248,113,113,0.1); }
    .priority-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

    /* ── Member grid (step 2) ──────────────────────────────────────────── */
    .member-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .member-card {
      border: 1px solid var(--f-stroke); border-radius: 10px; padding: 16px;
      background: var(--f-layer-2); cursor: pointer; display: flex; gap: 12px; align-items: flex-start;
      transition: all 0.2s; position: relative;
    }
    .member-card:hover     { border-color: var(--f-accent); background: var(--f-layer-3); }
    .member-card--selected { border-color: var(--kr-primary); background: rgba(58,143,200,0.08); }
    .member-avatar {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .member-meta  { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .member-name  { font-size: 14px; font-weight: 600; color: var(--f-text-1); }
    .member-role  { font-size: 11px; color: var(--f-text-3); }
    .member-tagline { font-size: 12px; color: var(--f-text-2); line-height: 1.4; margin: 4px 0 0; }
    .member-check { position: absolute; top: 12px; right: 12px; color: var(--kr-primary); font-size: 16px; }

    /* ── Result ─────────────────────────────────────────────────────────── */
    .result-section { align-items: center; }
    .result-actions { display: flex; gap: 10px; margin-top: 4px; }
    .saved-count { font-size: 12px; color: var(--kr-crystal); text-align: center; margin: 12px 0 0; }
    .save-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;
      background: var(--kr-crystal); border: 1px solid var(--kr-crystal); color: var(--kr-void);
      cursor: pointer; transition: filter 0.2s;
    }
    .save-btn:hover { filter: brightness(1.1); }
    .start-over-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      background: var(--f-layer-2); border: 1px solid var(--f-stroke); color: var(--f-text-2);
      cursor: pointer; transition: all 0.2s;
    }
    .start-over-btn:hover { border-color: var(--f-accent); color: var(--f-text-1); }

    /* ── Bottom nav ─────────────────────────────────────────────────────── */
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
      background: var(--f-layer-2); border-top: 1px solid var(--f-stroke);
      backdrop-filter: blur(12px);
    }
    .bottom-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; max-width: 900px; margin: 0 auto; }
    .nav-progress { font-size: 12px; color: var(--f-text-3); font-family: 'JetBrains Mono', monospace; }
    .nav-btn {
      padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; border: 1px solid var(--f-stroke);
    }
    .nav-btn:disabled { opacity: 0.4; cursor: default; }
    .nav-btn--back { background: transparent; color: var(--f-text-2); }
    .nav-btn--back:hover:not(:disabled) { color: var(--f-text-1); border-color: var(--f-accent); }
    .nav-btn--next { background: var(--kr-primary); border-color: var(--kr-primary); color: #fff; }
    .nav-btn--next:hover:not(:disabled) { filter: brightness(1.15); }
    .nav-btn--finish { background: var(--kr-crystal); border-color: var(--kr-crystal); color: var(--kr-void); font-weight: 600; }
    .nav-btn--finish:hover:not(:disabled) { filter: brightness(1.1); }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .add-row, .add-row--milestone, .add-row--task { flex-wrap: wrap; }
    }
  `],
})
export class TeamBuilderPage implements OnInit {
  protected readonly svc        = inject(TeamBuilderService);
  protected readonly steps      = WIZARD_STEPS;
  protected readonly members    = TEAM_MEMBER_OPTIONS;
  protected readonly priorities = PRIORITY_OPTIONS;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Team Builder — Waltkerovoz');
  }

  protected addGoal(input: HTMLInputElement): void {
    this.svc.addGoal(input.value);
    input.value = '';
  }

  protected addMilestone(textInput: HTMLInputElement, dateInput: HTMLInputElement): void {
    this.svc.addMilestone(textInput.value, dateInput.value || null);
    textInput.value = '';
    dateInput.value = '';
  }

  protected addTask(textInput: HTMLInputElement, assigneeSelect: HTMLSelectElement, prioritySelect: HTMLSelectElement): void {
    const assigneeId = (assigneeSelect.value || null) as TeamMemberId | null;
    const priority   = prioritySelect.value as PriorityId;
    this.svc.addTask(textInput.value, assigneeId, priority);
    textInput.value = '';
  }

  protected assigneeName(id: TeamMemberId | null): string {
    return TEAM_MEMBER_OPTIONS.find(m => m.id === id)?.name ?? 'Unassigned';
  }

  protected priorityColor(id: PriorityId): string {
    return PRIORITY_OPTIONS.find(p => p.id === id)?.color ?? 'var(--f-text-3)';
  }
}
