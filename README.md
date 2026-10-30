# Portafolio de Cristian Franco

Portafolio personal de una página para presentar proyectos de desarrollo de
software. Está construido con Next.js 16 (App Router), React 19 y TypeScript, y
se prerenderiza como contenido estático: no necesita backend ni base de datos.

## Requisitos

- Node.js 20.9 o superior.
- npm 10 o superior.

## Puesta en marcha

```bash
git clone https://github.com/cristiandevar/Presentacion.git
cd Presentacion
npm install
npm run dev
```

El sitio queda disponible en <http://localhost:3000>. No requiere variables de
entorno ni servicios externos.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 3000. |
| `npm run build` | Compilación optimizada y prerenderizado. |
| `npm start` | Sirve la compilación de producción. |
| `npm run validate` | Verificación de TypeScript y ESLint. |
| `npm test` | Suite de Playwright (19 pruebas). |
| `npm run test:report` | Abre el reporte HTML de la última ejecución. |

Playwright inicia automáticamente el servidor de pruebas en el puerto 4173.

## Estructura

```text
app/          Layout, página principal, estilos globales e icono
components/   Secciones y componentes con sus CSS Modules
lib/          Datos tipados de proyectos, filtros y constantes
tests/        Pruebas funcionales, de calidad y de accesibilidad
docs/         Documentación detallada del proyecto
```

## Documentación

La descripción de las funciones, la arquitectura y las convenciones de edición
está en [`docs/README.md`](docs/README.md). Las instrucciones para agentes de
código están en [`AGENTS.md`](AGENTS.md).

## Licencia

El contenido y los datos personales pertenecen a Cristian Franco. El código se
publica con fines de presentación y estudio.
