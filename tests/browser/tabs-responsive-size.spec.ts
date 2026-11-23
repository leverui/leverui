import { expect, test, type Locator, type Page } from '@playwright/test';

const widths = [400, 600, 800, 1100, 1300, 1600] as const;
const expected = [
  { height: '36px', padding: '4px 12px', fontSize: '14px', lineHeight: '20px' },
  { height: '44px', padding: '8px 18px', fontSize: '16px', lineHeight: '24px' },
  { height: '40px', padding: '8px 16px', fontSize: '14px', lineHeight: '20px' },
  { height: '36px', padding: '4px 12px', fontSize: '14px', lineHeight: '20px' },
  { height: '44px', padding: '8px 18px', fontSize: '16px', lineHeight: '24px' },
  { height: '40px', padding: '8px 16px', fontSize: '14px', lineHeight: '20px' },
] as const;

/** Read computed tab trigger sizing after the current breakpoint applies. */
async function readSize(root: Locator): Promise<Record<string, string>> {
  return root.evaluate(
    /** Sample the native trigger rather than authored CSS declarations. */
    (element) => {
      const trigger = element.querySelector('.lui-tabs__trigger');
      if (!trigger) throw new Error('Tabs trigger is missing.');
      const style = getComputedStyle(trigger);
      return {
        height: style.height,
        padding: style.padding,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      };
    },
  );
}

/** Check every responsive size against its rendered token values. */
async function verifiesTabsResponsiveSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-size--contract');
  const root = page.getByTestId('tabs-size-authored');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size-sm', 'lg');
  await expect(root).toHaveAttribute('data-size-md', 'md');
  await expect(root).toHaveAttribute('data-size-lg', 'sm');
  await expect(root).toHaveAttribute('data-size-xl', 'lg');
  await expect(root).toHaveAttribute('data-size-2xl', 'md');
  for (const [index, width] of widths.entries()) {
    await page.setViewportSize({ width, height: 800 });
    expect(await readSize(root), `${width}px`).toEqual(expected[index]);
  }
}

test('responsive Tabs sizes use authored CSS at every breakpoint', verifiesTabsResponsiveSizes);
