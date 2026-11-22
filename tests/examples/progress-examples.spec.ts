import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  composition: 3,
  sizes: 4,
  variants: 2,
  indeterminate: 1,
  'size-matrix': 50,
  'variant-matrix': 60,
  'animated-stripes': 1,
  colors: 20,
  'inline-label': 1,
  label: 1,
  'label-info': 1,
  stripes: 1,
} as const;

/** Verify every Progress story renders its expected tracks. */
async function verifiesProgressStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-progress--${story}`);
    await expect(page.locator('#storybook-root .leverui-progress__track')).toHaveCount(count);
  }
}

/** Check labels, matrix dimensions, and the information popover. */
async function verifiesProgressComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-progress--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
  await page.goto('/iframe.html?id=components-progress--composition');
  await expect(page.locator('#storybook-root .leverui-progress__label')).toHaveText([
    'Private users',
    'Editors',
    'Projects',
  ]);
  await page.goto('/iframe.html?id=components-progress--label-info');
  await page.getByRole('button', { name: 'info' }).click();
  await expect(page.getByText('Your document is uploading to the server.')).toBeVisible();
}

test('all thirteen Progress examples render', verifiesProgressStories);
test('Progress matrices, composition, and popover preserve behavior', verifiesProgressComposition);
