import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../core/services/mesa.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div>
        <p class="eyebrow">Panel operativo</p>
        <h1>Control de mesas</h1>
        <p class="hero-copy">Consulta la disponibilidad del salón y registra nuevas mesas en segundos.</p>
      </div>
      <a class="button primary" routerLink="/mesas/nueva">+ Registrar mesa</a>
    </section>

    <section class="stats" aria-label="Resumen de mesas">
      <div class="stat-card"><span>Total</span><strong>{{ mesas().length }}</strong></div>
      <div class="stat-card"><span>Disponibles</span><strong>{{ disponibles() }}</strong></div>
      <div class="stat-card"><span>En atención</span><strong>{{ ocupadas() }}</strong></div>
    </section>

    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Salón</p>
          <h2>Mesas registradas</h2>
        </div>
        <span class="muted">Actualizado en tiempo real</span>
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
  readonly disponibles = computed(() => this.mesas().filter((mesa) => mesa.estado === 'DISPONIBLE').length);
  readonly ocupadas = computed(() => this.mesas().filter((mesa) => mesa.estado === 'OCUPADA').length);
}
