import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import type { Employee, NavItem, FeatureCard } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppService {

  getNavItems() {
    return of<NavItem[]>([
      { label: 'Home',                icon: 'fas fa-house',  route: '/app/home'                    },
      { label: 'Element Explorer',    icon: 'fas fa-atom',   route: '/app/element-explorer'        },
      { label: 'Experiment Designer', icon: 'fas fa-flask',  route: '/app/experiment-designer'     },
      { label: 'Object Builder',       icon: 'fas fa-cube',   route: '/app/gear-builder'            },
      { label: 'MLS Composer',         icon: 'fas fa-magnifying-glass-location', route: '/app/mls-composer' },
      { label: 'Dream Space',          icon: 'fas fa-wand-magic-sparkles',       route: '/app/dream-space'  },
      { label: 'My Workflow',          icon: 'fas fa-palette',                   route: '/app/my-workflow'  },
      { label: 'DB Wizard',            icon: 'fas fa-database',                  route: '/app/db-wizard'    },
      { label: 'Séances',              icon: 'fas fa-fire-flame-curved',         route: '/app/seances'      },
      { label: 'Team Builder',         icon: 'fas fa-diagram-project',           route: '/app/team-builder' },
    ]);
  }

  getEmployees() {
    return of<Employee[]>([
      { id: 1, name: 'Alice Martin',   role: 'Frontend Engineer', department: 'Engineering', location: 'New York',      salary: 120000, status: 'Active'   },
      { id: 2, name: 'Bob Chen',       role: 'Backend Engineer',  department: 'Engineering', location: 'San Francisco', salary: 135000, status: 'Active'   },
      { id: 3, name: 'Carol Davis',    role: 'Product Manager',   department: 'Product',     location: 'Austin',        salary: 110000, status: 'Active'   },
      { id: 4, name: 'David Kim',      role: 'UX Designer',       department: 'Design',      location: 'Seattle',       salary: 98000,  status: 'On Leave' },
      { id: 5, name: 'Eva Rodriguez',  role: 'Data Scientist',    department: 'Analytics',   location: 'Boston',        salary: 125000, status: 'Active'   },
      { id: 6, name: 'Frank Wilson',   role: 'DevOps Engineer',   department: 'Engineering', location: 'Chicago',       salary: 115000, status: 'Inactive' },
      { id: 7, name: 'Grace Lee',      role: 'Tech Lead',         department: 'Engineering', location: 'New York',      salary: 155000, status: 'Active'   },
      { id: 8, name: 'Henry Brown',    role: 'QA Engineer',       department: 'Engineering', location: 'Denver',        salary: 88000,  status: 'Active'   },
    ]);
  }

  getFeatureCards() {
    return of<FeatureCard[]>([
      {
        title: 'Angular 21',
        description: 'Standalone components, new control flow syntax, and signal-based reactivity built in from the ground up.',
        icon: 'fab fa-angular',
        badge: 'v21',
      },
      {
        title: 'Krypton UI',
        description: 'A hand-rolled set of buttons, cards, dialogs, and inputs built directly on the Crystalline Torque design tokens.',
        icon: 'fas fa-layer-group',
        badge: 'in-house',
      },
      {
        title: 'AG Grid',
        description: 'High-performance data grid with sorting, filtering, and pagination out of the box.',
        icon: 'fas fa-table-cells',
        badge: 'v36',
      },
      {
        title: 'Tailwind CSS',
        description: 'Utility-first CSS framework powering layout and spacing decisions throughout the application.',
        icon: 'fas fa-wind',
        badge: 'v3.4',
      },
    ]);
  }
}
