import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'employee/:employeeId/audit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'journal',
    renderMode: RenderMode.Server,
  },
  {
    path: 'journal/new',
    renderMode: RenderMode.Server,
  },
  {
    path: 'journal/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'accounting/chart-of-accounts',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
