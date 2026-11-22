import { expect, test, type Page } from '@playwright/test';

/** Check the marker positions for the four offset stories. */
async function verifiesFloatOffsets({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [story, x, y] of [
    ['basic', 126, 46],
    ['offset-x', 142, 46],
    ['offset-y', 126, 30],
    ['offset', 110, 62],
  ] as const) {
    await page.goto(`/iframe.html?id=components-float--${story}`);
    const surface = page.locator('#storybook-root .float-example-surface');
    await expect(surface).toHaveCSS('position', 'relative');
    await expect(surface).toHaveCSS('width', '80px');
    await expect(surface).toHaveCSS('height', '80px');
    await expect(surface).toHaveCSS('background-color', 'rgb(228, 228, 231)');
    await expect(surface).not.toHaveAttribute('style');
    const marker = page.locator('#storybook-root .leverui-float');
    await expect(marker).toBeVisible();
    const bounds = await marker.boundingBox();
    expect([bounds?.x, bounds?.y, bounds?.width, bounds?.height]).toEqual([x, y, 20, 20]);
  }
}

/** Check the nine placements and their reference-relative offsets. */
async function verifiesFloatPlacements({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-float--placements');
  const markers = page.locator('#storybook-root .leverui-float');
  await expect(markers).toHaveCount(9);
  for (const [index, [x, y]] of [
    [70, 70],
    [-10, 70],
    [70, -10],
    [-10, -10],
    [40, 70],
    [40, -10],
    [40, 40],
    [70, 40],
    [-10, 40],
  ].entries()) {
    const marker = await markers.nth(index).boundingBox();
    const surface = await markers.nth(index).locator('xpath=..').boundingBox();
    if (!marker || !surface) {
      throw new Error(`Float placement ${index} has no measurable surface`);
    }
    expect([marker.x - surface.x, marker.y - surface.y]).toEqual([x, y]);
  }
}

/** Check the avatar and attached badge measurements. */
async function verifiesFloatAvatar({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-float--avatar');
  const image = page.locator('#storybook-root img');
  const badge = page.locator('#storybook-root .leverui-float');
  await expect(image).toBeVisible();
  await expect(badge).toContainText('New');
  await expect(page.locator('#storybook-root .float-example-avatar-host')).toHaveCSS(
    'display',
    'inline-block',
  );
  await expect(page.locator('#storybook-root .float-example-avatar-host')).toHaveCSS(
    'position',
    'relative',
  );
  const imageBounds = await image.boundingBox();
  const badgeBounds = await badge.boundingBox();
  expect([imageBounds?.width, imageBounds?.height]).toEqual([44, 44]);
  expect(badgeBounds?.height).toBe(20);
}

test('Float offset examples match positions', verifiesFloatOffsets);
test('Float placement examples match offsets', verifiesFloatPlacements);
test('Float avatar example matches measurements', verifiesFloatAvatar);
