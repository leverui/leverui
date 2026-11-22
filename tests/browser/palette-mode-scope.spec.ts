import { expect, test, type Page } from '@playwright/test';

const grayOnLight = 'rgb(39, 39, 42)';
const grayOnDark = 'rgb(228, 228, 231)';
const blueOnDark = 'rgb(163, 207, 255)';

/** Verify palette colors follow the nearest light or dark scope, not the page's mode. */
async function verifiesPaletteFollowsModeScope({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-palette-mode-scope--contract');
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(page.getByTestId('scope-page-button')).toHaveCSS('color', grayOnLight);
  await expect(page.getByTestId('scope-dark-button')).toHaveCSS('color', grayOnDark);
  await expect(page.getByTestId('scope-dark-light-button')).toHaveCSS('color', grayOnLight);
  // A Code Block is always dark, so a ghost button in its header needs the dark palette to show.
  await expect(page.getByTestId('scope-code-button')).toHaveCSS('color', grayOnDark);
}

/** Verify a palette set outside a scope still applies inside it, in the scope's colors. */
async function verifiesOuterPaletteReachesScope({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-palette-mode-scope--contract');
  await expect(page.getByTestId('scope-blue-dark-button')).toHaveCSS('color', blueOnDark);
  await expect(page.getByTestId('scope-red-blue-dark-button')).toHaveCSS('color', blueOnDark);
  await expect(page.getByTestId('scope-dark-own-palette-button')).toHaveCSS('color', blueOnDark);
  await expect(page.getByTestId('scope-blue-theme-button')).toHaveCSS('color', grayOnDark);
}

test('palette colors follow the nearest light or dark scope', verifiesPaletteFollowsModeScope);
test('a palette set outside a mode scope applies inside it', verifiesOuterPaletteReachesScope);
