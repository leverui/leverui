import { expect, test, type Locator, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

const sizes = [
  { name: 'xs', width: 24, height: 12 },
  { name: 'sm', width: 32, height: 16 },
  { name: 'md', width: 40, height: 20 },
  { name: 'lg', width: 48, height: 24 },
] as const;

/** Read computed track and thumb values from one rendered Switch. */
async function readAppearance(root: ReturnType<Page['getByTestId']>): Promise<{
  width: string;
  height: string;
  background: string;
  translate: string;
}> {
  return root.evaluate(
    /** Measure the actual visual parts rather than recipe source objects. */
    (element) => {
      const control = element.querySelector('.leverui-switch__control');
      const thumb = element.querySelector('.leverui-switch__thumb');
      if (!control || !thumb) throw new Error('Switch visual parts were not rendered.');
      const trackStyle = getComputedStyle(control);
      return {
        width: trackStyle.width,
        height: trackStyle.height,
        background: trackStyle.backgroundColor,
        translate: getComputedStyle(thumb).translate,
      };
    },
  );
}

/** Cover checked fills, track sizes, thumb travel, RTL, and public CSS tokens. */
async function verifiesSwitchVisuals({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-visual--contract');
  for (const { name, width, height } of sizes) {
    for (const variant of ['solid', 'raised'] as const) {
      const off = page.getByTestId(`visual-${name}-${variant}-off`);
      const on = page.getByTestId(`visual-${name}-${variant}-on`);
      await expect(off).toBeVisible({ timeout: 30_000 });
      const before = await readAppearance(off);
      const after = await readAppearance(on);
      expect(before.width).toBe(`${width}px`);
      expect(after.width).toBe(`${width}px`);
      expect(before.height).toBe(`${variant === 'solid' ? height : height / 2}px`);
      expect(after.height).toBe(before.height);
      expect(after.background).not.toBe(before.background);
      expect(Number.parseFloat(after.translate)).toBe(width - height);
      await expect(on.getByRole('checkbox')).toBeChecked();
      await expect(off.getByRole('checkbox')).not.toBeChecked();
    }
  }
  const tokenControl = page
    .getByTestId('visual-token-override')
    .locator('.leverui-switch__control');
  await expect(tokenControl).toHaveCSS('background-color', 'rgb(3, 111, 77)');
  const rtlRoot = page.getByTestId('visual-rtl');
  await expect(rtlRoot).toHaveAttribute('dir', 'rtl');
  const rtlAppearance = await readAppearance(rtlRoot);
  expect(Number.parseFloat(rtlAppearance.translate)).toBe(-20);
  const dark = await readAppearance(page.getByTestId('visual-dark'));
  const light = await readAppearance(page.getByTestId('visual-light'));
  expect(dark.background).not.toBe(light.background);
}

test(
  'Switch visual branches match their size, state, direction, and tokens',
  verifiesSwitchVisuals,
);

/** Verify the visible outside ring applied by the focused recipe slot. */
async function expectOutsideFocusRing(part: Locator): Promise<void> {
  await expect(part).toHaveCSS('outline-style', 'solid');
  await expect(part).toHaveCSS('outline-width', '2px');
  await expect(part).toHaveCSS('outline-offset', '2px');
}

/** Check keyboard focus rings on both recipe variants. */
async function verifiesSwitchFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-visual--contract');
  const solid = page.getByTestId('visual-xs-solid-off');
  await solid.getByRole('checkbox').focus();
  await pressBrowserTab(page);
  await pressBrowserTab(page, true);
  await expect(solid.getByRole('checkbox')).toBeFocused();
  const solidControl = solid.locator('.leverui-switch__control');
  await expect(solidControl).toHaveAttribute('data-focus-visible', '');
  await expectOutsideFocusRing(solidControl);
  const raised = page.getByTestId('visual-xs-raised-off');
  await raised.getByRole('checkbox').focus();
  await pressBrowserTab(page);
  await pressBrowserTab(page, true);
  await expect(raised.getByRole('checkbox')).toBeFocused();
  const raisedThumb = raised.locator('.leverui-switch__thumb');
  await expect(raisedThumb).toHaveAttribute('data-focus-visible', '');
  await expectOutsideFocusRing(raisedThumb);
}

test('Switch displays keyboard focus for both visual variants', verifiesSwitchFocus);
