import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 3,
  feed: 4,
  text: 3,
  'text-with-children': 6,
  'with-children': 2,
  'with-loaded': 1,
  'start-end-color': 1,
  variants: 2,
} as const;

/** Confirm all eight Skeleton examples render their placeholder counts. */
async function verifiesSkeletonStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-skeleton--${story}`);
    await expect(page.locator('#storybook-root .leverui-skeleton')).toHaveCount(count);
  }
}

/** Verify that the loaded example reveals its text on demand. */
async function verifiesLoadedTransition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-skeleton--with-loaded');
  await expect(page.getByText('Your report is ready')).toBeHidden();
  await page.getByRole('button', { name: 'Toggle' }).click();
  await expect(page.getByText('Your report is ready')).toBeVisible();
}

/** Keep a composed child's loading paint while allowing CSS theme overrides. */
async function verifiesComposedSurface({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-skeleton--with-children');
  await expect(page.locator('#storybook-root .leverui-skeleton').first()).toHaveCSS(
    'color',
    'rgba(0, 0, 0, 0)',
  );
  await expect(page.locator('#storybook-root .leverui-skeleton').first()).toHaveCSS(
    'background-color',
    'rgb(228, 228, 231)',
  );
  await expect(page.locator('#storybook-root .leverui-skeleton').last()).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  await page.addStyleTag({
    content: '.leverui-skeleton { --leverui-skeleton-bg: rgb(10, 20, 30); }',
  });
  await expect(page.locator('#storybook-root .leverui-skeleton').first()).toHaveCSS(
    'background-color',
    'rgb(10, 20, 30)',
  );
}

/** Keep the configured shine gradient on a loading placeholder. */
async function verifiesShineSurface({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-skeleton--start-end-color');
  await expect(page.locator('#storybook-root .leverui-skeleton')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
}

test('all eight Skeleton examples render', verifiesSkeletonStories);
test('Skeleton reveals loaded content after toggling', verifiesLoadedTransition);
test('Skeleton loading paint survives composition and CSS overrides', verifiesComposedSurface);
test('Skeleton shine renders its gradient', verifiesShineSurface);
