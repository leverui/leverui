import { expect, test, type Page } from '@playwright/test';

/** Verify shared root props and local overrides across a reactive size change. */
async function verifiesProviderDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-code-block-provider--contract');
  const inherited = page.getByTestId('code-block-provider-inherited');
  await expect(inherited).toBeVisible({ timeout: 15_000 });
  await expect(inherited).toHaveJSProperty('tagName', 'SECTION');
  await expect(inherited).toHaveAttribute('title', 'Shared code');
  await expect(inherited).toHaveClass(/shared-code-block/);
  await expect(inherited).toHaveCSS('border-top-width', '3px');
  await expect(inherited).toHaveCSS('border-radius', '6px');
  await expect(inherited).not.toHaveAttribute('as');
  await expect(inherited).not.toHaveAttribute('size');

  const overridden = page.getByTestId('code-block-provider-override');
  await expect(overridden).toHaveJSProperty('tagName', 'DIV');
  await expect(overridden).toHaveAttribute('title', 'Local code');
  await expect(overridden).toHaveClass(/shared-code-block/);
  await expect(overridden).toHaveClass(/local-code-block/);
  await expect(overridden).toHaveCSS('border-top-width', '1px');
  await expect(overridden).toHaveCSS('border-radius', '6px');
  await expect(overridden).not.toHaveAttribute('as');

  await inherited.evaluate(
    /** Mark the original root before changing provider defaults. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('code-block-provider-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-root', 'true');
  await expect(inherited).toHaveCSS('border-radius', '12px');
  await expect(overridden).toHaveCSS('border-radius', '12px');
}

test('Code Block provider shares native root defaults reactively', verifiesProviderDefaults);
