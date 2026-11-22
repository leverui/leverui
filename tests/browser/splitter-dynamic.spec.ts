import { expect, test, type Page } from '@playwright/test';

/** Verify adding and removing panels keeps the existing layout responsive. */
async function verifiesDynamicPanels({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-dynamic--panels');
  const root = page.getByTestId('splitter-dynamic-root');
  const first = page.getByTestId('splitter-dynamic-first');
  const second = page.getByTestId('splitter-dynamic-second');
  const panel = page.getByTestId('splitter-dynamic-a');
  await expect(first).toHaveAttribute('aria-valuenow', '50', { timeout: 30_000 });
  await panel.evaluate(
    /** Mark the mounted first panel before the item list changes. */
    (element) => element.setAttribute('data-original-panel', 'true'),
  );
  await page.getByTestId('splitter-toggle-third').click();
  await expect(second).toHaveAttribute('role', 'separator');
  await expect(page.getByTestId('splitter-dynamic-c')).toBeVisible();
  await expect(panel).toHaveAttribute('data-original-panel', 'true');
  await expect(first).toHaveAttribute('aria-valuenow', '30');
  await expect(second).toHaveAttribute('aria-valuenow', '40');
  await second.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toHaveAttribute('aria-valuenow', '41');
  await page.getByTestId('splitter-toggle-third').click();
  await expect(second).toHaveCount(0);
  await expect(first).toHaveAttribute('aria-valuenow', '50');
  await expect(panel).toHaveAttribute('data-original-panel', 'true');
  await expect(root.locator('[data-splitter-panel]')).toHaveCount(2);
}

test(
  'Splitter handles reactive panel lists without remounting existing panels',
  verifiesDynamicPanels,
);
