import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  'custom-color': 1,
  sizes: 5,
  colors: 30,
  'size-matrix': 6,
  'custom-speed': 1,
  'custom-thickness': 1,
  'custom-indicator': 1,
  'track-color': 1,
  label: 1,
  overlay: 1,
} as const;

/** Confirm that every spinner example renders the count. */
async function verifiesSpinnerStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-spinner--${story}`);
    await expect(page.locator('#storybook-root .leverui-spinner')).toHaveCount(count);
    await expect(
      page.locator('#storybook-root .leverui-spinner[data-leverui-private-style-runtime]'),
    ).toHaveCount(0);
  }
}

/** Check the custom indicator and busy overlay at their DOM boundaries. */
async function verifiesSpinnerComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-spinner--custom-indicator');
  const indicator = page.locator('#storybook-root .leverui-spinner');
  await expect(indicator.locator('svg.lucide-loader')).toHaveCount(1);
  await expect(indicator).toHaveCSS('width', '20px');
  await expect(indicator.locator('svg')).toHaveCSS('width', '20px');
  await page.goto('/iframe.html?id=components-spinner--overlay');
  await expect(page.locator('#storybook-root [aria-busy="true"]')).toHaveCount(1);
  await expect(page.locator('#storybook-root h2')).toHaveText('Weekly sales report');
}

test('all eleven Spinner examples render', verifiesSpinnerStories);
test('Spinner custom glyph and busy overlay preserve composition', verifiesSpinnerComposition);

/** Verify gallery color, track, and ring choices come from consumer CSS. */
async function verifiesSpinnerCssChoices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-spinner--custom-color');
  await expect(page.locator('#storybook-root .leverui-spinner')).toHaveCSS(
    'color',
    'rgb(20, 184, 166)',
  );
  await page.goto('/iframe.html?id=components-spinner--track-color');
  await expect(page.locator('#storybook-root .leverui-spinner')).toHaveCSS(
    'border-bottom-color',
    'rgb(228, 228, 231)',
  );
  await page.goto('/iframe.html?id=components-spinner--custom-thickness');
  await expect(page.locator('#storybook-root .leverui-spinner')).toHaveCSS(
    'border-top-width',
    '4px',
  );
}

test('Spinner gallery choices use consumer CSS', verifiesSpinnerCssChoices);
