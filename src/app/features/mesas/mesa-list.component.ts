import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../core/services/mesa.service';
import { MesaEstado } from '../../core/models/mesa.model';

const ACCIONES: Record<MesaEstado, { estado: MesaEstado; label: string; clase: string }[]> = {
  DISPONIBLE: [
    { estado: 'RESERVADA', label: 'Reservar', clase: 'btn-ghost' },
    { estado: 'OCUPADA', label: 'Ocupar', clase: 'btn-primary' },
  ],
  RESERVADA: [
    { estado: 'OCUPADA', label: 'Ocupar', clase: 'btn-primary' },
    { estado: 'DISPONIBLE', label: 'Liberar', clase: 'btn-ghost' },
  ],
  OCUPADA: [{ estado: 'DISPONIBLE', label: 'Liberar', clase: 'btn-ghost' }],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Mesas</h1>
        <p class="page-subtitle">Estado del salón en tiempo real</p>
        <a routerLink="/mesas/nueva" class="btn btn-primary">+ Nueva mesa</a>
      </div>

      <div class="mesa-grid">
        @for (mesa of mesas(); track mesa.id) {
          <div class="mesa-card" [class]="mesaEstadoClass(mesa.estado)">
            <div class="mesa-numero">Mesa {{ mesa.numero }}</div>
            <div class="mesa-capacidad">{{ mesa.capacidad }} personas</div>

            <div class="mesa-acciones">
              @for (accion of ACCIONES[mesa.estado]; track accion.estado) {
                <button
                  class="btn {{ accion.clase }} btn-sm"
                  (click)="cambiarEstado(mesa, accion.estado)"
                >
                  {{ accion.label }}
                </button>
              }
            </div>
          </div>
        } @empty {
          <p class="empty">No hay mesas registradas.</p>
        }
      </div>
    </div>
  `,
  styleUrls: ['./mesa-list.component.css'],
})
export class MesaListComponent {
  private readonly mesaService = inject(MesaService);

  protected readonly ACCIONES = ACCIONES;

  readonly mesas = computed(() => this.mesaService.mesas());

  protected mesaEstadoClass(estado: MesaEstado): string {
    return `mesa-card mesa-${estado.toLowerCase()}`;
  }

  protected cambiarEstado(mesa: { id: number; estado: MesaEstado }, estado: MesaEstado): void {
    this.mesaService.cambiarEstado(mesa.id, estado);
  }
}
