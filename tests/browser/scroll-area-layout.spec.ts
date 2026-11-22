import { expect, test, type Page } from '@playwright/test';

/** Read the native viewport's scroll extent without assuming a fixed font. */
async function readExtent(page: Page, testId: string): Promise<{ x: number; y: number }> {
  return page.getByTestId(testId).evaluate(
    /** Compare scrollable content with the current viewport box. */
    (element) => ({
      x: element.scrollWidth - element.clientWidth,
      y: element.scrollHeight - element.clientHeight,
    }),
  );
}

/** Verify the default vertical structure and native scrolling. */
async function verifiesBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--basic');
  const viewport = page.getByTestId('scroll-viewport');
  const scrollbar = page.getByTestId('scrollbar');
  expect((await readExtent(page, 'scroll-viewport')).y).toBeGreaterThan(0);
  await expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
  await expect(scrollbar).toHaveAttribute('data-overflow-y', '');
  await expect(scrollbar.locator('[data-scroll-area-thumb]')).toHaveCount(1);
  await viewport.hover();
  await page.mouse.wheel(0, 150);
  await expect
    .poll(
      /** Observe a real viewport scroll rather than only a style class. */
      () =>
        viewport.evaluate(
          /** Read the vertical offset of the scrolling element. */
          (element) => element.scrollTop,
        ),
    )
    .toBeGreaterThan(0);
}

test('ScrollArea renders a vertical viewport and default thumb', verifiesBasic);

/** Verify variant and size changes update authored CSS in place. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--variants');
  const root = page.getByTestId('variant-root');
  const viewport = page.getByTestId('variant-viewport');
  const scrollbar = page.getByTestId('variant-scrollbar');
  await expect(scrollbar).toHaveCSS('opacity', '0');
  const before = await root.evaluate(
    /** Read the configured scrollbar thickness from the native root. */
    (element) => getComputedStyle(element).getPropertyValue('--leverui-private-scroll-area-size'),
  );
  await page.getByRole('button', { name: 'Always visible' }).click();
  await expect(scrollbar).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Large scrollbar' }).click();
  const after = await root.evaluate(
    /** Read the larger CSS size after the reactive update. */
    (element) => getComputedStyle(element).getPropertyValue('--leverui-private-scroll-area-size'),
  );
  expect(after).not.toBe(before);
  expect((await readExtent(page, 'variant-viewport')).y).toBeGreaterThan(0);
  await expect(viewport).toBeVisible();
}

test('ScrollArea follows reactive visibility and size variants', verifiesVariants);

/** Confirm horizontal overflow and the correct machine orientation. */
async function verifiesHorizontal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--horizontal');
  const viewport = page.getByTestId('horizontal-viewport');
  const scrollbar = page.getByTestId('horizontal-scrollbar');
  expect((await readExtent(page, 'horizontal-viewport')).x).toBeGreaterThan(0);
  await expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal');
  await expect(scrollbar.locator('[data-scroll-area-thumb]')).toHaveCount(1);
  await viewport.hover();
  await page.mouse.wheel(150, 0);
  await expect
    .poll(
      /** Observe native horizontal movement from a wheel gesture. */
      () =>
        viewport.evaluate(
          /** Read the horizontal offset of the scrolling element. */
          (element) => element.scrollLeft,
        ),
    )
    .toBeGreaterThan(0);
}

test('ScrollArea supports horizontal wheel scrolling', verifiesHorizontal);

/** Confirm simultaneous overflow renders both scrollbars and the corner. */
async function verifiesBothDirections({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--both-directions');
  const extent = await readExtent(page, 'both-viewport');
  expect(extent.x).toBeGreaterThan(0);
  expect(extent.y).toBeGreaterThan(0);
  await expect(page.getByTestId('vertical-scrollbar')).toHaveAttribute('data-overflow-y', '');
  await expect(page.getByTestId('horizontal-scrollbar')).toHaveAttribute('data-overflow-x', '');
  await expect(page.getByTestId('scroll-corner')).toBeVisible();
}

test('ScrollArea renders two directions and their corner', verifiesBothDirections);

/** Keep RTL locale information on the machine-owned scrolling surface. */
async function verifiesRtl({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--rtl');
  const viewport = page.getByTestId('rtl-viewport');
  expect((await readExtent(page, 'rtl-viewport')).y).toBeGreaterThan(0);
  await expect(page.getByTestId('rtl-scrollbar')).toHaveAttribute('data-overflow-y', '');
  await expect(viewport).toBeVisible();
}

test('ScrollArea keeps RTL content scrollable', verifiesRtl);

/** Confirm unstyled parts keep machine behavior and consumer CSS hooks. */
async function verifiesUnstyled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--unstyled');
  const root = page.getByTestId('unstyled-root');
  const viewport = page.getByTestId('unstyled-viewport');
  const scrollbar = page.getByTestId('unstyled-scrollbar');
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(viewport).toHaveAttribute('data-unstyled', '');
  await expect(scrollbar).toHaveAttribute('data-unstyled', '');
  await expect(root).toHaveClass(/custom-scroll-area/);
  await expect(scrollbar).toHaveClass(/leverui-scroll-area__scrollbar/);
  await expect(root).toHaveCSS('display', 'block');
  await page.addStyleTag({
    content:
      '.custom-scroll-area .leverui-scroll-area__scrollbar { background: rgb(255, 0, 0); width: 14px; }',
  });
  await expect(scrollbar).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  await expect(scrollbar).toHaveCSS('width', '14px');
}

test('ScrollArea unstyled parts accept consumer CSS', verifiesUnstyled);
