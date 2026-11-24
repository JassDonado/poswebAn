import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../core/models/producto.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-producto-card',
  imports: [CurrencyPipe],
  template: `
    <div class="producto-card">
      @if (producto(); as p) {
        <div class="producto-nombre">{{ p.nombre }}</div>
        <div class="producto-precio">{{ p.precio | currency:'COP':'symbol':'1.0-0' }}</div>
        <div class="producto-categoria">{{ p.categoriaNombre || 'Sin categoría' }}</div>
        <div class="producto-stock">Stock: {{ p.stock }}</div>
        <span
          class="badge"
          [class]="p.activo ? 'badge-success' : 'badge-danger'"
        >
          {{ p.activo ? 'ACTIVO' : 'INACTIVO' }}
        </span>
      } @else {
        <div class="producto-vacio">Completa el formulario para ver la vista previa</div>
      }
    </div>
  `,
  styleUrls: ['./producto-card.component.css'],
})
export class ProductoCardComponent {
  readonly producto = input<Producto | null>(null);
}
