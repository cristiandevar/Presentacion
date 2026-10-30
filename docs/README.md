# Portafolio de Cristian Franco

Portafolio personal de una página para presentar proyectos de desarrollo de
software, facilitar su exploración y enlazar con los repositorios públicos.
El sitio se prerenderiza como contenido estático; no tiene backend ni base de
datos.

## Tecnologías

- Next.js 16 con App Router y React 19.
- TypeScript en modo estricto.
- CSS Modules y variables CSS para estilos y temas.
- `next/font` para servir localmente Bricolage Grotesque y DM Sans.
- Playwright y axe para pruebas de comportamiento, calidad y accesibilidad.

## Funciones

### Carrusel de proyectos

- Los proyectos se definen en `lib/projects.ts`; el componente los filtra y
  busca sin consultar servicios externos.
- El carrusel avanza automáticamente cada seis segundos y ofrece navegación
  circular con botones, teclado y desplazamiento táctil.
- La transición lateral conserva una franja de la siguiente diapositiva como
  referencia visual. Los controles permiten pausar o reanudar la rotación.
- La rotación se detiene al pasar el puntero por la sección, al recibir el
  foco, al quedar fuera de pantalla o cuando la pestaña no está visible.
- Con `prefers-reduced-motion`, la rotación automática se desactiva y la
  navegación manual cambia de diapositiva sin desplazamiento animado.
- Los filtros y la búsqueda por nombre, categoría o etiquetas se pueden
  combinar. Al cambiar los resultados, el carrusel vuelve al primer elemento.
- El indicador anuncia la diapositiva actual cuando la rotación está pausada
  o el usuario solicita movimiento reducido.
- Los repositorios privados se muestran sin enlace. Los enlaces públicos se
  abren de forma segura en otra pestaña.
- El HTML inicial contiene los proyectos y permite desplazarse por el carrusel
  aunque JavaScript esté desactivado; la búsqueda, los filtros, el autoplay y
  los controles requieren hidratación.

### Tema claro y oscuro

- El control del encabezado alterna entre tema claro y oscuro.
- La selección se guarda en `localStorage` con la clave `portfolio-theme` y se
  restaura al volver a visitar la página.
- El tema claro es el valor predeterminado cuando aún no hay una selección
  guardada.
- Los dos temas usan los mismos tokens semánticos (`--paper`, `--ink`,
  `--muted`, `--line`, `--blue`, `--pale-blue` y `--orange`) para conservar la
  jerarquía, los estados de foco y el contraste de la interfaz.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `app/layout.tsx` | Fuentes, metadatos, viewport, encabezado, pie y estructura común. |
| `app/page.tsx` | Composición de la página y datos estructurados `Person`. |
| `app/globals.css` | Tokens de los temas, reset, utilidades y movimiento reducido. |
| `components/Header.tsx` | Marca, navegación y control de tema. |
| `components/ThemeToggle.tsx` | Alternancia y persistencia de la preferencia de tema. |
| `components/Projects.tsx` | Carrusel, filtros, búsqueda y contador interactivos. |
| `components/*.module.css` | Estilos aislados de los componentes. |
| `lib/projects.ts` | Tipos, filtros, proyectos, perfil de GitHub y avatar. |
| `tests/` | Pruebas de interacción, accesibilidad y calidad. |

## Desarrollo

En shells no interactivos, cargue nvm antes de ejecutar comandos npm:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
```

```bash
npm run dev       # Servidor local en el puerto 3000
npm run validate  # TypeScript y ESLint
npm test          # Suite Playwright; inicia el servidor de pruebas en 4173
npm run build     # Compilación optimizada y prerenderizado
npm start         # Sirve la compilación de producción
```

Playwright se ejecuta con un worker para evitar colisiones con el servidor de
desarrollo. Para ejecutar una prueba específica:

```bash
npx playwright test tests/portfolio.spec.js -g "carrusel"
```

## Actualizar proyectos

Edite `lib/projects.ts`. Cada proyecto necesita un `slug`, `title`,
`description`, `initials`, `tags`, `categories` y `search`. El campo `repo` es
opcional. Para una categoría nueva, actualice `ProjectCategory`, `CategoryId`
y `filters` en ese mismo archivo. Revise las aserciones de contenido y cantidad
en `tests/portfolio.spec.js` cuando cambie la lista.

## Accesibilidad y diseño

- El contenido está en español formal y la página declara `lang="es"`.
- Se conservan el enlace para saltar al contenido, foco visible, filtros con
  `aria-pressed`, contador anunciado, estado vacío y enlaces externos seguros.
- El carrusel ofrece nombre accesible, descripción de diapositivas, controles
  etiquetados, pausa visible y seguimiento de la diapositiva activa.
- El tema expone su acción en el nombre accesible del botón.
- La animación respeta `prefers-reduced-motion`.
- La interfaz usa CSS Modules, propiedades lógicas y breakpoints en 800 px y
  600 px.

Para convenciones detalladas de edición y particularidades de Next.js, consulte
`AGENTS.md` en la raíz.
