export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'FACTURADO' | 'CANCELADO';

export type EstadoOrdenCocina = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'CANCELADO';

export interface DetallePedido {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  productoId: number;
  productoNombre?: string;
}

export interface Pedido {
  id: number;
  estado: EstadoPedido;
  nota: string | null;
  total: number;
  clienteId: number | null;
  mesaId: number | null;
  usuarioId: number;
  detalles: DetallePedido[];
  clienteNombre?: string;
  mesaNumero?: string;
}

export interface OrdenCocina {
  id: number;
  estado: EstadoOrdenCocina;
  pedidoId: number;
  pedido?: Pedido;
}
