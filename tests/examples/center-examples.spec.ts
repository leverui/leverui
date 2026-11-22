import { expect, test, type Page } from '@playwright/test';

/** Check the basic, absolute, icon, inline, square, and circle layouts. */
async function verifiesCenterLayouts({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('/iframe.html?id=layout-center--basic');
  const basic = page.locator('#storybook-root .leverui-center');
  await expect(basic).toHaveCSS('width', '320px');
  await expect(basic).toHaveCSS('height', '100px');
  await expect(basic).toHaveCSS('background-color', 'rgb(228, 228, 231)');
  await expect(basic).toContainText('This will be centered');

  await page.goto('/iframe.html?id=layout-center--absolute');
  const absolute = page.locator('#storybook-root .leverui-absolute-center');
  const frame = page.locator('#storybook-root .center-example-absolute-frame');
  await expect(frame).toHaveCSS('position', 'relative');
  await expect(frame).toHaveCSS('height', '100px');
  await expect(frame).not.toHaveAttribute('style');
  await expect(absolute).toHaveCSS('width', '48px');
  await expect(absolute).toHaveCSS('height', '48px');
  await expect(absolute).toHaveCSS('background-color', 'rgb(255, 99, 71)');

  await page.goto('/iframe.html?id=layout-center--icons');
  const icons = page.locator('#storybook-root .leverui-center');
  await expect(icons).toHaveCount(2);
  await expect(icons.first()).toHaveCSS('width', '40px');
  await expect(icons.first()).toHaveCSS('color', 'rgb(17, 24, 39)');
  await expect(icons.last()).toContainText('1');
  await expect(icons.last().locator('.center-example-count')).toHaveCSS('font-weight', '700');

  await page.goto('/iframe.html?id=layout-center--inline');
  await expect(page.getByRole('link', { name: 'Visit Lever UI' })).toBeVisible();
  await expect(page.locator('#storybook-root .leverui-center')).toHaveCSS('gap', '16px');

  await page.goto('/iframe.html?id=layout-center--square');
  const square = page.locator('#storybook-root .leverui-square');
  await expect(square).toHaveCSS('width', '40px');
  await expect(square).toHaveCSS('height', '40px');
  await expect(square).toHaveCSS('background-color', 'rgb(100, 27, 163)');

  await page.goto('/iframe.html?id=layout-center--circle');
  const circle = page.locator('#storybook-root .leverui-circle');
  await expect(circle).toHaveCSS('width', '40px');
  await expect(circle).toHaveCSS('height', '40px');
  await expect(circle).toHaveCSS('border-radius', '9999px');
  await expect(circle).toHaveCSS('background-color', 'rgb(23, 61, 166)');
}

/** Verify that a Lucide icon renders visible SVG shapes in its Storybook example. */
async function expectLucideIcon(page: Page, story: string, name: string): Promise<void> {
  await page.goto(`/iframe.html?id=layout-center--${story}`);
  const icon = page.locator(`#storybook-root svg.lucide-${name}`).first();
  await expect(icon).toBeVisible();
  expect(await icon.locator('path, circle, rect, line, polyline').count()).toBeGreaterThan(0);
}

/** Match the Lucide icon choice across Center examples. */
async function verifiesCenterIcons({ page }: { page: Page }): Promise<void> {
  await expectLucideIcon(page, 'absolute', 'phone');
  await expectLucideIcon(page, 'icons', 'phone');
  await expectLucideIcon(page, 'inline', 'arrow-right');
  await expectLucideIcon(page, 'square', 'phone-forwarded');
  await expectLucideIcon(page, 'circle', 'phone-forwarded');
}

test('all six Center examples match layouts', verifiesCenterLayouts);
test('Center examples use visible Lucide icons', verifiesCenterIcons);
