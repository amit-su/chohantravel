import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';
import environments from '../../../environments/environments';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule],
    templateUrl: './pages/layout.html'
})
export class AppLayout implements OnInit, OnDestroy {
    overlayMenuOpenSubscription: Subscription;
    isprod = environments.production;
    navItems = [
        { label: 'Menu', icon: 'pi pi-bars', route: '/menu' },
        { label: 'Profile', icon: 'pi pi-user', route: '/profile' }
    ];
    menuOutsideClickListener: any;
    isNotLoginPage: boolean = true;

    // Home routes — pressing back here will trigger exit logic
    private homeRoutes = ['/', ''];

    // Double-tap-to-exit state
    private backPressedOnce = false;
    private backExitTimer: any;

    // Capacitor back-button listener handle
    private backButtonListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            setTimeout(() => this.checkLoginUrl(), 0);
        });
    }

    async ngOnInit() {
        this.checkLoginUrl();
        await this.registerBackButton();

        // Hide splash screen after app initialization
        try {
            await SplashScreen.hide();
        } catch {
            // Not running in capacitor
        }
    }

    // ── Android Back Button ──────────────────────────────────────────────────

    private async registerBackButton() {
        try {
            this.backButtonListener = await App.addListener('backButton', () => {
                this.handleBackButton();
            });
        } catch {
            // Not running in Capacitor (e.g. browser dev) — skip
        }
    }

    private handleBackButton() {
        const currentUrl = this.router.url;
        const isHome = this.homeRoutes.includes(currentUrl) || currentUrl === '/';

        if (!isHome) {
            // Navigate back in history
            window.history.back();
            return;
        }

        // On home page: double-tap-to-exit
        if (this.backPressedOnce) {
            // Second tap — exit app
            clearTimeout(this.backExitTimer);
            App.exitApp();
            return;
        }

        // First tap — show toast and set timer
        this.backPressedOnce = true;
        this.showExitToast();

        this.backExitTimer = setTimeout(() => {
            this.backPressedOnce = false;
        }, 2000);
    }

    private showExitToast() {
        const toast = this.renderer.createElement('div');
        this.renderer.setStyle(toast, 'position', 'fixed');
        this.renderer.setStyle(toast, 'bottom', 'calc(env(safe-area-inset-bottom, 0px) + 80px)');
        this.renderer.setStyle(toast, 'left', '50%');
        this.renderer.setStyle(toast, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(toast, 'background', 'rgba(30,30,30,0.92)');
        this.renderer.setStyle(toast, 'color', 'white');
        this.renderer.setStyle(toast, 'padding', '10px 22px');
        this.renderer.setStyle(toast, 'border-radius', '24px');
        this.renderer.setStyle(toast, 'font-size', '13px');
        this.renderer.setStyle(toast, 'font-weight', '600');
        this.renderer.setStyle(toast, 'z-index', '99999');
        this.renderer.setStyle(toast, 'pointer-events', 'none');
        this.renderer.setStyle(toast, 'box-shadow', '0 4px 16px rgba(0,0,0,0.3)');
        this.renderer.setProperty(toast, 'textContent', 'Press back again to exit');
        this.renderer.appendChild(document.body, toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                this.renderer.removeChild(document.body, toast);
            }
        }, 2000);
    }

    // ── Layout Helpers ───────────────────────────────────────────────────────

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;
        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
        // Remove native back-button listener
        if (this.backButtonListener) {
            this.backButtonListener.remove();
        }
        if (this.backExitTimer) {
            clearTimeout(this.backExitTimer);
        }
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }

    navigate(route: string) {
        this.router.navigate([route]);
    }

    checkLoginUrl() {
        const loginRoutes = ['/pages/login'];
        const homeRouter = ['/pages/home'];
        this.isNotLoginPage = !(loginRoutes.includes(this.router.url) || homeRouter.includes(this.router.url));
    }
}
