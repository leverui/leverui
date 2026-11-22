import { expect, test, type Page } from '@playwright/test';

/** Verify keyboard and pointer updates reach the controlled value and form. */
async function verifiesSliderSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider--contract');
  const thumb = page.getByRole('slider', { name: 'Volume' });
  await expect(thumb).toHaveAttribute('aria-valuenow', '30', { timeout: 30_000 });
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '35');
  await expect(page.getByTestId('slider-value')).toHaveText('35');
  expect(
    await page.getByTestId('slider-form').evaluate(
      /** Read the native submitted value, not the displayed output. */
      (form) => new FormData(form as HTMLFormElement).get('volume'),
    ),
  ).toBe('35');
  const control = page.getByTestId('slider-control');
  const bounds = await control.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;
  await page.mouse.click(bounds.x + bounds.width * 0.8, bounds.y + bounds.height / 2);
  await expect(thumb).toHaveAttribute('aria-valuenow', '80');
}

test('Slider changes a native form value with keyboard and pointer', verifiesSliderSelection);

/** Keep the machine root stable while size and variant change reactively. */
async function verifiesSliderCssChoices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider--contract');
  const root = page.getByTestId('slider-root');
  const thumb = page.getByTestId('slider-thumb');
  await expect(root).toHaveClass(/leverui-slider__root/, { timeout: 30_000 });
  const before = await thumb.evaluate(
    /** Read the applied CSS width before the live update. */
    (element) => getComputedStyle(element).width,
  );
  await root.evaluate(
    /** Mark the mounted root so a replacement becomes observable. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('slider-appearance-toggle').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  const after = await thumb.evaluate(
    /** Read the current width after the size and variant change. */
    (element) => getComputedStyle(element).width,
  );
  expect(after).not.toBe(before);
  await expect(thumb).toHaveAttribute('aria-valuenow', '30');
}

test('Slider changes CSS variants without replacing selection', verifiesSliderCssChoices);

/** Cover generated range thumbs, vertical orientation, and disabled state. */
async function verifiesSliderStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider--range');
  const thumbs = page.getByRole('slider');
  await expect(thumbs).toHaveCount(2, { timeout: 30_000 });
  await expect(page.getByText('Middle')).toBeVisible();
  await thumbs.first().focus();
  await thumbs.first().press('End');
  await expect(thumbs.first()).toHaveAttribute('aria-valuenow', '70');

  await page.goto('/iframe.html?id=components-slider--states');
  const vertical = page.getByRole('slider', { name: 'Vertical' });
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical', { timeout: 30_000 });
  const disabled = page.getByRole('slider', { name: 'Disabled' });
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await disabled.press('ArrowRight');
  await expect(disabled).toHaveAttribute('aria-valuenow', '35');
  const readonly = page.getByRole('slider', { name: 'Readonly' });
  await readonly.focus();
  await readonly.press('ArrowRight');
  await expect(readonly).toHaveAttribute('aria-valuenow', '45');
  const readonlyControl = await page.getByTestId('slider-readonly-control').boundingBox();
  expect(readonlyControl).not.toBeNull();
  if (!readonlyControl) return;
  await page.mouse.click(
    readonlyControl.x + readonlyControl.width * 0.8,
    readonlyControl.y + readonlyControl.height / 2,
  );
  await expect(readonly).toHaveAttribute('aria-valuenow', '45');
  const provider = page.getByTestId('slider-provider-root');
  await expect(provider).toHaveAttribute('data-orientation', 'vertical');
  await expect(provider).not.toHaveAttribute('orientation');
  await expect(page.getByText('External middle')).toBeVisible();
  const direction = await page.getByTestId('slider-provider-control').evaluate(
    /** Inspect the browser's applied CSS direction. */
    (element) => getComputedStyle(element).flexDirection,
  );
  expect(direction).toBe('column');
  const markerDirection = await provider
    .locator('.leverui-slider__marker')
    .first()
    .evaluate(
      /** Ensure vertical marks receive their corresponding CSS orientation. */
      (element) => getComputedStyle(element).flexDirection,
    );
  expect(markerDirection).toBe('row');
  const external = page.getByRole('slider', { name: 'External' });
  await expect(external).toHaveAttribute('aria-orientation', 'vertical');
  await expect(external).toHaveAttribute('aria-valuenow', '40');
  await external.focus();
  await external.press('ArrowUp');
  await expect(external).toHaveAttribute('aria-valuenow', '41');
  await external.press('ArrowRight');
  await expect(external).toHaveAttribute('aria-valuenow', '41');
}

test(
  'Slider preserves range, orientation, disabled, and external-machine behavior',
  verifiesSliderStates,
);
