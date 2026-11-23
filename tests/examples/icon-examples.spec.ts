import { expect, test, type Page } from '@playwright/test';

const stories = ['basic', 'as-prop', 'create-icon', 'custom-svg', 'solid-component', 'sizes'];

/** Verify all six Icon examples render without preview errors. */
async function verifiesIconStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-icon--${story}`);
    await expect(page.locator('#storybook-root svg').first()).toBeVisible();
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check SVG ownership and all six sizes. */
async function verifiesIconComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-icon--basic');
  await expect(page.locator('#storybook-root svg')).toHaveCSS('color', 'rgb(164, 23, 82)');

  for (const story of ['basic', 'solid-component']) {
    await page.goto(`/iframe.html?id=components-icon--${story}`);
    await expect(page.locator('#storybook-root svg')).toHaveCount(1);
    await expect(page.locator('#storybook-root svg')).toHaveAttribute(
      'viewBox',
      /0 0 (16|20|24) (16|20|24)/,
    );
  }
  await page.goto('/iframe.html?id=components-icon--as-prop');
  await expect(page.locator('#storybook-root svg')).toHaveCount(1);
  await page.goto('/iframe.html?id=components-icon--custom-svg');
  await expect(page.locator('#storybook-root svg[viewBox="0 0 32 32"]')).toHaveCount(1);
  await page.goto('/iframe.html?id=components-icon--sizes');
  await expect(page.locator('#storybook-root .lui-icon')).toHaveCount(6);
  await expect(page.locator('#storybook-root svg')).toHaveCount(6);
  await expect(page.locator('#storybook-root p')).toHaveText(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);
  await expect(page.locator('#storybook-root p').first()).toHaveCSS('font-size', '14px');
}

test('all six Icon examples render', verifiesIconStories);
test('Icon custom SVG and sizes preserve the structure', verifiesIconComposition);
