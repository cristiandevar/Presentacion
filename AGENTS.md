# AGENTS.md

Portafolio personal de una página construido con Next.js 16 (App Router), React 19 y TypeScript. Se prerrenderiza como contenido estático: no hay backend ni base de datos.

## Estructura

- `app/layout.tsx`: fuentes con `next/font`, metadatos, `viewport`, skip link, `Header` y `Footer`.
- `app/page.tsx`: composición de la página y JSON-LD `Person`.
- `app/globals.css`: tokens, reset, `.shell`, utilidades y `prefers-reduced-motion`.
- `components/`: componentes y sus `*.module.css`. `Projects.tsx` y `ThemeToggle.tsx` son componentes de cliente; el resto son componentes de servidor.
- `lib/projects.ts`: datos tipados de proyectos, filtros y constantes (perfil de GitHub, avatar).
- `tests/`: 19 pruebas de Playwright (funcionales, accesibilidad con axe y calidad).
- `next.config.ts`: `allowedDevOrigins` e imágenes remotas permitidas.
- `docs/README.md`: documentación de arquitectura, funciones y desarrollo.

## Ejecutar

- **Node no está en el PATH de shells no interactivos.** Cargue nvm antes de cualquier comando npm:
  ```bash
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  ```
- Desarrollo: `npm run dev` (puerto 3000).
- Producción: `npm run build` y `npm start`. El build valida TypeScript.
- Validación estática: `npm run validate` (`tsc --noEmit` + ESLint).
- Pruebas: `npm test` (19 pruebas). Playwright levanta `npm run dev:test` en el puerto 4173.
- Una prueba o archivo: `npx playwright test tests/portfolio.spec.js -g "búsqueda"`. Reporte: `npm run test:report`.

## Gotchas de Next.js

- Next 16 bloquea recursos de desarrollo desde orígenes no permitidos; si la página no hidrata y los botones no responden, verifique el origen. `next.config.ts` permite `127.0.0.1` y las pruebas usan `http://localhost:4173`.
- **Espere la hidratación antes de interactuar en pruebas.** `tests/portfolio.spec.js` lo hace inspeccionando `__reactProps` en un botón; no elimine esa espera.
- Las clases de CSS Modules están hasheadas: en pruebas use roles, textos o los IDs estables (`#project-grid`, `#project-search`, `#project-count`, `#empty-state`).
- `priority` en `next/image` está deprecado en Next 16: use `preload` para la imagen LCP.
- Turbopack es el valor por defecto en `dev` y `build`; no agregue flags.
- `next-env.d.ts` y `.next/` son generados y están ignorados por git.

## Editar contenido

- **Agregar o modificar proyectos** se hace solo en `lib/projects.ts`:
  - `categories` debe usar el tipo `ProjectCategory` (`web`, `backend`, `mobile`, `python`). Para una categoría nueva, actualice también `filters` y el tipo `CategoryId`.
  - `search`: palabras clave; la búsqueda normaliza mayúsculas y tildes.
  - `repo` es opcional. **Puesto 13 no lo tiene**: su repositorio es privado y el enlace se eliminó a propósito.
  - `initials` se muestra con `aria-hidden`; `tags` son las etiquetas visibles.
- **Las pruebas fijan el contenido actual**: 8 proyectos, 3 de Python y 1 de Backend. Si cambia la cantidad, actualice `tests/portfolio.spec.js` o `npm test` fallará.
- El carrusel circular avanza automáticamente cada seis segundos; permite pausar, controles, teclado y desplazamiento táctil. Pausa con foco, puntero, movimiento reducido, pestaña oculta o fuera de pantalla.
- El HTML inicial incluye todos los proyectos; la búsqueda, los filtros y los controles del carrusel requieren JavaScript.
- El tema predeterminado es claro. El control de `ThemeToggle.tsx` guarda la selección en `localStorage` con la clave `portfolio-theme`.
- Documente los cambios relevantes en `docs/README.md`.
- Todo el contenido está en **español formal**: sin voseo ("Pruebe", no "Probá"), con tildes y ortografía correctas.
- Cada cambio relevante, deberá documentarse en la carpeta correspondiente al proyecto. Si no se tiene un documento creado, crear uno con el estado actual del proyecto.

## Convenciones

- Usar las variables de `:root` (`--paper`, `--ink`, `--blue`, `--pale-blue`, `--orange`, etc.) y CSS Modules; no agregue colores ni frameworks de estilos sin motivo.
- Tipografías: Bricolage Grotesque (títulos), DM Sans (texto), cargadas con `next/font`.
- Breakpoints: `max-width: 800px` y `max-width: 600px` para adaptar la composición y el índice de proyectos.
- Propiedades lógicas (`margin-block`, `inset-inline`, `padding-inline`) y `:focus-visible` para el foco.
- Enlaces externos: `target="_blank" rel="noopener noreferrer"`, flecha `↗` con `aria-hidden="true"` y aviso con `.visually-hidden`.
- Accesibilidad establecida: skip link, navegación visible en móvil, `aria-pressed` en filtros, `aria-live="polite"` en el contador, `role="status"` en el estado vacío y `prefers-reduced-motion`. Consérvela.
- La búsqueda usa `useDeferredValue`; no introduzca temporizadores manuales.
- Indentación de 2 espacios; TypeScript estricto.
- **Consulte la documentación actual de Next.js/React con el MCP Context7** antes de cambiar APIs, configuración o patrones del framework.

## Flujo recomendado

1. Editar datos, componentes o estilos.
2. Ejecutar `npm run validate` y `npm test`.
3. Si el cambio es visual, revisar en 1280 px y 390 px con `npm run build && npm start`.
