export type CategoryId = "all" | "web" | "backend" | "mobile" | "python";

export type ProjectCategory = Exclude<CategoryId, "all">;

export interface Project {
  slug: string;
  title: string;
  description: string;
  initials: string;
  tags: string[];
  categories: ProjectCategory[];
  search: string;
  repo?: string;
}

export const filters: { id: CategoryId; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web" },
  { id: "backend", label: "Backend" },
  { id: "mobile", label: "Mobile" },
  { id: "python", label: "Python" },
];

export const projects: Project[] = [
  {
    slug: "puesto-13",
    title: "Puesto 13",
    description:
      "Proyecto de gestión de productos, proveedores y sectores que contempla la actualización de precios mediante filtros y el control de vencimientos.",
    initials: "P13",
    tags: ["Python", "Gestión"],
    categories: ["web", "python"],
    search: "puesto 13 gestión productos proveedores sectores precios vencimientos python",
  },
  {
    slug: "cv-online",
    title: "CV Online",
    description:
      "Currículum web desarrollado como proyecto final de formación en Front End, con HTML, CSS y JavaScript.",
    initials: "CV",
    tags: ["JavaScript", "HTML / CSS"],
    categories: ["web"],
    search: "cv online cvonline html css javascript portafolio",
    repo: "https://github.com/cristiandevar/CVOnline",
  },
  {
    slug: "mitiendapp",
    title: "miTiendApp",
    description: "Aplicación para tienda publicada en GitHub y desarrollada con Blade.",
    initials: "MT",
    tags: ["Blade", "Web"],
    categories: ["web"],
    search: "mitiendapp tienda blade laravel",
    repo: "https://github.com/cristiandevar/miTiendApp",
  },
  {
    slug: "agendapp-backend",
    title: "AgendApp · Backend",
    description: "Repositorio de backend para AgendApp, desarrollado en Python.",
    initials: "AG",
    tags: ["Python", "Backend"],
    categories: ["backend", "python"],
    search: "agendapp backend agenda python",
    repo: "https://github.com/cristiandevar/AgendApp---BackEnd",
  },
  {
    slug: "android-app",
    title: "Android App",
    description: "Aplicación para Android desarrollada con Kotlin.",
    initials: "AN",
    tags: ["Kotlin", "Android"],
    categories: ["mobile"],
    search: "android aplicación móvil kotlin",
    repo: "https://github.com/cristiandevar/android_app",
  },
  {
    slug: "stockcontrol",
    title: "StockControl",
    description: "Proyecto en Python enfocado en el control de stock.",
    initials: "SC",
    tags: ["Python", "Inventario"],
    categories: ["python"],
    search: "stockcontrol control stock inventario python",
    repo: "https://github.com/cristiandevar/StockControl",
  },
  {
    slug: "laravel-jetstream",
    title: "Laravel + Jetstream",
    description: "Configuración inicial de un proyecto Laravel con Jetstream y Livewire.",
    initials: "LJ",
    tags: ["Laravel", "Livewire"],
    categories: ["web"],
    search: "laravel jetstream livewire",
    repo: "https://github.com/cristiandevar/LaravelJetstreamLiveware",
  },
  {
    slug: "midespensa",
    title: "miDespensa",
    description:
      "Proyecto publicado en TypeScript. Consulte el repositorio para conocer su implementación.",
    initials: "MD",
    tags: ["TypeScript", "Web"],
    categories: ["web"],
    search: "midespensa mi despensa typescript",
    repo: "https://github.com/cristiandevar/miDespensa",
  },
];

export const GITHUB_PROFILE = "https://github.com/cristiandevar";
export const AVATAR_URL = "https://avatars.githubusercontent.com/u/122702043?v=4";
