import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Verify root-level disabled state blocks every item. */
async function verifiesDisabledRoot({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-behavior--disabled-root');
  const first = page.getByTestId('behavior-first');
  const second = page.getByTestId('behavior-second');
  await expect(first).toBeDisabled({ timeout: 30_000 });
  await expect(second).toBeDisabled();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('behavior-first-content')).not.toBeVisible();
}

test('Accordion root disables every trigger', verifiesDisabledRoot);

/** Follow RTL, the focus callback, and the Tab route; Zag 2 drops arrow navigation. */
async function verifiesKeyboardAndFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-behavior--keyboard');
  const first = page.getByTestId('behavior-first');
  const disabled = page.getByTestId('behavior-disabled');
  const second = page.getByTestId('behavior-second');
  const last = page.getByTestId('behavior-last');
  await expect(first).toHaveAttribute('dir', 'rtl', { timeout: 30_000 });
  await expect(disabled).toBeDisabled();
  await first.focus();
  await expect(page.getByTestId('accordion-focus-changes')).not.toHaveText('0');
  await first.press('ArrowDown');
  await expect(first).toBeFocused();
  await first.press('End');
  await expect(first).toBeFocused();
  await pressBrowserTab(page);
  await expect(second).toBeFocused();
  await pressBrowserTab(page);
  await expect(last).toBeFocused();
}

test('Accordion preserves RTL and keyboard focus changes', verifiesKeyboardAndFocus);

/** Keep a visible item expanded and remove exited lazy content. */
async function verifiesNoncollapsibleUnmount({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-behavior--noncollapsible');
  const first = page.getByTestId('behavior-first');
  const second = page.getByTestId('behavior-second');
  const firstPanel = page.getByTestId('behavior-first-content');
  const secondPanel = page.getByTestId('behavior-second-content');
  await expect(firstPanel).toHaveCount(0, { timeout: 30_000 });
  await expect(first).not.toHaveAttribute('aria-controls');
  await first.click();
  await expect(firstPanel).toBeVisible();
  const panelId = await firstPanel.getAttribute('id');
  const triggerId = await first.getAttribute('id');
  if (!panelId || !triggerId) throw new Error('Accordion disclosure IDs are missing.');
  await expect(first).toHaveAttribute('aria-controls', panelId);
  await expect(firstPanel).toHaveAttribute('aria-labelledby', triggerId);
  await expect(firstPanel).toHaveAttribute('role', 'region');
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.click();
  await expect(secondPanel).toBeVisible();
  await expect(firstPanel).toHaveCount(0);
  await expect(first).not.toHaveAttribute('aria-controls');
}

test(
  'Accordion retains noncollapsible value and unmounts lazy content',
  verifiesNoncollapsibleUnmount,
);

/** Keep nested machine values and recipe scopes independent. */
async function verifiesNestedRoots({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-nested--independent');
  const outer = page.getByTestId('outer-accordion-trigger');
  const inner = page.getByTestId('inner-accordion-trigger');
  await expect(outer).toHaveAttribute('aria-expanded', 'true', { timeout: 30_000 });
  await expect(inner).toHaveAttribute('aria-expanded', 'true');
  await inner.click();
  await expect(inner).toHaveAttribute('aria-expanded', 'false');
  await expect(outer).toHaveAttribute('aria-expanded', 'true');
  await expect(inner).toHaveClass(/accordion__itemTrigger/);
  await outer.click();
  await expect(outer).toHaveAttribute('aria-expanded', 'false');
}

test('nested Accordions keep separate state and style contexts', verifiesNestedRoots);
