import { TestBed } from '@angular/core/testing';
import { ProductoService } from './producto.service';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose productos as readonly signal', () => {
    const productos = service.productos();
    expect(Array.isArray(productos)).toBe(true);
    expect(productos.length).toBeGreaterThan(0);
  });

  it('should return true for duplicate product name', () => {
    expect(service.nombreExiste('Hamburguesa Clásica')).toBe(true);
    expect(service.nombreExiste('Producto Inexistente XYZ')).toBe(false);
  });

  it('should add a new product via signal', () => {
    const before = service.productos().length;
    service.add({
      nombre: 'Producto Test Unitario',
      descripcion: 'Descripción de prueba',
      precio: 5000,
      stock: 10,
      categoriaId: 1,
      activo: true,
    });
    expect(service.productos().length).toBe(before + 1);
    expect(service.getById(service.productos().at(-1)!.id)?.nombre).toBe('Producto Test Unitario');
  });

  it('should expose active products computed', () => {
    const activos = service.productosActivos();
    expect(activos.every((p) => p.activo)).toBe(true);
  });
});
