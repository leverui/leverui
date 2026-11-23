import { expect, test, type Locator, type Page } from '@playwright/test';

const widths = [400, 600, 800, 1100, 1300, 1600] as const;
const variants = ['line', 'subtle', 'enclosed'] as const;

/** Sample the layout properties that fitted and justify must preserve. */
async function readLayout(root: Locator): Promise<Record<string, string>> {
  return root.evaluate(
    /** Read visible part styles after the current media query settles. */
    (element) => {
      const list = element.querySelector('.lui-tabs__list');
      const trigger = element.querySelector('.lui-tabs__trigger');
      if (!list || !trigger) throw new Error('Tabs layout parts are missing.');
      const listStyle = getComputedStyle(list);
      const triggerStyle = getComputedStyle(trigger);
      return {
        display: listStyle.display,
        listJustify: listStyle.justifyContent,
        flex: triggerStyle.flex,
        textAlign: triggerStyle.textAlign,
        triggerJustify: triggerStyle.justifyContent,
      };
    },
  );
}

/** Verify finite responsive layouts on every authored variant. */
async function verifiesResponsiveTabsLayout({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-layout--contract');
  const authored = page.getByTestId('tabs-layout-subtle-authored');
  await expect(authored).toBeVisible({ timeout: 30_000 });
  await expect(authored).toHaveAttribute('data-fitted-sm', 'true');
  await expect(authored).toHaveAttribute('data-justify-2xl', 'end');
  const justified = ['flex-start', 'center', 'flex-end', 'flex-start', 'center', 'flex-end'];
  for (const [index, width] of widths.entries()) {
    await page.setViewportSize({ width, height: 900 });
    for (const variant of variants) {
      const current = page.getByTestId(`tabs-layout-${variant}-authored`);
      const layout = await readLayout(current);
      expect(layout.display, `${variant} at ${width}px`).toBe(
        index === 0 && variant !== 'line' ? 'inline-flex' : 'flex',
      );
      expect(layout.listJustify, `${variant} at ${width}px`).toBe(justified[index]);
      expect(layout.flex, `${variant} at ${width}px`).toBe(index === 0 ? '0 1 auto' : '1 1 0%');
    }
  }
}

test('responsive Tabs layout uses authored CSS at every breakpoint', verifiesResponsiveTabsLayout);

/** Require explicit false to restore the unfitted layout at later widths. */
async function verifiesFittedReversal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-layout--contract');
  const root = page.getByTestId('tabs-layout-reversal');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-fitted-sm', 'false');
  for (const [width, display, flex] of [
    [400, 'flex', '1 1 0%'],
    [600, 'inline-flex', '0 1 auto'],
    [800, 'flex', '1 1 0%'],
    [1100, 'inline-flex', '0 1 auto'],
    [1300, 'flex', '1 1 0%'],
    [1600, 'inline-flex', '0 1 auto'],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await readLayout(root);
    expect(layout.display, `${width}px list`).toBe(display);
    expect(layout.flex, `${width}px trigger`).toBe(flex);
  }
}

test('fitted false reverses an earlier true choice', verifiesFittedReversal);

/** Keep the same native trigger while responsive props update after mount. */
async function verifiesReactiveLayout({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-layout--contract');
  const root = page.getByTestId('tabs-layout-reactive');
  const trigger = page.getByTestId('tabs-layout-reactive-trigger');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-fitted', 'true');
  await trigger.evaluate(
    /** Mark the native trigger to detect accidental replacement. */
    (element) => {
      (element as HTMLElement).dataset.original = 'true';
    },
  );
  await page.getByTestId('tabs-layout-toggle').click();
  await expect(root).toHaveAttribute('data-fitted', 'false');
  await expect(root).toHaveAttribute('data-fitted-md', 'true');
  await expect(root).toHaveAttribute('data-justify', 'end');
  await expect(trigger).toHaveAttribute('data-original', 'true');
}

test('responsive Tabs layout stays reactive without remounting', verifiesReactiveLayout);
