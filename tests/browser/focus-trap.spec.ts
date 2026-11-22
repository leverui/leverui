import { expect, test, type Locator, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Activate a trap with a focused launcher so return focus has a stable target. */
async function openFromKeyboard(launcher: Locator): Promise<void> {
  await launcher.focus();
  await launcher.press('Enter');
}

/** Verify Zag activation, focus cycling, callbacks, and restoration. */
async function verifiesFocusTrapContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap--contract');
  const launcher = page.getByTestId('focus-trap-launcher');
  const root = page.getByTestId('focus-trap-root');
  const outside = page.getByTestId('focus-trap-outside');
  const first = page.getByRole('textbox', { name: 'First trapped input' });
  const autofocus = page.getByRole('textbox', { name: 'Autofocused input' });
  const end = page.getByRole('button', { name: 'End trap' });
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveAttribute('data-custom', 'retained');
  await expect(root).toHaveClass(/leverui-focus-trap/);
  await expect(root).toHaveCSS('padding', '17px');
  await page.addStyleTag({ content: '.leverui-focus-trap { border-top: 3px solid red; }' });
  await expect(root).toHaveCSS('border-top-width', '3px');
  await outside.focus();
  await expect(outside).toBeFocused();
  await openFromKeyboard(launcher);
  await expect(page.getByTestId('focus-trap-active')).toHaveText('true');
  await expect(autofocus).toBeFocused();
  await expect(page.getByTestId('focus-trap-activations')).toHaveText('1');
  await pressBrowserTab(page);
  await expect(end).toBeFocused();
  await pressBrowserTab(page);
  await expect(first).toBeFocused();
  await pressBrowserTab(page, true);
  await expect(end).toBeFocused();
  await outside.focus();
  await expect(outside).not.toBeFocused();
  await end.click();
  await expect(page.getByTestId('focus-trap-active')).toHaveText('false');
  await expect(page.getByTestId('focus-trap-deactivations')).toHaveText('1');
  await expect(launcher).toBeFocused();
  await outside.focus();
  await expect(outside).toBeFocused();
}

test('Focus Trap keeps focus inside its active styled element', verifiesFocusTrapContract);

/** Verify selected and caller-owned elements retain their actual trapped nodes. */
async function verifiesPolymorphicFocusTrap({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap-polymorphic--contract');
  const sectionLauncher = page.getByTestId('focus-trap-section-launcher');
  const section = page.getByTestId('focus-trap-section');
  await expect(section).toBeVisible({ timeout: 30_000 });
  await expect(section).toHaveJSProperty('tagName', 'SECTION');
  await expect(section).toHaveClass(/leverui-focus-trap/);
  await expect(section).toHaveAttribute('data-section-ref', 'attached');
  await openFromKeyboard(sectionLauncher);
  await expect(page.getByRole('textbox', { name: 'Section input' })).toBeFocused();
  await page.getByRole('button', { name: 'End section' }).click();
  await expect(sectionLauncher).toBeFocused();

  const childLauncher = page.getByTestId('focus-trap-child-launcher');
  const child = page.getByTestId('focus-trap-child');
  await expect(child).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(child).toHaveClass(/leverui-focus-trap/);
  await expect(child).toHaveAttribute('data-child-ref', 'attached');
  await expect(child).toHaveAttribute('data-child-owned-ref', 'attached');
  await openFromKeyboard(childLauncher);
  await expect(page.getByRole('textbox', { name: 'Child input' })).toBeFocused();
  await page.getByRole('button', { name: 'End child' }).click();
  await expect(childLauncher).toBeFocused();
}

test('Focus Trap supports selected tags and caller-owned children', verifiesPolymorphicFocusTrap);
