import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/welcome/welcome.page').then(m => m.WelcomePage),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'gear-builder',
        loadComponent: () =>
          import('./features/gear-builder/gear-builder.page').then(m => m.GearBuilderPage),
      },
      {
        path: 'experiment-designer',
        loadComponent: () =>
          import('./features/experiment-designer/experiment-designer.page').then(m => m.ExperimentDesignerPage),
      },
      {
        path: 'element-explorer',
        loadComponent: () =>
          import('./features/element-explorer/element-explorer.page').then(m => m.ElementExplorerPage),
      },
      {
        path: 'mls-composer',
        loadComponent: () =>
          import('./features/mls-composer/mls-composer.page').then(m => m.MlsComposerPage),
      },
      {
        path: 'dream-space',
        loadComponent: () =>
          import('./features/dream-space/dream-space.page').then(m => m.DreamSpacePage),
      },
      {
        path: 'my-workflow',
        loadComponent: () =>
          import('./features/my-workflow/my-workflow.page').then(m => m.MyWorkflowPage),
      },
      {
        path: 'db-wizard',
        loadComponent: () =>
          import('./features/db-wizard/db-wizard.page').then(m => m.DbWizardPage),
      },
      {
        path: 'seances',
        loadComponent: () =>
          import('./features/seances/seances.page').then(m => m.SeancesPage),
      },
      {
        path: 'team-builder',
        loadComponent: () =>
          import('./features/team-builder/team-builder.page').then(m => m.TeamBuilderPage),
      },
    ],
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome' },
];
