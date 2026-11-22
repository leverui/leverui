import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Require a generated native ID before checking an ARIA relationship. */
async function requiredId(locator, name) {
  const id = await locator.getAttribute('id');
  assert.ok(id, `Packed Tabs ${name} is missing an ID.`);
  return id;
}

/** Verify installed Tabs selection, relationships, and authored CSS sizing. */
export async function verifyPackedTabs(page) {
  const firstTab = page.getByTestId('packed-tab-one');
  const secondTab = page.getByTestId('packed-tab-two');
  const firstPanel = page.getByTestId('packed-panel-one');
  const secondPanel = page.getByTestId('packed-panel-two');
  const firstTabId = await requiredId(firstTab, 'first trigger');
  const firstPanelId = await requiredId(firstPanel, 'first panel');
  const secondTabId = await requiredId(secondTab, 'second trigger');
  const secondPanelId = await requiredId(secondPanel, 'second panel');
  assert.equal(await firstTab.getAttribute('aria-selected'), 'true');
  assert.equal(await firstTab.getAttribute('aria-controls'), firstPanelId);
  assert.equal(await firstPanel.getAttribute('aria-labelledby'), firstTabId);
  await expect(firstPanel).toBeVisible();
  assert.equal(
    await firstTab.evaluate(
      /** Read the packaged Tabs size CSS on its native trigger. */
      (element) => getComputedStyle(element).height,
    ),
    '36px',
  );
  await secondTab.click();
  assert.equal(await secondTab.getAttribute('aria-selected'), 'true');
  assert.equal(await secondTab.getAttribute('aria-controls'), secondPanelId);
  assert.equal(await secondPanel.getAttribute('aria-labelledby'), secondTabId);
  await expect(secondPanel).toBeVisible();
  await expect(firstPanel).toBeHidden();
  const familyRoot = page.getByTestId('packed-family-root');
  const familyFirst = page.getByTestId('packed-family-one');
  const familySecond = page.getByTestId('packed-family-two');
  assert.equal(
    await familyRoot.evaluate(
      /** Check that the provider's child-renderer default selected a native section. */
      (element) => element.tagName,
    ),
    'SECTION',
  );
  await expect(familyRoot).toHaveClass(/leverui-tabs__root/);
  await expect(familyFirst).toHaveAttribute('role', 'tab');
  await expect(page.getByTestId('packed-family-group')).toHaveClass(/leverui-tabs__contentGroup/);
  await expect(page.getByTestId('packed-family-probe')).toHaveText('one');
  await familySecond.click();
  await expect(familySecond).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('packed-family-panel-two')).toBeVisible();
  await expect(page.getByTestId('packed-family-probe')).toHaveText('two');
}
