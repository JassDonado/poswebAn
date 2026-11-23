# PoswebAn

Sistema de control de mesas para restaurante (POS). Aplicación Angular moderna construida con componentes standalone, señales y formularios reactivos.

## Tabla de rutas

| Ruta | Vista / Componente | Parámetro |
|---|---|---|
| `/mesas` | Listado de mesas (`MesaListComponent`) | Ninguno |
| `/mesas/nueva` | Formulario de alta (`MesaFormComponent`) | Ninguno |
| `/mesas/detalle/:id` | Detalle de mesa (`MesaDetailComponent`) | `id` de la mesa |
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

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npx ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npx ng test --watch=false
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Arquitectura moderna

- **Standalone components:** la aplicación no usa `NgModule`; cada componente declara sus propias dependencias en `imports`.
- **Señales privadas con `.asReadonly()`:** el `MesaService` mantiene su estado en una `signal` privada (`_mesas`) y lo expuesto solo de lectura mediante `asReadonly()`, impidiendo que los componentes lo muten directamente.
- **Rutas con `loadComponent` y parámetros vía `input()`:** las rutas usan carga diferida (lazy loading) con `loadComponent`, y el parámetro `id` se inyecta en el componente de detalle con `input<string>()` (vía `withComponentInputBinding`).
- **Búsqueda reactiva (RF-E2-08):** el listado incluye un campo de búsqueda con `FormControl` tipado, conectado mediante `debounceTime(300)` y `distinctUntilChanged()`, convertido a señal con `toSignal()` (sin suscripciones abiertas) y combinado en un `computed()` que filtra las mesas por número y estado.
- **Formulario reactivo tipado:** el alta de mesas usa `ReactiveFormsModule` con `NonNullableFormBuilder`, validadores síncronos y un validador personalizado de número duplicado.

## Justificación técnica: Formulario Reactivo vs Formulario basado en plantillas

Para el alta de mesas se utilizó `ReactiveFormsModule` en lugar de `FormsModule` por las siguientes razones:

1. **Tipado estricto de los controles:** con `NonNullableFormBuilder` y `FormControl<string | number>` tipados, el valor del formulario se conoce en tiempo de compilación, evitando errores de tipo en tiempo de ejecución.
2. **Escalabilidad de validadores:** es sencillo añadir validadores síncronos integrados (`required`, `min`, `minLength`, `pattern`) y validadores personalizados (como `uniqueMesaNumberValidator`) sin ensuciar el template.
3. **Separación entre modelo de formulario y modelo de dominio:** el formulario maneja `MesaFormValue` mientras el servicio trabaja con la entidad `Mesa`; la conversión es explícita (`mapMesaFormToEntity`), lo que mantiene el dominio limpio.
4. **Facilidad de pruebas:** el estado y las validaciones del formulario se pueden verificar directamente en pruebas unitarias sin renderizar el DOM ni depender de directivas de plantilla.
5. **Control explícito del estado de validación y del envío:** se puede deshabilitar el botón con `[disabled]="form.invalid"` y mostrar mensajes de error solo cuando el control está `invalid && (touched || dirty)`.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
