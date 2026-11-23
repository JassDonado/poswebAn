# TAREAS COMPANERO 20% — Entrega 2 (POSWEB Angular)

Este documento describe qué quedó listo en el **80% implementado**, cómo probar los **6 casos de verificación** de la rúbrica, y qué debe completar el compañero para su **20% pendiente**.

---

## 1. Qué quedó listo (80% implementado en `poswebAn`, rama `master`)

### Arquitectura (reglas de la rúbrica respetadas)
- **100% Standalone Components** — sin `NgModule`.
- **Control Flow moderno** — exclusivamente `@if`, `@else`, `@for` (con `track` obligatorio). Sin `*ngIf` ni `*ngFor`.
- **Señales privadas en servicios** — `private _xxx = signal<...>(...)` expuestas solo con `.asReadonly()`. Los componentes no mutan señales directamente.
- **`input()` para parámetros de ruta** — `withComponentInputBinding()` en `app.config.ts`. Sin `@Input()`.
- **`inject()`** en lugar de constructores.
- **Cero fugas de memoria** — sin `.subscribe()`; se usa `toSignal()` y `takeUntilDestroyed()`.
- **Datos reales** — extraídos de `posweb.sql` del proyecto de referencia (mesas, productos, categorías, pedidos, órdenes de cocina). Sin "Lorem ipsum".

### Vistas y rutas implementadas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | redirección a `/mesas` | Inicio |
| `/mesas` | `MesaListComponent` | Dashboard de mesas con cambio de estado (disponible/ocupada/reservada) |
| `/cocina` | `CocinaComponent` | Tablero Kanban de comandas (pendiente → en preparación → listo) |
| `/inventario` | `InventarioListComponent` | Listado de inventario con búsqueda reactiva y bajo stock |
| `/inventario/nuevo` | `ProductoFormComponent` | Formulario reactivo de alta de producto |
| `/inventario/detalle/:id` | `ProductoDetalleComponent` | Detalle de producto con `input()` y "Registro no encontrado" |
| `/404` | `NotFoundComponent` | Vista 404 |
| `**` | redirección a `/404` | Cualquier ruta inexistente |

### Servicios (señales privadas + `.asReadonly()`)
- `ProductoService` — `_productos`, `_categorias`, `_nextId` privados. CRUD completo, `nombreExiste()`, productos activos/bajo stock/agotados.
- `MesaService` — `_mesas` privado. CRUD, `cambiarEstado()`, `numeroExiste()`.
- `PedidoService` — `_pedidos`, `_ordenesCocina` privados. Órdenes de cocina con cambio de estado.

### Formulario reactivo de producto (`/inventario/nuevo`)
- `NonNullableFormBuilder` tipado con `FormControl` por campo.
- Modelo de formulario (`ProductoFormValue`) separado del modelo de dominio (`Producto`) con mapper `mapProductoFormToProducto()`.
- **4 validadores integrados**: `required`, `minLength(3)`, `maxLength(50)`, `min(100)`.
- **1 validador personalizado**: `nombreProductoUnicoValidator` (nombre duplicado).
- Mensajes de error solo cuando `control.invalid && (control.touched || control.dirty)`.
- Botón deshabilitado con `[disabled]="formularioProducto.invalid"`.
- Al guardar: `productoService.add()`, `form.reset()`, navegación a `/inventario`.
- Vista previa en vivo (`ProductoCardComponent`) mientras se llena el formulario.

### Búsqueda reactiva (`/inventario`)
- `FormControl` + `valueChanges` + `debounceTime(300)` + `distinctUntilChanged()`.
- `toSignal(..., { initialValue: '' })` sin suscripciones abiertas.
- `computed()` que filtra productos por nombre o categoría.
- Mensaje claro si no hay coincidencias; al borrar el texto reaparecen todos.

### Pruebas y build
- `npx ng build` ✅ compila sin errores.
- `npx ng test --watch=false` ✅ 12 tests pasando (3 archivos spec).
- `.gitignore` ignora `node_modules`, `dist`, `.idea`, `coverage`, etc.

---

## 2. Cómo probar los 6 casos de verificación

### Caso 1 — Formulario vacío tocado → mensaje de error + botón deshabilitado
1. Ir a `/inventario/nuevo`.
2. Hacer clic en cada campo y salir sin escribir (touched).
3. Verificar que aparece el mensaje de error por control (`invalid && (touched || dirty)`).
4. Verificar que el botón "Guardar producto" está deshabilitado (`[disabled]="formularioProducto.invalid"`).

### Caso 2 — Campo numérico con `min`
1. En "Precio", escribir un valor menor a 100 (ej. 50).
2. Verificar error `min`: "El precio mínimo es 100 COP."
3. Corregir a un valor ≥ 100.
4. Verificar que el error desaparece.
5. Lo mismo para "Stock" con valor negativo (mínimo 0).

### Caso 3 — Validador personalizado (nombre duplicado)
1. En "Nombre", escribir "Hamburguesa Clásica" (ya existe).
2. Verificar mensaje: "Ese nombre de producto ya está registrado."
3. Cambiar a un nombre único.
4. Verificar que el error desaparece.

### Caso 4 — Envío válido → agrega al listado + reset del formulario
1. Llenar el formulario con datos válidos.
2. Hacer clic en "Guardar producto".
3. Verificar que el producto aparece en `/inventario` sin recargar la página.
4. Verificar que el formulario se reinició (`form.reset()`).

### Caso 5 — Búsqueda con debounce 300 ms
1. Ir a `/inventario`.
2. Escribir 3 caracteres rápidamente en el buscador.
3. Verificar que el filtrado se ejecuta una sola vez, 300 ms después de la última tecla.
4. Borrar el texto y verificar que reaparecen todos los productos.

### Caso 6 — Ruta de detalle con ID inexistente y ruta 404
1. Navegar a `/inventario/detalle/99999`.
2. Verificar mensaje: "Registro no encontrado / El producto solicitado no existe."
3. Navegar a `/ruta-inexistente`.
4. Verificar la vista 404: "Página no encontrada."

---

## 3. Qué debe completar el compañero (20% pendiente)

### A. Vista de Facturación / Reportes (`/facturacion` o `/reportes`)
Crear un componente independiente (standalone) con:
- Listado de facturas/pedidos facturados.
- Totales de ventas por día.
- Botón para generar factura desde un pedido listo.
- Ruta: `/facturacion` o `/reportes` (a elegir por el compañero).
- Agregar la ruta en `src/app/app.routes.ts` con `loadComponent`.

### B. Actualización final del `README.md`
El `README.md` ya tiene una versión básica. El compañero debe:
1. Agregar la tabla de rutas completa (incluyendo `/facturacion` o `/reportes`).
2. Agregar la justificación técnica de por qué se usó `ReactiveFormsModule` en lugar de `FormsModule` (tipado estricto, validadores escalables, separación modelo de formulario/dominio, facilidad de pruebas).
3. Documentar la arquitectura moderna (standalone, señales privadas `.asReadonly()`, `loadComponent`, parámetros vía `input()`).
4. Incluir comandos de ejecución: `npm install`, `npx ng serve`, `npx ng build`, `npx ng test --watch=false`.

### Archivos exactos a tocar por el compañero

| Archivo | Qué hacer |
|---------|-----------|
| `src/app/app.routes.ts` | Agregar ruta `/facturacion` o `/reportes` con `loadComponent` |
| `src/app/features/` | Crear carpeta `facturacion/` o `reportes/` con el componente standalone |
| `README.md` | Actualizar con tabla de rutas y justificación técnica |

---

## 4. Comandos git del compañero

Desde la carpeta `poswebAn`, en la rama `master`:

```bash
# Verificar que el remoto apunta únicamente a poswebAn.git
git remote -v

# Agregar los archivos del 20%
git add <archivos-modificados>
git commit -m "feat: add facturacion/reportes view (20%)"
git add README.md
git commit -m "docs: finalize README for entrega 2"

# Subir a master (revisar antes de ejecutar)
git push origin master
```

> **Nota:** No hacer `git push` hasta revisar los cambios localmente con `npx ng build` y `npx ng test --watch=false`.

---

## 5. Comandos de ejecución del proyecto

```bash
npm install
npx ng serve          # http://localhost:4200/
npx ng build
npx ng test --watch=false
```
