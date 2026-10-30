import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("no presenta violaciones graves de accesibilidad", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact),
  );

  const summary = blocking.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    help: violation.help,
  }));

  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
});
