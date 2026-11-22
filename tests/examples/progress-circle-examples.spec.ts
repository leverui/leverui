import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  indeterminate: 1,
  colors: 30,
  'range-color': 1,
  'round-cap': 1,
  sizes: 5,
  'custom-thickness': 1,
  'value-text': 3,
} as const;

/** Verify the SVG progressbar count in every story. */
async function verifiesCircleStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-progress-circle--${story}`);
    await expect(page.locator('#storybook-root svg[role="progressbar"]')).toHaveCount(count);
  }
}

/** Check indeterminate state, rounded ends, and centered values. */
async function verifiesCircleStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-progress-circle--indeterminate');
  await expect(page.locator('#storybook-root svg[role="progressbar"]')).toHaveAttribute(
    'data-state',
    'indeterminate',
  );
  await page.goto('/iframe.html?id=components-progress-circle--round-cap');
  await expect(page.locator('#storybook-root circle').last()).toHaveCSS('stroke-linecap', 'round');
  await page.goto('/iframe.html?id=components-progress-circle--range-color');
  await expect(page.locator('#storybook-root circle').last()).toHaveCSS(
    'stroke',
    'rgb(255, 165, 0)',
  );
  await page.goto('/iframe.html?id=components-progress-circle--custom-thickness');
  await expect(page.locator('#storybook-root circle').first()).toHaveCSS('stroke-width', '2px');
  await page.goto('/iframe.html?id=components-progress-circle--value-text');
  await expect(page.locator('#storybook-root .leverui-progress-circle__valueText')).toHaveText([
    '5%',
    '5%',
    '5%',
  ]);
}

test('all eight Progress Circle examples render', verifiesCircleStories);
test('Progress Circle preserves indeterminate and formatted states', verifiesCircleStates);
