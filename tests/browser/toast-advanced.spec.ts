import { expect, test, type Page } from '@playwright/test';

const storyPrefix = '/iframe.html?id=feedback-toast-advanced--';
const corners = [
  {
    story: 'top-start',
    placement: 'top-start',
    block: 'top',
    blockOffset: '24px',
    inline: 'left',
    inlineOffset: '24px',
  },
  {
    story: 'top-end',
    placement: 'top-end',
    block: 'top',
    blockOffset: '28px',
    inline: 'right',
    inlineOffset: '36px',
  },
  {
    story: 'bottom-start',
    placement: 'bottom-start',
    block: 'bottom',
    blockOffset: '24px',
    inline: 'left',
    inlineOffset: '24px',
  },
  {
    story: 'bottom-end',
    placement: 'bottom-end',
    block: 'bottom',
    blockOffset: '24px',
    inline: 'right',
    inlineOffset: '24px',
  },
] as const;

/** Verify each corner and both scalar and per-edge store offsets. */
async function verifiesCornersAndOffsets({ page }: { page: Page }): Promise<void> {
  for (const corner of corners) {
    await page.goto(`${storyPrefix}${corner.story}`);
    await page.getByTestId('advanced-create').click();
    const region = page.getByTestId('advanced-region');
    await expect(region).toHaveAttribute('data-placement', corner.placement);
    await expect(region).toHaveCSS(corner.block, corner.blockOffset);
    await expect(region).toHaveCSS(corner.inline, corner.inlineOffset);
    await expect(page.getByTestId('advanced-toast')).toBeVisible();
  }
}

test(
  'Toast places notifications at each corner with configured offsets',
  verifiesCornersAndOffsets,
);

/** Measure the distance between two mounted notification roots. */
async function toastSeparation(page: Page): Promise<number> {
  const roots = page.getByTestId('advanced-toast');
  await expect(roots).toHaveCount(2);
  await page.waitForTimeout(350);
  const first = await roots.nth(0).boundingBox();
  const second = await roots.nth(1).boundingBox();
  if (!first || !second) throw new Error('Both toast roots must have visible bounds.');
  return Math.abs(first.y - second.y);
}

/** Compare the default stack with the store's overlapping presentation. */
async function verifiesOverlap({ page }: { page: Page }): Promise<void> {
  await page.goto(`${storyPrefix}top-end`);
  await page.getByTestId('advanced-create').click();
  await page.getByTestId('advanced-create').click();
  await expect(page.getByTestId('advanced-toast').first()).toHaveAttribute('data-stack', '');
  const stackedDistance = await toastSeparation(page);

  await page.goto(`${storyPrefix}overlapping`);
  await page.getByTestId('advanced-create').click();
  await page.getByTestId('advanced-create').click();
  await expect(page.getByTestId('advanced-toast').first()).toHaveAttribute('data-overlap', '');
  const overlapDistance = await toastSeparation(page);
  expect(overlapDistance).toBeLessThan(stackedDistance);
}

test('Toast overlap changes the mounted stack geometry', verifiesOverlap);

/** Render the close control only when the store item requests it. */
async function verifiesClosable({ page }: { page: Page }): Promise<void> {
  await page.goto(`${storyPrefix}closable`);
  await page.getByTestId('advanced-create').click();
  await expect(page.getByTestId('advanced-close')).toBeVisible();
  await page.getByTestId('advanced-close').click();
  await expect(page.getByTestId('advanced-toast')).toHaveCount(0);

  await page.goto(`${storyPrefix}not-closable`);
  await page.getByTestId('advanced-create').click();
  await expect(page.getByTestId('advanced-toast')).toBeVisible();
  await expect(page.getByTestId('advanced-close')).toHaveCount(0);
}

test('Toast composition respects the closable option', verifiesClosable);

/** Keep each advanced notification within a 320px viewport. */
async function verifiesMobileBounds({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const corner of corners) {
    await page.goto(`${storyPrefix}${corner.story}`);
    await page.getByTestId('advanced-create').click();
    const bounds = await page.getByTestId('advanced-toast').boundingBox();
    if (!bounds) throw new Error('The notification needs measurable bounds.');
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  }
}

test('Toast advanced placements fit narrow viewports', verifiesMobileBounds);
