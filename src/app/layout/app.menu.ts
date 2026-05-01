import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../core/services/auth.service';
import { Permission } from '../core/models';

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
        routerLink: ['/dashboard'],
        permission: Permission.PERM_VIEW_DASHBOARD,
      },
    ],
    path: '/dashboard',
    routerLink: ['/dashboard'],
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
      {
        label: 'Audit Trail',
        icon: 'pi pi-fw pi-shield',
        routerLink: ['/audit'],
        permission: Permission.PERM_VIEW_AUDIT,
      },
      {
        label: 'Management',
        icon: 'pi pi-fw pi-cog',
        routerLink: ['/management'],
        permission: Permission.PERM_MANAGE_ROLES,
      },
      //   {
      //     label: 'Files',
      //     icon: 'pi pi-fw pi-folder',
      //     routerLink: ['/apps/files'],
      //   },
      //   {
      //     label: 'Mail',
      //     icon: 'pi pi-fw pi-envelope',
      //     routerLink: ['/apps/mail/inbox'],
      //   },
      //   {
      //     label: 'Task List',
      //     icon: 'pi pi-fw pi-check-square',
      //     routerLink: ['/apps/tasklist'],
      //   },
    ],
  },
  // //   { separator: true },
  // //   {
  // //     label: 'Pages',
  // //     icon: 'pi pi-fw pi-briefcase',
  // //     path: '/pages',
  // //     items: [
  // //       {
  // //         label: 'Auth',
  // //         icon: 'pi pi-fw pi-user',
  // //         path: '/auth',
  // //         items: [
  // //           {
  // //             label: 'Login',
  // //             icon: 'pi pi-fw pi-sign-in',
  // //             routerLink: ['/auth/login'],
  // //           },
  // //           {
  // //             label: 'Error',
  // //             icon: 'pi pi-fw pi-times-circle',
  // //             routerLink: ['/auth/error'],
  // //           },
  // //           {
  // //             label: 'Access Denied',
  // //             icon: 'pi pi-fw pi-lock',
  // //             routerLink: ['/auth/access-denied'],
  // //           },
  // //         ],
  // //       },
  //     ],
  //   },
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
