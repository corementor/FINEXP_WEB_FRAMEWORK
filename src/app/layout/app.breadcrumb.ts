import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

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
    private activatedRoute = inject(ActivatedRoute);

    private breadcrumbs$ = this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.activatedRoute.root))
    );

    breadcrumbs = toSignal(this.breadcrumbs$, { initialValue: [] as string[] });

    private buildBreadcrumbs(route: ActivatedRoute, breadcrumbs: string[] = []): string[] {
        const children = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const breadcrumb = child.snapshot.data['breadcrumb'];
            if (breadcrumb) {
                if (Array.isArray(breadcrumb)) {
                    breadcrumbs.push(...breadcrumb);
                } else {
                    breadcrumbs.push(breadcrumb);
                }
            }
            return this.buildBreadcrumbs(child, breadcrumbs);
        }

        return breadcrumbs;
    }
}
