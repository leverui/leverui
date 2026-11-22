import { expect, test, type Page } from '@playwright/test';

/** Verify buttons, page text formats, boundary state, and page selection. */
async function verifiesBasicPagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--basic');
  const root = page.getByTestId('pagination-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('aria-label', 'Article pages');
  await expect(root).toHaveClass(/leverui-pagination__root/);
  await expect(root.locator('[data-pagination-item]').first()).toHaveClass(
    /leverui-pagination__item/,
  );
  await expect(page.getByTestId('pagination-prev')).toBeDisabled();
  await expect(page.getByTestId('pagination-compact')).toHaveText('1 of 10');
  await expect(page.getByTestId('pagination-short')).toHaveText('1 / 10');
  await expect(page.getByTestId('pagination-short')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('pagination-short')).toHaveAttribute(
    'data-received-span-ref',
    'true',
  );
  await expect(page.getByTestId('pagination-long')).toHaveText('1 - 10 of 100');
  await expect(root.locator('[data-pagination-ellipsis]')).toHaveCount(1);
  await page.getByTestId('pagination-next').click();
  await expect(page.getByTestId('pagination-compact')).toHaveText('2 of 10');
  await expect(page.getByTestId('pagination-prev')).toBeEnabled();
  await expect(root.getByRole('button', { name: 'page 2' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await root.getByRole('button', { name: 'page 1', exact: true }).click();
  await expect(page.getByTestId('pagination-compact')).toHaveText('1 of 10');
}

test(
  'Pagination buttons, ranges, and disabled boundaries follow the machine',
  verifiesBasicPagination,
);

/** Keep the activated page node and focus across a machine page update. */
async function verifiesKeyboardFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--basic');
  const item = page.getByRole('button', { name: 'page 2', exact: true });
  await expect(item).toBeVisible({ timeout: 30_000 });
  await item.evaluate(
    /** Mark the native button before the selection changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await item.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('pagination-compact')).toHaveText('2 of 10');
  await expect(item).toHaveAttribute('data-original-node', 'true');
  await expect(item).toBeFocused();
}

test('Pagination retains keyboard focus on the selected page', verifiesKeyboardFocus);

/** Check the authored default and ordinary consumer CSS override for page text. */
async function verifiesPageTextCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--basic');
  const text = page.getByTestId('pagination-compact');
  await expect(text).toBeVisible({ timeout: 30_000 });
  await expect(text).toHaveClass(/leverui-pagination__page-text/);
  await expect(text).toHaveCSS('font-weight', '500');
  await page.addStyleTag({
    content: '.leverui-pagination__page-text { font-weight: 700; }',
  });
  await expect(text).toHaveCSS('font-weight', '700');
}

test('Pagination page text uses authored CSS and accepts consumer overrides', verifiesPageTextCss);

/** Verify custom Solid child callbacks receive usable machine attributes. */
async function verifiesCustomPagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--custom');
  const root = page.getByTestId('pagination-custom');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('pagination-custom-text')).toHaveText('Página 5 de 10');
  await expect(page.getByTestId('pagination-custom-gap').first()).toHaveAttribute(
    'data-pagination-ellipsis',
  );
  await expect(page.getByTestId('pagination-custom-gap').first()).toHaveJSProperty(
    'tagName',
    'SPAN',
  );
  await page.getByTestId('pagination-custom-6').click();
  await expect(page.getByTestId('pagination-custom-text')).toHaveText('Página 6 de 10');
  await expect(page.getByTestId('pagination-custom-6')).toHaveAttribute('aria-current', 'page');
}

test(
  'Pagination custom items and ellipses retain the primitive attributes',
  verifiesCustomPagination,
);
