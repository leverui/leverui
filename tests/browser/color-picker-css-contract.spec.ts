import { expect, test, type Page } from '@playwright/test';

/** Verify that authored CSS styles the public parts while the primitive owns live color styles. */
async function verifiesAuthoredCssAndMachineStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker--basic');
  const root = page.locator('.lui-color-picker__root');
  const trigger = page.getByTestId('color-picker-trigger');
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(root).toHaveAttribute('data-variant', 'outline');
  await expect(trigger).toHaveAttribute('data-lui-color-picker-css', '');
  await expect(trigger).toHaveCSS('min-height', '40px');
  await trigger.click();
  const content = page.getByTestId('color-picker-content');
  await expect(content).toHaveAttribute('data-lui-color-picker-css', '');
  await expect(content).toHaveCSS('width', '256px');
  const area = page.getByTestId('color-picker-area');
  await expect(area).toHaveCSS('height', '180px');
  const background = area.locator('.lui-color-picker__areaBackground');
  await expect(background).toHaveAttribute('style', /background/);
  const hueTrack = content.locator('.lui-color-picker__channelSliderTrack').first();
  await expect(hueTrack).toHaveAttribute('style', /background-image/);
}

test(
  'ColorPicker uses authored CSS and keeps the primitive color geometry',
  verifiesAuthoredCssAndMachineStyles,
);
