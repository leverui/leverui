import { expect, test, type Page } from '@playwright/test';

/** Verify the ratios, media wrappers, and responsive frame. */
async function verifiesAspectRatioExamples({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });

  for (const [story, width, height, child] of [
    ['basic', 1216, 684, 'div'],
    ['responsive', 300, 168.75, 'div'],
    ['image', 400, 300, 'img'],
    ['map', 1216, 684, 'iframe'],
    ['video', 560, 560, 'iframe'],
  ] as const) {
    await page.goto(`/iframe.html?id=layout-aspectratio--${story}`);
    const ratio = page.locator('#storybook-root .lui-aspect-ratio');
    await expect(ratio).toBeVisible();
    const bounds = await ratio.boundingBox();
    expect(bounds?.width).toBe(width);
    expect(bounds?.height).toBe(height);
    await expect(ratio.locator(child)).toBeVisible();
  }

  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=layout-aspectratio--responsive');
  const narrow = page.locator('#storybook-root .lui-aspect-ratio');
  await expect(narrow).toBeVisible();
  const bounds = await narrow.boundingBox();
  expect(bounds?.width).toBe(300);
  expect(bounds?.height).toBe(300);
}

test('all five AspectRatio examples match geometry', verifiesAspectRatioExamples);
