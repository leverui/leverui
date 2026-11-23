import { expect, test, type Page } from '@playwright/test';

/** Verify external state, root provider, selected title, and caller-owned trigger. */
async function verifiesExternalPanel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-floating-panel-provider--contract');
  const trigger = page.getByTestId('floating-provider-trigger');
  const content = page.getByTestId('floating-provider-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await page.getByTestId('floating-external-open').click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('floating-provider-open')).toHaveText('true');
  const title = page.getByTestId('floating-provider-title');
  await expect(title).toHaveJSProperty('tagName', 'H3');
  await expect(title).toHaveAttribute('data-title-ref', 'attached');
  const titleId = await title.getAttribute('id');
  if (!titleId) throw new Error('Floating Panel title has no ID.');
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveClass(/lui-floating-panel__content/);
  const beforeId = await content.getAttribute('id');
  if (!beforeId) throw new Error('Floating Panel content has no ID.');
  await page.getByTestId('floating-external-move').click();
  await expect(page.getByTestId('floating-provider-position')).toHaveText('120,110');
  await page.getByTestId('floating-external-grow').click();
  await expect(page.getByTestId('floating-provider-size')).toHaveText('360×240');
  await expect(content).toHaveAttribute('id', beforeId);
  await page.getByTestId('floating-provider-close').click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('floating-provider-open')).toHaveText('false');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Floating Panel keeps caller-owned state and native composition', verifiesExternalPanel);
