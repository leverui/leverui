import { expect, test, type Page } from '@playwright/test';

/** Verify reactive provider defaults and explicit instance precedence. */
async function verifiesHoverCardReactiveDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hover-card-reactive--contract');
  const inherited = page.getByTestId('hover-default-size');
  const explicit = page.getByTestId('hover-explicit-size');
  await expect(inherited).toHaveCount(1, { timeout: 30_000 });
  await expect(explicit).toHaveCount(1);
  await expect(inherited).toHaveCSS('padding', '24px');
  await expect(explicit).toHaveCSS('padding', '16px');

  await inherited.evaluate((element) => element.setAttribute('data-original-node', 'true'));
  await page.getByTestId('hover-size-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('padding', '16px');
  await expect(explicit).toHaveCSS('padding', '16px');

  await page.getByTestId('hover-size-toggle').click();
  await expect(inherited).toHaveCSS('padding', '24px');
  await expect(explicit).toHaveCSS('padding', '16px');
}

test('Hover Card defaults update without replacing content', verifiesHoverCardReactiveDefaults);
