import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../core/services/mesa.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Operación</p>
          <h1>Mesas del restaurante</h1>
        </div>
        <a class="button primary" routerLink="/mesas/nueva">Registrar mesa</a>
      </div>

      <div class="mesa-grid">
        @for (mesa of mesas(); track mesa.id) {
          <article class="mesa-card">
            <div class="mesa-number">{{ mesa.numero }}</div>
            <p>Capacidad: {{ mesa.capacidad }} personas</p>
            <span class="status">{{ mesa.estado }}</span>
            <a [routerLink]="['/mesas/detalle', mesa.id]">Ver detalle</a>
          </article>
        } @empty {
          <p>No hay mesas registradas.</p>
        }
      </div>
    </section>
  `,
})
export class MesaListComponent {
  private readonly mesaService = inject(MesaService);
  readonly mesas = computed(() => this.mesaService.mesas());
}
