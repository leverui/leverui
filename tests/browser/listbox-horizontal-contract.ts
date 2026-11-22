import { expect, type Locator } from '@playwright/test';

/** Check that a highlighted card sits wholly inside its scrollable listbox. */
function isFullyVisible(element: Element): boolean {
  const viewport = element.closest('[role="listbox"]');
  if (!viewport) return false;
  const card = element.getBoundingClientRect();
  const visible = viewport.getBoundingClientRect();
  return card.left >= visible.left - 1 && card.right <= visible.right + 1;
}

/** Return the listbox's horizontal scroll offset after keyboard navigation. */
function readScrollLeft(element: Element): number {
  return element.scrollLeft;
}

/** Require the offscreen end card to become active and enter view. */
export async function expectHorizontalEndReachable(
  listbox: Locator,
  option: Locator,
): Promise<void> {
  await expect(option).toHaveAttribute('data-highlighted');
  const optionId = await option.getAttribute('id');
  if (!optionId) throw new Error('Highlighted horizontal Listbox option has no ID.');
  await expect(listbox).toHaveAttribute('aria-activedescendant', optionId);
  await expect
    .poll(
      /** Wait for Zag's scroll effect to align the active card. */
      () => option.evaluate(isFullyVisible),
    )
    .toBe(true);
  expect(await listbox.evaluate(readScrollLeft)).toBeGreaterThan(0);
}
