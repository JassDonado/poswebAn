import { Injectable, signal } from '@angular/core';
import { Mesa, MesaFormValue, mapMesaFormToEntity } from '../models/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly _mesas = signal<Mesa[]>([
    { id: 1, numero: 'M-01', capacidad: 4, estado: 'DISPONIBLE' },
    { id: 2, numero: 'M-02', capacidad: 2, estado: 'OCUPADA' },
    { id: 3, numero: 'M-03', capacidad: 6, estado: 'RESERVADA' },
  ]);

  readonly mesas = this._mesas.asReadonly();

  getById(id: number): Mesa | undefined {
    return this._mesas().find((mesa) => mesa.id === id);
  }

  numeroExiste(numero: string): boolean {
    const normalized = numero.trim().toLowerCase();
    return this._mesas().some((mesa) => mesa.numero.toLowerCase() === normalized);
  }

  add(value: MesaFormValue): void {
    const nextId = Math.max(0, ...this._mesas().map((mesa) => mesa.id)) + 1;
    this._mesas.update((mesas) => [...mesas, mapMesaFormToEntity(value, nextId)]);
  }
}
