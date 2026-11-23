import { expect, test, type Page } from '@playwright/test';

/** Verify native parts, size variants, actions, and explicit announcement role. */
async function verifiesEmptyStateParts({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=feedback-empty-state--contract');
  const root = page.getByTestId('empty-default');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).not.toHaveAttribute('role');
  await expect(page.getByTestId('empty-sm')).toHaveAttribute('role', 'status');
  await expect(page.getByTestId('empty-default-title')).toHaveJSProperty('tagName', 'H3');
  await expect(page.getByTestId('empty-default-description')).toHaveJSProperty('tagName', 'P');
  await expect(page.getByTestId('empty-default-content')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('empty-sm')).toHaveCSS('padding-top', '24px');
  await expect(page.getByTestId('empty-lg')).toHaveCSS('padding-top', '64px');
  await expect(page.getByTestId('empty-css-override')).toHaveCSS('padding-top', '20px');
  await expect(
    page.getByTestId('empty-css-override').locator('.lui-empty-state__content'),
  ).toHaveCSS('gap', '2px');
  await expect(page.getByTestId('empty-css-override').locator('.lui-empty-state__title')).toHaveCSS(
    'color',
    'rgb(11, 99, 176)',
  );
  await expect(page.getByTestId('empty-unstyled')).toHaveCSS('padding-top', '0px');
  await expect(page.getByTestId('empty-responsive')).toHaveCSS('padding-top', '24px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('empty-responsive')).toHaveCSS('padding-top', '64px');
  await page.setViewportSize({ width: 1100, height: 720 });
  await expect(page.getByTestId('empty-responsive')).toHaveCSS('padding-top', '24px');
  await page.setViewportSize({ width: 1300, height: 720 });
  await expect(page.getByTestId('empty-responsive')).toHaveCSS('padding-top', '48px');
  await page.setViewportSize({ width: 1600, height: 720 });
  await expect(page.getByTestId('empty-responsive')).toHaveCSS('padding-top', '64px');
  await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible();
  for (const attribute of ['size', 'recipe', 'unstyled']) {
    await expect(root).not.toHaveAttribute(attribute);
  }
}

test('Empty State preserves native parts and CSS sizes', verifiesEmptyStateParts);

/** Verify inherited size updates without remounting the root. */
async function verifiesReactiveEmptyState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-empty-state--contract');
  const root = page.getByTestId('empty-reactive');
  await expect(root).toHaveCSS('padding-top', '24px', { timeout: 15_000 });
  await root.evaluate(
    /** Mark the original native root before changing the inherited size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('empty-toggle').click();
  await expect(root).toHaveCSS('padding-top', '64px');
  await expect(root).toHaveAttribute('data-original-node', 'true');
}

test('Empty State updates inherited size on the same root', verifiesReactiveEmptyState);
