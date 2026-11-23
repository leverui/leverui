import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Require one generated ID before checking its accessible relationship. */
async function requiredId(locator, name) {
  const id = await locator.getAttribute('id');
  assert.ok(id, `Packed Steps ${name} is missing an ID.`);
  return id;
}

/** Verify the installed Steps machine, orientation, and completion flow. */
export async function verifyPackedSteps(page) {
  const root = page.getByTestId('packed-steps-root');
  const first = page.getByTestId('packed-steps-first');
  const second = page.getByTestId('packed-steps-second');
  const firstPanel = page.getByTestId('packed-steps-panel-first');
  const secondPanel = page.getByTestId('packed-steps-panel-second');
  const previous = page.getByTestId('packed-steps-prev');
  const next = page.getByTestId('packed-steps-next');
  const indicator = page.getByTestId('packed-steps-indicator');
  const firstId = await requiredId(first, 'first trigger');
  const secondId = await requiredId(second, 'second trigger');
  const firstPanelId = await requiredId(firstPanel, 'first panel');
  const secondPanelId = await requiredId(secondPanel, 'second panel');
  await expect(root).toHaveClass(/lui-steps__root/);
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(root.locator('[data-steps-list]')).toHaveCSS('flex-direction', 'column');
  assert.equal(await root.getAttribute('orientation'), null);
  await expect(first).toHaveAttribute('role', 'tab');
  await expect(second).toHaveAttribute('role', 'tab');
  await expect(first).toHaveAccessibleName(/First/);
  await expect(second).toHaveAccessibleName(/Second/);
  await expect(first).toHaveAttribute('aria-controls', firstPanelId);
  await expect(second).toHaveAttribute('aria-controls', secondPanelId);
  await expect(firstPanel).toHaveAttribute('role', 'tabpanel');
  await expect(secondPanel).toHaveAttribute('role', 'tabpanel');
  await expect(firstPanel).toHaveAttribute('aria-labelledby', firstId);
  await expect(secondPanel).toHaveAttribute('aria-labelledby', secondId);
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(firstPanel).toBeVisible();
  await expect(secondPanel).toBeHidden();
  await expect(previous).toBeDisabled();
  await expect(indicator).toHaveCSS('width', '32px');
  await expect(indicator).toHaveCSS('height', '32px');
  await expect(indicator).toHaveCSS('background-color', 'rgb(228, 228, 231)');
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('step-0:ready');
  await second.focus();
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(second).toBeFocused();
  await expect(secondPanel).toBeVisible();
  await expect(firstPanel).toBeHidden();
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('step-1:ready');
  await expect(previous).toBeEnabled();
  // Zag 2 completes the flow only after every required step is completed.
  // Jumping ahead with a trigger leaves the first step incomplete.
  await next.click();
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('step-1:ready');
  await expect(page.getByTestId('packed-steps-complete')).toBeHidden();
  await previous.click();
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('step-0:ready');
  await next.click();
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('step-1:ready');
  await next.click();
  await expect(page.getByTestId('packed-steps-complete')).toBeVisible();
  await expect(page.getByTestId('packed-steps-probe')).toHaveText('__complete__:ready');
  await expect(next).toBeDisabled();
}
