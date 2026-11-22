import { expect, test, type Page } from '@playwright/test';

/** Verify physical destinations, disabled rendering, children, and events. */
async function verifiesPortalContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-portal--contract');
  const first = page.getByTestId('portal-first');
  const second = page.getByTestId('portal-second');
  const inline = page.getByTestId('portal-inline-host');
  const explicit = page.getByTestId('portal-explicit');
  const button = page.getByTestId('portal-button');
  const secondChild = page.getByTestId('portal-second-child');
  const priority = page.getByTestId('portal-priority');
  const mountedDefault = page.getByTestId('portal-default');
  const grid = page.getByTestId('portal-grid');

  await expect(first.getByTestId('portal-button')).toHaveCount(1);
  await expect(first).toContainText('Plain text');
  await expect(first.getByTestId('portal-second-child')).toHaveCount(1);
  await expect(first.getByTestId('portal-direct')).toHaveCount(1);
  await expect(priority).toBeVisible();
  await expect(explicit.getByTestId('portal-priority')).toHaveCount(1);
  await expect(grid.getByTestId('portal-grid-first')).toHaveCount(1);
  await expect(grid.getByTestId('portal-grid-second')).toHaveCount(1);
  const gridLayout = await grid.evaluate(
    /** Measure the children as direct grid items through Solid's wrapper. */
    (element) => {
      const firstItem = element.querySelector('[data-testid="portal-grid-first"]');
      const secondItem = element.querySelector('[data-testid="portal-grid-second"]');
      if (!(firstItem instanceof HTMLElement) || !(secondItem instanceof HTMLElement)) {
        throw new Error('Portal grid items were not found.');
      }
      if (!firstItem.parentElement) throw new Error('Portal grid wrapper was not found.');
      const firstBox = firstItem.getBoundingClientRect();
      const secondBox = secondItem.getBoundingClientRect();
      return {
        wrapperDisplay: getComputedStyle(firstItem.parentElement).display,
        columnOffset: secondBox.x - firstBox.x,
        rowOffset: secondBox.y - firstBox.y,
      };
    },
  );
  expect(gridLayout.wrapperDisplay).toBe('contents');
  expect(gridLayout.columnOffset).toBeCloseTo(80);
  expect(gridLayout.rowOffset).toBe(0);
  await expect
    .poll(
      /** Check the default content's physical destination. */
      () =>
        mountedDefault.evaluate(
          /** Account for Solid's event-preserving portal container. */
          (element) => element.parentElement?.parentElement === document.body,
        ),
    )
    .toBe(true);
  await button.click();
  await expect(button).toHaveText('Clicks: 1');

  await page.getByTestId('portal-switch').click();
  await expect(second.getByTestId('portal-button')).toHaveCount(1);
  await expect(first.getByTestId('portal-button')).toHaveCount(0);
  await expect(first.getByTestId('portal-direct')).toHaveCount(1);
  await expect(secondChild).toHaveCount(1);
  await expect(explicit.getByTestId('portal-priority')).toHaveCount(1);

  await page.getByTestId('portal-disable').click();
  await expect(inline.getByTestId('portal-button')).toHaveCount(1);
  await expect(second.getByTestId('portal-button')).toHaveCount(0);
  await button.click();
  await expect(button).toHaveText('Clicks: 2');
  await page.getByTestId('portal-disable').click();
  await expect(second.getByTestId('portal-button')).toHaveCount(1);
  await expect(button).toHaveCount(1);
}

test('Portal preserves content and events across custom destinations', verifiesPortalContract);
