import { expect, test, type Page } from '@playwright/test';

/** Verify custom marker labels and the actual dragging value indicator. */
async function verifiesSliderGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider--guide');
  const thumb = page.getByRole('slider', { name: 'Guide value' });
  await expect(thumb).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  for (const label of ['Low', 'Medium', 'High']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.locator('.lui-slider__markerIndicator')).toHaveCount(3);
  const colors = await page.locator('.lui-slider__markerLabel').evaluateAll(
    /** Verify that custom labels resolve to distinct palette colors. */
    (labels) => labels.map((label) => getComputedStyle(label).color),
  );
  expect(new Set(colors).size).toBe(3);

  const bubble = page.getByTestId('slider-drag-value');
  await expect(bubble).not.toBeVisible();
  const start = await thumb.boundingBox();
  const control = await page.getByTestId('slider-guide-control').boundingBox();
  expect(start).not.toBeNull();
  expect(control).not.toBeNull();
  if (!start || !control) return;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(control.x + control.width * 0.7, start.y + start.height / 2, {
    steps: 5,
  });
  await expect(bubble).toBeVisible();
  await expect(bubble).toContainText(/\d+/);
  await expect(thumb).not.toHaveAttribute('aria-valuenow', '40');
  await page.mouse.up();
  await expect(bubble).not.toBeVisible();
}

test('Slider composes custom marker labels and dragging indicator', verifiesSliderGuide);
