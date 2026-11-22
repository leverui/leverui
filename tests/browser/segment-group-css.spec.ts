import { expect, test, type Page } from '@playwright/test';

/** Verify variables override CSS presentation without style insertion. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--css-contract');
  const root = page.getByTestId('segment-css-root');
  const item = root.locator('.leverui-segment-group__item').first();
  const indicator = page.getByTestId('segment-css-indicator');
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(item).toHaveCSS('height', '40px');
  await page.addStyleTag({
    content:
      '.consumer-segment { --leverui-segment-group-item-height: 48px; --leverui-segment-group-indicator-background: rgb(255, 0, 0); }',
  });
  await expect(item).toHaveCSS('height', '48px');
  await expect(indicator).toHaveCSS('background-color', 'rgb(255, 0, 0)');
}

test('Segment Group accepts consumer CSS variables', verifiesConsumerCss);

/** Keep radio interaction and part hooks when authored CSS is suppressed. */
async function verifiesUnstyled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--css-contract');
  const root = page.getByTestId('segment-unstyled-root');
  const item = root.locator('.leverui-segment-group__item').first();
  const indicator = page.getByTestId('segment-unstyled-indicator');
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(item).toHaveAttribute('data-unstyled', '');
  await expect(indicator).toHaveAttribute('data-unstyled', '');
  await expect(root).toHaveCSS('display', 'block');
  await root.getByText('Solid', { exact: true }).click();
  await expect(root.getByRole('radio', { name: 'Solid' })).toBeChecked();
}

test('Segment Group unstyled composition preserves native radios', verifiesUnstyled);
