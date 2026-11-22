import { expect, type Locator } from '@playwright/test';

/** Wait until Zag's visible indicator aligns with the selected segment. */
export async function expectIndicatorAligned(indicator: Locator, item: Locator): Promise<void> {
  await expect(indicator).toBeVisible();
  await expect
    .poll(
      /** Measure both axes after collection, recipe, or viewport changes. */
      async () => {
        const indicatorBox = await indicator.boundingBox();
        const itemBox = await item.boundingBox();
        if (!indicatorBox || !itemBox) return Number.POSITIVE_INFINITY;
        return Math.max(Math.abs(indicatorBox.x - itemBox.x), Math.abs(indicatorBox.y - itemBox.y));
      },
    )
    .toBeLessThan(2);
}
