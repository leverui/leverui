import { expect, test, type Locator, type Page } from '@playwright/test';

const sizes = ['sm', 'md', 'lg'] as const;
const heights = { sm: '36px', md: '40px', lg: '44px' } as const;
const variants = ['line', 'subtle', 'enclosed', 'outline', 'plain'] as const;
const orientations = ['horizontal', 'vertical'] as const;

/** Read the rendered styles that distinguish Tabs variants and directions. */
async function readPresentation(root: Locator): Promise<Record<string, string>> {
  return root.evaluate(
    /** Sample visible native parts after their machine state settles. */
    (element) => {
      const list = element.querySelector('.leverui-tabs__list');
      const trigger = element.querySelector('.leverui-tabs__trigger[data-selected]');
      if (!list || !trigger) throw new Error('Selected Tabs parts are missing.');
      const rootStyle = getComputedStyle(element);
      const listStyle = getComputedStyle(list);
      const triggerStyle = getComputedStyle(trigger);
      return {
        rootDisplay: rootStyle.display,
        listDirection: listStyle.flexDirection,
        listBackground: listStyle.backgroundColor,
        listPadding: listStyle.padding,
        listBorderBottom: listStyle.borderBottomWidth,
        listBorderEnd: listStyle.borderInlineEndWidth,
        triggerHeight: triggerStyle.height,
        triggerBackground: triggerStyle.backgroundColor,
        triggerBorderWidth: triggerStyle.borderTopWidth,
      };
    },
  );
}

/** Verify all finite combinations render authored size, state, and orientation. */
async function verifiesTabsCssContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-css-contract--contract');
  for (const size of sizes) {
    for (const variant of variants) {
      for (const orientation of orientations) {
        const prefix = `tabs-css-${size}-${variant}-${orientation}`;
        const root = page.getByTestId(`${prefix}-authored`);
        await expect(root).toBeVisible({ timeout: 30_000 });
        await expect(root).toHaveAttribute('data-size', size);
        await expect(root).toHaveAttribute('data-variant', variant);
        await expect(root).toHaveAttribute('data-orientation', orientation);
        const style = await readPresentation(root);
        expect(style.rootDisplay, prefix).toBe(orientation === 'vertical' ? 'flex' : 'block');
        expect(style.listDirection, prefix).toBe(orientation === 'vertical' ? 'column' : 'row');
        expect(style.triggerHeight, prefix).toBe(heights[size]);
        expect(style.listBackground === 'rgba(0, 0, 0, 0)', prefix).toBe(variant !== 'enclosed');
        expect(style.triggerBorderWidth, prefix).toBe(variant === 'outline' ? '1px' : '0px');
        if (variant === 'line') {
          expect(style.listBorderBottom, prefix).toBe(orientation === 'vertical' ? '0px' : '1px');
          expect(style.listBorderEnd, prefix).toBe(orientation === 'vertical' ? '1px' : '0px');
        }
      }
    }
  }
  const fitted = page.getByTestId('tabs-css-fitted-authored');
  await expect(fitted.locator('.leverui-tabs__trigger').first()).toHaveCSS('flex', '1 1 0%');
  const teal = page.getByTestId('tabs-css-teal-authored');
  await expect(teal).toHaveAttribute('data-leverui-color-palette', 'teal');
  await teal.evaluate(
    /** Override the public palette token at the component scope. */
    (element) => element.setAttribute('style', '--lui-colors-color-palette-solid: rgb(3, 111, 77)'),
  );
  const markerColor = await teal.locator('.leverui-tabs__trigger[data-selected]').evaluate(
    /** Read the selected marker after a consumer token override. */
    (element) => getComputedStyle(element, '::before').backgroundColor,
  );
  expect(markerColor).toBe('rgb(3, 111, 77)');
  const unstyledRoot = page.getByTestId('tabs-css-unstyled-root');
  await expect(unstyledRoot).toHaveAttribute('data-unstyled', '');
  await expect(unstyledRoot.locator('.leverui-tabs__trigger')).not.toHaveCSS('height', '40px');
  const unstyledTrigger = page
    .getByTestId('tabs-css-unstyled-trigger')
    .locator('.leverui-tabs__trigger');
  await expect(unstyledTrigger).toHaveAttribute('data-unstyled', '');
  await expect(unstyledTrigger).not.toHaveCSS('height', '40px');
}

test('authored Tabs CSS covers every finite appearance', verifiesTabsCssContract);
