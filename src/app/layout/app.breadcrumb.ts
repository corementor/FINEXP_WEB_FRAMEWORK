import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule],
    template: `
        <span><i class="pi pi-home text-surface-400 leading-none!"></i></span>
        @for (item of breadcrumbs(); track $index; let last = $last) {
            <div class="flex items-center gap-2" [class]="!last ? 'text-surface-400 font-normal' : 'text-surface-950 dark:text-surface-0 font-medium'">
                <span class="leading-none">{{ item }}</span>
                @if (!last) {
                    <span><i class="pi pi-chevron-right text-xs! leading-none!"></i></span>
                }
            </div>
        }
    `,
    host: {
        class: 'max-h-16 py-4 pr-4 pl-6 flex items-center gap-2 border-b'
    }
})
export class AppBreadcrumb {
    private router = inject(Router);

    private breadcrumbs$ = this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.buildBreadcrumbs(this.router.routerState.snapshot.root))
    );

    breadcrumbs = toSignal(this.breadcrumbs$, { initialValue: [] as string[] });

    private buildBreadcrumbs(snapshot: ActivatedRouteSnapshot, breadcrumbs: string[] = []): string[] {
        const breadcrumb = snapshot.data['breadcrumb'];
        if (breadcrumb) {
            if (Array.isArray(breadcrumb)) {
                breadcrumbs.push(...breadcrumb);
            } else {
                breadcrumbs.push(breadcrumb);
            }
        }

        if (snapshot.firstChild) {
            return this.buildBreadcrumbs(snapshot.firstChild, breadcrumbs);
        }

        return breadcrumbs;
    }
}
