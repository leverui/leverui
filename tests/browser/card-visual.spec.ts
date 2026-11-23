import { expect, test, type Page } from '@playwright/test';

/** Check Card base, part, and variant CSS against the mapped presentation. */
async function verifiesCardVisualCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card-visual--states');
  const card = page.getByTestId('card-visual-default');
  await expect(card).toBeVisible({ timeout: 45_000 });
  await expect(card).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(card).toHaveClass(/(?:^|\s)lui-card__root(?:\s|$)/);
  await expect(page.getByTestId('card-visual-header')).toHaveClass(
    /(?:^|\s)lui-card__header(?:\s|$)/,
  );
  await expect(page.getByTestId('card-visual-body')).toHaveClass(/(?:^|\s)lui-card__body(?:\s|$)/);
  await expect(page.getByTestId('card-visual-footer')).toHaveClass(
    /(?:^|\s)lui-card__footer(?:\s|$)/,
  );
  await expect(page.getByTestId('card-visual-title')).toHaveClass(
    /(?:^|\s)lui-card__title(?:\s|$)/,
  );
  await expect(page.getByTestId('card-visual-description')).toHaveClass(
    /(?:^|\s)lui-card__description(?:\s|$)/,
  );
  await expect(card).toHaveCSS('display', 'flex');
  await expect(card).toHaveCSS('position', 'relative');
  await expect(card).toHaveCSS('border-radius', '6px');
  await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(card).toHaveCSS('border-top-color', 'rgb(228, 228, 231)');
  await expect(card).toHaveCSS('color', 'rgb(9, 9, 11)');
  await expect(page.getByTestId('card-visual-elevated')).not.toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('card-visual-subtle')).toHaveCSS(
    'background-color',
    'rgb(244, 244, 245)',
  );
  await expect(page.getByTestId('card-visual-title')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('card-visual-title')).toHaveCSS('font-weight', '600');
  await expect(page.getByTestId('card-visual-description')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('card-visual-description')).toHaveCSS('color', 'rgb(82, 82, 91)');
  await expect(page.getByTestId('card-visual-header')).toHaveCSS('gap', '6px');
  await expect(page.getByTestId('card-visual-header')).toHaveCSS('padding-top', '24px');
  await expect(page.getByTestId('card-visual-body')).toHaveCSS('flex-grow', '1');
  await expect(page.getByTestId('card-visual-footer')).toHaveCSS('gap', '8px');
  await expect(page.getByTestId('card-visual-footer')).toHaveCSS('padding-bottom', '24px');
}

test('Card CSS preserves visual treatments and part layout', verifiesCardVisualCss);

/** Check closest color scope, public CSS variables, and part unstyled behavior. */
async function verifiesCardThemeScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card-visual--states');
  await expect(page.getByTestId('card-visual-dark')).toHaveCSS(
    'background-color',
    'rgb(17, 17, 17)',
  );
  await expect(page.getByTestId('card-visual-dark')).toHaveCSS(
    'border-top-color',
    'rgb(39, 39, 42)',
  );
  await expect(page.getByTestId('card-visual-nested-light')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(page.getByTestId('card-visual-css-override')).toHaveCSS(
    'background-color',
    'rgb(12, 34, 56)',
  );
  await expect(page.getByTestId('card-visual-css-body')).toHaveCSS('padding-top', '44px');
  await expect(page.getByTestId('card-visual-unstyled-header')).toHaveCSS('padding-top', '0px');
  await expect(page.getByTestId('card-visual-unstyled-description')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('card-visual-unstyled-description')).toHaveCSS(
    'color',
    'rgb(9, 9, 11)',
  );
}

test('Card follows nearest theme scope and consumer CSS overrides', verifiesCardThemeScopes);
