import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';

export function nombreProductoUnicoValidator(
  productoService: ProductoService,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nombre = String(control.value ?? '').trim();
    if (!nombre) {
      return null;
    }
    return productoService.nombreExiste(nombre)
      ? { nombreProductoUnico: true }
      : null;
  };
}
