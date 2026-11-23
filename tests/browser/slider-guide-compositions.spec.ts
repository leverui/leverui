import { expect, test, type Page } from '@playwright/test';
import { sliderGuideFormValue } from './slider-guide-form-value';

/** Check five public palette choices resolve to distinct range colors. */
async function verifiesPalettes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-compositions--palettes');
  const colors: string[] = [];
  for (const palette of ['gray', 'blue', 'red', 'green', 'pink']) {
    const root = page.getByTestId(`slider-palette-${palette}`);
    await expect(root.getByRole('slider', { name: `${palette} value` })).toHaveAttribute(
      'aria-valuenow',
      '40',
      { timeout: 30_000 },
    );
    colors.push(
      await root.locator('.lui-slider__range').evaluate(
        /** Read the resolved palette color from the actual range. */
        (element) => getComputedStyle(element).backgroundColor,
      ),
    );
  }
  expect(new Set(colors).size).toBe(5);
}

test('Slider applies five guide palettes', verifiesPalettes);

/** Verify vertical marks remain positioned while the thumb changes by keyboard. */
async function verifiesVerticalMarks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-compositions--vertical');
  const root = page.getByTestId('slider-vertical-marks');
  const thumb = root.getByRole('slider', { name: 'Vertical percentage' });
  await expect(thumb).toHaveAttribute('aria-orientation', 'vertical', { timeout: 30_000 });
  await expect(root.locator('.lui-slider__markerLabel')).toHaveText(['0%', '50%', '100%']);
  const marks = root.locator('.lui-slider__marker');
  const first = await marks.first().boundingBox();
  const last = await marks.last().boundingBox();
  if (!first || !last) throw new Error('Vertical Slider marks have no browser bounds.');
  expect(first.y).toBeGreaterThan(last.y);
  await thumb.focus();
  await thumb.press('ArrowUp');
  await expect(thumb).toHaveAttribute('aria-valuenow', '41');
}

test('Slider keeps labeled marks on its vertical axis', verifiesVerticalMarks);

/** Compare contained and centered thumb edges and ten-unit keyboard steps. */
async function verifiesAlignment({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-compositions--alignment');
  const contain = page.getByTestId('slider-align-contain');
  const center = page.getByTestId('slider-align-center');
  for (const root of [contain, center]) {
    const thumb = root.getByRole('slider');
    await expect(thumb).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
    await thumb.focus();
    await thumb.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');
    await expect(root.locator('.lui-slider__valueText')).toContainText('50');
    await thumb.press('Home');
  }
  const containedThumb = await contain.getByRole('slider').boundingBox();
  const centeredThumb = await center.getByRole('slider').boundingBox();
  const containedTrack = await contain.locator('.lui-slider__track').boundingBox();
  const centeredTrack = await center.locator('.lui-slider__track').boundingBox();
  if (!containedThumb || !centeredThumb || !containedTrack || !centeredTrack) {
    throw new Error('Slider alignment specimens have no browser bounds.');
  }
  expect(containedThumb.x - containedTrack.x).toBeGreaterThan(
    centeredThumb.x - centeredTrack.x + 2,
  );
}

test('Slider preserves thumb alignment and ten-unit steps', verifiesAlignment);

/** Verify a decorative custom thumb keeps accessible and native value behavior. */
async function verifiesCustomThumb({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-compositions--custom');
  const root = page.getByTestId('slider-custom');
  const thumb = root.getByRole('slider', { name: 'Custom level' });
  const iconPaths = thumb.locator('svg[aria-hidden="true"] path');
  await expect(iconPaths).toHaveCount(2, {
    timeout: 30_000,
  });
  await expect(iconPaths.last()).toHaveAttribute('d', /^M7 18h2V6/);
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '31');
  expect(await page.getByTestId('slider-custom-form').evaluate(sliderGuideFormValue, 'level')).toBe(
    '31',
  );
}

test('Slider custom thumb retains machine and native input behavior', verifiesCustomThumb);

/** Verify an application-owned wrapper composes value text, marks, and form input. */
async function verifiesClosedSlider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-closed--contract');
  const form = page.getByTestId('slider-closed-form');
  const thumb = form.getByRole('slider', { name: 'Volume' });
  await expect(thumb).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  const labelRow = form.locator('.lui-slider__label').locator('..');
  await expect(labelRow).toHaveCSS('align-items', 'center');
  await expect(labelRow).toHaveCSS('gap', '8px');
  await expect(form.getByText('Half')).toBeVisible();
  await expect(form.locator('.lui-slider__valueText')).toContainText('40');
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(form.locator('.lui-slider__valueText')).toContainText('41');
  expect(await form.evaluate(sliderGuideFormValue, 'volume')).toBe('41');
}

test('Slider supports a consumer-owned closed component', verifiesClosedSlider);

/** Verify the optional value text branch keeps a direct accessible label. */
async function verifiesDefaultClosedSlider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-guide-closed--default');
  const form = page.getByTestId('slider-closed-default-form');
  const root = page.getByTestId('slider-closed-default-root');
  const thumb = root.getByRole('slider', { name: 'Level' });
  await expect(root.locator(':scope > .lui-slider__label')).toHaveText('Level', {
    timeout: 30_000,
  });
  await expect(root.locator('.lui-slider__valueText')).toHaveCount(0);
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '31');
  expect(await form.evaluate(sliderGuideFormValue, 'level')).toBe('31');
}

test('Slider closed component keeps its direct-label default', verifiesDefaultClosedSlider);
