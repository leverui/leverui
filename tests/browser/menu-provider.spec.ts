import { expect, test, type Page } from '@playwright/test';

/** Verify controlled state, reactive defaults, and instance precedence. */
async function verifiesMenuProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu-provider--contract');
  const controlled = page.getByTestId('menu-provider-content');
  const fixed = page.getByTestId('menu-fixed-content');
  await expect(page.getByTestId('menu-provider-trigger')).toBeVisible({ timeout: 30_000 });
  await expect(controlled).toHaveCount(1);
  await expect(controlled).toBeHidden();
  await expect(controlled).toHaveAttribute('data-state', 'closed');
  await expect(page.getByTestId('menu-lazy-content')).toHaveCount(0);
  await page.getByTestId('menu-open-toggle').click();
  await expect(page.getByTestId('menu-controlled-open')).toHaveText('true');
  await expect(controlled).toBeVisible();
  await expect(controlled).toHaveCSS('padding', '6px');
  await expect(fixed).toHaveCSS('padding', '4px');
  await controlled.evaluate(
    /** Mark the current DOM node so later checks detect remounting. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('menu-controlled-open')).toHaveText('false');
  await expect(controlled).toBeHidden();
  await expect(controlled).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('menu-size-toggle').click();
  await expect(controlled).toHaveCSS('padding', '4px');
  await expect(fixed).toHaveCSS('padding', '4px');
  await expect(controlled).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('menu-size-toggle').click();
  await expect(controlled).toHaveCSS('padding', '6px');
  await expect(fixed).toHaveCSS('padding', '4px');
  await page.getByTestId('menu-lazy-trigger').click();
  await expect(page.getByTestId('menu-lazy-content')).toBeVisible();
}

test('Menu keeps external machine and reactive provider defaults', verifiesMenuProvider);
