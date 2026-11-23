import { expect, test, type Page } from '@playwright/test';

/** Verify native hooks, consumer CSS, and unstyled machine behavior. */
async function verifiesListboxCssContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-listbox--css-contract');
  const root = page.getByTestId('listbox-css-root');
  const content = page.getByTestId('listbox-css-content');
  const selected = content.getByRole('option', { name: 'Solid' });
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/consumer-listbox/);
  await expect(root).toHaveClass(/lui-listbox__root/);
  await expect(root).toHaveCSS('width', '280px');
  await expect(content).toHaveCSS('box-shadow', 'rgb(2, 132, 199) 0px 0px 0px 2px inset');
  await expect(selected).toHaveCSS('background-color', 'rgb(253, 230, 138)');
  await expect(selected).toHaveCSS('letter-spacing', '0.5px');

  const unstyled = page.getByTestId('listbox-unstyled-root');
  const unstyledContent = page.getByTestId('listbox-unstyled-content');
  const unstyledItem = page.getByTestId('listbox-unstyled-item');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyledContent).toHaveAttribute('data-unstyled', '');
  await expect(unstyledItem).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).not.toHaveCSS('display', 'flex');
  await unstyledItem.click();
  await expect(unstyledItem).toHaveAttribute('aria-selected', 'true');
}

test('Listbox exposes CSS hooks and preserves unstyled selection', verifiesListboxCssContract);
