import { expect, test, type Page } from '@playwright/test';

/** Verify sibling and level movement, typeahead, and accessible focus. */
async function verifiesKeyboardNavigation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view-navigation--contract');
  const folder = page.getByTestId('navigation-folder');
  const alpha = page.getByTestId('navigation-alpha');
  const beta = page.getByTestId('navigation-beta');
  const gamma = page.getByTestId('navigation-gamma');
  await expect(folder).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('treegrid')).toHaveAttribute('aria-multiselectable', 'true');
  await folder.focus();
  await folder.press('ArrowDown');
  await expect(alpha).toBeFocused();
  await alpha.press('ArrowDown');
  await expect(beta).toBeFocused();
  await beta.press('End');
  await expect(gamma).toBeFocused();
  await gamma.press('Home');
  await expect(folder).toBeFocused();
  await folder.press('b');
  await expect(beta).toBeFocused();
}

test('Tree View moves accessible focus across levels and by name', verifiesKeyboardNavigation);

/** Verify multiple selection and a link rendered as a native tree item. */
async function verifiesSelectionAndLink({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view-navigation--contract');
  const folder = page.getByTestId('navigation-folder');
  const alpha = page.getByTestId('navigation-alpha');
  const beta = page.getByTestId('navigation-beta');
  const gamma = page.getByTestId('navigation-gamma');
  await expect(alpha).toBeVisible({ timeout: 30_000 });
  await expect(alpha).toHaveAttribute('href', '#tree-destination');
  await expect(alpha).toHaveAttribute('role', 'row');
  await beta.click();
  await gamma.click({ modifiers: ['Meta'] });
  await expect(beta).toHaveAttribute('aria-selected', 'true');
  await expect(gamma).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('navigation-selected')).toHaveText('beta,gamma');
  await alpha.click();
  await expect(page).toHaveURL(/#tree-destination$/);
  await expect(page.locator('#tree-destination')).toBeVisible();
  await expect(folder).toHaveAttribute('data-state', 'open');
}

test('Tree View supports multiple selection and native links', verifiesSelectionAndLink);

/** Verify explicit expansion leaves branch selection separate. */
async function verifiesExplicitExpansion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view-navigation--contract');
  const folder = page.getByTestId('navigation-folder');
  const trigger = page.getByTestId('navigation-trigger');
  await expect(folder).toHaveAttribute('data-state', 'open', { timeout: 30_000 });
  await folder.click();
  await expect(folder).toHaveAttribute('data-state', 'open');
  await expect(page.getByTestId('navigation-selected')).toHaveText('folder');
  await trigger.click();
  await expect(folder).toHaveAttribute('data-state', 'closed');
  await expect(page.getByTestId('navigation-alpha')).toBeHidden();
}

test('Tree View expands only through its explicit trigger', verifiesExplicitExpansion);
