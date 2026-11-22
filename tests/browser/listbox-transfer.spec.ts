import { expect, test, type Page } from '@playwright/test';

/** Verify selected items travel between two controlled Listboxes. */
async function verifiesTransferList({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-transfer--guide');
  const available = page.getByRole('listbox', { name: 'Available characters' });
  const selected = page.getByRole('listbox', { name: 'Selected characters' });
  const right = page.getByRole('button', { name: 'Move selected characters right' });
  const left = page.getByRole('button', { name: 'Move selected characters left' });

  await expect(available.getByRole('option')).toHaveCount(15, { timeout: 30_000 });
  await expect(selected).toContainText('No items available');
  await expect(right).toBeDisabled();
  await expect(left).toBeDisabled();

  await available.getByRole('option', { name: 'Wren' }).click();
  await expect(right).toBeEnabled();
  await right.click();
  await expect(available.getByRole('option', { name: 'Wren' })).toHaveCount(0);
  await expect(selected.getByRole('option', { name: 'Wren' })).toHaveCount(1);
  await expect(right).toBeDisabled();

  await selected.getByRole('option', { name: 'Wren' }).click();
  await expect(left).toBeEnabled();
  await left.click();
  await expect(selected).toContainText('No items available');
  await expect(available.getByRole('option', { name: 'Wren' })).toHaveCount(1);
  await expect(left).toBeDisabled();
}

test('Listbox guide transfer moves items in both directions', verifiesTransferList);

/** Keep several keyboard-selected values when the transfer button is activated. */
async function verifiesKeyboardMultiTransfer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-transfer--guide');
  const available = page.getByRole('listbox', { name: 'Available characters' });
  const selected = page.getByRole('listbox', { name: 'Selected characters' });
  const wren = available.getByRole('option', { name: 'Wren' });
  const corin = available.getByRole('option', { name: 'Corin' });
  await expect(wren).toBeVisible({ timeout: 30_000 });
  await available.focus();
  await available.press('Enter');
  await expect(wren).toHaveAttribute('aria-selected', 'true');
  await available.press('ArrowDown');
  await available.press('Enter');
  await expect(corin).toHaveAttribute('aria-selected', 'true');
  const right = page.getByRole('button', { name: 'Move selected characters right' });
  await right.focus();
  await right.press('Enter');
  await expect(available.getByRole('option')).toHaveCount(13);
  await expect(selected.getByRole('option')).toHaveCount(2);
  await expect(selected.getByRole('option', { name: 'Wren' })).toHaveCount(1);
  await expect(selected.getByRole('option', { name: 'Corin' })).toHaveCount(1);
  await expect(right).toBeDisabled();
}

test('Listbox transfers multiple keyboard-selected options', verifiesKeyboardMultiTransfer);

/** Reveal the final appended option after its destination begins overflowing. */
async function verifiesDestinationScroll({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox-transfer--guide');
  const available = page.getByRole('listbox', { name: 'Available characters' });
  const selected = page.getByRole('listbox', { name: 'Selected characters' });
  const right = page.getByRole('button', { name: 'Move selected characters right' });
  await expect(available.getByRole('option')).toHaveCount(15, { timeout: 30_000 });

  for (const option of (await available.getByRole('option').all()).slice(0, 14)) {
    await option.click();
    await expect(option).toHaveAttribute('aria-selected', 'true');
  }
  await right.click();
  await expect(selected.getByRole('option')).toHaveCount(14);
  const before = await selected.evaluate(
    /** Read the current destination scroll offset before appending the final item. */
    (element) => element.scrollTop,
  );
  await available.getByRole('option', { name: 'Linnea', exact: true }).click();
  await right.click();
  const moved = selected.getByRole('option', { name: 'Linnea', exact: true });
  await expect(moved).toHaveCount(1);
  await expect
    .poll(
      /** Wait for the animation frame that reveals the last moved option. */
      () =>
        selected.evaluate(
          /** Observe the live destination's scroll offset. */
          (element) => element.scrollTop,
        ),
    )
    .toBeGreaterThan(before);
  await expect
    .poll(
      /** Confirm the moved item is fully inside the scroll viewport. */
      () =>
        moved.evaluate(
          /** Compare the option's bounds with its owning Listbox content. */
          (element) => {
            const item = element.getBoundingClientRect();
            const content = element.closest('[role="listbox"]')?.getBoundingClientRect();
            return Boolean(content && item.top >= content.top && item.bottom <= content.bottom);
          },
        ),
    )
    .toBe(true);
}

test(
  'Listbox transfer scrolls the overflowing destination to the moved option',
  verifiesDestinationScroll,
);
