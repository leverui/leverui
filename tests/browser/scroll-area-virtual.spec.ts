import { expect, test, type Page } from '@playwright/test';

/** Verify virtualization shares ScrollArea's native scrolling viewport. */
async function verifiesVirtualization({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-virtual--virtualized');
  const rows = page.getByTestId('virtual-row');
  const viewport = page.getByTestId('virtual-viewport');
  await expect(rows.first()).toHaveText('Item 1');
  expect(await rows.count()).toBeLessThan(30);
  await page.getByRole('button', { name: 'Show last item' }).click();
  await expect(rows.filter({ hasText: 'Item 1000' })).toBeVisible();
  expect(await rows.count()).toBeLessThan(30);
  expect(
    await viewport.evaluate(
      /** Read the native viewport position after virtual navigation. */
      (element) => element.scrollTop,
    ),
  ).toBeGreaterThan(40000);
}

test('ScrollArea works with a Solid virtualizer', verifiesVirtualization);
