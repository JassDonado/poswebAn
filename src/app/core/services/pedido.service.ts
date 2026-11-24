import { Injectable, signal, computed } from '@angular/core';
import {
  Pedido,
  EstadoPedido,
  OrdenCocina,
  EstadoOrdenCocina,
  DetallePedido,
} from '../models/pedido.model';

const DETALLES_SEED: Record<number, DetallePedido[]> = {
  1: [
    { id: 1, cantidad: 2, precioUnitario: 16500, subtotal: 33000, productoId: 1, productoNombre: 'Hamburguesa Clásica' },
    { id: 2, cantidad: 1, precioUnitario: 9000, subtotal: 9000, productoId: 22, productoNombre: 'Papas a la Francesa' },
    { id: 3, cantidad: 2, precioUnitario: 3500, subtotal: 7000, productoId: 32, productoNombre: 'Gaseosa Personal' },
  ],
  2: [
    { id: 4, cantidad: 1, precioUnitario: 13500, subtotal: 13500, productoId: 9, productoNombre: 'Perro Especial' },
    { id: 5, cantidad: 1, precioUnitario: 5000, subtotal: 5000, productoId: 37, productoNombre: 'Limonada Natural' },
  ],
  3: [
    { id: 6, cantidad: 1, precioUnitario: 28000, subtotal: 28000, productoId: 13, productoNombre: 'Pizza Pepperoni' },
    { id: 7, cantidad: 2, precioUnitario: 6500, subtotal: 13000, productoId: 38, productoNombre: 'Cerveza Nacional' },
  ],
  4: [
    { id: 8, cantidad: 1, precioUnitario: 48000, subtotal: 48000, productoId: 19, productoNombre: 'Combo Pareja' },
    { id: 9, cantidad: 2, precioUnitario: 8000, subtotal: 16000, productoId: 42, productoNombre: 'Brownie con Helado' },
  ],
  5: [
    { id: 10, cantidad: 1, precioUnitario: 19500, subtotal: 19500, productoId: 3, productoNombre: 'Hamburguesa BBQ' },
    { id: 11, cantidad: 1, precioUnitario: 9000, subtotal: 9000, productoId: 22, productoNombre: 'Papas a la Francesa' },
    { id: 12, cantidad: 1, precioUnitario: 7000, subtotal: 7000, productoId: 36, productoNombre: 'Limonada de Coco' },
  ],
  6: [
    { id: 13, cantidad: 1, precioUnitario: 16500, subtotal: 16500, productoId: 28, productoNombre: 'Ensalada César' },
    { id: 14, cantidad: 1, precioUnitario: 3000, subtotal: 3000, productoId: 34, productoNombre: 'Agua sin Gas' },
  ],
  7: [
    { id: 15, cantidad: 2, precioUnitario: 22000, subtotal: 44000, productoId: 6, productoNombre: 'Hamburguesa Ranchera' },
    { id: 16, cantidad: 1, precioUnitario: 8500, subtotal: 8500, productoId: 40, productoNombre: 'Malteada de Chocolate' },
    { id: 17, cantidad: 1, precioUnitario: 4500, subtotal: 4500, productoId: 41, productoNombre: 'Té Frío' },
  ],
  8: [
    { id: 18, cantidad: 1, precioUnitario: 34000, subtotal: 34000, productoId: 15, productoNombre: 'Pizza Carnes' },
    { id: 19, cantidad: 1, precioUnitario: 15000, subtotal: 15000, productoId: 25, productoNombre: 'Alitas BBQ (6 unidades)' },
    { id: 20, cantidad: 1, precioUnitario: 7500, subtotal: 7500, productoId: 33, productoNombre: 'Gaseosa 1.5 Litros' },
  ],
  9: [
    { id: 21, cantidad: 1, precioUnitario: 85000, subtotal: 85000, productoId: 18, productoNombre: 'Combo Familiar' },
    { id: 22, cantidad: 1, precioUnitario: 10500, subtotal: 10500, productoId: 43, productoNombre: 'Cheesecake de Maracuyá' },
  ],
  10: [
    { id: 23, cantidad: 1, precioUnitario: 14500, subtotal: 14500, productoId: 10, productoNombre: 'Perro Hawaiano' },
    { id: 24, cantidad: 1, precioUnitario: 12000, subtotal: 12000, productoId: 24, productoNombre: 'Dedos de Queso' },
    { id: 25, cantidad: 1, precioUnitario: 5500, subtotal: 5500, productoId: 35, productoNombre: 'Jugo Natural' },
  ],
  12: [
    { id: 27, cantidad: 2, precioUnitario: 34000, subtotal: 68000, productoId: 15, productoNombre: 'Pizza Carnes' },
    { id: 28, cantidad: 1, precioUnitario: 7500, subtotal: 7500, productoId: 45, productoNombre: 'Flan de Caramelo' },
  ],
  13: [
    { id: 29, cantidad: 1, precioUnitario: 19500, subtotal: 19500, productoId: 3, productoNombre: 'Hamburguesa BBQ' },
    { id: 30, cantidad: 2, precioUnitario: 8500, subtotal: 17000, productoId: 47, productoNombre: 'Milhojas' },
  ],
  14: [
    { id: 31, cantidad: 1, precioUnitario: 16500, subtotal: 16500, productoId: 1, productoNombre: 'Hamburguesa Clásica' },
  ],
  15: [
    { id: 32, cantidad: 1, precioUnitario: 16500, subtotal: 16500, productoId: 1, productoNombre: 'Hamburguesa Clásica' },
  ],
  16: [
    { id: 33, cantidad: 4, precioUnitario: 5000, subtotal: 20000, productoId: 37, productoNombre: 'Limonada Natural' },
    { id: 34, cantidad: 4, precioUnitario: 13500, subtotal: 54000, productoId: 9, productoNombre: 'Perro Especial' },
  ],
  17: [
    { id: 35, cantidad: 1, precioUnitario: 16500, subtotal: 16500, productoId: 1, productoNombre: 'Hamburguesa Clásica' },
    { id: 36, cantidad: 1, precioUnitario: 9500, subtotal: 9500, productoId: 8, productoNombre: 'Perro Clásico' },
    { id: 37, cantidad: 1, precioUnitario: 8500, subtotal: 8500, productoId: 40, productoNombre: 'Malteada de Chocolate' },
  ],
};

const PEDIDOS_SEED: Pedido[] = [
  { id: 1, estado: 'FACTURADO', nota: 'Sin cebolla en las hamburguesas', total: 49000, clienteId: 1, mesaId: 1, usuarioId: 3, detalles: DETALLES_SEED[1], clienteNombre: 'Ana María López', mesaNumero: '1' },
  { id: 2, estado: 'FACTURADO', nota: 'Ketchup extra', total: 18500, clienteId: null, mesaId: 2, usuarioId: 2, detalles: DETALLES_SEED[2], mesaNumero: '2' },
  { id: 3, estado: 'FACTURADO', nota: null, total: 41000, clienteId: 2, mesaId: 3, usuarioId: 3, detalles: DETALLES_SEED[3], clienteNombre: 'Pedro Pérez', mesaNumero: '3' },
  { id: 4, estado: 'FACTURADO', nota: 'Mesa junto a la ventana', total: 64000, clienteId: 3, mesaId: 4, usuarioId: 2, detalles: DETALLES_SEED[4], clienteNombre: 'Carolina Gutiérrez', mesaNumero: '4' },
  { id: 5, estado: 'FACTURADO', nota: 'Sin mayonesa', total: 35500, clienteId: null, mesaId: 5, usuarioId: 3, detalles: DETALLES_SEED[5], mesaNumero: '5' },
  { id: 6, estado: 'CANCELADO', nota: null, total: 19500, clienteId: 5, mesaId: 6, usuarioId: 2, detalles: DETALLES_SEED[6], clienteNombre: 'Luisa Fernández', mesaNumero: '6' },
  { id: 7, estado: 'FACTURADO', nota: 'Bien cocinada', total: 57000, clienteId: 4, mesaId: 7, usuarioId: 3, detalles: DETALLES_SEED[7], clienteNombre: 'Jorge Ramírez', mesaNumero: '7' },
  { id: 8, estado: 'FACTURADO', nota: null, total: 56500, clienteId: 6, mesaId: 8, usuarioId: 2, detalles: DETALLES_SEED[8], clienteNombre: 'Andrés Torres', mesaNumero: '8' },
  { id: 9, estado: 'FACTURADO', nota: 'Cumpleaños: decorar el postre', total: 95500, clienteId: 7, mesaId: 9, usuarioId: 3, detalles: DETALLES_SEED[9], clienteNombre: 'María Rodríguez', mesaNumero: '9' },
  { id: 10, estado: 'FACTURADO', nota: null, total: 32000, clienteId: 2, mesaId: 10, usuarioId: 2, detalles: DETALLES_SEED[10], clienteNombre: 'Pedro Pérez', mesaNumero: '10' },
  { id: 12, estado: 'FACTURADO', nota: null, total: 75500, clienteId: null, mesaId: 1, usuarioId: 1, detalles: DETALLES_SEED[12], mesaNumero: '1' },
  { id: 13, estado: 'FACTURADO', nota: 'hamburguesa sin lechuga', total: 36500, clienteId: 7, mesaId: 1, usuarioId: 2, detalles: DETALLES_SEED[13], clienteNombre: 'María Rodríguez', mesaNumero: '1' },
  { id: 14, estado: 'FACTURADO', nota: null, total: 16500, clienteId: null, mesaId: null, usuarioId: 2, detalles: DETALLES_SEED[14] },
  { id: 15, estado: 'FACTURADO', nota: null, total: 16500, clienteId: null, mesaId: 6, usuarioId: 3, detalles: DETALLES_SEED[15], mesaNumero: '6' },
  { id: 16, estado: 'FACTURADO', nota: null, total: 74000, clienteId: 1, mesaId: 12, usuarioId: 1, detalles: DETALLES_SEED[16], clienteNombre: 'Ana María López', mesaNumero: '12' },
  { id: 17, estado: 'FACTURADO', nota: null, total: 34500, clienteId: 8, mesaId: 2, usuarioId: 2, detalles: DETALLES_SEED[17], clienteNombre: 'Mateo Chamorro', mesaNumero: '2' },
];

const ORDENES_COCINA_SEED: OrdenCocina[] = [
  { id: 1, estado: 'LISTO', pedidoId: 1, pedido: PEDIDOS_SEED.find((p) => p.id === 1) },
  { id: 2, estado: 'LISTO', pedidoId: 2, pedido: PEDIDOS_SEED.find((p) => p.id === 2) },
  { id: 3, estado: 'LISTO', pedidoId: 3, pedido: PEDIDOS_SEED.find((p) => p.id === 3) },
  { id: 4, estado: 'LISTO', pedidoId: 4, pedido: PEDIDOS_SEED.find((p) => p.id === 4) },
  { id: 5, estado: 'LISTO', pedidoId: 5, pedido: PEDIDOS_SEED.find((p) => p.id === 5) },
  { id: 6, estado: 'LISTO', pedidoId: 7, pedido: PEDIDOS_SEED.find((p) => p.id === 7) },
  { id: 7, estado: 'LISTO', pedidoId: 8, pedido: PEDIDOS_SEED.find((p) => p.id === 8) },
  { id: 8, estado: 'LISTO', pedidoId: 9, pedido: PEDIDOS_SEED.find((p) => p.id === 9) },
  { id: 9, estado: 'LISTO', pedidoId: 10, pedido: PEDIDOS_SEED.find((p) => p.id === 10) },
  { id: 12, estado: 'LISTO', pedidoId: 12, pedido: PEDIDOS_SEED.find((p) => p.id === 12) },
  { id: 13, estado: 'LISTO', pedidoId: 13, pedido: PEDIDOS_SEED.find((p) => p.id === 13) },
  { id: 14, estado: 'LISTO', pedidoId: 14, pedido: PEDIDOS_SEED.find((p) => p.id === 14) },
  { id: 15, estado: 'LISTO', pedidoId: 15, pedido: PEDIDOS_SEED.find((p) => p.id === 15) },
  { id: 16, estado: 'LISTO', pedidoId: 16, pedido: PEDIDOS_SEED.find((p) => p.id === 16) },
  { id: 17, estado: 'LISTO', pedidoId: 17, pedido: PEDIDOS_SEED.find((p) => p.id === 17) },
];

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly _pedidos = signal<Pedido[]>(PEDIDOS_SEED);
  private readonly _ordenesCocina = signal<OrdenCocina[]>(ORDENES_COCINA_SEED);

  readonly pedidos = this._pedidos.asReadonly();
  readonly ordenesCocina = this._ordenesCocina.asReadonly();

  readonly pedidosActivos = computed(() =>
    this._pedidos().filter((p) => p.estado !== 'CANCELADO' && p.estado !== 'FACTURADO'),
  );
  readonly pedidosEnCocina = computed(() =>
    this._pedidos().filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION'),
  );
  readonly pedidosListos = computed(() => this._pedidos().filter((p) => p.estado === 'LISTO'));
  readonly totalVentas = computed(() =>
    this._pedidos().filter((p) => p.estado === 'FACTURADO').reduce((sum, p) => sum + p.total, 0),
  );

  getOrdenesCocinaActivas(): OrdenCocina[] {
    return this._ordenesCocina().filter((o) => o.estado !== 'CANCELADO');
  }

  getById(id: number): Pedido | undefined {
    return this._pedidos().find((p) => p.id === id);
  }

  cambiarEstadoOrdenCocina(id: number, estado: EstadoOrdenCocina): void {
    this._ordenesCocina.update((ordenes) =>
      ordenes.map((o) => (o.id === id ? { ...o, estado } : o)),
    );
  }

  cancelarOrdenCocina(id: number): void {
    this._ordenesCocina.update((ordenes) =>
      ordenes.map((o) => (o.id === id ? { ...o, estado: 'CANCELADO' } : o)),
    );
  }
}
