import { test, expect } from "@playwright/test";

test("desktop resume downloads and About model is deferred", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const typing: string[] = [];
  page.on("request", (request) => { if (request.url().includes("luffy_typing.glb")) typing.push(request.url()); });
  await page.goto("/");
  await expect(page.locator(".loading-screen")).toHaveCount(0, { timeout: 20000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("RAGHAVENDRA", { timeout: 10000 });
  await expect(page.locator(".character-model canvas")).toBeVisible();
  await expect(page.locator(".character-model")).toHaveAttribute("data-scene-state", "ready", { timeout: 30000 });
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await expect(page.locator(".scene-fallback")).toHaveCount(0);
  expect(typing).toHaveLength(0);
  const download = page.waitForEvent("download");
  await page.locator(".desktop-nav .resume-btn").click();
  expect((await download).suggestedFilename()).toBe("Raghavendra_Pedada_Resume.pdf");
  await page.locator(".desktop-nav a[href='#about']").click();
  await expect(page.locator(".about-scene canvas")).toBeVisible({ timeout: 15000 });
  await expect.poll(() => typing.length).toBe(1);
  await expect(page.locator(".about-scene")).toHaveAttribute("data-scene-state", "ready", { timeout: 30000 });
  await page.screenshot({ path: "test-results/desktop-about.png" });
  // Cross the responsive boundary with a model already loaded.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".character-model canvas")).toHaveCount(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".character-model canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("mobile menu manages keyboard focus and uses the correct GitHub profile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/models/*.glb", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".loading-screen")).toHaveCount(0, { timeout: 15000 });
  const toggle = page.getByRole("button", { name: "Toggle menu" });
  await toggle.click();
  const drawer = page.locator("#mobile-menu");
  await expect(drawer.getByRole("link", { name: "ABOUT", exact: true })).toBeFocused();
  await expect(drawer.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute("href", "https://github.com/RaghavendraPedada-1765");
  await page.keyboard.press("Shift+Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.getByRole("link", { name: "Email", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(page.locator(".scene-fallback").first()).toBeVisible();
  await page.screenshot({ path: "test-results/mobile-fallback.png", fullPage: true });
});

test("reduced motion skips glitch and content survives unavailable WebGL", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind: string, ...args: unknown[]) {
      if (kind.includes("webgl")) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".loading-screen")).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("RAGHAVENDRA");
  await expect(page.locator(".static-overlay")).toHaveCount(0);
  await expect(page.locator(".cursor-main")).toBeHidden();
  await page.locator(".desktop-nav a[href='#contact']").click();
  await expect(page.locator("#contact")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("slow model loading can be skipped without blocking navigation", async ({ page }) => {
  await page.route("**/models/*.glb", () => {});
  await page.goto("/");
  await page.getByRole("button", { name: "Continue to portfolio" }).click();
  await expect(page.locator(".loading-screen")).toHaveCount(0);
  await page.locator(".desktop-nav a[href='#work']").click();
  await expect(page.locator("#work")).toBeInViewport();
});
