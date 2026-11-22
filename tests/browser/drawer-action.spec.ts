import { expect, test, type Page } from '@playwright/test';

/** Verify consumer clicks close the Drawer and keep normal event propagation. */
async function verifiesDrawerActions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-action--contract');
  const trigger = page.getByTestId('action-drawer-trigger');
  const content = page.getByTestId('action-drawer-content');
  const bubbles = page.getByTestId('action-drawer-bubbles');
  await expect(trigger).toBeVisible({ timeout: 30_000 });

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('action-drawer-prevented')).toHaveClass(
    /leverui-drawer__actionTrigger/,
  );
  // The prevented action is a Lever-owned button, not a primitive drawer part.
  await expect(page.getByTestId('action-drawer-prevented')).not.toHaveAttribute(
    'data-drawer-close-trigger',
  );
  const beforePrevented = Number(await bubbles.textContent());
  await page.getByTestId('action-drawer-prevented').click();
  await expect(page.getByTestId('action-drawer-result')).toHaveText('prevented:true');
  await expect(content).toHaveCount(0);
  await expect(bubbles).toHaveText(String(beforePrevented + 1));

  await trigger.click();
  await expect(content).toBeVisible();
  const beforeBound = Number(await bubbles.textContent());
  await page.getByTestId('action-drawer-bound').click();
  await expect(page.getByTestId('action-drawer-result')).toHaveText('bound:click');
  await expect(content).toHaveCount(0);
  await expect(bubbles).toHaveText(String(beforeBound + 1));

  await trigger.click();
  await expect(content).toBeVisible();
  const beforeChild = Number(await bubbles.textContent());
  await page.getByTestId('action-drawer-child').click();
  await expect(page.getByTestId('action-drawer-result')).toHaveText('child');
  await expect(content).toHaveCount(0);
  await expect(bubbles).toHaveText(String(beforeChild + 1));
}

test('Drawer ActionTrigger preserves consumer-first click behavior', verifiesDrawerActions);
