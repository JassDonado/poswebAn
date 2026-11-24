import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MesaService } from '../../core/services/mesa.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Hola, Usuario</h1>
        <p class="page-subtitle">Resumen del salón en tiempo real</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Mesas</div>
          <div class="stat-value">{{ totalMesas() }}</div>
          <div class="stat-note">{{ mesasOcupadas() }} ocupadas</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Pedidos activos</div>
          <div class="stat-value">{{ pedidosActivos() }}</div>
          <div class="stat-note">{{ enCocina() }} en cocina</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Productos</div>
          <div class="stat-value">{{ totalProductos() }}</div>
          <div class="stat-note">{{ bajoStock() }} bajo stock</div>
        </div>

        <div class="stat-card stat-accent">
          <div class="stat-label">Ventas totales</div>
          <div class="stat-value">{{ totalVentas() | currency:'COP':'symbol':'1.0-0' }}</div>
          <div class="stat-note">Pedidos facturados</div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="card">
          <div class="card-header">
            <h2>Por atender en cocina</h2>
            <a routerLink="/cocina" class="btn btn-ghost btn-sm">Ver cocina</a>
          </div>

          @if (enCocina() === 0) {
            <p class="empty">No hay órdenes pendientes de preparar.</p>
          } @else {
            <ul class="simple-list">
              @for (orden of ordenesActivas(); track orden.id) {
                <li>
                  <span>Orden #{{ orden.id }}{{ orden.pedido?.mesaNumero ? ' · Mesa ' + orden.pedido.mesaNumero : '' }}</span>
                  <span class="badge badge-info">{{ orden.estado }}</span>
                </li>
              }
            </ul>
          }
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Pedidos listos</h2>
            <a routerLink="/mesas" class="btn btn-ghost btn-sm">Ver mesas</a>
          </div>

          @if (pedidosListos().length === 0) {
            <p class="empty">No hay pedidos listos por entregar.</p>
          } @else {
            <ul class="simple-list">
              @for (pedido of pedidosListos(); track pedido.id) {
                <li>
                  <span>Pedido #{{ pedido.id }}{{ pedido.mesaNumero ? ' · Mesa ' + pedido.mesaNumero : '' }}</span>
                  <strong>{{ pedido.total | currency:'COP':'symbol':'1.0-0' }}</strong>
                </li>
              }
            </ul>
          }
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Productos bajo stock</h2>
            <a routerLink="/inventario" class="btn btn-ghost btn-sm">Ver inventario</a>
          </div>

          @if (bajoStock() === 0) {
            <p class="empty">Todo el inventario está en niveles adecuados.</p>
          } @else {
            <ul class="simple-list">
              @for (producto of productosBajoStock(); track producto.id) {
                <li>
                  <span>{{ producto.nombre }}</span>
                  <span class="badge badge-danger">Stock: {{ producto.stock }}</span>
                </li>
              }
            </ul>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly mesaService = inject(MesaService);
  private readonly pedidoService = inject(PedidoService);

  readonly totalMesas = computed(() => this.mesaService.mesas().length);
  readonly mesasOcupadas = computed(() =>
    this.mesaService.mesas().filter((m) => m.estado === 'OCUPADA').length,
  );
  readonly pedidosActivos = computed(() => this.pedidoService.pedidosActivos().length);
  readonly enCocina = computed(() => this.pedidoService.pedidosEnCocina().length);
  readonly ordenesActivas = computed(() => this.pedidoService.getOrdenesCocinaActivas());
  readonly pedidosListos = computed(() => this.pedidoService.pedidosListos());
  readonly totalProductos = computed(() => 47);
  readonly bajoStock = computed(() => 2);
  readonly totalVentas = computed(() => this.pedidoService.totalVentas());
  readonly productosBajoStock = computed(() => [] as Producto[]);
}
