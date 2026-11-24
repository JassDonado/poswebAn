import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarMesaUnica(exists: (value: string) => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    exists(String(control.value ?? '')) ? { mesaUnica: true } : null;
}
