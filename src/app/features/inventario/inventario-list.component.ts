import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Inventario</h1>
        <p class="page-subtitle">Control de existencias</p>
      </div>

      <div class="search-bar">
        <label class="buscar-label" for="buscar">Buscar producto</label>
        <input id="buscar" type="text" [formControl]="busqueda" placeholder="Nombre o categoría…" />
      </div>

      <h2 class="section-title">⚠️ Bajo stock</h2>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Mínimo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (item of productosBajoStockFiltrados(); track item.id) {
              <tr>
                <td>{{ item.nombre }}</td>
                <td>{{ item.stock }}</td>
                <td>5</td>
                <td>
                  <span class="badge badge-danger">BAJO STOCK</span>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="empty">Sin productos bajo stock.</td></tr>
            }
          </tbody>
        </table>
      </div>

      <h2 class="section-title">Inventario general</h2>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (item of productosFiltrados(); track item.id) {
              <tr>
                <td>{{ item.nombre }}</td>
                <td>{{ item.categoriaNombre || '—' }}</td>
                <td>{{ item.stock }}</td>
                <td>
                  <span
                    class="badge"
                    [class]="estadoClase(item.stock)"
                  >
                    {{ estadoTexto(item.stock) }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="empty">No hay productos que coincidan.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./inventario-list.component.css'],
})
export class InventarioListComponent {
  private readonly productoService = inject(ProductoService);
  readonly busqueda = new FormControl('', { nonNullable: true });

  private readonly terminoBusqueda = toSignal(
    this.busqueda.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  readonly todosLosProductos = computed(() => this.productoService.productos());

  private readonly termino = computed(() => this.terminoBusqueda()?.trim().toLowerCase() ?? '');

  readonly productosFiltrados = computed(() => {
    const t = this.termino();
    return this.todosLosProductos().filter((p) =>
      p.nombre.toLowerCase().includes(t) || (p.categoriaNombre?.toLowerCase().includes(t) ?? false),
    );
  });

  readonly productosBajoStockFiltrados = computed(() => {
    const t = this.termino();
    return this.productoService.productosBajoStock().filter((p) =>
      p.nombre.toLowerCase().includes(t) || (p.categoriaNombre?.toLowerCase().includes(t) ?? false),
    );
  });

  protected estadoClase(stock: number): string {
    if (stock === 0) return 'badge-danger';
    if (stock <= 5) return 'badge-warning';
    return 'badge-success';
  }

  protected estadoTexto(stock: number): string {
    if (stock === 0) return 'AGOTADO';
    if (stock <= 5) return 'BAJO STOCK';
    return 'OK';
  }
}
