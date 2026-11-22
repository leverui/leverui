import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'basic-example',
  'controlled',
  'emoji',
  'testimonial',
  'sizes',
  'colors',
  'custom-icon',
  'half',
  'hook-form',
  'read-only',
  'store',
  'label',
  'size-matrix',
] as const;

/** Require every Rating story to mount its radio group. */
async function verifiesEveryRatingStory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-rating--${id}`);
    await expect(page.getByRole('radiogroup').first()).toBeVisible();
  }
}

/** Check basic, controlled, half, read-only, and store state. */
async function verifiesRatingState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating--basic');
  await expect(page.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.getByRole('radio', { name: '4 stars' }).click();
  await expect(page.getByRole('radio', { name: '4 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await page.goto('/iframe.html?id=components-rating--controlled');
  await page.getByRole('radio', { name: '5 stars' }).click();
  await expect(page.getByRole('radio', { name: '5 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await page.goto('/iframe.html?id=components-rating--half');
  // Zag 2 names an item holding a half value by that value.
  await expect(page.getByRole('radio', { name: '3.5 stars' }).locator('[data-half]')).toHaveCount(
    1,
  );

  await page.goto('/iframe.html?id=components-rating--read-only');
  await page.getByRole('radio', { name: '5 stars' }).click({ force: true });
  await expect(page.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await page.goto('/iframe.html?id=components-rating--store');
  await expect(page.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
}

/** Check the emoji and heart item compositions. */
async function verifiesCustomItems({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating--emoji');
  await expect(page.getByText('😍')).toBeVisible();
  await page.getByText('😍').click();
  await expect(page.getByRole('radio', { name: '5 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );

  await page.goto('/iframe.html?id=components-rating--custom-icon');
  await expect(page.getByRole('radio')).toHaveCount(5);
  await expect(page.getByRole('radio').first().locator('svg')).toHaveCount(2);
  // The example's heart comes from Lucide, since solid-icons has no Solid 2 build.
  await expect(page.getByRole('radio').first().locator('svg').first()).toHaveAttribute(
    'viewBox',
    '0 0 24 24',
  );
}

/** Verify all color and size combinations render. */
async function verifiesRatingMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating--colors');
  await expect(page.getByRole('radiogroup')).toHaveCount(10);

  await page.goto('/iframe.html?id=components-rating--sizes');
  await expect(page.getByRole('radiogroup')).toHaveCount(4);

  await page.goto('/iframe.html?id=components-rating--size-matrix');
  await expect(page.getByRole('radiogroup')).toHaveCount(40);
  await expect(page.locator('#storybook-root table > thead > tr')).toHaveCount(1);
  await expect(page.locator('#storybook-root table > tbody > tr')).toHaveCount(10);
}

/** Submit a selected rating and show required validation when empty. */
async function verifiesRatingForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating--hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Rating is required')).toBeVisible();
  await page.getByRole('radio', { name: '4 stars' }).click();
  await expect(page.getByText('Rating is required')).not.toBeVisible();
  const value = await page.locator('form').evaluate(
    /** Read the native input value submitted by the form. */
    (form) => new FormData(form as HTMLFormElement).get('rating'),
  );
  expect(value).toBe('4');
}

/** Check the testimonial copy and visible label. */
async function verifiesRatingCompositions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating--testimonial');
  await expect(page.getByText('Oskar Brandt')).toBeVisible();
  await expect(page.getByText(/Rafe rebuilt our checkout in two weeks/)).toBeVisible();

  await page.goto('/iframe.html?id=components-rating--label');
  await expect(page.getByText('Rating', { exact: true })).toBeVisible();
}

test('all Rating stories render', verifiesEveryRatingStory);
test('Rating basic and controlled states work', verifiesRatingState);
test('Rating emoji and custom icon work', verifiesCustomItems);
test('Rating color and size matrices render', verifiesRatingMatrices);
test('Rating form validates and submits', verifiesRatingForm);
test('Rating testimonial and label render', verifiesRatingCompositions);
