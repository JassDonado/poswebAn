import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MesaEstado } from '../../core/models/mesa.model';
import { MesaService } from '../../core/services/mesa.service';
import { uniqueMesaNumberValidator } from '../../shared/validators/unique-mesa-number.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="card narrow">
      <p class="eyebrow">Alta</p>
      <h1>Registrar mesa</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label for="numero">Número de mesa</label>
        <input id="numero" formControlName="numero" placeholder="M-04" />
        @if (form.controls.numero.invalid && (form.controls.numero.touched || form.controls.numero.dirty)) {
          @if (form.controls.numero.hasError('required')) { <small>El número es obligatorio.</small> }
          @if (form.controls.numero.hasError('minlength')) { <small>Usa al menos 3 caracteres.</small> }
          @if (form.controls.numero.hasError('maxlength')) { <small>Usa máximo 10 caracteres.</small> }
          @if (form.controls.numero.hasError('pattern')) { <small>Usa el formato M-01.</small> }
          @if (form.controls.numero.hasError('duplicateNumber')) { <small>Ese número ya está registrado.</small> }
        }

        <label for="capacidad">Capacidad</label>
        <input id="capacidad" type="number" formControlName="capacidad" />
        @if (form.controls.capacidad.invalid && (form.controls.capacidad.touched || form.controls.capacidad.dirty)) {
          @if (form.controls.capacidad.hasError('required')) { <small>La capacidad es obligatoria.</small> }
          @if (form.controls.capacidad.hasError('min')) { <small>La capacidad mínima es 1.</small> }
        }

        <label for="estado">Estado</label>
        <select id="estado" formControlName="estado">
          @for (estado of estados; track estado) { <option [value]="estado">{{ estado }}</option> }
        </select>

        <div class="actions">
          <button class="button primary" type="submit" [disabled]="form.invalid">Guardar mesa</button>
          <a routerLink="/mesas">Cancelar</a>
        </div>
      </form>
    </section>
  `,
})
export class MesaFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly mesaService = inject(MesaService);
  private readonly router = inject(Router);
  readonly estados: MesaEstado[] = ['DISPONIBLE', 'OCUPADA', 'RESERVADA'];
  readonly form = this.fb.group({
    numero: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^M-\d{2}$/),
        uniqueMesaNumberValidator((numero) => this.mesaService.numeroExiste(numero)),
      ],
    }),
    capacidad: this.fb.control(4, [Validators.required, Validators.min(1)]),
    estado: this.fb.control<MesaEstado>('DISPONIBLE', Validators.required),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.mesaService.add(this.form.getRawValue());
    this.form.reset({ numero: '', capacidad: 4, estado: 'DISPONIBLE' });
    void this.router.navigate(['/mesas']);
  }
}
