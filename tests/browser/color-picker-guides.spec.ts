import { expect, test, type Page } from '@playwright/test';

/** Open the portal-hosted channel specimen, optionally checking label focus. */
async function openChannelPicker(page: Page, checkLabel = false): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker-guides--channels');
  const input = page.getByTestId('color-picker-guide-hex');
  await expect(input).toHaveValue('#EB5E41', { timeout: 30_000 });
  if (checkLabel) {
    await page.getByTestId('color-picker-guide-label').click();
    await expect(input).toBeFocused();
  }
  await page.getByTestId('color-picker-guide-trigger').click();
  await expect(page.getByTestId('color-picker-guide-content')).toBeVisible();
}

/** Keep channel inputs and format views synchronized with the color machine. */
async function verifiesFormatsAndChannels({ page }: { page: Page }): Promise<void> {
  await openChannelPicker(page, true);
  await page.getByTestId('color-picker-guide-format').selectOption('rgba');
  await expect(page.getByTestId('color-picker-guide-rgba')).toBeVisible();
  const red = page.getByTestId('color-picker-guide-red');
  await expect(red).toHaveValue('235');
  await red.fill('120');
  await red.press('Enter');
  await expect(page.getByTestId('color-picker-guide-hex')).not.toHaveValue('#EB5E41');
  await page.getByTestId('color-picker-guide-format').selectOption('hsla');
  await expect(page.getByTestId('color-picker-guide-hsla')).toBeVisible();
  await expect(page.getByTestId('color-picker-guide-hue-input')).toBeVisible();
}

test('ColorPicker keeps guide channel inputs and formats reactive', verifiesFormatsAndChannels);

/** Change the hue by keyboard and pointer without losing its commit callback. */
async function verifiesChannelSlider({ page }: { page: Page }): Promise<void> {
  const errors: string[] = [];
  /** Capture machine exceptions from keyboard and pointer changes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await openChannelPicker(page);
  await expect(page.getByTestId('color-picker-guide-format-state')).toHaveText('hsba');
  await expect(page.getByTestId('color-picker-guide-content').locator(':focus')).toHaveCount(1);
  const slider = page.getByTestId('color-picker-guide-hue').getByRole('slider');
  await expect(slider).toBeVisible();
  await slider.focus();
  await expect(slider).toBeFocused();
  const before = await slider.getAttribute('aria-valuenow');
  await slider.press('ArrowRight');
  await expect(slider).toBeFocused();
  expect(errors).toEqual([]);
  await expect(slider).not.toHaveAttribute('aria-valuenow', before ?? '');
  const track = page.getByTestId('color-picker-guide-hue');
  const box = await track.boundingBox();
  if (!box) throw new Error('Hue slider has no pointer target.');
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await expect(page.getByTestId('color-picker-guide-ended')).not.toHaveText('none');
}

test('ColorPicker channel slider supports keyboard and pointer changes', verifiesChannelSlider);

/** Preserve focusable read-only controls without changing their value. */
async function verifiesReadOnly({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker-guides--read-only');
  const input = page.getByTestId('color-picker-readonly-input');
  const trigger = page.getByTestId('color-picker-readonly-trigger');
  await expect(input).toHaveValue('#EB5E41', { timeout: 30_000 });
  await expect(input).toHaveAttribute('readonly');
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByTestId('color-picker-readonly-content')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(input).toHaveValue('#EB5E41');
}

test('ColorPicker keeps its read-only value and popup closed', verifiesReadOnly);
