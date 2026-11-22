import { expect, test, type Page } from '@playwright/test';

/** Read the current native scroll position from the published specimen. */
async function readScrollTop(page: Page, testId: string): Promise<number> {
  return page.getByTestId(testId).evaluate(
    /** Use DOM scrollTop as the programmatic control's observable result. */
    (element) => element.scrollTop,
  );
}

/** Exercise the external machine's edge and coordinate methods. */
async function verifiesProgrammatic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-controls--programmatic');
  await expect(page.getByTestId('scroll-state')).toHaveText('away');
  await page.getByRole('button', { name: 'Scroll to bottom' }).click();
  await expect
    .poll(
      /** Wait for the primitive to move the native viewport to its lower edge. */
      () => readScrollTop(page, 'controlled-viewport'),
    )
    .toBeGreaterThan(100);
  await expect(page.getByTestId('scroll-state')).toHaveText('bottom');
  await page.getByRole('button', { name: 'Scroll to 80' }).click();
  await expect
    .poll(
      /** Verify the exact-coordinate method reaches its requested target. */
      () => readScrollTop(page, 'controlled-viewport'),
    )
    .toBe(80);
  await page.getByRole('button', { name: 'Scroll to top' }).click();
  await expect
    .poll(
      /** Confirm the same machine can return to its upper edge. */
      () => readScrollTop(page, 'controlled-viewport'),
    )
    .toBe(0);
}

test('ScrollArea RootProvider exposes programmatic scrolling', verifiesProgrammatic);

/** Confirm inherited appearance defaults follow Solid state changes. */
async function verifiesDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-controls--defaults');
  const root = page.getByTestId('defaulted-root');
  /** Read the active scrollbar thickness after each state change. */
  async function readSize(): Promise<string> {
    return root.evaluate(
      /** Read the current inherited scrollbar thickness. */
      (element) => getComputedStyle(element).getPropertyValue('--leverui-private-scroll-area-size'),
    );
  }
  const before = await readSize();
  await page.getByRole('button', { name: 'Enlarge inherited scrollbar' }).click();
  await expect.poll(readSize).not.toBe(before);
  await expect(page.getByTestId('defaulted-viewport')).toBeVisible();
}

test('ScrollArea PropsProvider keeps appearance defaults reactive', verifiesDefaults);

/** Verify consumer slot CSS reaches the actual viewport and thumb. */
async function verifiesCustomStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-controls--custom-styles');
  const viewport = page.getByTestId('shadow-viewport');
  const thumb = page.getByTestId('custom-thumb');
  await expect(viewport).toHaveAttribute('data-overflow-y', '');
  await expect(viewport).toHaveCSS('mask-image', /linear-gradient/);
  await expect(thumb).toHaveCSS('background-color', /rgb\(/);
}

test('ScrollArea accepts viewport and thumb CSS overrides', verifiesCustomStyles);
