import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';

const ESTADO_CLASS: Record<string, string> = {
  PENDIENTE: 'badge-warning',
  EN_PREPARACION: 'badge-info',
  LISTO: 'badge-success',
  CANCELADO: 'badge-danger',
};

const SIGUIENTE: Record<string, string | null> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
  LISTO: null,
  CANCELADO: null,
};

const ACCION_LABEL: Record<string, string> = {
  PENDIENTE: 'Iniciar preparación',
  EN_PREPARACION: 'Marcar listo',
  LISTO: 'Completado',
  CANCELADO: 'Cancelada',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Cocina</h1>
        <p class="page-subtitle">Órdenes de cocina y su estado</p>
      </div>

      <div class="tab-bar">
        <button class="btn btn-primary btn-sm" (click)="setTab('activas')">Activas</button>
        <button class="btn btn-ghost btn-sm" (click)="setTab('historial')">Historial</button>
      </div>

      @if (tab() === 'activas') {
        <div class="filter-bar">
          <select class="filtro-select" (change)="setFiltro($event)">
            <option value="">Pendientes</option>
            <option value="EN_PREPARACION">En preparación</option>
            <option value="LISTO">Listas</option>
            <option value="CANCELADO">Canceladas</option>
          </select>
        </div>
      }

      @if (ordenes().length === 0) {
        <p class="empty">No hay órdenes de cocina.</p>
      } @else {
        <div class="cocina-grid">
          @for (orden of ordenes(); track orden.id) {
            <div class="card cocina-card">
              <div class="cocina-header">
                <span class="cocina-titulo">
                  Orden #{{ orden.id }}
                  @if (orden.pedido?.mesaNumero) {
                    <span> · Mesa {{ orden.pedido.mesaNumero }}</span>
                  }
                </span>
                <span class="badge" [class]="estadoClass(orden.estado)">
                  {{ orden.estado }}
                </span>
              </div>

              @if (orden.pedido?.clienteNombre) {
                <p class="cocina-cliente">Cliente: {{ orden.pedido.clienteNombre }}</p>
              }

              <ul class="cocina-items">
                @for (detalle of orden.pedido?.detalles ?? []; track detalle.id) {
                  <li>
                    <span class="cocina-cantidad">×{{ detalle.cantidad }}</span>
                    <span>{{ detalle.productoNombre || 'Producto' }}</span>
                  </li>
                }
              </ul>

              @if (orden.pedido?.nota) {
                <p class="cocina-nota">📝 {{ orden.pedido.nota }}</p>
              }

              @if (tab() === 'activas') {
                <div class="cocina-acciones">
                  <button
                    class="btn btn-primary"
                    [disabled]="!siguienteEstado(orden.estado)"
                    (click)="avanzar(orden)"
                  >
                    {{ accionLabel(orden.estado) }}
                  </button>

                  @if (orden.estado === 'PENDIENTE' || orden.estado === 'EN_PREPARACION') {
                    <button
                      class="btn btn-danger btn-sm"
                      (click)="cancelar(orden)"
                    >
                      Cancelar
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./cocina.component.css'],
})
export class CocinaComponent {
  private readonly pedidoService = inject(PedidoService);

  private _tab: 'activas' | 'historial' = 'activas';
  private _filtro = '';

  protected readonly SIGUIENTE = SIGUIENTE;
  protected readonly ESTADO_CLASS = ESTADO_CLASS;
  protected readonly ACCION_LABEL = ACCION_LABEL;

  protected setTab(tab: 'activas' | 'historial'): void {
    this._tab = tab;
    this._filtro = '';
  }

  protected setFiltro(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this._filtro = target.value;
  }

  protected tab(): 'activas' | 'historial' {
    return this._tab;
  }

  protected ordenes(): any[] {
    const todas = this.pedidoService.getOrdenesCocinaActivas();
    let filtradas = todas;

    if (this._tab === 'activas') {
      if (this._filtro) {
        filtradas = filtradas.filter((o) => o.estado === this._filtro);
      }
    }

    return filtradas;
  }

  protected estadoClass(estado: string): string {
    return ESTADO_CLASS[estado] || '';
  }

  protected siguienteEstado(estado: string): string | null {
    return SIGUIENTE[estado] ?? null;
  }

  protected accionLabel(estado: string): string {
    return ACCION_LABEL[estado] ?? '';
  }

  protected avanzar(orden: any): void {
    const siguiente = this.siguienteEstado(orden.estado);
    if (!siguiente) return;
    this.pedidoService.cambiarEstadoOrdenCocina(orden.id, siguiente as any);
  }

  protected cancelar(orden: any): void {
    if (!confirm(`¿Cancelar la orden de cocina #${orden.id}?`)) return;
    this.pedidoService.cancelarOrdenCocina(orden.id);
  }
}
