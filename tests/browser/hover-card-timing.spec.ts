import { expect, test, type Page } from '@playwright/test';

/** Exercise nonzero machine delays and browser-computed top placement. */
async function verifiesHoverCardTiming({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card-timing--contract');
  const trigger = page.getByTestId('hover-timing-trigger');
  const content = page.getByTestId('hover-timing-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  // Time from before each move, so a slow machine can only make a delay look longer.
  const openStart = Date.now();
  await trigger.hover();
  await expect(content).toBeVisible({ timeout: 5_000 });
  expect(Date.now() - openStart).toBeGreaterThanOrEqual(550);

  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  if (!triggerBox || !contentBox) throw new Error('Hover Card placement boxes are missing.');
  expect(contentBox.y + contentBox.height).toBeLessThan(triggerBox.y + 8);

  const closeStart = Date.now();
  await page.mouse.move(1_000, 650);
  await expect(content).toHaveCount(0, { timeout: 5_000 });
  expect(Date.now() - closeStart).toBeGreaterThanOrEqual(350);
}

test('Hover Card honors delays and top placement', verifiesHoverCardTiming);
