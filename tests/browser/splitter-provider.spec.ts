import { expect, test, type Page } from '@playwright/test';

/** Verify provider defaults never replace either external machine. */
async function verifiesProviderDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-provider--defaults');
  const inherited = page.getByTestId('splitter-provider-inherited');
  const overridden = page.getByTestId('splitter-provider-overridden');
  const first = page.getByTestId('splitter-provider-first-trigger');
  const second = page.getByTestId('splitter-provider-second-trigger');
  await expect(first).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  await expect(second).toHaveAttribute('aria-valuenow', '55');
  await expect(inherited).toHaveClass(/shared-splitter/);
  await expect(inherited).toHaveAttribute('title', 'Shared splitter');
  await expect(inherited).toHaveCSS('border-left-width', '3px');
  await expect(overridden).toHaveClass(/shared-splitter/);
  await expect(overridden).toHaveClass(/instance-splitter/);
  await expect(overridden).toHaveAttribute('title', 'Instance splitter');
  await expect(overridden).toHaveCSS('border-left-width', '1px');
  await expect(page.getByTestId('splitter-provider-ref')).toHaveText('DIV');
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(first).toHaveAttribute('aria-valuenow', '41');
  await expect(second).toHaveAttribute('aria-valuenow', '55');
}

test(
  'Splitter RootProvider inherits styling without replacing its store',
  verifiesProviderDefaults,
);
