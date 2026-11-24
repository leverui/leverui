import { expect, test, type Page } from '@playwright/test';

// Storybook may compile this story while the other browser workers are active.
test.setTimeout(120_000);

/** Switch the document mode while the branded section stays explicitly light. */
function setRootDarkMode(): void {
  document.documentElement.setAttribute('data-lui-color-mode', 'dark');
}

/** Open a CSS theme story after Storybook has rendered its component tree. */
async function openThemeStory(page: Page, story: 'brand' | 'default'): Promise<void> {
  await page.goto(`/iframe.html?id=setup-css-theme--${story}&viewMode=story`);
  await expect(page.getByTestId('theme-panel')).toBeVisible({ timeout: 30_000 });
}

/** Verify a CSS-only theme changes semantic colors and Button recipes. */
async function verifiesBrandTheme({ page }: { page: Page }): Promise<void> {
  await openThemeStory(page, 'brand');

  await expect(page.getByTestId('theme-panel')).toHaveAttribute('data-lui-color-mode', 'light');
  await expect(page.getByTestId('theme-panel')).toHaveCSS('background-color', 'rgb(245, 240, 255)');
  await expect(page.getByTestId('theme-content')).toHaveCSS('color', 'rgb(40, 28, 66)');
  await expect(page.getByTestId('theme-content')).toHaveCSS('padding', '16px');
  await expect(page.getByTestId('solid-button')).toHaveCSS('background-color', 'rgb(98, 84, 199)');
  await expect(page.getByTestId('solid-button')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByTestId('solid-button')).toHaveCSS('border-top-left-radius', '12px');
  await expect(page.getByTestId('subtle-button')).toHaveCSS(
    'background-color',
    'rgb(233, 225, 255)',
  );
  await expect(page.getByTestId('subtle-button')).toHaveCSS('color', 'rgb(67, 50, 140)');
  await expect(page.getByTestId('outline-button')).toHaveCSS(
    'border-top-color',
    'rgb(122, 105, 219)',
  );
  await expect(page.getByTestId('nested-button')).toHaveCSS('background-color', 'rgb(98, 84, 199)');
  await page.addStyleTag({ content: ':root { --lui-spacing-4: 24px; }' });
  await expect(page.getByTestId('theme-content')).toHaveCSS('padding', '24px');
  await expect(page.getByTestId('inherited-theme')).not.toHaveAttribute(
    'data-lui-color-mode',
    'dark',
  );

  await page.evaluate(setRootDarkMode);
  await expect(page.getByTestId('theme-panel')).toHaveCSS('background-color', 'rgb(245, 240, 255)');
  await expect(page.getByTestId('nested-button')).toHaveCSS('background-color', 'rgb(98, 84, 199)');
}

/** Verify the unbranded story retains mapped light colors and Button sizes. */
async function verifiesDefaultTheme({ page }: { page: Page }): Promise<void> {
  await openThemeStory(page, 'default');

  await expect(page.getByTestId('theme-panel')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByTestId('solid-button')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(page.getByTestId('solid-button')).toHaveCSS('height', '40px');
  await expect(page.getByRole('button', { name: 'Small' })).toHaveCSS('height', '32px');
  await expect(page.getByRole('button', { name: 'Large' })).toHaveCSS('height', '44px');
}

test('CSS-only brand theme changes semantic and Button recipe values', verifiesBrandTheme);
test('default story retains its original theme', verifiesDefaultTheme);
