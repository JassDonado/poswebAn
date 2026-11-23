export type MesaEstado = 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA';

export interface Mesa {
  id: number;
  numero: string;
  capacidad: number;
  estado: MesaEstado;
}

export interface MesaFormValue {
  numero: string;
  capacidad: number;
  estado: MesaEstado;
}

export function mapMesaFormToEntity(value: MesaFormValue, id: number): Mesa {
  return { id, numero: value.numero.trim(), capacidad: value.capacidad, estado: value.estado };
}
