import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found.component';

export const routes: Routes = [
  {
    path: 'mesas',
    loadComponent: () =>
      import('./features/mesas/mesa-list.component').then((m) => m.MesaListComponent),
  },
  {
    path: 'cocina',
    loadComponent: () =>
      import('./features/cocina/cocina.component').then((m) => m.CocinaComponent),
  },
  {
    path: 'inventario',
    loadComponent: () =>
      import('./features/inventario/inventario-list.component').then((m) => m.InventarioListComponent),
  },
  {
    path: 'inventario/nuevo',
    loadComponent: () =>
      import('./features/productos/producto-form.component').then((m) => m.ProductoFormComponent),
  },
  {
    path: 'inventario/detalle/:id',
    loadComponent: () =>
      import('./features/productos/producto-detalle.component').then((m) => m.ProductoDetalleComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/not-found.component').then((m) => m.NotFoundComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'mesas' },
  { path: '**', redirectTo: '404' },
];
