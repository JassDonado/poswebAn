import { TestBed } from '@angular/core/testing';
import { PedidoService } from './pedido.service';

describe('PedidoService', () => {
  let service: PedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose ready and billed orders', () => {
    expect(service.pedidosListos().length).toBeGreaterThan(0);
    expect(service.pedidos().filter((pedido) => pedido.estado === 'FACTURADO').length).toBeGreaterThan(0);
  });

  it('should synchronize kitchen state with the pedido', () => {
    service.cambiarEstadoOrdenCocina(1, 'EN_PREPARACION');
    expect(service.getById(1)?.estado).toBe('EN_PREPARACION');

    service.cambiarEstadoOrdenCocina(1, 'LISTO');
    expect(service.getById(1)?.estado).toBe('LISTO');
  });

  it('should bill only a ready pedido', () => {
    expect(service.facturarPedido(14)).toBe(true);
    expect(service.getById(14)?.estado).toBe('FACTURADO');
    expect(service.facturarPedido(1)).toBe(false);
  });
});
