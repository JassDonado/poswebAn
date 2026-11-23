import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="card narrow">
      @if (producto(); as producto) {
        <p class="eyebrow">Detalle del producto</p>
        <h1>{{ producto.nombre }}</h1>
        <dl>
          <dt>Categoría</dt><dd>{{ producto.categoriaNombre || 'Sin categoría' }}</dd>
          <dt>Precio</dt><dd>{{ producto.precio | currency:'COP':'symbol':'1.0-0' }}</dd>
          <dt>Stock</dt><dd>{{ producto.stock }} unidades</dd>
          <dt>Estado</dt><dd>
            <span class="badge" [class]="producto.activo ? 'badge-success' : 'badge-danger'">
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </dd>
        </dl>
        <p class="descripcion">{{ producto.descripcion }}</p>
      } @else {
        <h1>Registro no encontrado</h1>
        <p>El producto solicitado no existe.</p>
      }
      <a routerLink="/inventario">Volver al inventario</a>
    </section>
  `,
  styleUrls: ['./producto-detalle.component.css'],
})
export class ProductoDetalleComponent {
  readonly id = input<string>();
  private readonly productoService = inject(ProductoService);

  readonly producto = computed(() => {
    const parsedId = Number(this.id());
    return Number.isInteger(parsedId)
      ? this.productoService.getById(parsedId)
      : undefined;
  });
}
