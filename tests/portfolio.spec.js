import { test, expect } from "@playwright/test";

const cards = (page) => page.locator("article");
const projectCount = (page) => page.locator("#project-count");
const emptyState = (page) => page.locator("#empty-state");

let pageErrors;

async function waitForHydration(page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some((button) =>
      Object.keys(button).some((key) => key.startsWith("__reactProps")),
    ),
  );
}

test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await waitForHydration(page);
});

test.afterEach(() => {
  expect(pageErrors, "errores de JavaScript en la página").toEqual([]);
});

test("carga el documento y la hoja de estilos", async ({ page }) => {
  await expect(page).toHaveTitle("Cristian Franco — Portafolio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Código que convierte tareas en herramientas útiles.",
  );
  await expect(page.getByRole("link", { name: "Cristian Franco" })).toBeVisible();

  const response = await page.request.get("/");
  expect(response.status()).toBe(200);

  const background = await page
    .locator("body")
    .evaluate((body) => getComputedStyle(body).backgroundColor);
  expect(background).toBe("rgb(242, 245, 247)");
});

test("muestra los ocho proyectos y el contador inicial", async ({ page }) => {
  await expect(cards(page)).toHaveCount(8);
  await expect(projectCount(page)).toHaveText("08 proyectos");
  await expect(emptyState(page)).toBeHidden();
});

test("filtra por categoría y actualiza el estado accesible", async ({ page }) => {
  const python = page.getByRole("button", { name: "Python" });
  const all = page.getByRole("button", { name: "Todos" });

  await python.click();

  await expect(python).toHaveAttribute("aria-pressed", "true");
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(cards(page)).toHaveCount(3);
  await expect(cards(page).locator("h3")).toHaveText([
    "Puesto 13",
    "AgendApp · Backend",
    "StockControl",
  ]);
  await expect(projectCount(page)).toHaveText("03 proyectos");
});

test("usa el singular cuando queda un solo proyecto", async ({ page }) => {
  await page.getByRole("button", { name: "Backend" }).click();

  await expect(cards(page)).toHaveCount(1);
  await expect(projectCount(page)).toHaveText("01 proyecto");
});

test("la búsqueda ignora mayúsculas y tildes", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Buscar proyectos" });

  await search.fill("GESTION");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("h3")).toHaveText("Puesto 13");

  await search.fill("gestión");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("h3")).toHaveText("Puesto 13");

  await search.fill("aplicacion");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("h3")).toHaveText("Android App");
});

test("muestra el estado vacío y se recupera al borrar la búsqueda", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Buscar proyectos" });

  await search.fill("zzz");
  await expect(cards(page)).toHaveCount(0);
  await expect(emptyState(page)).toBeVisible();
  await expect(projectCount(page)).toHaveText("00 proyectos");

  await search.clear();
  await expect(cards(page)).toHaveCount(8);
  await expect(emptyState(page)).toBeHidden();
});

test("combina filtro y búsqueda", async ({ page }) => {
  await page.getByRole("button", { name: "Web" }).click();
  await page.getByRole("searchbox", { name: "Buscar proyectos" }).fill("blade");

  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("h3")).toHaveText("miTiendApp");
});

test("avanza y retrocede por las diapositivas del carrusel circular", async ({ page }) => {
  const position = page.locator("#project-position");
  const previous = page.getByRole("button", { name: "Proyecto anterior" });
  const next = page.getByRole("button", { name: "Proyecto siguiente" });

  await expect(position).toHaveText("01 / 08");

  await next.click();
  await expect(position).toHaveText("02 / 08");

  await previous.click();
  await expect(position).toHaveText("01 / 08");

  await previous.click();
  await expect(position).toHaveText("08 / 08");

  await next.click();
  await expect(position).toHaveText("01 / 08");
});

test("la rotación automática avanza y se puede pausar", async ({ page }) => {
  const position = page.locator("#project-position");
  const carousel = page.locator("#project-grid");

  await carousel.scrollIntoViewIfNeeded();
  await expect(position).toHaveText("02 / 08", { timeout: 8000 });

  await page.getByRole("button", { name: "Pausar carrusel" }).click();
  await expect(page.getByRole("button", { name: "Reanudar carrusel" })).toBeVisible();
  await expect(position).toHaveText("02 / 08");
});

test("respeta el movimiento reducido sin bloquear la navegación manual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const rotation = page.getByRole("button", {
    name: "Movimiento automático desactivado por la preferencia de movimiento reducido",
  });
  await expect(rotation).toBeDisabled();

  await page.getByRole("button", { name: "Proyecto siguiente" }).click();
  await expect(page.locator("#project-position")).toHaveText("02 / 08");
});

test("mantiene accesibles todos los enlaces de navegación en móvil", async ({ page }) => {
  const navItems = page
    .getByRole("navigation", { name: "Navegación principal" })
    .locator("li");

  await expect(navItems.first()).toBeVisible();

  await page.setViewportSize({ width: 590, height: 900 });
  await expect(navItems).toHaveCount(4);
  await expect(navItems.first()).toBeVisible();
});

test("cambia y conserva el tema elegido", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Cambiar a tema oscuro" });

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Cambiar a tema claro" })).toBeVisible();

  await page.reload();
  await waitForHydration(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Cambiar a tema claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("no desborda horizontalmente en móvil", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});

test("el enlace de salto lleva el foco al contenido principal", async ({ page }) => {
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
  await expect(page.locator("main")).toBeFocused();
});

test("todos los enlaces externos abren de forma segura", async ({ page }) => {
  const unsafe = await page.locator('a[target="_blank"]').evaluateAll((links) =>
    links
      .filter((link) => !(link.getAttribute("rel") ?? "").includes("noopener"))
      .map((link) => link.href),
  );

  expect(unsafe).toEqual([]);
});
