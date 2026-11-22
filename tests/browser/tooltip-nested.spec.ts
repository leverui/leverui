import { expect, test, type Page } from '@playwright/test';

/** Verify actual placement and dismissal while Tooltip lives inside Dialog. */
async function verifiesNestedTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-nested--dialog');
  const dialogTrigger = page.getByTestId('tooltip-dialog-trigger');
  const dialog = page.getByTestId('tooltip-dialog-content');
  const trigger = page.getByTestId('nested-tooltip-trigger');
  const content = page.getByTestId('nested-tooltip-content');
  await expect(dialogTrigger).toBeVisible({ timeout: 30_000 });
  await dialogTrigger.click();
  await expect(dialog).toBeVisible();
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-placement', 'right');
  await expect
    .poll(
      /** Wait for the primitive's floating layout to settle after the dialog opens. */
      async () => {
        const triggerBounds = await trigger.boundingBox();
        const contentBounds = await content.boundingBox();
        if (!triggerBounds || !contentBounds) return Number.NEGATIVE_INFINITY;
        return contentBounds.x - (triggerBounds.x + triggerBounds.width);
      },
    )
    .toBeGreaterThanOrEqual(-1);
  await page.mouse.move(0, 0);
  await expect(content).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(dialogTrigger).toBeFocused();
}

test('Tooltip positions and dismisses independently inside Dialog', verifiesNestedTooltip);
