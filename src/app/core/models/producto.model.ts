export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: boolean;
  categoriaId: number | null;
  categoriaNombre?: string;
}

export interface ProductoFormValue {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number | null;
  activo: boolean;
}

export function mapProductoFormToProducto(value: ProductoFormValue, id: number): Producto {
  return {
    id,
    nombre: value.nombre.trim(),
    descripcion: value.descripcion.trim(),
    precio: value.precio,
    stock: value.stock,
    activo: value.activo,
    categoriaId: value.categoriaId,
  };
}

export interface ProductoCardPreview {
  nombre: string;
  precio: number;
  categoriaNombre?: string;
  stock: number;
  activo: boolean;
}
