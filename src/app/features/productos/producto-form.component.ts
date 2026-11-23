import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Producto, ProductoFormValue, mapProductoFormToProducto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';
import { ProductoCardComponent } from './producto-card.component';
import { nombreProductoUnicoValidator } from '../../shared/validators/nombre-producto-unico.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ProductoCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Nuevo producto</h1>
        <p class="page-subtitle">Registro de producto en el catálogo</p>
        <a routerLink="/inventario" class="btn btn-ghost">Volver al inventario</a>
      </div>

      <div class="form-container">
        <div class="form-card">
          <h2>Formulario de producto</h2>
          <form [formGroup]="formularioProducto" (ngSubmit)="guardar()">

            <div class="form-field">
              <label for="nombre">Nombre</label>
              <input id="nombre" type="text" formControlName="nombre" placeholder="Ej. Hamburguesa Clásica" />
              @if (formularioProducto.get('nombre')!.invalid && (formularioProducto.get('nombre')!.touched || formularioProducto.get('nombre')!.dirty)) {
                <div class="error-texto">
                  @if (formularioProducto.get('nombre')!.hasError('required')) {
                    <span>El nombre es obligatorio.</span>
                  }
                  @if (formularioProducto.get('nombre')!.hasError('minlength')) {
                    <span>Usa al menos 3 caracteres.</span>
                  }
                  @if (formularioProducto.get('nombre')!.hasError('maxlength')) {
                    <span>Usa máximo 50 caracteres.</span>
                  }
                  @if (formularioProducto.get('nombre')!.hasError('nombreProductoUnico')) {
                    <span>Ese nombre de producto ya está registrado.</span>
                  }
                </div>
              }
            </div>

            <div class="form-field">
              <label for="descripcion">Descripción</label>
              <textarea id="descripcion" formControlName="descripcion" rows="3" placeholder="Descripción del producto"></textarea>
            </div>

            <div class="form-field">
              <label for="precio">Precio (COP)</label>
              <input id="precio" type="number" formControlName="precio" min="100" step="100" placeholder="0" />
              @if (formularioProducto.get('precio')!.invalid && (formularioProducto.get('precio')!.touched || formularioProducto.get('precio')!.dirty)) {
                <div class="error-texto">
                  @if (formularioProducto.get('precio')!.hasError('required')) {
                    <span>El precio es obligatorio.</span>
                  }
                  @if (formularioProducto.get('precio')!.hasError('min')) {
                    <span>El precio mínimo es 100 COP.</span>
                  }
                </div>
              }
            </div>

            <div class="form-field">
              <label for="stock">Stock inicial</label>
              <input id="stock" type="number" formControlName="stock" min="0" placeholder="0" />
              @if (formularioProducto.get('stock')!.invalid && (formularioProducto.get('stock')!.touched || formularioProducto.get('stock')!.dirty)) {
                <div class="error-texto">
                  @if (formularioProducto.get('stock')!.hasError('required')) {
                    <span>El stock es obligatorio.</span>
                  }
                  @if (formularioProducto.get('stock')!.hasError('min')) {
                    <span>El stock no puede ser negativo.</span>
                  }
                </div>
              }
            </div>

            <div class="form-field">
              <label for="categoriaId">Categoría</label>
              <select id="categoriaId" formControlName="categoriaId">
                <option value="">Sin categoría</option>
                @for (categoria of categorias(); track categoria.id) {
                  <option [value]="categoria.id">{{ categoria.nombre }}</option>
                }
              </select>
            </div>

            <div class="form-field form-field-full">
              <label>
                <input type="checkbox" formControlName="activo" />
                Producto activo
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="formularioProducto.invalid">
                Guardar producto
              </button>
              <button type="button" class="btn btn-ghost" (click)="resetear()">Cancelar</button>
            </div>

          </form>
        </div>

        <div class="vista-previa-card">
          <h2>Vista previa</h2>
          <app-producto-card [producto]="vistaPrevia()" />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly router = inject(Router);

  readonly categorias = computed(() => this.productoService.categorias());

  readonly formularioProducto = this.fb.group({
    nombre: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        nombreProductoUnicoValidator(this.productoService),
      ],
    }),
    descripcion: this.fb.control(''),
    precio: this.fb.control(0, {
      validators: [Validators.required, Validators.min(100)],
    }),
    stock: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
    categoriaId: this.fb.control<number | null>(null),
    activo: this.fb.control(true),
  });

  readonly vistaPrevia = computed((): Producto | null => {
    if (!this.formularioProducto.valid) {
      return null;
    }
    const value = this.formularioProducto.getRawValue();
    const categoria = this.categorias().find((c) => c.id === value.categoriaId);
    return {
      id: 0,
      nombre: value.nombre,
      descripcion: value.descripcion,
      precio: value.precio,
      stock: value.stock,
      activo: value.activo,
      categoriaId: value.categoriaId,
      categoriaNombre: categoria?.nombre,
    };
  });

  protected guardar(): void {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const value = this.formularioProducto.getRawValue() as ProductoFormValue;
    this.productoService.add(value);
    this.formularioProducto.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: null,
      activo: true,
    });
    void this.router.navigate(['/inventario']);
  }

  protected resetear(): void {
    this.formularioProducto.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: null,
      activo: true,
    });
    this.formularioProducto.markAsPristine();
    this.formularioProducto.markAsUntouched();
  }
}
