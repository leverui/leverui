import { expect, test, type Page } from '@playwright/test';

/** Verify selection, accessible options, and live CSS appearance in Chromium. */
async function verifiesListboxBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox--contract');
  const root = page.getByTestId('listbox-root');
  const content = page.getByRole('listbox');
  const solid = page.getByRole('option', { name: 'Solid' });
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/lui-listbox__root/);
  await expect(content).toHaveAttribute('aria-labelledby', /label/);
  await expect(content).toHaveAttribute('data-orientation', 'vertical');
  await expect(page.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-disabled', 'true');
  await solid.click();
  await expect(solid).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('listbox-selected')).toHaveText('solid');
  const originalBackground = await solid.evaluate(
    /** Read the subtle selected-item color before switching variants. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await content.evaluate(
    /** Mark the native node so a variant change cannot silently replace it. */
    (element) => element.setAttribute('data-original-content', 'true'),
  );
  await page.getByTestId('toggle-listbox-variant').click();
  await expect(content).toHaveAttribute('data-original-content', 'true');
  const solidBackground = await solid.evaluate(
    /** Read the selected-item color after switching to solid. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(solidBackground).not.toBe(originalBackground);
  await page.getByTestId('toggle-listbox-orientation').click();
  await expect(content).toHaveAttribute('data-orientation', 'horizontal');
  await expect(content).toHaveCSS('flex-direction', 'row');
}

test(
  'Listbox selects and updates CSS appearance without replacing the content',
  verifiesListboxBrowser,
);

/** Verify filtering, empty state, disabled state, and keyboard selection. */
async function verifiesListboxFiltering({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox--contract');
  const input = page.getByTestId('listbox-input');
  const content = page.getByRole('listbox');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await input.fill('zz');
  await expect(page.getByText('No matching frameworks')).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(0);
  await input.fill('React');
  await expect(page.getByRole('option', { name: 'React' })).toBeVisible();
  await content.focus();
  await content.press('ArrowDown');
  await content.press('Enter');
  await expect(page.getByTestId('listbox-selected')).toHaveText('react');
}

test('Listbox filters and selects from the keyboard', verifiesListboxFiltering);
