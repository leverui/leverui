import { expect, test, type Page } from '@playwright/test';

/** Verify controlled selection, expansion, ARIA, and reactive recipe changes. */
async function verifiesTreeContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view--contract');
  const root = page.getByTestId('tree-root');
  const tree = page.getByRole('treegrid', { name: 'Project files' });
  const branch = page.getByTestId('tree-branch-src');
  const app = page.getByTestId('tree-item-src/app');
  // The primitive puts the row role and expansion state on the branch control itself.
  const branchItem = branch;
  await expect(tree).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-tree-view__root/);
  await expect(tree).toHaveClass(/leverui-tree-view__tree/);
  await expect(branch).toHaveAttribute('data-state', 'open');
  await expect(branchItem).toHaveAttribute('role', 'row');
  await expect(branchItem).toHaveAttribute('aria-expanded', 'true');
  await expect(app).toHaveAttribute('role', 'row');
  await app.click();
  await expect(app).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('tree-selected')).toHaveText('src/app');
  const mediumPadding = await app.evaluate(
    /** Read the current recipe's vertical spacing on the same native item. */
    (element) => getComputedStyle(element).paddingTop,
  );
  const subtleBackground = await app.evaluate(
    /** Read the selected subtle appearance before changing variants. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByTestId('tree-size').click();
  await expect(app).not.toHaveCSS('padding-top', mediumPadding);
  await page.getByTestId('tree-variant').click();
  await expect(app).not.toHaveCSS('background-color', subtleBackground);
  await branch.click();
  await expect(branch).toHaveAttribute('data-state', 'closed');
  await expect(branchItem).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('tree-expanded')).toHaveText('');
  await expect(app).toBeHidden();
  await expect(page.getByTestId('tree-selected')).toHaveText('src');
}

test('Tree View retains machine state and styled parts', verifiesTreeContract);

/** Verify an external machine remains usable through the public provider. */
async function verifiesProviderTree({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view--provider');
  const root = page.getByTestId('tree-provider');
  const app = page.getByTestId('tree-item-src/app');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-tree-view__root/);
  await expect(app).toBeVisible();
  await app.click();
  await expect(page.getByTestId('tree-provider-selection')).toHaveText('src/app');
}

test('Tree View provider preserves caller-owned selection', verifiesProviderTree);

/** Confirm a consumer stylesheet can change Tree View spacing through public variables. */
async function verifiesCssOverrides({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view--contract');
  const app = page.getByTestId('tree-item-src/app');
  await expect(app).toBeVisible({ timeout: 30_000 });
  const originalPadding = await app.evaluate(
    /** Read native item spacing before a consumer override is added. */
    (element) => getComputedStyle(element).paddingInlineStart,
  );
  await page.addStyleTag({
    content:
      '[data-testid="tree-root"] { --lui-tree-padding-inline: 2rem; --lui-tree-indentation: 3rem; } .leverui-tree-view__itemText { color: rgb(12, 34, 56); }',
  });
  await expect(app).not.toHaveCSS('padding-inline-start', originalPadding);
  await expect(page.getByTestId('tree-root')).toHaveCSS('--lui-tree-indentation', '3rem');
  await expect(app.locator('.leverui-tree-view__itemText')).toHaveCSS('color', 'rgb(12, 34, 56)');
}

test('Tree View accepts consumer CSS variable overrides', verifiesCssOverrides);

/** Verify static breakpoint rules change size and selected appearance. */
async function verifiesResponsiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/iframe.html?id=components-tree-view--responsive');
  const root = page.getByTestId('tree-responsive-root');
  const tree = page.getByTestId('tree-items');
  const app = page.getByTestId('tree-item-src/app');
  await expect(app).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size', 'xs');
  await expect(root).toHaveAttribute('data-size-md', 'sm');
  const mobileFontSize = await tree.evaluate(
    /** Read the default stylesheet's compact font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  const mobileBackground = await app.evaluate(
    /** Read the selected subtle background before the breakpoint. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(tree).not.toHaveCSS('font-size', mobileFontSize);
  await expect(app).not.toHaveCSS('background-color', mobileBackground);
}

test('Tree View responsive choices follow viewport breakpoints', verifiesResponsiveAppearance);

/** Keep left and right arrow expansion under the primitive's tree keyboard handler. */
async function verifiesKeyboardExpansion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view--contract');
  const branch = page.getByTestId('tree-branch-src');
  await expect(branch).toHaveAttribute('data-state', 'open', { timeout: 30_000 });
  await branch.focus();
  await branch.press('ArrowLeft');
  await expect(branch).toHaveAttribute('data-state', 'closed');
  await expect(branch).toBeFocused();
  await branch.press('ArrowRight');
  await expect(branch).toHaveAttribute('data-state', 'open');
  await expect(page.getByTestId('tree-item-src/app')).toBeVisible();
}

test('Tree View expands branches with keyboard arrows', verifiesKeyboardExpansion);

/** Check checkbox state and disabled nodes in the nested collection. */
async function verifiesCheckboxTree({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tree-view-checkbox--contract');
  const file = page.getByTestId('tree-check-file');
  const locked = page.getByTestId('tree-check-locked');
  await expect(file).toHaveAttribute('role', 'checkbox', { timeout: 30_000 });
  await expect(file).toHaveAttribute('aria-checked', 'false');
  await file.click();
  await expect(file).toHaveAttribute('aria-checked', 'true');
  await expect(file).toHaveText('✓');
  await expect(locked).toHaveAttribute('data-disabled', '');
  await locked.click({ force: true });
  await expect(locked).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByTestId('tree-checkbox-item-locked')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
}

test('Tree View checkbox state respects disabled descendants', verifiesCheckboxTree);
