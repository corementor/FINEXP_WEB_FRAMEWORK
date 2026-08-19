import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../core/services/auth.service';
import { Permission } from '../core/models';
import { DashboardExampleComponent } from '@app/shared/components/ui-base/examples.component';

export interface MenuItem {
  label?: string;
  icon?: string;
  path?: string;
  routerLink?: string[];
  separator?: boolean;
  visible?: boolean;
  permission?: Permission | Permission[];
  items?: MenuItem[];
  url?: string[] | string;
  target?: string;
}

const DEFAULT_MENU_MODEL: MenuItem[] = [
  {
    label: 'General',
    icon: 'pi pi-home',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-line',
        routerLink: ['/dashboard/finance'],
        permission: Permission.PERM_VIEW_DASHBOARD,
      },
    ],
    path: '/dashboard',
    routerLink: ['/dashboard/finance'],
    permission: Permission.PERM_VIEW_DASHBOARD,
  },
  { separator: true },
  {
    label: 'Apps',
    icon: 'pi pi-th-large',
    path: '/apps',
    items: [
      {
        label: 'Employees',
        icon: 'pi pi-fw pi-comments',
        routerLink: ['/entities'],
        permission: Permission.PERM_VIEW_EMPLOYEE,
      },
      {
        label: 'Workflows',
        icon: 'pi pi-fw pi-sitemap',
        routerLink: ['/workflows'],
        permission: Permission.PERM_MANAGE_WORKFLOWS,
      },
      // {
      //   label: 'Audit Trail',
      //   icon: 'pi pi-fw pi-shield',
      //   routerLink: ['/audit'],
      //   permission: Permission.PERM_VIEW_AUDIT,
      // },
      {
        label: 'Management',
        icon: 'pi pi-fw pi-cog',
        routerLink: ['/management'],
        permission: Permission.PERM_MANAGE_ROLES,
      },

      // {
      //   label: 'examples',
      //   icon: 'pi pi-fw pi-cog',
      //   routerLink: ['/examples'],
      //   permission: Permission.PERM_VIEW_DASHBOARD,
      // },

      // {
      //   label: 'Charts of Accounts',
      //   icon: 'pi pi-fw pi-folder',
      //   routerLink: ['/apps/files'],
      // },
      // {
      //   label: 'Mail',
      //   icon: 'pi pi-fw pi-envelope',
      //   routerLink: ['/apps/mail/inbox'],
      // },
      // {
      //   label: 'Task List',
      //   icon: 'pi pi-fw pi-check-square',
      //   routerLink: ['/apps/tasklist'],
      // },
    ],
  },
  { separator: true },
  {
    label: 'Accounting',
    icon: 'pi pi-fw pi-file',
    path: '/accounting',
    items: [
      {
        label: 'Chart of Accounts',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/accounting/chart-of-accounts'],
        permission: Permission.PERM_VIEW_DASHBOARD,
      },
      {
        label: 'Journal Entries',
        icon: 'pi pi-fw pi-book',
        path: '/journal',
        permission: Permission.PERM_VIEW_DASHBOARD,
        items: [
          {
            label: 'Create Entry',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/journal/new'],
            permission: Permission.PERM_VIEW_DASHBOARD,
          },
          {
            label: 'List Entries',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/journal'],
            permission: Permission.PERM_VIEW_DASHBOARD,
          },
        ],
      },

      {
        label: 'Trial Balance',
        icon: 'pi pi-fw pi-table',
        routerLink: ['/accounting/trial-balance'],
      },
      // {
      //   label: 'Financial Statements',
      //   icon: 'pi pi-fw pi-file-export',
      //   routerLink: ['/accounting/financial-statements'],
      // },
    ],
  },
  // { separator: true },
  // {
  //   label: 'Charts of Accounts',
  //   icon: 'pi pi-fw pi-briefcase',
  //   path: '/pages',
  //   items: [
  //     {
  //       label: 'Segment 1',
  //       icon: 'pi pi-fw pi-shield',
  //       path: '/auth',
  //       items: [
  //         {
  //           label: 'Option 1',
  //           icon: 'pi pi-fw pi-shield',
  //           path: '/auth/login',
  //           routerLink: ['/auth/login'],
  //           items: [
  //             {
  //               label: 'Sub Option 1',
  //               icon: 'pi pi-fw pi-shield',
  //               path: '/auth/login',
  //               routerLink: ['/auth/login'],
  //             },
  //             {
  //               label: 'Sub Option 2',
  //               icon: 'pi pi-fw pi-shield',
  //               path: '/auth/login',
  //               routerLink: ['/auth/login'],
  //             },
  //           ],
  //         },
  //         {
  //           label: 'Option 2',
  //           icon: 'pi pi-fw pi-shield',
  //           routerLink: ['/auth/error'],
  //         },
  //         {
  //           label: 'Option 3',
  //           icon: 'pi pi-fw pi-lock',
  //           routerLink: ['/auth/access-denied'],
  //         },
  //       ],
  //     },
  //   ],
  // },
  { separator: true },
  {
    label: 'Budget Formulation',
    icon: 'pi pi-fw pi-wallet',
    path: '/budget',
    items: [
      {
        label: 'Ceiling',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: ['/budget/budget'],
      },
      {
        label: 'Budget Costing salary',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/budget/variance'],
      },
      {
        label: 'Budget Costing Debt',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/budget/variance'],
      },
    ],
  },
  { separator: true },
  {
    label: 'Commitments',
    icon: 'pi pi-fw pi-handshake',
    path: '/commitments',
    items: [
      {
        label: 'Create Commitment',
        icon: 'pi pi-fw pi-plus',
        routerLink: ['/commitments/create'],
      },
      {
        label: 'View Commitments',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/commitments/view'],
      },
    ],
  },
  { separator: true },
  {
    label: 'Payments',
    icon: 'pi pi-fw pi-credit-card',
    path: '/payments',
    items: [
      {
        label: 'Create Payment',
        icon: 'pi pi-fw pi-plus',
        routerLink: ['/payments/create'],
      },
      {
        label: 'View Payments',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/payments/view'],
      },
    ],
  },
  { separator: true },
  {
    label: 'Receipts',
    icon: 'pi pi-fw pi-handshake',
    path: '/receipts',
    items: [
      {
        label: 'Create Receipt',
        icon: 'pi pi-fw pi-plus',
        routerLink: ['/receipts/create'],
      },
      {
        label: 'View Receipts',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/receipts/view'],
      },
    ],
  },

  { separator: true },

  {
    label: 'TSA',
    icon: 'pi pi-fw pi-chart-pie',
    path: '/reports',
    items: [
      {
        label: 'Budget vs Actual',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: ['/reports/budget-vs-actual'],
      },
      {
        label: 'Cash Flow Statement',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/reports/cash-flow-statement'],
      },
      {
        label: 'Balance Sheet',
        icon: 'pi pi-fw pi-table',
        routerLink: ['/accounting/balance-sheet'],
      },
      {
        label: 'Income Statement',
        icon: 'pi pi-fw pi-file-export',
        routerLink: ['/reports/income-statement'],
      },
    ],
  },
  { separator: true },
  {
    label: 'Admin',
    icon: 'pi pi-fw pi-cog',
    routerLink: ['/admin'],
    items: [
      {
        label: 'User Management',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/admin/users'],
      },
      {
        label: 'Role  Management',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/admin/users'],
      },
      {
        label: 'System Settings',
        icon: 'pi pi-fw pi-sliders-h',
        routerLink: ['/admin/settings'],
      },
    ],
  },
];

@Component({
  selector: '[app-menu]',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model(); track $index) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [root]="true"></li>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul> `,
})
export class AppMenu {
  private readonly authService = inject(AuthService);

  readonly model = computed(() => this.filterItems(DEFAULT_MENU_MODEL));

  private filterItems(items: MenuItem[]): MenuItem[] {
    return (items || [])
      .map((item) => {
        if (item.separator) {
          return item;
        }

        if (item.permission) {
          const permissions = Array.isArray(item.permission) ? item.permission : [item.permission];
          if (!this.authService.hasAnyPermission(permissions)) {
            return null;
          }
        }

        if (item.items?.length) {
          const children = this.filterItems(item.items);
          if (children.length === 0) {
            return null;
          }

          return { ...item, items: children };
        }

        return item;
      })
      .filter((item): item is MenuItem => item !== null);
  }
}
