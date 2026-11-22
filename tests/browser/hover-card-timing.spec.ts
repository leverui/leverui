import { expect, test, type Page } from '@playwright/test';

/** Exercise nonzero machine delays and browser-computed top placement. */
async function verifiesHoverCardTiming({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card-timing--contract');
  const trigger = page.getByTestId('hover-timing-trigger');
  const content = page.getByTestId('hover-timing-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.hover();
  await page.waitForTimeout(120);
  await expect(content).toHaveCount(0);
  await expect(content).toBeVisible({ timeout: 5_000 });

  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  if (!triggerBox || !contentBox) throw new Error('Hover Card placement boxes are missing.');
  expect(contentBox.y + contentBox.height).toBeLessThan(triggerBox.y + 8);

  await page.mouse.move(1_000, 650);
  await page.waitForTimeout(120);
  await expect(content).toBeVisible();
  await expect(content).toHaveCount(0, { timeout: 5_000 });
}

test('Hover Card honors delays and top placement', verifiesHoverCardTiming);
