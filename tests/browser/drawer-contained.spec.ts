import { expect, test, type Page } from '@playwright/test';

const arrayCases = [
  [400, false],
  [500, true],
  [800, true],
  [1100, true],
  [1300, true],
  [1600, true],
] as const;
const rangeCases = [
  [400, true],
  [700, true],
  [900, true],
  [1100, true],
  [1400, true],
  [1600, false],
] as const;

/** Verify responsive contained presentation without replacing the primitive content. */
async function verifyContained(
  page: Page,
  story: string,
  cases: readonly (readonly [number, boolean])[],
): Promise<void> {
  await page.setViewportSize({ width: cases[0]?.[0] ?? 400, height: 700 });
  await page.goto(`/iframe.html?id=${story}`);
  const content = page.getByTestId('drawer-responsive-css-content');
  const positioner = page.getByTestId('drawer-responsive-css-positioner');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-leverui-drawer-css', '');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Contained Drawer has no primitive content ID.');
  for (const [width, contained] of cases) {
    await page.setViewportSize({ width, height: 700 });
    await expect(positioner).toHaveCSS('padding', contained ? '16px' : '0px');
    await expect(content).toHaveCSS('border-top-left-radius', contained ? '6px' : '0px');
    await expect(content).toHaveAttribute('id', id);
  }
}

/** Exercise boolean arrays through the public Drawer root. */
async function verifiesContainedArray({ page }: { page: Page }): Promise<void> {
  await verifyContained(page, 'components-drawer-responsive-css--contained-array', arrayCases);
}

/** Exercise every downward boolean range through the public Drawer root. */
async function verifiesContainedRanges({ page }: { page: Page }): Promise<void> {
  await verifyContained(page, 'components-drawer-responsive-css--contained-ranges', rangeCases);
}

test('Drawer contained arrays use authored CSS', verifiesContainedArray);
test('Drawer contained ranges preserve matching true rules', verifiesContainedRanges);
