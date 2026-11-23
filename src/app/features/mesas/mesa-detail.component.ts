import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../core/services/mesa.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="card narrow">
      @if (mesa(); as selectedMesa) {
        <p class="eyebrow">Detalle</p>
        <h1>Mesa {{ selectedMesa.numero }}</h1>
        <dl>
          <dt>Capacidad</dt><dd>{{ selectedMesa.capacidad }} personas</dd>
          <dt>Estado</dt><dd>{{ selectedMesa.estado }}</dd>
        </dl>
      } @else {
        <h1>Registro no encontrado</h1>
        <p>La mesa solicitada no existe.</p>
      }
      <a routerLink="/mesas">Volver a mesas</a>
    </section>
  `,
})
export class MesaDetailComponent {
  readonly id = input<string>();
  private readonly mesaService = inject(MesaService);
  readonly mesa = computed(() => {
    const parsedId = Number(this.id());
    return Number.isInteger(parsedId) ? this.mesaService.getById(parsedId) : undefined;
  });
}
