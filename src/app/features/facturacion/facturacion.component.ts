import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Pedido } from '../../core/models/pedido.model';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-facturacion',
  imports: [],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Facturación</h1>
          <p class="page-subtitle">Pedidos listos y facturas generadas</p>
        </div>
        <div class="total-card">
          <span>Total facturado</span>
          <strong>{{ formatoCOP(totalVentas()) }}</strong>
        </div>
      </div>

      <section>
        <h2>Pedidos listos para facturar</h2>
        @if (pedidosListos().length === 0) {
          <p class="empty">No hay pedidos listos.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Mesa</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                @for (pedido of pedidosListos(); track pedido.id) {
                  <tr>
                    <td>#{{ pedido.id }}</td>
                    <td>{{ pedido.mesaNumero ? 'Mesa ' + pedido.mesaNumero : 'Venta directa' }}</td>
                    <td>{{ pedido.clienteNombre || 'Cliente general' }}</td>
                    <td>{{ formatoCOP(pedido.total) }}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" (click)="generarFactura(pedido)">
                        Generar factura
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section>
        <h2>Facturas generadas</h2>
        @if (pedidosFacturados().length === 0) {
          <p class="empty">Aún no hay facturas generadas.</p>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Pedido</th>
                  <th>Mesa</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (pedido of pedidosFacturados(); track pedido.id) {
                  <tr>
                    <td>FAC-{{ pedido.id }}</td>
                    <td>#{{ pedido.id }}</td>
                    <td>{{ pedido.mesaNumero ? 'Mesa ' + pedido.mesaNumero : 'Venta directa' }}</td>
                    <td>{{ pedido.clienteNombre || 'Cliente general' }}</td>
                    <td>{{ formatoCOP(pedido.total) }}</td>
                    <td><span class="badge badge-success">FACTURADO</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  `,
  styleUrls: ['./facturacion.component.css'],
})
export class FacturacionComponent {
  private readonly pedidoService = inject(PedidoService);

  protected readonly pedidosListos = this.pedidoService.pedidosListos;
  protected readonly pedidosFacturados = computed(() =>
    this.pedidoService.pedidos().filter((pedido) => pedido.estado === 'FACTURADO'),
  );
  protected readonly totalVentas = this.pedidoService.totalVentas;

  protected generarFactura(pedido: Pedido): void {
    this.pedidoService.facturarPedido(pedido.id);
  }

  protected formatoCOP(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

}
