import { expect, test, type Page } from '@playwright/test';

test.setTimeout(180_000);

const storyCounts = [
  ['basic', 1],
  ['sizes', 5],
  ['variants', 6],
  ['disabled', 1],
  ['disabled-link', 1],
  ['group', 2],
  ['group-flushed', 2],
  ['icon-composition', 1],
  ['icon', 2],
  ['loading', 2],
  ['loading-toggle', 1],
  ['custom-spinner', 1],
  ['spinner-placement', 2],
  ['split-menu', 2],
  ['radius', 9],
  ['responsive-size', 1],
  ['style-overrides', 1],
] as const;

/** Ensure every Button story renders its expected controls. */
async function verifiesButtonGallery({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [story, count] of storyCounts) {
    await page.goto(`/iframe.html?id=components-button--${story}`);
    await expect(
      page.locator('#storybook-root button, #storybook-root a[data-disabled]'),
    ).toHaveCount(count, { timeout: 45_000 });
  }
}

/** Verify sizing, native disabled behavior, and SVG composition. */
async function verifiesButtonGeometry({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-button--basic');
  const basic = page.getByRole('button', { name: 'Button' });
  await expect(basic).toHaveCSS('background-color', 'rgb(24, 24, 27)');
  await expect
    .poll(
      /** Wait for the gallery stylesheet and font to settle before measuring. */
      async () => (await basic.boundingBox())?.width,
      { timeout: 15_000 },
    )
    .toBeCloseTo(78.85, 1);
  const basicBounds = await basic.boundingBox();
  expect(basicBounds?.height).toBe(40);

  await page.goto('/iframe.html?id=components-button--disabled');
  await expect(page.getByRole('button', { name: 'Button' })).toBeDisabled();
  await page.goto('/iframe.html?id=components-button--disabled-link');
  await expect(page.getByRole('link', { name: 'Button' })).toHaveAttribute('data-disabled');

  await page.goto('/iframe.html?id=components-button--icon-composition');
  const icons = page.locator('#storybook-root button > span.lui-icon');
  await expect(icons).toHaveCount(2);
  await expect(page.locator('#storybook-root button svg svg')).toHaveCount(0);
  for (const icon of await icons.all()) {
    const bounds = await icon.boundingBox();
    expect([bounds?.width, bounds?.height]).toEqual([20, 20]);
  }

  await page.goto('/iframe.html?id=components-button--style-overrides');
  const override = await page.getByRole('button', { name: 'Button' }).boundingBox();
  expect([override?.width, override?.height]).toEqual([200, 48]);
}

/** Verify the medium breakpoint changes Button height. */
async function verifiesResponsiveButton({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=components-button--responsive-size');
  const button = page.getByRole('button', { name: 'Button' });
  const narrow = await button.boundingBox();
  expect(narrow?.height).toBe(40);
  await page.setViewportSize({ width: 1280, height: 720 });
  const wide = await button.boundingBox();
  expect(wide?.height).toBe(44);
}

test('all 17 Button stories render their controls', verifiesButtonGallery);
test('Button sizes and SVG composition match their measurements', verifiesButtonGeometry);
test('Button responsive size follows breakpoints', verifiesResponsiveButton);
