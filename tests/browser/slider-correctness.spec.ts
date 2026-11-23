import { expect, test, type Locator, type Page } from '@playwright/test';

type CollisionMode = 'none' | 'push' | 'swap';

/** Drag the first thumb beyond the second and read both resulting values. */
async function dragAcross(page: Page, mode: CollisionMode): Promise<number[]> {
  const root = page.getByTestId(`slider-collision-${mode}`);
  const thumbs = root.getByRole('slider');
  const thumbBounds = await thumbs.first().boundingBox();
  const controlBounds = await root.locator('.lui-slider__control').boundingBox();
  if (!thumbBounds || !controlBounds) throw new Error(`${mode} slider has no visible bounds`);
  await page.mouse.move(
    thumbBounds.x + thumbBounds.width / 2,
    thumbBounds.y + thumbBounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    controlBounds.x + controlBounds.width * 0.9,
    controlBounds.y + controlBounds.height / 2,
    { steps: 8 },
  );
  await page.mouse.up();
  return Promise.all([
    thumbs.nth(0).getAttribute('aria-valuenow'),
    thumbs.nth(1).getAttribute('aria-valuenow'),
  ]).then(
    /** Convert browser attribute values for collision comparisons. */
    (values) => values.map((value) => Number(value)),
  );
}

/** Distinguish blocked, pushing, and swapping thumb collisions. */
async function verifiesCollisionModes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-correctness--collisions');
  const none = await dragAcross(page, 'none');
  const push = await dragAcross(page, 'push');
  const swap = await dragAcross(page, 'swap');
  // With `none`, the first thumb stops at the second; Zag 2 then hands the
  // stacked drag to the thumb that can still move instead of sticking.
  expect(none[0]).toBe(80);
  expect(none[1]).toBeGreaterThan(80);
  expect(push[0]).toBeGreaterThan(80);
  expect(push[1]).toBeGreaterThan(80);
  expect(swap[0]).toBe(80);
  expect(swap[1]).toBeGreaterThan(80);
}

test('Slider preserves all pointer collision modes', verifiesCollisionModes);

/** Verify onValueChangeEnd fires with the committed keyboard selection. */
async function verifiesChangeEnd({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-correctness--change-end');
  const thumb = page.getByRole('slider', { name: 'Change end' });
  await expect(thumb).toHaveAttribute('aria-valuenow', '30');
  await expect(page.getByTestId('slider-end-value')).toHaveText('none');
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '35');
  await expect(page.getByTestId('slider-end-value')).toHaveText('35');
}

test('Slider reports the final selection', verifiesChangeEnd);

type SliderStyle = {
  direction: string;
  thumbWidth: number;
  borderWidth: number;
  trackWidth: number;
  trackHeight: number;
};

/** Read browser computed styles for one CSS matrix entry. */
function readSliderStyle(element: Element): SliderStyle {
  const control = element.querySelector('.lui-slider__control');
  const track = element.querySelector('.lui-slider__track');
  const thumb = element.querySelector('.lui-slider__thumb');
  if (!control || !track || !thumb) throw new Error('Slider matrix parts are missing');
  return {
    direction: getComputedStyle(control).flexDirection,
    thumbWidth: parseFloat(getComputedStyle(thumb).width),
    borderWidth: parseFloat(getComputedStyle(thumb).borderTopWidth),
    trackWidth: parseFloat(getComputedStyle(track).width),
    trackHeight: parseFloat(getComputedStyle(track).height),
  };
}

/** Check every size, variant, and direction through applied browser CSS. */
async function verifiesRecipeMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-correctness--matrix');
  const widths: number[] = [];
  for (const size of ['sm', 'md', 'lg'] as const) {
    const root: Locator = page.getByTestId(`slider-matrix-${size}-outline-horizontal`);
    await expect(root).toHaveAttribute('data-orientation', 'horizontal');
    const style = await root.evaluate(readSliderStyle);
    expect(style.direction).toBe('row');
    expect(style.borderWidth).toBe(2);
    expect(style.trackWidth).toBeGreaterThan(style.trackHeight);
    widths.push(style.thumbWidth);
    for (const variant of ['outline', 'solid'] as const) {
      const vertical = page.getByTestId(`slider-matrix-${size}-${variant}-vertical`);
      await expect(vertical).toHaveAttribute('data-orientation', 'vertical');
      const verticalStyle = await vertical.evaluate(readSliderStyle);
      expect(verticalStyle.direction).toBe('column');
      expect(verticalStyle.trackHeight).toBeGreaterThan(verticalStyle.trackWidth);
      expect(verticalStyle.borderWidth).toBe(variant === 'outline' ? 2 : 0);
      const horizontal = page.getByTestId(`slider-matrix-${size}-${variant}-horizontal`);
      const horizontalStyle = await horizontal.evaluate(readSliderStyle);
      expect(horizontalStyle.direction).toBe('row');
      expect(horizontalStyle.borderWidth).toBe(variant === 'outline' ? 2 : 0);
    }
  }
  expect(widths[0]).toBeLessThan(widths[1] ?? 0);
  expect(widths[1]).toBeLessThan(widths[2] ?? 0);
}

test('Slider renders its full size, variant, and orientation matrix', verifiesRecipeMatrix);

/** Confirm ordinary consumer CSS wins over the layered Slider defaults. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-correctness--matrix');
  await page.addStyleTag({
    content:
      '.lui-slider__thumb { border-color: rgb(1, 2, 3); }' +
      '[data-testid="slider-matrix-md-outline-horizontal"] {' +
      '--lui-slider-thumb-size: 31px; --lui-slider-range-color: rgb(4, 5, 6); }',
  });
  const root = page.getByTestId('slider-matrix-md-outline-horizontal');
  const thumb = root.getByRole('slider');
  const borderColor = await thumb.evaluate(
    /** Read the final CSS cascade after the consumer rule is inserted. */
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(borderColor).toBe('rgb(1, 2, 3)');
  expect((await root.evaluate(readSliderStyle)).thumbWidth).toBe(31);
  await expect(root.locator('.lui-slider__range')).toHaveCSS('background-color', 'rgb(4, 5, 6)');
}

test('Slider accepts a consumer CSS override', verifiesConsumerCss);

/** Verify viewport CSS choices update presentation without changing the value. */
async function verifiesResponsiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 500 });
  await page.goto('/iframe.html?id=components-slider-correctness--responsive');
  const root = page.getByTestId('slider-responsive');
  const thumb = root.getByRole('slider');
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  await expect(root).toHaveAttribute('data-variant-md', 'solid');
  await expect(thumb).toHaveAttribute('aria-valuenow', '35');
  const small = await root.evaluate(readSliderStyle);
  expect(small.thumbWidth).toBe(16);
  expect(small.borderWidth).toBe(2);
  await page.setViewportSize({ width: 900, height: 500 });
  const large = await root.evaluate(readSliderStyle);
  expect(large.thumbWidth).toBe(24);
  expect(large.borderWidth).toBe(0);
  await expect(thumb).toHaveAttribute('aria-valuenow', '35');
}

test('Slider follows responsive size and variant CSS', verifiesResponsiveAppearance);

/** Verify the public native paths keep the primitive semantics without default CSS. */
async function verifiesNativeComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-slider-correctness--native');
  const root = page.locator('section.lui-slider__root');
  const thumb = page.getByTestId('slider-native-thumb');
  const track = page.getByTestId('slider-native-track');
  await expect(root).toHaveAttribute('data-root-ref', 'true');
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(thumb).toHaveAttribute('data-thumb-ref', 'true');
  await expect(thumb).toHaveAttribute('data-unstyled', '');
  await expect(track).toHaveAttribute('data-unstyled', '');
  await expect(thumb).toHaveAttribute('aria-valuenow', '20');
  await thumb.focus();
  await thumb.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '21');
}

test('Slider keeps native composition and unstyled semantics', verifiesNativeComposition);
