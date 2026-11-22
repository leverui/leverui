import { expect, test, type Page } from '@playwright/test';
import { countries } from '../../demos/listbox-virtualized-data';

/** Verify a bounded country window preserves full-collection keyboard access. */
async function verifiesVirtualListbox({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-virtualized--contract');
  const listbox = page.getByRole('listbox', { name: `Select Country (${countries.length} items)` });
  const options = listbox.getByRole('option');
  /** Count only the options mounted in the current virtual window. */
  function countOptions(): Promise<number> {
    return options.count();
  }
  const content = page.getByTestId('virtual-listbox-content');
  await expect(options.first()).toHaveAccessibleName('Andorra');
  await expect.poll(countOptions).toBeLessThan(countries.length);
  await expect(page.getByRole('option', { name: 'Zimbabwe' })).toHaveCount(0);
  await expect(content).toHaveJSProperty('scrollTop', 0);
  const viewport = await content.evaluate(
    /** Report layout measurements for the bounded scrolling surface. */
    (element: HTMLDivElement) => ({
      height: element.clientHeight,
      totalHeight: element.scrollHeight,
      rowHeight: element.querySelector('[role="option"]')?.getBoundingClientRect().height,
    }),
  );
  expect(viewport.height).toBeLessThanOrEqual(300);
  expect(viewport.totalHeight).toBeGreaterThan(countries.length * 30);
  expect(viewport.rowHeight).toBe(32);

  await listbox.focus();
  await listbox.press('End');
  const last = page.getByRole('option', { name: 'Zimbabwe' });
  await expect(last).toBeVisible();
  await expect(last).toHaveAttribute('aria-posinset', String(countries.length));
  await expect(last).toHaveAttribute('aria-setsize', String(countries.length));
  await expect(last).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await last.getAttribute('id')) ?? '',
  );
  await expect(listbox).toBeFocused();
  await listbox.press('Enter');
  await expect(last).toHaveAttribute('aria-selected', 'true');
  await expect.poll(countOptions).toBeLessThan(countries.length);

  await listbox.press('Home');
  const first = page.getByRole('option', { name: 'Andorra' });
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute('aria-posinset', '1');
  await expect(first).toHaveAttribute('data-highlighted');
  await expect(listbox).toBeFocused();
  await content.evaluate(
    /** Move the viewport independently of Zag's highlighted option. */
    async (element: HTMLDivElement) => {
      const scrolled = new Promise<void>(
        /** Wait for the native event TanStack observes. */
        (resolve) => {
          /** Resolve after the virtualizer receives this native event. */
          function handleScroll(): void {
            resolve();
          }
          element.addEventListener('scroll', handleScroll, { once: true });
        },
      );
      element.scrollTop = element.scrollHeight / 2;
      await scrolled;
    },
  );
  await expect
    .poll(
      /** Read the first mounted full-collection position after scrolling. */
      async () => Number(await options.first().getAttribute('aria-posinset')),
    )
    .toBeGreaterThan(100);
}

test('Listbox virtualizes the country collection', verifiesVirtualListbox);
