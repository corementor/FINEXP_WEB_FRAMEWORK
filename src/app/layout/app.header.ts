import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Avatar } from 'primeng/avatar';
import { LayoutService } from './service/layout.service';
import { AuthService } from '../core/services/auth.service';
import { AppNotifications } from './app.notifications';
import { AppProfile } from './app.profile';
import { AppRightMenu } from './app.rightmenu';

@Component({
  selector: '[app-header]',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StyleClassModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    // Avatar,
    AppNotifications,
    // AppProfile,
    AppRightMenu,
  ],
  template: `
    <div class="topbar-left">
      @if (showMenuButton()) {
        <button type="button" (click)="layoutService.toggleMenu()" class="menu-button">
          <i class="pi pi-bars"></i>
        </button>
        <span class="topbar-separator"></span>
      }
      <div class="page-title">
        {{ pageTitle() }}
      </div>
    </div>

    <div class="topbar-right">
      <p-iconfield>
        <p-inputicon class="pi pi-search" />
        <input type="text" pInputText [(ngModel)]="search" placeholder="Search" />
      </p-iconfield>

      <div class="topbar-actions">
        <button
          type="button"
          (click)="layoutService.toggleMenu()"
          class="menu-button menu-button-mobile"
        >
          <i class="pi pi-bars"></i>
        </button>

        <button
          type="button"
          (click)="layoutService.toggleConfigSidebar()"
          class="app-config-button"
        >
          <i class="pi pi-cog"></i>
        </button>

        <div class="relative">
          <a
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="p-anchored-overlay-enter-active"
            leaveActiveClass="p-anchored-overlay-leave-active"
            leaveToClass="hidden"
            [hideOnOutsideClick]="true"
          >
            <p-button icon="pi pi-bell" severity="secondary" [outlined]="true" />
          </a>
          <div class="absolute hidden min-w-72 top-auto right-0 z-20 mt-2">
            <div app-notifications styleClass="w-full sm:w-[22rem]"></div>
          </div>
        </div>

        <!-- <div class="relative">
          <a
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="p-anchored-overlay-enter-active"
            leaveActiveClass="p-anchored-overlay-leave-active"
            leaveToClass="hidden"
            [hideOnOutsideClick]="true"
            class="flex items-center"
          >
            <p-avatar
              image="/demo/images/avatar/avatar-square-m-2.jpg"
              styleClass="!rounded-md !overflow-hidden !w-9 !h-9 cursor-pointer"
            />
          </a>
          <div class="absolute hidden top-full right-0 mt-2 z-20">
            <div app-profile class="w-52"></div>
          </div>
        </div> -->

        <p-button
          (click)="onLogout()"
          icon="pi pi-sign-out"
          severity="secondary"
          [outlined]="true"
        />

        <!-- <p-button
          (click)="layoutService.toggleRightMenu()"
          icon="pi pi-align-right"
          severity="secondary"
          [outlined]="true"
        /> -->
        <div app-rightmenu></div>
      </div>
    </div>
  `,
})
export class AppHeader {
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  search = signal('');

  // RBAC & Auth state from layout
  currentUser = computed(() => {
    const user = this.authService.currentUser$();
    return user ? user.username || user.email : '';
  });

  userInitial = computed(() => {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : 'A';
  });

  isAuthenticated = computed(() => this.authService.isAuthenticated$());

  showMenuButton = computed(() => {
    const menuMode = this.layoutService.layoutConfig().menuMode;
    return menuMode === 'overlay' || menuMode === 'static';
  });

  private pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route.snapshot.data['title'] || 'Dashboard';
    }),
  );

  pageTitle = toSignal(this.pageTitle$, { initialValue: 'Dashboard' });

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
