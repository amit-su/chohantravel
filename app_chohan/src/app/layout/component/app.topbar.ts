import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { GlobalStorageService } from '../../../services/global-storage.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule],
    template: `    <div class="fixed top-0 left-0 w-full z-[1001] pointer-events-none">
        <div class="w-full h-16 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-md pointer-events-auto flex items-center justify-between px-6 overflow-hidden">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <img src="assets/image/logo-black-new.png" alt="Logo" class="w-8 h-8 object-contain brightness-0 invert" />
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-black tracking-tight text-white leading-none uppercase">Chohan Tours and Travels</span>
                    <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-red-100 mt-1">{{ branchInfo.user_name }}</span>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <div class="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md border border-white/5">
                    {{ globalstorage.get('PAGE_TITLE') || 'Dashboard' }}
                </div>
                <button (click)="layoutService.onMenuToggle()" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 sm:hidden">
                    <i class="pi pi-bars"></i>
                </button>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    constructor(
        public layoutService: LayoutService,
        public globalstorage: GlobalStorageService
    ) {}

    get branchInfo(): { user_name: string } {
        const branchData = (this.globalstorage.get('branchInfo') as { branch_name?: string }) || {};
        const userData = (this.globalstorage.get('username') as { username: string }) || {};
        return {
            user_name: `${userData ?? ''}` || 'Guest User'
        };
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
