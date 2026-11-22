import { expect, test, type Page } from '@playwright/test';

/** Open a fresh copy of the behavior fixture for each machine path. */
async function openFixture(page: Page): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs-behavior--contract');
  await expect(page.getByTestId('behavior-first')).toBeVisible({ timeout: 30_000 });
}

/** Check that the last tab retains focus when looping is disabled. */
async function verifiesNoLoop({ page }: { page: Page }): Promise<void> {
  await openFixture(page);
  const second = page.getByTestId('behavior-second');
  await second.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeFocused();
}

/** Check deselection and activation of a native link trigger. */
async function verifiesLinkAndDeselect({ page }: { page: Page }): Promise<void> {
  await openFixture(page);
  const first = page.getByTestId('behavior-first');
  await page.getByTestId('behavior-second').click();
  await first.click();
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/#tabs-first$/);
  await first.click();
  await expect(first).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByTestId('behavior-second')).toHaveAttribute('aria-selected', 'false');
}

/** Check that changing orientation updates the primitive's keyboard direction. */
async function verifiesOrientationChange({ page }: { page: Page }): Promise<void> {
  await openFixture(page);
  await page.getByTestId('toggle-orientation').click();
  await expect(page.getByTestId('behavior-root')).toHaveAttribute('data-orientation', 'vertical');
  const first = page.getByTestId('behavior-first');
  const second = page.getByTestId('behavior-second');
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(second).toBeFocused();
}

/** Check dynamic triggers and panels follow controlled Solid state. */
async function verifiesDynamicTabs({ page }: { page: Page }): Promise<void> {
  await openFixture(page);
  await page.getByTestId('add-third').click();
  const third = page.getByTestId('dynamic-third');
  await expect(third).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('dynamic-panel-third')).toBeVisible();
  await page.getByTestId('remove-third').click();
  await expect(third).toHaveCount(0);
  await expect(page.getByTestId('dynamic-panel-third')).toHaveCount(0);
  await expect(page.getByTestId('dynamic-first')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('dynamic-value')).toHaveText('first');
}

test('Tabs respects disabled focus looping', verifiesNoLoop);
test('Tabs link triggers select and deselect', verifiesLinkAndDeselect);
test('Tabs updates keyboard orientation reactively', verifiesOrientationChange);
test('Tabs supports changing trigger collections', verifiesDynamicTabs);
