import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueMesaNumberValidator(exists: (value: string) => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    exists(String(control.value ?? '')) ? { duplicateNumber: true } : null;
}
