import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("research explorer switches lenses and supports selecting observations by keyboard", async ({
  page,
}) => {
  const explorer = page.locator(".research-explorer");
  await explorer.getByRole("button", { name: "Product", exact: true }).click();
  await expect(
    explorer.getByRole("button", { name: "Product", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(explorer.locator(".axis-x")).toContainText("Ease of use");
  await expect(explorer.locator(".explorer-caption")).toContainText(
    "Where does the experience fall short?",
  );
  const point = explorer.getByRole("button", {
    name: "Product observation 3",
    exact: true,
  });
  await point.focus();
  await page.keyboard.press("Enter");
  await expect(point).toHaveAttribute("aria-pressed", "true");
  await expect(explorer.locator(".point-halo")).toHaveAttribute("cx", "122");
  await explorer.getByRole("button", { name: "Data", exact: true }).click();
  await expect(explorer.locator(".axis-y")).toHaveText("Confidence");
});

test("filters research interests, opens an honest focus detail, and restores focus on escape", async ({
  page,
}) => {
  const filter = page
    .getByRole("button", { name: "Product", exact: true })
    .last();
  await filter.click();
  await expect(page.locator(".focus-card")).toHaveCount(1);
  const card = page.getByRole("button", {
    name: "Explore product research focus",
  });
  await card.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("not a completed case study");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
  await page.getByRole("button", { name: "All" }).click();
  await expect(page.locator(".focus-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Explore market research focus" })
    .click();
  await page.getByRole("button", { name: "Close research focus" }).click();
  await expect(dialog).toHaveCount(0);
});

test("approach steps reveal their own content and collapse the previous step", async ({
  page,
}) => {
  const second = page.getByRole("button", { name: /Follow the evidence/ });
  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#step-panel-1")).toBeVisible();
  await expect(page.locator("#step-panel-0")).toBeHidden();
  await page.getByRole("button", { name: /Make the insight useful/ }).click();
  await expect(page.locator("#step-panel-2")).toContainText(
    "what remains uncertain",
  );
  await expect(page.locator("#step-panel-1")).toBeHidden();
});

test("mobile navigation opens, follows a section link, and closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("navigation")).toBeHidden();
});

test("contact name copy writes the real profile name", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Keep my name handy" }).click();
  await expect(page.getByRole("button", { name: "Name copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "Sandy Yoga Prakasa Holley",
  );
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout stays within the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const heading = page.getByRole("heading", { level: 1 });
    const box = await heading.boundingBox();
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    const overflows = await page
      .locator("h1")
      .evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflows).toBe(false);
  });
}

test("main page and research dialog pass automated accessibility checks", async ({
  page,
}) => {
  const scan = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
  expect((await scan()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "Explore data research focus" })
    .click();
  expect((await scan()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  expect((await scan()).violations).toEqual([]);
});

test("page loads with no browser errors or missing local assets", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page).toHaveTitle("Sandy Holley — Research & Insights");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A curious mind.",
  );
  expect(errors).toEqual([]);
});
