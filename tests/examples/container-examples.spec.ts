import { expect, test, type Page } from '@playwright/test';

/** Check regular, sized, and fluid Container layouts. */
async function verifiesContainerLayouts({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('/iframe.html?id=layout-container--basic');
  const basic = page.locator('#storybook-root .lui-container');
  await expect(basic).toHaveCSS('max-width', '1440px');
  await expect(basic).toHaveCSS('padding-left', '32px');
  await expect(basic).toContainText('This text sits inside a container.');
  await expect(basic.locator('.container-example-pattern')).toHaveCSS(
    'background-image',
    /data:image\/svg\+xml/,
  );

  await page.goto('/iframe.html?id=layout-container--sizes');
  const sizes = page.locator('#storybook-root .lui-container');
  await expect(sizes).toHaveCount(4);
  for (const [index, width] of ['384px', '448px', '576px', '672px'].entries()) {
    await expect(sizes.nth(index)).toHaveCSS('max-width', width);
    await expect(sizes.nth(index)).toHaveCSS('padding-left', '8px');
  }

  await page.goto('/iframe.html?id=layout-container--fluid');
  const fluid = page.locator('#storybook-root .lui-container');
  await expect(fluid).toHaveCSS('max-width', '100%');
  await expect(fluid).toHaveCSS('padding-left', '32px');
  await expect(fluid).toContainText('This text sits inside a container.');
}

test('all three Container examples match widths', verifiesContainerLayouts);
