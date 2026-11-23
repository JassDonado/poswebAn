# Entrega para completar la Entrega 2

## Estado actual

El proyecto Angular ya tiene implementados los puntos 1 y 3 del documento de requisitos:

- Rutas standalone con lazy loading.
- Navegación activa.
- Detalle de mesa y vista 404.
- Signals privadas en el servicio.
- Formulario reactivo tipado para registrar mesas.
- Validadores integrados y validador personalizado para números duplicados.
- Alta reactiva, limpieza del formulario y actualización del listado.

El proyecto compila con `npx ng build` y las pruebas actuales pasan con `npx ng test --watch=false`.

## Punto pendiente 2: Búsqueda reactiva (RF-E2-08)

Implementar la búsqueda en la vista del listado principal de mesas.

### Requisitos técnicos

1. Agregar un campo de búsqueda en `MesaListComponent`.
2. Crear un `FormControl` para el texto de búsqueda.
3. Conectar `valueChanges` usando:
   - `debounceTime(300)`.
   - `distinctUntilChanged()`.
4. Convertir el Observable a Signal usando:

   ```ts
   toSignal(observable, { initialValue: '' })
   ```

5. Crear un `computed()` que combine:
   - `MesaService.mesas`.
   - La Signal del texto de búsqueda.
6. Filtrar por número de mesa y, si se considera útil, también por estado.
7. El template debe iterar sobre el resultado filtrado, no sobre la Signal original.
8. Mantener el requisito de Angular moderno:
   - Usar `@for`.
   - Incluir siempre `track`.
   - No usar `.subscribe()` manual.

### Comportamiento esperado

- Al escribir rápidamente, el filtrado debe ejecutarse después de 300 ms sin escribir.
- La lista debe actualizarse sin recargar la página.
- Si no hay coincidencias, mostrar un mensaje claro.
- Al limpiar el campo, deben volver a mostrarse todas las mesas.

### Archivos sugeridos

- `src/app/features/mesas/mesa-list.component.ts`

## Punto pendiente 4: Actualización de README.md

Actualizar el README principal del proyecto con la documentación de la Entrega 2.

### Tabla de rutas obligatoria

Agregar una tabla con estas columnas:

| Ruta | Vista / Componente | Parámetro |
|---|---|---|
| `/mesas` | Listado de mesas | Ninguno |
| `/mesas/nueva` | Formulario de alta | Ninguno |
| `/mesas/detalle/:id` | Detalle de mesa | `id` de la mesa |
| `/404` | Vista no encontrada | Ninguno |
| `**` | Redirección a 404 | Cualquier ruta inexistente |

Verificar los nombres reales de los componentes antes de documentarlos.

### Justificación técnica obligatoria

Explicar por qué se utilizó `ReactiveFormsModule` en lugar de `FormsModule`, incluyendo:

- Tipado estricto de los controles.
- Escalabilidad para validaciones síncronas y personalizadas.
- Separación entre el modelo del formulario y el modelo de dominio.
- Facilidad para pruebas unitarias.
- Control explícito del estado de validación y del envío.

### También documentar

- Que la aplicación usa standalone components.
- Que las señales del servicio son privadas y se exponen como readonly.
- Que las rutas usan lazy loading.
- Cómo ejecutar:

  ```bash
  npm install
  npx ng serve
  npx ng build
  npx ng test --watch=false
  ```

## Recomendación de commits

Realizar dos commits separados:

```text
feat: add reactive mesa search
docs: update README for entrega 2
```

Cada commit debe contener únicamente el punto correspondiente. Antes de finalizar:

1. Ejecutar `npx ng build`.
2. Ejecutar `npx ng test --watch=false`.
3. Confirmar que no se introdujeron `@Input()`, `*ngIf`, `*ngFor` ni suscripciones manuales.
4. Verificar que la búsqueda y la documentación estén presentes en la rama remota.
