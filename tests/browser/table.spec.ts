import { expect, test, type Page } from '@playwright/test';

/** Verify semantic parts, native attributes, and default recipe styles. */
async function verifiesTableParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-table--contract');
  const root = page.getByTestId('table-parts-root');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveJSProperty('tagName', 'TABLE');
  await expect(root).toHaveAttribute('data-ref-tag', 'table');
  await expect(root).not.toHaveAttribute('role');
  await expect(root).toHaveCSS('border-collapse', 'collapse');
  await expect(page.getByTestId('table-caption')).toHaveCSS('caption-side', 'bottom');
  await expect(page.getByTestId('table-header')).toHaveJSProperty('tagName', 'THEAD');
  await expect(page.getByTestId('table-body')).toHaveJSProperty('tagName', 'TBODY');
  await expect(page.getByTestId('table-footer')).toHaveJSProperty('tagName', 'TFOOT');
  await expect(page.getByTestId('table-column-group')).toHaveJSProperty('tagName', 'COLGROUP');
  await expect(page.getByTestId('table-column')).toHaveAttribute('width', '40%');
  await expect(page.getByTestId('table-column-header')).toHaveAttribute('scope', 'col');
  await expect(page.getByTestId('table-column-header')).toHaveCSS('font-weight', '500');
  await expect(page.getByTestId('table-reactive-cell')).toHaveCSS('padding-left', '8px');
  await expect(page.getByTestId('table-style-probe')).toHaveCSS('padding-left', '8px');
  const rowAction = page.getByTestId('table-row-action');
  await rowAction.click();
  await expect(page.getByTestId('table-clicks')).toHaveText('1');
  await rowAction.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('table-clicks')).toHaveText('2');
}

test('Table renders semantic parts with native attributes and slot styles', verifiesTableParts);

/** Verify provider variants update the same table and cell nodes. */
async function verifiesReactiveTable({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-table--contract');
  const cell = page.getByTestId('table-reactive-cell');
  const probe = page.getByTestId('table-style-probe');
  await expect(cell).toHaveCSS('padding-left', '8px');
  await cell.evaluate(
    /** Mark the original cell before the provider changes size. */
    (element) => element.setAttribute('data-original-cell', 'true'),
  );
  await page.getByTestId('table-size-toggle').click();
  await expect(cell).toHaveAttribute('data-original-cell', 'true');
  await expect(cell).toHaveCSS('padding-left', '16px');
  await expect(probe).toHaveCSS('padding-left', '16px');
}

test('Table provider updates variant styles without replacing cells', verifiesReactiveTable);

/** Verify responsive recipe size changes with the viewport breakpoint. */
async function verifiesResponsiveSize({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=content-table--contract');
  const cell = page.getByTestId('table-responsive-cell');
  await expect(cell).toHaveCSS('padding-left', '8px');
  await cell.evaluate(
    /** Keep a marker on the original cell while the viewport changes. */
    (element) => element.setAttribute('data-original-cell', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(cell).toHaveCSS('padding-left', '16px');
  await expect(cell).toHaveAttribute('data-original-cell', 'true');
}

test('Table responsive size follows the viewport breakpoint', verifiesResponsiveSize);

/** Verify native mode and scroll/sticky behavior without styled descendants. */
async function verifiesNativeTable({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-table--contract');
  const scroll = page.getByTestId('table-scroll-area');
  await expect(scroll).toHaveCSS('overflow-x', 'auto');
  await expect(scroll).toHaveCSS('max-width', '100%');
  await expect(page.getByTestId('table-header-row')).toHaveCSS('position', 'sticky');
  await expect(page.getByTestId('table-header-row')).toHaveCSS('top', '0px');
  const native = page.getByTestId('table-native-root');
  await expect(native).not.toHaveAttribute('native');
  await expect(page.getByTestId('table-native-header')).toHaveCSS('padding-left', '8px');
  await expect(page.getByTestId('table-native-cell')).toHaveCSS('padding-left', '8px');
  await expect(page.getByTestId('table-native-caption')).toHaveCSS('caption-side', 'top');
  await expect(page.getByTestId('table-top-caption')).toHaveCSS('caption-side', 'top');
}

test('Table native mode styles plain descendants and keeps overflow behavior', verifiesNativeTable);

/** Verify part-level unstyled suppresses state and variant presentation. */
async function verifiesUnstyledParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-table--contract');
  const headerRow = page.getByTestId('table-unstyled-header-row');
  const heading = page.getByTestId('table-unstyled-heading');
  const row = page.getByTestId('table-unstyled-row');
  const cell = page.getByTestId('table-unstyled-cell');
  const footer = page.getByTestId('table-unstyled-footer');
  await expect(headerRow).toHaveCSS('position', 'static');
  await expect(heading).toHaveCSS('border-inline-end-width', '0px');
  await expect(row).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(cell).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(cell).toHaveCSS('border-inline-end-width', '0px');
  await expect(footer).toHaveCSS('border-top-width', '0px');
}

test('Table unstyled parts suppress variant and state rules', verifiesUnstyledParts);
