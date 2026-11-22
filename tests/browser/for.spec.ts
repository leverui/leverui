import { expect, test, type Page } from '@playwright/test';

/** Verify the list, fallback, and keyed Solid updates without a wrapper. */
async function verifiesForContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-for--contract');
  const list = page.getByTestId('for-list');
  await expect(list.locator(':scope > li')).toHaveCount(3);
  await expect(list.locator(':scope > li')).toHaveText(['One', 'Two', 'Three']);
  await expect(page.getByTestId('for-primitive-0')).toHaveText('Alpha');
  await expect(page.getByTestId('for-primitive-1')).toHaveText('Beta');

  const first = page.getByTestId('for-item-one');
  await first.evaluate(
    /** Mark the first native item to detect keyed DOM reuse. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('for-reverse').click();
  await expect(list.locator(':scope > li')).toHaveText(['Three', 'Two', 'One']);
  await expect(first).toHaveAttribute('data-original-node', 'true');
  await expect(first).toHaveAttribute('data-index', '2');
  await page.getByTestId('for-change-renderer').click();
  await expect(first).toHaveText('Changed: One');
  await expect(first).not.toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('for-change-renderer').click();
  await expect(list.locator(':scope > li')).toHaveText(['Three', 'Two', 'One']);

  await page.getByTestId('for-clear').click();
  await expect(list.locator(':scope > li')).toHaveCount(1);
  await expect(page.getByTestId('for-fallback')).toHaveText('No items');
  await page.getByTestId('for-change-fallback').click();
  await expect(page.getByTestId('for-fallback')).toHaveText('Still empty');
  await page.getByTestId('for-omit').click();
  await expect(list.locator(':scope > li')).toHaveCount(0);
  await expect(page.getByTestId('for-fallback')).toHaveCount(0);
  await page.getByTestId('for-sparse').click();
  await expect(list.locator(':scope > li')).toHaveCount(1);
  await expect(page.getByTestId('for-item-three')).toHaveAttribute('data-index', '2');
  await page.getByTestId('for-holes').click();
  await expect(list.locator(':scope > li')).toHaveCount(0);
  await expect(page.getByTestId('for-fallback')).toHaveCount(0);
  await page.getByTestId('for-restore').click();
  await expect(list.locator(':scope > li')).toHaveText(['One', 'Two', 'Three']);
  await expect(page.getByTestId('for-fallback')).toHaveCount(0);
}

test('For renders objects, primitives, and reactive fallback states', verifiesForContract);
