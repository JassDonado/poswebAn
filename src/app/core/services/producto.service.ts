import { Injectable, signal, computed } from '@angular/core';
import { Producto, Categoria, ProductoFormValue, mapProductoFormToProducto } from '../models/producto.model';

const CATEGORIAS: Categoria[] = [
  { id: 1, nombre: 'Hamburguesas', descripcion: 'Hamburguesas artesanales y clásicas' },
  { id: 2, nombre: 'Perros Calientes', descripcion: 'Perros calientes tradicionales' },
  { id: 3, nombre: 'Pizzas', descripcion: 'Pizzas al horno' },
  { id: 4, nombre: 'Combos', descripcion: 'Combos familiares y personales' },
  { id: 5, nombre: 'Entradas', descripcion: 'Entradas y acompañamientos' },
  { id: 6, nombre: 'Ensaladas', descripcion: 'Ensaladas frescas' },
  { id: 7, nombre: 'Bebidas', descripcion: 'Gaseosas, jugos y café' },
  { id: 8, nombre: 'Postres', descripcion: 'Postres de la casa' },
];

const PRODUCTOS_SEED: Producto[] = [
  { id: 1, nombre: 'Hamburguesa Clásica', descripcion: 'Pan brioche, carne 150g, lechuga, tomate y salsa de la casa', precio: 16500, stock: 28, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 2, nombre: 'Hamburguesa Doble Queso', descripcion: 'Doble carne, doble cheddar y tocineta crocante', precio: 21000, stock: 25, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 3, nombre: 'Hamburguesa BBQ', descripcion: 'Carne a la parrilla, salsa BBQ ahumada y cebolla caramelizada', precio: 19500, stock: 21, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 4, nombre: 'Hamburguesa Hawaiana', descripcion: 'Piña asada, jamón, queso mozzarella y salsa teriyaki', precio: 19000, stock: 18, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 5, nombre: 'Hamburguesa Crispy Pollo', descripcion: 'Filete de pollo apanado, lechuga y mayonesa de chipotle', precio: 17500, stock: 20, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 6, nombre: 'Hamburguesa Ranchera', descripcion: 'Carne, chorizo, huevo, aguacate y salsa ranchera', precio: 22000, stock: 15, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 7, nombre: 'Hamburguesa Veggie', descripcion: 'Medallón de garbanzo, vegetales a la plancha y alioli', precio: 18500, stock: 12, activo: true, categoriaId: 1, categoriaNombre: 'Hamburguesas' },
  { id: 8, nombre: 'Perro Clásico', descripcion: 'Salchicha americana, papitas, cebolla y salsas', precio: 9500, stock: 34, activo: true, categoriaId: 2, categoriaNombre: 'Perros Calientes' },
  { id: 9, nombre: 'Perro Especial', descripcion: 'Salchicha, queso fundido, tocineta y papa criolla', precio: 13500, stock: 24, activo: true, categoriaId: 2, categoriaNombre: 'Perros Calientes' },
  { id: 10, nombre: 'Perro Hawaiano', descripcion: 'Piña caramelizada, tocineta, queso y salsa de la casa', precio: 14500, stock: 24, activo: true, categoriaId: 2, categoriaNombre: 'Perros Calientes' },
  { id: 11, nombre: 'Perro Ranchero', descripcion: 'Chorizo, frijol, queso fundido, huevo y aguacate', precio: 15500, stock: 20, activo: true, categoriaId: 2, categoriaNombre: 'Perros Calientes' },
  { id: 12, nombre: 'Pizza Margarita', descripcion: 'Salsa de tomate, mozzarella, albahaca y orégano', precio: 24500, stock: 16, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 13, nombre: 'Pizza Pepperoni', descripcion: 'Doble pepperoni y extra queso mozzarella', precio: 28000, stock: 14, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 14, nombre: 'Pizza Hawaiana', descripcion: 'Jamón, piña y queso mozzarella', precio: 27500, stock: 15, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 15, nombre: 'Pizza Carnes', descripcion: 'Pepperoni, jamón, tocineta, pollo y chorizo', precio: 34000, stock: 10, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 16, nombre: 'Pizza Vegetariana', descripcion: 'Pimentón, champiñones, cebolla, aceitunas y maíz', precio: 26500, stock: 13, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 17, nombre: 'Pizza Quesos', descripcion: 'Mozzarella, cheddar y parmesano', precio: 30000, stock: 11, activo: true, categoriaId: 3, categoriaNombre: 'Pizzas' },
  { id: 18, nombre: 'Combo Familiar', descripcion: '2 pizzas medianas, gaseosa 1.5L y papas a la francesa', precio: 85000, stock: 8, activo: true, categoriaId: 4, categoriaNombre: 'Combos' },
  { id: 19, nombre: 'Combo Pareja', descripcion: '2 hamburguesas clásicas, papas grandes y 2 gaseosas', precio: 48000, stock: 10, activo: true, categoriaId: 4, categoriaNombre: 'Combos' },
  { id: 20, nombre: 'Combo Infantil', descripcion: 'Mini hamburguesa, papas pequeñas y jugo', precio: 18500, stock: 12, activo: true, categoriaId: 4, categoriaNombre: 'Combos' },
  { id: 21, nombre: 'Combo Ejecutivo', descripcion: 'Hamburguesa, papas medianas, gaseosa y postre del día', precio: 32000, stock: 9, activo: true, categoriaId: 4, categoriaNombre: 'Combos' },
  { id: 22, nombre: 'Papas a la Francesa', descripcion: 'Papas crocantes con sal', precio: 9000, stock: 40, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 23, nombre: 'Patacones con Hogao', descripcion: 'Patacones con hogao casero', precio: 11500, stock: 30, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 24, nombre: 'Dedos de Queso', descripcion: '8 unidades con salsa de tomate', precio: 12000, stock: 4, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 25, nombre: 'Alitas BBQ (6 unidades)', descripcion: 'Alitas bañadas en salsa BBQ', precio: 15000, stock: 3, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 26, nombre: 'Nachos con Queso', descripcion: 'Nachos con queso fundido y jalapeños', precio: 13500, stock: 25, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 27, nombre: 'Empanadas de Carne (3 unidades)', descripcion: 'Empanadas de carne con ají', precio: 8500, stock: 30, activo: true, categoriaId: 5, categoriaNombre: 'Entradas' },
  { id: 28, nombre: 'Ensalada César', descripcion: 'Lechuga, pollo, crotones, parmesano y aderezo césar', precio: 16500, stock: 18, activo: true, categoriaId: 6, categoriaNombre: 'Ensaladas' },
  { id: 29, nombre: 'Ensalada Griega', descripcion: 'Feta, aceitunas, tomate, pepino y orégano', precio: 18000, stock: 5, activo: true, categoriaId: 6, categoriaNombre: 'Ensaladas' },
  { id: 30, nombre: 'Ensalada de la Casa', descripcion: 'Vegetales frescos, queso y aderezo de la casa', precio: 15000, stock: 20, activo: true, categoriaId: 6, categoriaNombre: 'Ensaladas' },
  { id: 31, nombre: 'Ensalada Tropical', descripcion: 'Piña, mango, plátano asado y vinagreta', precio: 17000, stock: 14, activo: true, categoriaId: 6, categoriaNombre: 'Ensaladas' },
  { id: 32, nombre: 'Gaseosa Personal', descripcion: 'Coca-Cola, Postobón o Pepsi', precio: 3500, stock: 60, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 33, nombre: 'Gaseosa 1.5 Litros', descripcion: 'Gaseosa familiar', precio: 7500, stock: 35, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 34, nombre: 'Agua sin Gas', descripcion: 'Botella 500 ml', precio: 3000, stock: 50, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 35, nombre: 'Jugo Natural', descripcion: 'Maracuyá, mango o lulo', precio: 5500, stock: 40, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 36, nombre: 'Limonada de Coco', descripcion: 'Limonada con coco', precio: 7000, stock: 30, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 37, nombre: 'Limonada Natural', descripcion: 'Limonada clásica', precio: 5000, stock: 28, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 38, nombre: 'Cerveza Nacional', descripcion: 'Cerveza fría 330 ml', precio: 6500, stock: 6, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 39, nombre: 'Café Americano', descripcion: 'Café de origen', precio: 3200, stock: 45, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 40, nombre: 'Malteada de Chocolate', descripcion: 'Malteada cremosa', precio: 8500, stock: 21, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 41, nombre: 'Té Frío', descripcion: 'Té helado de durazno', precio: 4500, stock: 0, activo: true, categoriaId: 7, categoriaNombre: 'Bebidas' },
  { id: 42, nombre: 'Brownie con Helado', descripcion: 'Brownie de chocolate con bola de helado', precio: 8000, stock: 25, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
  { id: 43, nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake con salsa de maracuyá', precio: 10500, stock: 18, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
  { id: 44, nombre: 'Tiramisú', descripcion: 'Porción de tiramisú italiano', precio: 9500, stock: 16, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
  { id: 45, nombre: 'Flan de Caramelo', descripcion: 'Flan casero con caramelo', precio: 7500, stock: 19, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
  { id: 46, nombre: 'Helado Artesanal (bola)', descripcion: 'Bola de helado artesanal', precio: 5000, stock: 30, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
  { id: 47, nombre: 'Milhojas', descripcion: 'Milhojas con arequipe', precio: 8500, stock: 13, activo: true, categoriaId: 8, categoriaNombre: 'Postres' },
];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly _productos = signal<Producto[]>(PRODUCTOS_SEED);
  private readonly _categorias = signal<Categoria[]>(CATEGORIAS);
  private readonly _nextId = signal<number>(Math.max(0, ...PRODUCTOS_SEED.map((p) => p.id)) + 1);

  readonly productos = this._productos.asReadonly();
  readonly categorias = this._categorias.asReadonly();

  readonly productosActivos = computed(() => this._productos().filter((p) => p.activo));
  readonly totalProductos = computed(() => this._productos().length);
  readonly productosBajoStock = computed(() =>
    this._productos().filter((p) => p.stock > 0 && p.stock <= 5),
  );
  readonly productosAgotados = computed(() => this._productos().filter((p) => p.stock === 0));

  getById(id: number): Producto | undefined {
    return this._productos().find((p) => p.id === id);
  }

  nombreExiste(nombre: string, excluirId?: number): boolean {
    const normalizado = nombre.trim().toLowerCase();
    return this._productos().some(
      (p) => (excluirId === undefined || p.id !== excluirId) && p.nombre.toLowerCase() === normalizado,
    );
  }

  add(value: ProductoFormValue): void {
    const id = this._nextId();
    this._nextId.update((n) => n + 1);
    this._productos.update((productos) => [...productos, mapProductoFormToProducto(value, id)]);
  }

  update(id: number, value: ProductoFormValue): void {
    this._productos.update((productos) =>
      productos.map((p) => (p.id === id ? { ...p, ...mapProductoFormToProducto(value, id) } : p)),
    );
  }

  delete(id: number): void {
    this._productos.update((productos) => productos.filter((p) => p.id !== id));
  }

  toggleActivo(id: number): void {
    this._productos.update((productos) =>
      productos.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)),
    );
  }

  actualizarStock(id: number, stock: number): void {
    this._productos.update((productos) =>
      productos.map((p) => (p.id === id ? { ...p, stock } : p)),
    );
  }
}
