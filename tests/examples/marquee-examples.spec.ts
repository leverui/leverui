import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'auto-fill',
  'reverse-direction',
  'vertical',
  'with-speed',
  'pause-on-interaction',
  'store',
  'finite-loops',
  'edges',
  'multiple',
  'diagonal',
  'news-ticker',
  'image-gallery',
  'testimonials',
  'rtl',
] as const;

/** Open a Marquee example in the isolated canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-marquee--${id}`);
}

/** Check every example mounts a scrolling component. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-marquee-root]')).not.toHaveCount(0);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Exercise external pause and resume through the shared Marquee store. */
async function verifiesStore({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'store');
  const pause = page.getByRole('button', { name: 'Pause' });
  const resume = page.getByRole('button', { name: 'Resume' });
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(resume).toBeVisible();
  await resume.click();
  await expect(pause).toBeVisible();
}

/** Verify the directional, edge, and localized gallery variants. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'auto-fill');
  await expect(page.getByRole('img', { name: 'Northwind' }).first()).toBeVisible();

  await openStory(page, 'edges');
  await expect(page.locator('[data-marquee-edge]')).toHaveCount(2);

  await openStory(page, 'vertical');
  await expect(page.locator('[data-marquee-root]')).toHaveAttribute('data-orientation', 'vertical');

  await openStory(page, 'rtl');
  await expect(page.getByText('مرحبا بكم').first()).toBeVisible();
}

test('all Marquee examples render', verifiesInventory);
test('Marquee store pauses and resumes', verifiesStore);
test('Marquee edge, vertical, and Arabic variants render', verifiesVariants);
