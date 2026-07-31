import { Component, computed, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { AppMenu } from './app.menu';
import { LayoutService } from './service/layout.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { Logo } from './icons';
import { AuthService } from '../core/services/auth.service';

const BREAKPOINT = 992;

@Component({
  selector: '[app-sidebar]',
  standalone: true,
  imports: [CommonModule, AppMenu, RouterModule, Logo],
  template: ` <div
    [class]="sidebarClass()"
    (mouseenter)="onMouseEnter()"
    (mouseleave)="onMouseLeave()"
  >
    <div class="sidebar-header">
      <a class="logo" [routerLink]="['/']">
        <logo />
        <span class="app-name text-4xl font-medium leading-normal">FINXP</span></a
      >
      <button class="layout-sidebar-anchor z-2" type="button" (click)="onAnchorToggle()"></button>
    </div>

    <div #menuContainer class="layout-menu-container" (scroll)="onMenuScroll()">
      <div app-menu></div>
    </div>

    <div class="p-3 border-t border-surface-200 dark:border-surface-700 mt-auto">
      <div class="flex items-center gap-3 px-2 py-2 rounded-xl mb-1 overflow-hidden">
        <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {{ userInitial() }}
        </div>
        <span class="text-sm font-medium text-surface-900 dark:text-surface-0 truncate sidebar-user-name">
          {{ currentUser() }}
        </span>
      </div>
      <button
        type="button"
        (click)="onLogout()"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-surface-500 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 group"
      >
        <i class="pi pi-sign-out text-base flex-shrink-0"></i>
        <span class="text-sm font-medium sidebar-logout-label">Sign Out</span>
      </button>
    </div>
  </div>`,
})
export class AppSidebar {
  layoutService = inject(LayoutService);

  router = inject(Router);

  el = inject(ElementRef);

  private authService = inject(AuthService);

  currentUser = computed(() => {
    const user = this.authService.currentUser$();
    return user ? user.username || user.email : '';
  });

  userInitial = computed(() => {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  @ViewChild('sidebarRef') sidebarRef!: ElementRef;

  private timeout: any = null;

  private observer: IntersectionObserver | null = null;

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;

  private mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);

  private destroy$ = new Subject<void>();

  sidebarClass = computed(
    () =>
      'layout-sidebar ' +
      (this.layoutService.isDarkTheme() ? 'layout-sidebar-dark' : 'layout-sidebar-light'),
  );

  isHorizontal = computed(() => this.layoutService.isHorizontal());

  isDrawer = computed(() => this.layoutService.layoutConfig().menuMode === 'drawer');

  isReveal = computed(() => this.layoutService.layoutConfig().menuMode === 'reveal');

  isAnchored = computed(() => this.layoutService.layoutState().anchored);

  constructor() {
    effect(() => {
      const hasOpenOverlay = this.layoutService.hasOpenOverlay();
      const mobileMenuActive = this.layoutService.layoutState().mobileMenuActive;

      if (this.layoutService.isDesktop()) {
        if (hasOpenOverlay) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      } else {
        if (mobileMenuActive) {
          this.bindOutsideClickListener();
        } else {
          this.unbindOutsideClickListener();
        }
      }
    });

    effect(() => {
      const hasOpenOverlaySubmenu = this.layoutService.hasOpenOverlaySubmenu();
      if (this.layoutService.isDesktop()) {
        if (hasOpenOverlaySubmenu) {
          setTimeout(() => this.setupIntersectionObserver());
        } else {
          this.unbindObserver();
        }
      }
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.onRouteChange(navEvent.urlAfterRedirects);
      });

    this.onRouteChange(this.router.url);

    this.mediaQuery.addEventListener('change', this.screenChangeListener);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unbindOutsideClickListener();
    this.unbindObserver();
    this.mediaQuery.removeEventListener('change', this.screenChangeListener);
  }

  private onRouteChange(path: string) {
    let newActivePath: string | null;

    if (this.layoutService.hasOverlaySubmenu() && this.layoutService.isDesktop()) {
      newActivePath = null;
    } else {
      newActivePath = path;
    }

    this.layoutService.layoutState.update((val) => ({
      ...val,
      activePath: newActivePath,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
  }

  private screenChangeListener = () => {
    if (this.layoutService.hasOverlaySubmenu()) {
      this.layoutService.layoutState.update((val) => ({
        ...val,
        activePath: this.layoutService.isDesktop() ? null : this.router.url,
        menuHoverActive: false,
      }));
      this.unbindOutsideClickListener();
      this.unbindObserver();
    }
  };

  private bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isOutsideClicked(event)) {
          if (this.layoutService.isDesktop()) {
            this.layoutService.layoutState.update((val) => ({
              ...val,
              overlayMenuActive: false,
            }));

            if (this.layoutService.hasOverlaySubmenu()) {
              this.layoutService.layoutState.update((val) => ({
                ...val,
                activePath: null,
                menuHoverActive: false,
              }));
            }
          } else {
            this.layoutService.layoutState.update((val) => ({
              ...val,
              mobileMenuActive: false,
            }));
          }
        }
      };

      document.addEventListener('click', this.outsideClickListener);
    }
  }

  private unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  private isOutsideClicked(event: MouseEvent): boolean {
    const topbarButtonEl = document.querySelector('.topbar-left > a');
    const sidebarEl = this.el.nativeElement;

    return !(
      sidebarEl?.isSameNode(event.target as Node) ||
      sidebarEl?.contains(event.target as Node) ||
      topbarButtonEl?.isSameNode(event.target as Node) ||
      topbarButtonEl?.contains(event.target as Node)
    );
  }

  onMouseEnter() {
    if (!this.isAnchored() && (this.isDrawer() || this.isReveal())) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.layoutState.update((state) => ({
        ...state,
        sidebarExpanded: true,
      }));
    }
  }

  onMouseLeave() {
    if (!this.isAnchored() && !this.timeout) {
      this.timeout = setTimeout(() => {
        this.layoutService.layoutState.update((state) => ({
          ...state,
          sidebarExpanded: false,
        }));
      }, 300);
    }
  }

  onAnchorToggle() {
    this.layoutService.layoutState.update((state) => ({
      ...state,
      anchored: !state.anchored,
    }));
  }

  onMenuScroll() {
    if (this.menuContainer?.nativeElement) {
      if (this.layoutService.isHorizontal()) {
        const scrollLeft = this.menuContainer.nativeElement.scrollLeft;
        this.menuContainer.nativeElement.style.setProperty('--menu-scroll-x', `-${scrollLeft}px`);
      } else {
        const scrollTop = this.menuContainer.nativeElement.scrollTop;
        this.menuContainer.nativeElement.style.setProperty('--menu-scroll-y', `-${scrollTop}px`);
      }
    }

    if (this.layoutService.hasOverlaySubmenu() && this.layoutService.isDesktop()) {
      this.layoutService.layoutState.update((val) => ({
        ...val,
        activePath: null,
        menuHoverActive: false,
      }));
    }
  }

  private setupIntersectionObserver() {
    if (!this.menuContainer?.nativeElement) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    const activeMenuItem = this.menuContainer.nativeElement.querySelector(
      '.layout-root-menuitem.active-menuitem',
    );
    if (!activeMenuItem) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            this.layoutService.isDesktop() &&
            !entry.isIntersecting &&
            this.layoutService.hasOverlaySubmenu() &&
            this.layoutService.layoutState().activePath
          ) {
            this.layoutService.layoutState.update((val) => ({
              ...val,
              activePath: null,
            }));
          }
        });
      },
      {
        root: this.menuContainer.nativeElement,
        threshold: 0,
      },
    );

    this.observer.observe(activeMenuItem);
  }

  private unbindObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
