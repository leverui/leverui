import { expect, test, type Page } from '@playwright/test';

const arrayCases = [
  [400, '320px', 'slide-from-left-full, fade-in'],
  [500, '448px', 'slide-from-right-full, fade-in'],
  [800, '100%', 'slide-from-top-full, fade-in'],
  [1100, '100%', 'slide-from-bottom-full, fade-in'],
  [1300, '896px', 'slide-from-left-full, fade-in'],
  [1600, '1600px', 'slide-from-right-full, fade-in'],
] as const;

const downCases = [
  [400, '320px', 'slide-from-left-full, fade-in'],
  [700, '700px', 'slide-from-right-full, fade-in'],
  [900, '100%', 'slide-from-bottom-full, fade-in'],
  [1100, '100%', 'slide-from-top-full, fade-in'],
  [1400, '512px', 'slide-from-left-full, fade-in'],
  [1600, '1600px', 'slide-from-right-full, fade-in'],
] as const;

/** Read live Drawer geometry while the same primitive machine stays mounted. */
async function verifyChoices(
  page: Page,
  story: string,
  cases: readonly (readonly [number, string, string])[],
): Promise<void> {
  await page.setViewportSize({ width: cases[0]?.[0] ?? 400, height: 700 });
  await page.goto(`/iframe.html?id=${story}`);
  const content = page.getByTestId('drawer-responsive-css-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Responsive Drawer has no primitive content ID.');
  for (const [width, maxWidth, animation] of cases) {
    await page.setViewportSize({ width, height: 700 });
    await expect(content).toHaveCSS('max-width', maxWidth);
    await expect(content).toHaveCSS('animation-name', animation);
    await expect(content).toHaveAttribute('id', id);
  }
}

/** Verify every supported ordinary breakpoint from a public array prop. */
async function verifiesArrayChoices({ page }: { page: Page }): Promise<void> {
  await verifyChoices(page, 'components-drawer-responsive-css--array-choices', arrayCases);
}

/** Verify each downward range and its precedence over wider ranges. */
async function verifiesDownChoices({ page }: { page: Page }): Promise<void> {
  await verifyChoices(page, 'components-drawer-responsive-css--down-choices', downCases);
}

test('Drawer array choices use authored CSS at every breakpoint', verifiesArrayChoices);
test('Drawer downward ranges use authored CSS without style tags', verifiesDownChoices);
