import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'mesas',
    loadComponent: () =>
      import('./features/mesas/mesa-list.component').then((m) => m.MesaListComponent),
  },
  {
    path: 'mesas/nueva',
    loadComponent: () =>
      import('./features/mesas/mesa-form.component').then((m) => m.MesaFormComponent),
  },
  {
    path: 'mesas/detalle/:id',
    loadComponent: () =>
      import('./features/mesas/mesa-detail.component').then((m) => m.MesaDetailComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/not-found.component').then((m) => m.NotFoundComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'mesas' },
  { path: '**', redirectTo: '404' },
];
