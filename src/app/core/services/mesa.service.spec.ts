import { TestBed } from '@angular/core/testing';
import { MesaService } from './mesa.service';

describe('MesaService', () => {
  let service: MesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose mesas as readonly signal', () => {
    const mesas = service.mesas();
    expect(Array.isArray(mesas)).toBe(true);
    expect(mesas.length).toBe(12);
  });

  it('should find mesa by id', () => {
    const mesa = service.getById(1);
    expect(mesa?.numero).toBe('1');
    expect(service.getById(99999)).toBeUndefined();
  });

  it('should change mesa state via signal', () => {
    service.cambiarEstado(1, 'OCUPADA');
    expect(service.getById(1)?.estado).toBe('OCUPADA');

    service.cambiarEstado(1, 'DISPONIBLE');
    expect(service.getById(1)?.estado).toBe('DISPONIBLE');
  });

  it('should return true for duplicate mesa number', () => {
    expect(service.numeroExiste('1')).toBe(true);
    expect(service.numeroExiste('999')).toBe(false);
  });
});
