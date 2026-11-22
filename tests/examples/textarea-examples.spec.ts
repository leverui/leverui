import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'sizes',
  'variants',
  'size-matrix',
  'variant-matrix',
  'autoresize',
  'autoresize-max-rows',
  'error-text',
  'textarea-field',
  'form',
  'helper-text',
  'hook-form',
  'resize',
] as const;

/** Confirm every Textarea story mounts a native textarea. */
async function verifiesTextareaStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-textarea--${story}`);
    await expect(page.locator('#storybook-root textarea').first()).toBeVisible();
  }
}

/** Check the documented size, variant, and resize matrices. */
async function verifiesTextareaMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--size-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(5);
  await expect(page.locator('#storybook-root textarea')).toHaveCount(10);
  await page.goto('/iframe.html?id=components-textarea--variant-matrix');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-textarea--sizes');
  await expect(page.locator('#storybook-root textarea')).toHaveCount(5);
  await page.goto('/iframe.html?id=components-textarea--variants');
  await expect(page.locator('#storybook-root textarea')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-textarea--resize');
  await expect(page.locator('#storybook-root textarea')).toHaveCount(4);
}

/** Check auto growth and the four-row cap against native element heights. */
async function verifiesTextareaAutoresize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--autoresize');
  const growing = page.locator('#storybook-root textarea');
  const initialHeight = (await growing.boundingBox())?.height ?? 0;
  await growing.fill('One\nTwo\nThree\nFour\nFive\nSix');
  await expect
    .poll(
      /** Wait for Zag's scheduled resize frame before comparing heights. */
      async () => (await growing.boundingBox())?.height ?? 0,
    )
    .toBeGreaterThan(initialHeight);
  const grownHeight = (await growing.boundingBox())?.height ?? 0;

  await page.goto('/iframe.html?id=components-textarea--autoresize-max-rows');
  const capped = page.locator('#storybook-root textarea');
  await capped.fill('One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight');
  await expect
    .poll(
      /** Wait for the cap to settle after Zag measures the longer value. */
      async () => (await capped.boundingBox())?.height ?? 0,
    )
    .toBeLessThan(grownHeight);
}

/** Check Field context and native form validation. */
async function verifiesTextareaFields({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--field');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveCount(2);
  await expect(page.locator('#storybook-root input[required]')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-textarea--textarea-field');
  await expect(page.getByRole('textbox', { name: 'Comment' })).toHaveCount(2);
  await expect(page.locator('#storybook-root textarea[required]')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-textarea--error-text');
  await expect(page.locator('#storybook-root textarea[aria-invalid="true"]')).toHaveCount(2);
  await expect(page.getByText('A comment is required')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-textarea--helper-text');
  await expect(page.getByText('Max 500 characters.')).toHaveCount(2);
}

/** Check the form's two required messages and recovery. */
async function verifiesTextareaHookForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Username is required')).toBeVisible();
  await expect(page.getByText('Bio is required')).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).fill('person');
  await page.getByRole('textbox', { name: 'Profile bio' }).fill('I build interfaces.');
  await expect(page.getByText('Username is required')).toHaveCount(0);
  await expect(page.getByText('Bio is required')).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Profile bio' }).fill('');
  await expect(page.getByText('Bio is required')).toBeVisible();
}

test('Textarea stories render', verifiesTextareaStories);
test('Textarea matrices preserve dimensions', verifiesTextareaMatrices);
test('Textarea auto resize grows and caps its height', verifiesTextareaAutoresize);
test('Textarea Field examples preserve semantics', verifiesTextareaFields);
test('Textarea form validates required fields', verifiesTextareaHookForm);
