import { test, expect } from "@playwright/test";

const avatar = (page) =>
  page.getByRole("img", { name: "Avatar de Cristian Franco" });

test("carga todos los recursos sin errores", async ({ page }) => {
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });

  expect(failures).toEqual([]);
  await expect(avatar(page)).toHaveJSProperty("complete", true);
  expect(await avatar(page).evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor)).toBe(
    "rgb(242, 245, 247)",
  );
});

test("expone metadatos válidos y una estructura de encabezados correcta", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /width=device-width/);

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(jsonLd);
  expect(data["@type"]).toBe("Person");
  expect(data.name).toBe("Cristian Franco");

  const audit = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    const levels = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((heading) =>
      Number(heading.tagName[1]),
    );
    return {
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      levels,
    };
  });

  expect(audit.duplicateIds).toEqual([]);
  expect(audit.levels[0]).toBe(1);
  expect(audit.levels.filter((level) => level === 1)).toHaveLength(1);
  audit.levels.slice(1).forEach((level, index) => {
    expect(level - audit.levels[index]).toBeLessThanOrEqual(1);
  });
});

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mantiene visibles los proyectos y el contador", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("article")).toHaveCount(8);
    await expect(page.locator("#project-count")).toHaveText("08 proyectos");
    await expect(page.getByRole("heading", { name: "Proyectos", exact: true })).toBeVisible();
  });
});
