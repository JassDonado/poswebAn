import { Injectable, signal } from '@angular/core';
import { Mesa, MesaEstado, MesaFormValue, mapMesaFormToEntity } from '../models/mesa.model';

const MESAS_SEED: Mesa[] = [
  { id: 1, numero: '1', capacidad: 2, estado: 'DISPONIBLE' },
  { id: 2, numero: '2', capacidad: 2, estado: 'DISPONIBLE' },
  { id: 3, numero: '3', capacidad: 2, estado: 'DISPONIBLE' },
  { id: 4, numero: '4', capacidad: 2, estado: 'DISPONIBLE' },
  { id: 5, numero: '5', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 6, numero: '6', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 7, numero: '7', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 8, numero: '8', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 9, numero: '9', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 10, numero: '10', capacidad: 4, estado: 'DISPONIBLE' },
  { id: 11, numero: '11', capacidad: 6, estado: 'DISPONIBLE' },
  { id: 12, numero: '12', capacidad: 8, estado: 'DISPONIBLE' },
];

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly _mesas = signal<Mesa[]>(MESAS_SEED);

  readonly mesas = this._mesas.asReadonly();

  getById(id: number): Mesa | undefined {
    return this._mesas().find((mesa) => mesa.id === id);
  }

  numeroExiste(numero: string, excluirId?: number): boolean {
    const normalized = numero.trim().toLowerCase();
    return this._mesas().some(
      (mesa) => (excluirId === undefined || mesa.id !== excluirId) && mesa.numero.toLowerCase() === normalized,
    );
  }

  add(value: MesaFormValue): void {
    const nextId = Math.max(0, ...this._mesas().map((mesa) => mesa.id)) + 1;
    this._mesas.update((mesas) => [...mesas, mapMesaFormToEntity(value, nextId)]);
  }

  update(id: number, value: MesaFormValue): void {
    this._mesas.update((mesas) =>
      mesas.map((m) => (m.id === id ? { ...m, ...mapMesaFormToEntity(value, id) } : m)),
    );
  }

  delete(id: number): void {
    this._mesas.update((mesas) => mesas.filter((m) => m.id !== id));
  }

  cambiarEstado(id: number, estado: MesaEstado): void {
    this._mesas.update((mesas) =>
      mesas.map((m) => (m.id === id ? { ...m, estado } : m)),
    );
  }
}
