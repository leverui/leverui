import { expect, test, type Page } from '@playwright/test';

/** Check the rendered structure of all five AbsoluteCenter stories. */
async function verifiesAbsoluteCenterLayouts({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('/iframe.html?id=layout-absolutecenter--basic');
  const basic = page.locator('#storybook-root .leverui-absolute-center');
  await expect(basic).toBeVisible();
  await expect(basic).toHaveCSS('position', 'absolute');
  await expect(basic).toContainText('Centered content');

  await page.goto('/iframe.html?id=layout-absolutecenter--with-axis');
  const axes = page.locator('#storybook-root .leverui-absolute-center');
  await expect(axes).toHaveCount(3);
  await expect(axes.nth(0)).toContainText('horizontal');
  await expect(axes.nth(1)).toContainText('vertical');
  await expect(axes.nth(2)).toContainText('both');

  await page.goto('/iframe.html?id=layout-absolutecenter--with-content');
  const content = page.locator('#storybook-root .leverui-absolute-center');
  await expect(content).toHaveCSS('width', '44px');
  await expect(content.locator('.lucide-heart')).toBeVisible();

  await page.goto('/iframe.html?id=layout-absolutecenter--with-overlay');
  const overlay = page.locator('#storybook-root .leverui-absolute-center');
  await expect(overlay).toContainText('Loading...');
  await expect(overlay).toHaveCSS('backdrop-filter', 'blur(2px)');

  await page.goto('/iframe.html?id=layout-absolutecenter--with-rtl');
  const rtl = page.locator('#storybook-root [dir="rtl"]');
  await expect(rtl).toHaveCount(3);
  await expect(page.locator('#storybook-root .leverui-absolute-center')).toHaveCount(3);
}

/** Preserve the centered heart icon and default-sized red badge. */
async function verifiesAbsoluteCenterHeart({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=layout-absolutecenter--with-content');
  const badge = page.locator('#storybook-root .absolute-center-gallery-heart');
  const icon = badge.locator('.lucide-heart');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  await expect(badge.locator('svg')).toHaveCount(1);
  await expect(badge).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  const badgeBounds = await badge.boundingBox();
  const iconBounds = await icon.boundingBox();
  if (!badgeBounds || !iconBounds) throw new Error('Missing AbsoluteCenter heart bounds.');
  expect(badgeBounds.width).toBe(44);
  expect(badgeBounds.height).toBe(44);
  expect(Math.abs(iconBounds.width - 20)).toBeLessThan(1);
  expect(Math.abs(iconBounds.height - 20)).toBeLessThan(1);
}

/** Keep the gallery's Box surfaces on authored, overridable CSS. */
async function verifiesAuthoredBoxCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-absolutecenter--basic');
  const panel = page.locator('#storybook-root .absolute-center-gallery-panel');
  await expect(panel).toHaveCSS('position', 'relative');
  await expect(panel).toHaveCSS('height', '100px');
  await expect(panel).not.toHaveAttribute('style', /.+/);
  const lightBackground = await panel.evaluate(
    /** Read the semantic panel color before the global mode changes. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.goto('/iframe.html?id=layout-absolutecenter--basic&globals=theme:dark');
  const darkPanel = page.locator('#storybook-root .absolute-center-gallery-panel');
  await expect(darkPanel).not.toHaveCSS('background-color', lightBackground);
  await page.addStyleTag({
    content: '.absolute-center-gallery-panel { background: rgb(1, 2, 3); }',
  });
  await expect(darkPanel).toHaveCSS('background-color', 'rgb(1, 2, 3)');
}

test(
  'all five AbsoluteCenter examples retain their layout structure',
  verifiesAbsoluteCenterLayouts,
);
test('AbsoluteCenter heart keeps badge geometry', verifiesAbsoluteCenterHeart);
test('AbsoluteCenter Box surfaces use overridable authored CSS', verifiesAuthoredBoxCss);
