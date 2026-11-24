# PoswebAn

Sistema de control de mesas para restaurante (POS). Aplicación Angular moderna construida con componentes standalone, señales y formularios reactivos.

## Tabla de rutas

| Ruta | Vista / Componente | Parámetro |
|------|-------------------|-----------|
| `/mesas` | Listado de mesas (`MesaListComponent`) | Ninguno |
| `/cocina` | Tablero de cocina (`CocinaComponent`) | Ninguno |
| `/inventario` | Listado de inventario (`InventarioListComponent`) | Ninguno |
| `/inventario/nuevo` | Formulario de alta de producto (`ProductoFormComponent`) | Ninguno |
| `/inventario/detalle/:id` | Detalle de producto (`ProductoDetalleComponent`) | `id` del producto |
| `/facturacion` | Facturación y reportes (`FacturacionComponent`) | Ninguno |
| `/404` | Vista no encontrada (`NotFoundComponent`) | Ninguno |
| `**` | Redirección a 404 | Cualquier ruta inexistente |
| (vacío) | Redirección a `/mesas` | Ninguno |

## Development server

To start a local development server, run:

```bash
npm install
npx ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. You can use Angular CLI to generate components and other building blocks.

```bash
ng generate component component-name
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner:

```bash
npx ng test --watch=false
```

## Arquitectura moderna

- **Standalone components:** la aplicación no usa `NgModule`; cada componente declara sus propias dependencias en `imports`.
- **Señales privadas con `.asReadonly()`:** los servicios mantienen su estado en señales privadas y exponen solo valores de lectura mediante `asReadonly()`, impidiendo que los componentes muten el estado directamente.
- **Rutas con `loadComponent` y parámetros vía `input()`:** las rutas usan carga diferida (lazy loading) con `loadComponent`, y el parámetro `id` se inyecta en el componente de detalle con `input<string>()` (vía `withComponentInputBinding`).
- **Búsqueda reactiva:** el listado de inventario incluye un `FormControl` tipado conectado mediante `debounceTime(300)`, `distinctUntilChanged()` y `toSignal()`; un `computed()` filtra por nombre, categoría y bajo stock sin suscripciones abiertas.
- **Formulario reactivo tipado:** el alta de productos usa `ReactiveFormsModule` con `NonNullableFormBuilder`, validadores integrados y un validador personalizado de nombre duplicado.

## Justificación técnica: Formulario Reactivo vs Formulario basado en plantillas

Para los formularios se utilizó `ReactiveFormsModule` en lugar de `FormsModule` por las siguientes razones:

1. **Tipado estricto de los controles:** con `NonNullableFormBuilder` y `FormControl` tipados, el valor del formulario se conoce en tiempo de compilación.
2. **Escalabilidad de validadores:** es sencillo añadir validadores integrados como `required`, `min`, `minLength` y `maxLength`, además de validadores personalizados.
3. **Separación entre modelo de formulario y modelo de dominio:** el formulario maneja `ProductoFormValue`, mientras el servicio trabaja con `Producto`; la conversión es explícita.
4. **Facilidad de pruebas:** las validaciones y el estado pueden verificarse directamente sin depender del DOM.
5. **Control explícito del envío:** el botón se deshabilita con `[disabled]="formularioProducto.invalid"` y los errores se muestran solo al tocar o modificar el control.

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
