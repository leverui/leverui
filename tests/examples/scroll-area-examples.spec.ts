import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'both-directions',
  'horizontal',
  'scroll-to-position',
  'scroll-to-side',
  'stick-to-bottom',
  'virtualization',
  'rtl',
  'scroll-shadow',
  'sizes',
  'store',
  'thumb-styling',
  'variants',
] as const;

const viewport = '[data-scroll-area-viewport]';

/** Open one ScrollArea example in the gallery. */
async function openStory(page: Page, story: string): Promise<void> {
  await page.goto(`/iframe.html?id=layout-scrollarea--${story}`);
}

/** Confirm that every direct ScrollArea composition has a usable viewport. */
async function verifiesGallery({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await openStory(page, story);
    await expect(page.locator(viewport).first()).toBeVisible();
  }

  await openStory(page, 'with-menu');
  await page.getByRole('button', { name: 'Open menu with scroll' }).click();
  await expect(page.getByRole('menuitem')).toHaveCount(20);
  await expect(page.locator(viewport)).toBeVisible();
  // The menu element is the viewport. Its native scrollbar stays hidden behind the Scrollbar part.
  await expect(page.getByRole('menu')).toHaveCSS('scrollbar-width', 'none');
}

/** Check both programmatic controls against the source examples. */
async function verifiesControls({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'scroll-to-position');
  const positionViewport = page.locator(viewport);
  await page.getByRole('button', { name: 'Scroll to 200px' }).click();
  await expect(positionViewport).toHaveJSProperty('scrollTop', 200);

  await openStory(page, 'scroll-to-side');
  const sideViewport = page.locator(viewport);
  await page.getByRole('button', { name: 'Scroll to bottom' }).click();
  await expect(sideViewport).toHaveJSProperty('scrollTop', 520);
  await page.getByRole('button', { name: 'Scroll to top' }).click();
  await expect(sideViewport).toHaveJSProperty('scrollTop', 0);
}

/** Preserve the large virtual surface while rendering only nearby rows. */
async function verifiesVirtualization({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'virtualization');
  const virtualViewport = page.locator(viewport);
  await expect(virtualViewport).toHaveJSProperty('scrollHeight', 80_000);
  await expect(page.getByText('Item 1', { exact: true })).toBeVisible();
  expect(await page.locator('#storybook-root [style*="translateY"]').count()).toBeLessThan(20);
}

/** Check the RTL track position and scrollbar widths. */
async function verifiesVisualVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'rtl');
  const rtlRoot = page.locator('[data-scroll-area-root]');
  await expect(rtlRoot).toHaveAttribute('dir', 'rtl');
  const rtlTrack = rtlRoot.locator('[data-scroll-area-scrollbar]');
  await expect(rtlTrack).toHaveCSS('width', '6px');
  expect(await rtlTrack.boundingBox()).toMatchObject({ x: 58, width: 6 });

  await openStory(page, 'sizes');
  const tracks = page.locator('[data-scroll-area-scrollbar]');
  await expect(tracks).toHaveCount(4);
  for (const [index, width] of [4, 6, 8, 12].entries()) {
    await expect(tracks.nth(index)).toHaveCSS('width', `${width}px`);
  }
}

test('all ScrollArea examples render', verifiesGallery);
test('ScrollArea example controls move the viewport', verifiesControls);
test('ScrollArea virtualization renders only nearby rows', verifiesVirtualization);
test('ScrollArea RTL and size variants render', verifiesVisualVariants);
