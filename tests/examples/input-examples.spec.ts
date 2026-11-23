import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'variants',
  'card-details',
  'card-number',
  'character-counter',
  'clear-button',
  'end-addon',
  'end-button',
  'end-icon',
  'end-text',
  'error-text',
  'field',
  'floating-label',
  'focus-error-color',
  'helper-text',
  'hook-form',
  'kbd',
  'mask',
  'select',
  'start-addon',
  'start-and-end-addon',
  'start-and-end-text',
  'start-element-end-addon',
  'start-icon',
  'start-text',
  'disabled',
  'placeholder-style',
  'size-matrix',
  'variant-matrix',
] as const;

/** Open one curated Input story. */
export async function openInputStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-input--${id}`);
}

/** Build a check that one named story renders a native text field. */
function verifiesStory(id: (typeof storyIds)[number]) {
  /** Open the story and wait for its first input. */
  return async ({ page }: { page: Page }): Promise<void> => {
    await openInputStory(page, id);
    await expect(page.locator('input').first()).toBeVisible();
  };
}

/** Compare every size and variant row with the table. */
async function verifiesMatrices({ page }: { page: Page }): Promise<void> {
  await openInputStory(page, 'sizes');
  await expect(page.locator('#storybook-root input')).toHaveCount(4);
  await openInputStory(page, 'variants');
  await expect(page.locator('#storybook-root input')).toHaveCount(3);
  await openInputStory(page, 'size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(7);
  await expect(page.locator('#storybook-root tbody input')).toHaveCount(14);
  await openInputStory(page, 'variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(4);
  await expect(page.locator('#storybook-root tbody input')).toHaveCount(4);
  await expect(page.getByText('unstyled')).toBeVisible();
}

/** Check the inline and attached adornment combinations. */
async function verifiesAdornments({ page }: { page: Page }): Promise<void> {
  await openInputStory(page, 'end-addon');
  await expect(page.getByText('.com')).toBeVisible();
  await openInputStory(page, 'end-text');
  await expect(page.getByText('.com')).toBeVisible();
  await openInputStory(page, 'start-addon');
  await expect(page.getByText('https://')).toBeVisible();
  await openInputStory(page, 'start-and-end-addon');
  await expect(page.getByText('$')).toBeVisible();
  await expect(page.getByText('USD')).toBeVisible();
  await openInputStory(page, 'start-and-end-text');
  await expect(page.getByText('USD')).toBeVisible();
  await openInputStory(page, 'start-element-end-addon');
  await expect(page.getByText('USD')).toBeVisible();
  await openInputStory(page, 'end-button');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await openInputStory(page, 'start-text');
  await expect(page.getByText('https://')).toBeVisible();
  await openInputStory(page, 'start-icon');
  await expect(page.locator('.lui-input-group .lucide-user')).toBeVisible();
  await openInputStory(page, 'end-icon');
  await expect(page.locator('.lui-input-group .lucide-mail')).toBeVisible();
  await openInputStory(page, 'kbd');
  await expect(page.getByText('⌘K')).toBeVisible();
}

/** Check Field copy and the custom error focus tokens. */
async function verifiesFields({ page }: { page: Page }): Promise<void> {
  await openInputStory(page, 'field');
  await expect(page.locator('input')).toHaveCount(2);
  await openInputStory(page, 'error-text');
  await expect(page.getByText('This field is required')).toBeVisible();
  await openInputStory(page, 'helper-text');
  await expect(page.getByText("We'll never share your email.")).toBeVisible();
  await openInputStory(page, 'focus-error-color');
  await expect(page.locator('input')).toHaveCount(6);
  await expect(page.getByPlaceholder('Focus me').first()).toHaveCSS(
    '--lui-input-focus-color',
    'lime',
  );
}

for (const id of storyIds) test(`Input ${id} example renders`, verifiesStory(id));
test('Input size and variant tables render', verifiesMatrices);
test('Input adornment examples render', verifiesAdornments);
test('Input Field and focus examples render', verifiesFields);
