import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface LayoutConfig {
    preset: string;
    primary: string;
    surface: string | undefined | null;
    darkTheme: boolean;
    menuMode: string;
}

interface LayoutState {
    staticMenuInactive: boolean;
    overlayMenuActive: boolean;
    rightMenuVisible: boolean;
    configSidebarVisible: boolean;
    mobileMenuActive: boolean;
    searchBarActive: boolean;
    sidebarExpanded: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
    anchored: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    layoutConfig = signal<LayoutConfig>({
        preset: 'Aura',
        primary: 'blue',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    });

    layoutState = signal<LayoutState>({
        staticMenuInactive: false,
        overlayMenuActive: false,
        rightMenuVisible: false,
        configSidebarVisible: false,
        mobileMenuActive: false,
        searchBarActive: false,
        sidebarExpanded: false,
        menuHoverActive: false,
        activePath: null,
        anchored: false
    });

    router = inject(Router);

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    isSlim = computed(() => this.layoutConfig().menuMode === 'slim');

    isHorizontal = computed(() => this.layoutConfig().menuMode === 'horizontal');

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    isCompact = computed(() => this.layoutConfig().menuMode === 'compact');

    isStatic = computed(() => this.layoutConfig().menuMode === 'static');

    isReveal = computed(() => this.layoutConfig().menuMode === 'reveal');

    isDrawer = computed(() => this.layoutConfig().menuMode === 'drawer');

    hasOverlaySubmenu = computed(() => this.isSlim() || this.isCompact() || this.isHorizontal());

    hasOpenOverlay = computed(() => this.layoutState().overlayMenuActive || this.hasOpenOverlaySubmenu());

    hasOpenOverlaySubmenu = computed(() => {
        return this.hasOverlaySubmenu() && !!this.layoutState().activePath;
    });

    isSidebarStateChanged = computed(() => {
        const layoutConfig = this.layoutConfig();
        return layoutConfig.menuMode === 'horizontal' || layoutConfig.menuMode === 'slim' || layoutConfig.menuMode === 'slim-plus';
    });

    private initialized = false;

    private previousMenuMode: string | undefined = undefined;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });

        effect(() => {
            this.updateMenuState();
        });
    }

    private updateMenuState() {
        const menuMode = this.layoutConfig().menuMode;
        if (this.previousMenuMode === undefined) {
            this.previousMenuMode = menuMode;
            return;
        }

        if (this.previousMenuMode === menuMode) {
            return;
        }

        this.previousMenuMode = menuMode;

        const isOverlaySubmenu = menuMode === 'slim' || menuMode === 'slim-plus' || menuMode === 'horizontal' || menuMode === 'compact';

        this.layoutState.update((prev) => ({
            ...prev,
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            sidebarExpanded: false,
            menuHoverActive: false,
            anchored: false,
            activePath: this.isDesktop() ? (isOverlaySubmenu ? null : this.router.url) : prev.activePath
        }));
    }

    private handleDarkModeTransition(config: LayoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
        }
    }

    private startViewTransition(config: LayoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });
    }

    toggleDarkMode(config?: LayoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    toggleMenu() {
        if (this.isDesktop()) {
            if (this.layoutConfig().menuMode === 'static') {
                this.layoutState.update((prev) => ({ ...prev, staticMenuInactive: !prev.staticMenuInactive }));
            }

            if (this.layoutConfig().menuMode === 'overlay') {
                this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !prev.overlayMenuActive }));
            }
        } else {
            this.layoutState.update((prev) => ({ ...prev, mobileMenuActive: !prev.mobileMenuActive }));
        }
    }

    changeMenuMode(mode: string) {
        this.layoutConfig.update((prev) => ({ ...prev, menuMode: mode }));
        this.layoutState.update((prev) => ({ ...prev, staticMenuInactive: false, overlayMenuActive: false, mobileMenuActive: false, sidebarExpanded: false, menuHoverActive: false, anchored: false }));

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({ ...prev, activePath: this.hasOverlaySubmenu() ? null : this.router.url }));
        }
    }

    toggleRightMenu() {
        this.layoutState.update((prev) => ({
            ...prev,
            rightMenuVisible: !prev.rightMenuVisible
        }));
    }

    toggleConfigSidebar() {
        this.layoutState.update((prev) => ({
            ...prev,
            configSidebarVisible: !prev.configSidebarVisible
        }));
    }

    toggleSearchBar() {
        this.layoutState.update((prev) => ({
            ...prev,
            searchBarActive: !prev.searchBarActive
        }));
    }

    isDesktop() {
        return window.innerWidth > 991;
    }
}
