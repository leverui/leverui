import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'change-end',
  'collision-behavior',
  'controlled',
  'customization',
  'disabled',
  'prevent-overlap',
  'sizes',
  'size-matrix',
  'thumb-alignment',
  'variants',
  'variant-matrix',
  'vertical',
  'colors',
  'dragging-indicator',
  'hook-form',
  'label',
  'marks',
  'marks-and-label',
  'marks-vertical',
  'range-slider',
  'step',
  'store',
  'value-text',
  'custom-marker-labels',
] as const;

const displayCounts = { sizes: 3, 'size-matrix': 30, variants: 2, 'variant-matrix': 40, colors: 5 };

/** Open one curated Slider story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-slider--${id}`);
}

/** Require every Slider example to render a slider thumb. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.getByRole('slider').first()).toBeVisible();
  }
}

/** Check default, controlled, stepped, and disabled keyboard behavior. */
async function verifiesBasicState({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  const basic = page.getByRole('slider');
  await expect(basic).toHaveAttribute('aria-valuenow', '40');
  await basic.focus();
  await basic.press('ArrowRight');
  await expect(basic).toHaveAttribute('aria-valuenow', '41');

  await openStory(page, 'controlled');
  const controlled = page.getByRole('slider');
  await controlled.focus();
  await controlled.press('ArrowRight');
  await expect(controlled).toHaveAttribute('aria-valuenow', '41');

  await openStory(page, 'step');
  const stepped = page.getByRole('slider');
  await stepped.focus();
  await stepped.press('ArrowRight');
  await expect(stepped).toHaveAttribute('aria-valuenow', '50');

  await openStory(page, 'disabled');
  const disabled = page.getByRole('slider');
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled).toHaveAttribute('aria-valuenow', '40');
}

/** Confirm two-thumb ranges and collision rules preserve ordering. */
async function verifiesRanges({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'range-slider');
  await expect(page.getByRole('slider')).toHaveCount(2);
  await expect(page.getByRole('slider').nth(0)).toHaveAttribute('aria-valuenow', '30');
  await expect(page.getByRole('slider').nth(1)).toHaveAttribute('aria-valuenow', '60');

  await openStory(page, 'prevent-overlap');
  const first = page.getByRole('slider').nth(0);
  const second = page.getByRole('slider').nth(1);
  await first.focus();
  await first.press('End');
  const low = Number(await first.getAttribute('aria-valuenow'));
  const high = Number(await second.getAttribute('aria-valuenow'));
  expect(high - low).toBeGreaterThanOrEqual(8);

  await openStory(page, 'collision-behavior');
  const pushing = page.getByRole('slider').nth(0);
  const pushed = page.getByRole('slider').nth(1);
  await expect(page.getByRole('slider')).toHaveCount(2);
  await expect(page.getByText('Price range')).toBeVisible();
  await pushing.focus();
  await pushing.press('End');
  await expect(pushing).toHaveAttribute('aria-valuenow', '70');
  await expect(pushed).toHaveAttribute('aria-valuenow', '70');
  const thumbBox = await pushing.boundingBox();
  const trackBox = await page.locator('[data-slider-track]').boundingBox();
  expect(thumbBox).not.toBeNull();
  expect(trackBox).not.toBeNull();
  if (!thumbBox || !trackBox) return;
  await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(trackBox.x + trackBox.width * 0.9, thumbBox.y + thumbBox.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
  expect(Number(await pushed.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
}

/** Check marker counts, labels, vertical orientation, and custom colors. */
async function verifiesMarkers({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'marks');
  await expect(page.locator('[data-slider-marker]')).toHaveCount(9);
  await openStory(page, 'marks-and-label');
  await expect(page.getByText('50%')).toBeVisible();
  await openStory(page, 'marks-vertical');
  await expect(page.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
  await openStory(page, 'custom-marker-labels');
  await expect(page.getByText('Low')).toBeVisible();
  await expect(page.getByText('Medium')).toBeVisible();
  await expect(page.getByText('High')).toBeVisible();
}

/** Check palette and CSS tables, labels, and custom thumb structure. */
async function verifiesDisplay({ page }: { page: Page }): Promise<void> {
  for (const [id, count] of [...Object.entries(displayCounts), ['thumb-alignment', 2] as const]) {
    await openStory(page, id);
    await expect(page.getByRole('slider')).toHaveCount(count);
  }
  await openStory(page, 'label');
  await expect(page.getByText('Quantity')).toBeVisible();
  await openStory(page, 'customization');
  await expect(page.getByRole('slider').locator('svg.lucide-audio-waveform')).toBeVisible();
  await openStory(page, 'vertical');
  await expect(page.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
}

/** Follow live values and committed values through their Storybook labels. */
async function verifiesValueOutputs({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'value-text');
  await expect(page.getByText('Volume')).toBeVisible();
  await expect(page.getByText('40', { exact: true })).toBeVisible();

  await openStory(page, 'store');
  const store = page.getByRole('slider');
  await store.focus();
  await store.press('ArrowRight');
  await expect(page.getByText('current: 41')).toBeVisible();

  await openStory(page, 'change-end');
  const changed = page.getByRole('slider');
  await changed.focus();
  await changed.press('ArrowRight');
  await expect(page.getByText('onChange: 51')).toBeVisible();
  await expect(page.getByText('onChangeEnd: 51')).toBeVisible();
}

/** Validate the Solid form example through a real submit and thumb update. */
async function verifiesForm({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Value must be greater than 60')).toBeVisible();
  const slider = page.getByRole('slider');
  await slider.focus();
  await slider.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '100');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Value must be greater than 60')).toHaveCount(0);
}

/** Show the value while dragging, then hide it when the drag ends. */
async function verifiesDraggingIndicator({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'dragging-indicator');
  const thumb = page.getByRole('slider');
  const indicator = page.locator('[data-slider-dragging-indicator]');
  await expect(indicator).toBeHidden();
  const bounds = await thumb.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await expect(indicator).toBeVisible();
  await page.mouse.up();
  await expect(indicator).toBeHidden();
}

test('all Slider examples render', verifiesInventory);
test('Slider basic and controlled keyboard state works', verifiesBasicState);
test('Slider range constraints preserve thumb ordering', verifiesRanges);
test('Slider marks and labels render', verifiesMarkers);
test('Slider CSS and layout examples render', verifiesDisplay);
test('Slider value outputs update', verifiesValueOutputs);
test('Slider form validates and submits', verifiesForm);
test('Slider dragging indicator follows pointer state', verifiesDraggingIndicator);
