import { expect, test, type Page } from '@playwright/test';

/** Verify that selected and caller-owned triggers retain refs and ARIA links. */
async function verifiesTooltipRefs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-refs--contract');
  const selected = page.getByTestId('tooltip-selected-trigger');
  const child = page.getByTestId('tooltip-child-trigger');
  const selectedContent = page.getByTestId('tooltip-selected-content');
  const childContent = page.getByTestId('tooltip-child-content');
  await expect(selected).toBeVisible({ timeout: 30_000 });
  await expect(selected).toHaveJSProperty('tagName', 'A');
  await expect(page.getByTestId('tooltip-selected-ref')).toHaveText('A');
  await expect(page.getByTestId('tooltip-parent-ref')).toHaveText('BUTTON');
  await expect(page.getByTestId('tooltip-child-ref')).toHaveText('BUTTON');

  await selected.hover();
  await expect(selectedContent).toBeVisible();
  const selectedId = await selectedContent.getAttribute('id');
  if (!selectedId) throw new Error('Selected Tooltip content has no ID.');
  await expect(selected).toHaveAttribute('aria-describedby', selectedId);
  await selected.focus();
  await page.keyboard.press('Escape');
  await expect(selectedContent).toHaveCount(0);
  await expect(selected).toBeFocused();

  await child.hover();
  await expect(childContent).toBeVisible();
  const childId = await childContent.getAttribute('id');
  if (!childId) throw new Error('Caller-owned Tooltip content has no ID.');
  await expect(child).toHaveAttribute('aria-describedby', childId);
}

test('Tooltip triggers preserve native refs and accessible descriptions', verifiesTooltipRefs);

/** Preserve tooltip semantics when the root supplies an accessible name. */
async function verifiesLabelledTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-refs--contract');
  const trigger = page.getByTestId('tooltip-labelled-trigger');
  const content = page.getByTestId('tooltip-labelled-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'tooltip');
  await expect(content).toHaveAccessibleName('Named tooltip');
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Named Tooltip content has no ID.');
  await expect(trigger).toHaveAttribute('aria-describedby', contentId);
}

test('Tooltip follows the primitive aria-label content semantics', verifiesLabelledTooltip);
