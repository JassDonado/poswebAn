# TAREAS COMPANERO 20% — Entrega 2 (COM30)

Este documento describe qué quedó listo en el **80% implementado** y qué falta para el **20% pendiente**, basado en una auditoría completa del código actual de `poswebAn`.

---

## 1. AUDITORÍA COMPLETA — Estado actual vs. requerimientos de la rúbrica

### R1 — README.md

| Criterio | Estado | Observación |
|----------|--------|-------------|
| Tabla de rutas (`Ruta`, `Vista / Componente`, `Parámetro`) | ⚠️ PARCIAL | Tiene tabla, pero con las **rutas antiguas** (`/mesas`, `/mesas/nueva`, `/mesas/detalle/:id`). Las rutas actuales son diferentes. Falta actualizar. |
| Justificación técnica Reactivo vs. Plantillas | ✅ SÍ | Líneas 77-85 de README.md. |
| Arquitectura moderna (standalone, señales, `loadComponent`, `input()`) | ✅ SÍ | Líneas 69-75 de README.md. |
| Comandos de ejecución | ✅ SÍ | `npm install`, `npx ng serve`, `npx ng build`, `npx ng test --watch=false`. |

**Archivo a editar:** `README.md` (raíz del proyecto)

---

### R2 — Rutas y Navegación

| Criterio | Estado | Archivo / Líneas |
|----------|--------|------------------|
| Vista listado (`/mesas` y `/inventario`) | ✅ SÍ | `app.routes.ts` líneas 5-8 y 16-19 |
| Vista detalle con `:id` (`/inventario/detalle/:id`) | ✅ SÍ | `app.routes.ts` líneas 26-29 + `producto-detalle.component.ts` |
| Parámetro `:id` recibido con `input()` | ✅ SÍ | `producto-detalle.component.ts` línea 36 |
| `withComponentInputBinding()` en `app.config.ts` | ✅ SÍ | `app.config.ts` línea 8 |
| Mensaje "Registro no encontrado" si ID inexistente | ✅ SÍ | `producto-detalle.component.ts` líneas 26-29 |
| Vista alta (`/inventario/nuevo`) | ✅ SÍ | `app.routes.ts` líneas 21-24 |
| Vista 404 (`/404` y `**`) | ✅ SÍ | `app.routes.ts` líneas 30-36 |
| `loadComponent` en todas las rutas | ✅ SÍ | `app.routes.ts` todas las rutas |
| `routerLinkActive` y `routerLinkActiveOptions` | ✅ SÍ | `sidebar-layout.component.ts` líneas 27-28 |

---

### R3 — Formulario de Alta de Producto

| Criterio | Estado | Archivo / Líneas |
|----------|--------|------------------|
| `NonNullableFormBuilder` tipado, un control por campo | ✅ SÍ | `producto-form.component.ts` líneas 130-148 |
| Modelo de formulario (`ProductoFormValue`) separado del modelo de datos (`Producto`) | ✅ SÍ | `producto.model.ts` líneas 18-25 y 7-16 |
| Conversión explícita con `mapProductoFormToProducto()` | ✅ SÍ | `producto.model.ts` líneas 27-37 |
| Guarda mediante servicio actualizando señal privada sin recargar | ✅ SÍ | `producto.service.ts` líneas 92-96; `producto-form.component.ts` líneas 168-184 |
| Vista previa en vivo (`ProductoCard`) | ✅ SÍ | `producto-form.component.ts` líneas 114-116 y `producto-card.component.ts` |

---

### R4 — Validaciones

| Criterio | Estado | Archivo / Líneas |
|----------|--------|------------------|
| 4 validadores integrados distintos | ✅ SÍ | `required`, `minLength(3)`, `maxLength(50)`, `min(100)` — `producto-form.component.ts` líneas 133-136, 141, 144 |
| 1 validador propio | ✅ SÍ | `validarProductoUnico` — `producto-unico.validator.ts` |
| Errores solo cuando `control.invalid && (touched || dirty)` | ✅ SÍ | `producto-form.component.ts` líneas 34, 60, 75 |
| Botón deshabilitado con `[disabled]="formularioProducto.invalid"` | ✅ SÍ | `producto-form.component.ts` línea 105 |

---

### R5 — Búsqueda Reactiva (INVENTARIO)

**✅ YA ESTÁ IMPLEMENTADA** en el archivo:
> **`src/app/features/inventario/inventario-list.component.ts`**

**Detalles de implementación:**

| Requisito | Dónde está | Líneas |
|-----------|------------|--------|
| `FormControl` tipado con `nonNullable: true` | `inventario-list.component.ts` | Línea 89 |
| `valueChanges` conectado | `inventario-list.component.ts` | Línea 91 |
| `debounceTime(300)` | `inventario-list.component.ts` | Línea 92 |
| `distinctUntilChanged()` | `inventario-list.component.ts` | Línea 92 |
| `toSignal(..., { initialValue: '' })` | `inventario-list.component.ts` | Líneas 91-94 |
| `computed()` que combina señal de productos + término de búsqueda | `inventario-list.component.ts` | Líneas 100-105 |
| Filtra por nombre de producto y categoría | `inventario-list.component.ts` | Líneas 102-103 |
| Filtra también bajo stock | `inventario-list.component.ts` | Líneas 107-112 |
| Sin `.subscribe()` (cero fugas de memoria) | — | Usa `toSignal()` en lugar de subscribe |
| HTML itera sobre señal filtrada con `@for` + `track` | `inventario-list.component.ts` | Líneas 35 y 63 |
| Mensaje claro si no hay coincidencias (`@empty`) | `inventario-list.component.ts` | Líneas 44 y 77 |
| Al borrar el texto reaparecen todas las mesas/productos | — | Porque `termino` es `''` y el `includes('')` devuelve `true` para todo |

**NOTA:** La búsqueda está implementada en el listado de **inventario** (`/inventario`), no en el listado de mesas (`/mesas`). El componente `MesaListComponent` (`src/app/features/mesas/mesa-list.component.ts`) NO tiene búsqueda reactiva todavía.

---

### R6 y Reglas de Descuento (sin penalizaciones)

| Regla | Estado | Verificación |
|-------|--------|--------------|
| No `NgModule` | ✅ | Todos los componentes son `standalone` |
| No `*ngIf` | ✅ | Se usa exclusivamente `@if` / `@else` |
| No `*ngFor` | ✅ | Se usa exclusivamente `@for` con `track` |
| No `@Input()` | ✅ | Se usa `input()` |
| Señales privadas en servicios (`.asReadonly()`) | ✅ | `_productos`, `_categorias`, `_mesas`, `_pedidos`, `_ordenesCocina` son `private` |
| No mutar señales desde componentes | ✅ | Los componentes solo leen con `.asReadonly()` |
| No suscripciones abiertas (`.subscribe()`) | ✅ | Se usa `toSignal()` |
| `@for` siempre con `track` | ✅ | Verificado en todos los componentes |
| Sin "Lorem ipsum" | ✅ | Todos los textos son reales del dominio POS |
| `npx ng build` compila sin errores | ✅ | Verificado |
| `npx ng test --watch=false` pasa en verde | ✅ | 12 tests pasando |

---

## 2. MAPA EXACTO DE LO QUE YA ESTÁ HECHO (80%)

| Requisito | Qué está hecho | Archivo exacto |
|-----------|---------------|----------------|
| R2 — Rutas y navegación | 6 rutas con `loadComponent`, detalle con `input()`, 404, `routerLinkActive` | `src/app/app.routes.ts`, `src/app/app.config.ts`, `src/app/features/layout/sidebar-layout.component.ts` |
| R2 — Vista de mesas | Listado de 12 mesas con cambio de estado | `src/app/features/mesas/mesa-list.component.ts` |
| R2 — Vista de cocina | Tablero Kanban de órdenes (pendiente → preparación → listo) | `src/app/features/cocina/cocina.component.ts` |
| R2 — Vista de inventario | Listado de 47 productos con stock y categorías | `src/app/features/inventario/inventario-list.component.ts` |
| R3 — Formulario alta producto | `NonNullableFormBuilder`, 6 campos, guardar + reset + navegar | `src/app/features/productos/producto-form.component.ts` |
| R3 — Modelo separado | `ProductoFormValue` ↔ `Producto` con mapper | `src/app/core/models/producto.model.ts` |
| R4 — Validadores | 4 integrados + 1 personalizado (`validarProductoUnico`) | `src/app/shared/validators/producto-unico.validator.ts` |
| R5 — Búsqueda reactiva | `FormControl` + `debounceTime(300)` + `distinctUntilChanged()` + `toSignal()` + `computed()` | `src/app/features/inventario/inventario-list.component.ts` (líneas 89-112) |
| Servicios | Señales privadas `.asReadonly()` en 3 servicios | `src/app/core/services/producto.service.ts`, `mesa.service.ts`, `pedido.service.ts` |
| Datos reales | 47 productos, 12 mesas, 17 pedidos, 8 categorías (del SQL de referencia) | `src/app/core/services/producto.service.ts`, `mesa.service.ts`, `pedido.service.ts` |
| Pruebas | 12 tests pasando (3 specs) | `src/app/core/services/producto.service.spec.ts`, `mesa.service.spec.ts`, `app.spec.ts` |

---

## 3. LO QUE FALTA HACER (20% PENDIENTE PARA EL COMPAÑERO)

### 3.1. Vista de Facturación / Reportes (OBLIGATORIO)

Crear una vista independiente (standalone component) para facturación o reportes.

**Ruta sugerida:** `/facturacion` o `/reportes`

**Qué debe incluir:**
- Componente standalone en `src/app/features/facturacion/` o `src/app/features/reportes/`
- Ruta en `src/app/app.routes.ts` con `loadComponent`
- Listado de facturas/pedidos facturados con totales
- Botón para generar factura desde un pedido listo

**Archivos exactos a crear/modificar:**
1. Crear: `src/app/features/facturacion/facturacion.component.ts` (y `.css`)
2. Modificar: `src/app/app.routes.ts` (agregar ruta con `loadComponent`)
3. Opcional: Agregar enlace en el sidebar de `src/app/features/layout/sidebar-layout.component.ts`

---

### 3.2. Actualización de `README.md` (OBLIGATORIO)

El `README.md` actual tiene la tabla de rutas con rutas **antiguas** (`/mesas`, `/mesas/nueva`, `/mesas/detalle/:id`). Debe actualizarse con las **rutas actuales** del proyecto.

**Archivo a editar:** `README.md` (raíz del proyecto)

**Qué debe incluir:**
1. **Tabla de rutas actualizada** con columnas `Ruta`, `Vista / Componente`, `Parámetro`:

   | Ruta | Vista / Componente | Parámetro |
   |------|-------------------|-----------|
   | `/mesas` | Listado de mesas (`MesaListComponent`) | Ninguno |
   | `/cocina` | Tablero de cocina (`CocinaComponent`) | Ninguno |
   | `/inventario` | Listado de inventario (`InventarioListComponent`) | Ninguno |
   | `/inventario/nuevo` | Formulario alta producto (`ProductoFormComponent`) | Ninguno |
   | `/inventario/detalle/:id` | Detalle de producto (`ProductoDetalleComponent`) | `id` del producto |
   | `/404` | Vista no encontrada (`NotFoundComponent`) | Ninguno |
   | `**` | Redirección a 404 | Cualquier ruta inexistente |
   | (vacío) | Redirección a `/mesas` | Ninguno |

2. **Justificación técnica:** Por qué se usó `ReactiveFormsModule` en lugar de `FormsModule` (tipado estricto, validadores escalables, separación modelo de formulario/dominio, facilidad de pruebas).

3. **Arquitectura moderna:** Standalone components, señales privadas con `.asReadonly()`, `loadComponent`, parámetros vía `input()`.

4. **Comandos de ejecución:** `npm install`, `npx ng serve`, `npx ng build`, `npx ng test --watch=false`.

---

### 3.3. (Opcional) Búsqueda reactiva en el listado de mesas

La búsqueda reactiva (R5) ya está implementada en `/inventario`. Si se desea, también se puede agregar al listado de mesas (`/mesas`) en:
> `src/app/features/mesas/mesa-list.component.ts`

---

## 4. GUÍA RÁPIDA DE PRUEBAS Y GIT

### 4.1. Cómo verificar los 6 casos de prueba de la rúbrica

Ejecutar en la terminal:
```bash
cd C:\Users\USER\Desktop\entrega2_posweb\poswebAn
npx ng serve
```
Luego abrir **http://localhost:4200/**

| Caso | Qué probar en el navegador |
|------|---------------------------|
| 1. Formulario vacío tocado → error + botón deshabilitado | Ir a `/inventario/nuevo`, hacer clic en cada campo sin escribir, verificar que aparecen mensajes de error y el botón "Guardar producto" está deshabilitado |
| 2. Campo numérico con `min` | En "Precio" escribir valor < 100 → error "El precio mínimo es 100 COP". Corregir a ≥100 → error desaparece. Lo mismo para "Stock" con valor negativo |
| 3. Validador personalizado (nombre duplicado) | En "Nombre" escribir "Hamburguesa Clásica" → error "Ese nombre de producto ya está registrado". Cambiar a nombre único → error desaparece |
| 4. Envío válido → agrega sin recargar + `reset()` | Llenar formulario válido, hacer clic "Guardar producto", verificar que aparece en `/inventario` y el formulario se reinició |
| 5. Debounce 300 ms en búsqueda | Ir a `/inventario`, escribir 3 caracteres rápido, verificar que filtra una sola vez 300ms después de la última tecla. Borrar texto → reaparecen todos |
| 6. Detalle ID inexistente / 404 | Ir a `/inventario/detalle/99999` → "Registro no encontrado". Ir a `/ruta-inexistente` → vista 404 |

### 4.2. Comandos de Build y Tests

```bash
# Compilar para producción (debe compilar sin errores)
npx ng build

# Ejecutar pruebas unitarias (debe pasar en verde)
npx ng test --watch=false
```

### 4.3. Comandos Git para el compañero

Desde la carpeta `poswebAn`, en la rama `master`:

```bash
# Verificar que el remoto apunta únicamente a poswebAn.git
git remote -v

# Agregar los archivos creados/modificados para el 20%
git add <archivos-modificados-o-creados>

# Commit 1: Vista de facturación/reportes
git commit -m "feat: add facturacion/reportes view (20%)"

# Commit 2: Actualización de README
git add README.md
git commit -m "docs: update README with current routes and reactive form justification"

# Subir a master (REVISAR ANTES DE EJECUTAR)
git push origin master
```

**Verificar que aparece en el historial:**
```bash
git shortlog -sn
```

> **Nota importante:** No hacer `git push` hasta revisar localmente con `npx ng build` y `npx ng test --watch=false`. Todo el código debe compilar y los tests deben pasar antes de subir.

---

## 5. RESUMEN EJECUTIVO

| Estado | Detalle |
|--------|---------|
| Build | ✅ `npx ng build` compila sin errores |
| Tests | ✅ 12 tests pasando (3 archivos spec) |
| R1 (README) | ⚠️ Necesita actualizar tabla de rutas (rutas antiguas) |
| R2 (Rutas) | ✅ Completo (listado, detalle, alta, 404, `loadComponent`, `input()`) |
| R3 (Formulario alta) | ✅ Completo (Reactivo, `NonNullableFormBuilder`, modelo separado, `reset()`) |
| R4 (Validaciones) | ✅ Completo (4 integrados + 1 propio, errores con `touched/dirty`, botón deshabilitado) |
| R5 (Búsqueda reactiva) | ✅ Completo en `/inventario` (`inventario-list.component.ts` líneas 89-112) |
| Reglas de descuento | ✅ Sin violaciones (sin `NgModule`, `*ngIf`, `*ngFor`, `@Input()`, `.subscribe()`, "Lorem ipsum") |
| 20% pendiente | Vista de facturación/reportes + actualización de `README.md` |
