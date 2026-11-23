import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="card narrow">
      <h1>Página no encontrada</h1>
      <p>La ruta solicitada no existe.</p>
      <a routerLink="/mesas">Volver al inicio</a>
    </section>
  `,
})
export class NotFoundComponent {}
