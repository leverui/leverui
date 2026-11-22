import { expect, test, type Page } from '@playwright/test';

/** Verify hover presence, semantic content, slot styling, and close behavior. */
async function verifiesHoverCardContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card--contract');
  const trigger = page.getByTestId('hover-trigger');
  const content = page.getByTestId('hover-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('hover-open')).toHaveText('true');
  await expect(content).toHaveJSProperty('tagName', 'DIV');
  await expect(content).toHaveClass(/hoverCard__content/);
  await expect(content).toHaveCSS('padding', '20px');
  await expect(page.getByTestId('hover-arrow')).toBeVisible();
  await expect(page.getByTestId('hover-arrow').locator('[data-hover-card-arrow-tip]')).toHaveCount(
    1,
  );
  await content.hover();
  await expect(content).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page.getByTestId('hover-open')).toHaveText('false');
  await expect(content).toHaveCount(0);
}

test(
  'Hover Card composes the primitive hover behavior with Lever UI slots',
  verifiesHoverCardContract,
);

/** Verify keyboard focus can open and Escape can dismiss the preview. */
async function verifiesHoverCardKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card--contract');
  const trigger = page.getByTestId('hover-trigger');
  const content = page.getByTestId('hover-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.focus();
  await expect(content).toBeVisible();
  // Zag installs its dismissable layer on a deferred animation frame.
  await page.waitForTimeout(100);
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Hover Card opens on focus and dismisses on Escape', verifiesHoverCardKeyboard);
