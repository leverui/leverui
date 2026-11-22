import { expect, test, type Page } from '@playwright/test';

/** Verify selected tags, native aliases, refs, and child-owned QR parts. */
async function verifiesQrComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-composition--contract');
  const root = page.getByTestId('qr-tag-root');
  const frame = page.getByTestId('qr-tag-frame');
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('data-qr-code-root');
  await expect(root).toHaveAttribute('data-qr-ref', 'section');
  await expect(root).not.toHaveAttribute('as');
  await expect(frame).toHaveAttribute('width', '96');
  await expect(frame).toHaveAttribute('height', '96');
  await expect(frame).not.toHaveAttribute('htmlWidth');
  await expect(frame).not.toHaveAttribute('htmlHeight');
  await expect(frame).toHaveAttribute('data-qr-ref', 'svg');
  await expect(frame).toHaveCSS('width', '120px');
  await expect(frame.locator('path')).toHaveAttribute('d', /.+/);
  await expect(page.getByTestId('qr-tag-overlay')).toHaveJSProperty('tagName', 'STRONG');
  await expect(page.getByTestId('qr-tag-overlay')).toHaveAttribute('data-qr-ref', 'strong');
  await expect(page.getByTestId('qr-tag-provider')).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(page.getByTestId('qr-tag-provider')).toHaveAttribute('data-qr-ref', 'article');

  const child = page.getByTestId('qr-child-root');
  await expect(child).toHaveJSProperty('tagName', 'SECTION');
  await expect(child).toHaveAttribute('data-qr-code-root');
  await expect(child).toHaveAttribute('data-qr-ref', 'section');
  await expect(child).toHaveClass(/consumer-qr-root/);
  await expect(page.getByTestId('qr-child-frame')).toHaveJSProperty('tagName', 'svg');
  await expect(page.getByTestId('qr-child-pattern')).toHaveAttribute('d', /.+/);
  await expect(page.getByTestId('qr-child-overlay')).toHaveJSProperty('tagName', 'EM');
  await expect(page.getByTestId('qr-child-download')).toHaveJSProperty('tagName', 'BUTTON');
}

test('QR parts preserve Zag behavior on selected native elements', verifiesQrComposition);

/** Verify custom events and native disabled and keyboard behavior. */
async function verifiesQrButtonBehavior({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-composition--contract');
  await page.getByTestId('qr-tag-root').click();
  await expect(page.getByTestId('qr-consumer-clicks')).toHaveText('1');
  const disabled = page.getByTestId('qr-disabled-download');
  await expect(disabled).toBeDisabled();
  await disabled.evaluate(
    /** Native click must not activate a disabled button. */
    (element) => (element as HTMLButtonElement).click(),
  );
  await expect(page.getByTestId('qr-consumer-clicks')).toHaveText('1');

  const child = page.getByTestId('qr-child-download');
  await child.focus();
  await expect(child).toBeFocused();
  const download = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  expect((await download).suggestedFilename()).toBe('child.png');
}

test('QR download keeps native disabled and keyboard behavior', verifiesQrButtonBehavior);

/** Confirm changing `as` updates each native tag without losing Zag parts. */
async function verifiesReactiveTags({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-qr-code-composition--contract');
  const root = page.getByTestId('qr-reactive-root');
  const provider = page.getByTestId('qr-reactive-provider');
  const overlay = page.getByTestId('qr-reactive-overlay');
  const path = page.getByTestId('qr-reactive-frame').locator('path');
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(provider).toHaveJSProperty('tagName', 'DIV');
  await expect(overlay).toHaveJSProperty('tagName', 'DIV');
  const initialPath = await path.getAttribute('d');
  expect(initialPath).toBeTruthy();

  await page.getByTestId('qr-toggle-root-tag').click();
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('data-qr-ref', 'section');
  await expect(root).toHaveAttribute('data-qr-code-root');
  await expect(path).toHaveAttribute('d', initialPath ?? '');
  await page.getByTestId('qr-toggle-provider-tag').click();
  await expect(provider).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(provider).toHaveAttribute('data-qr-ref', 'article');
  await expect(page.getByTestId('qr-reactive-provider-frame').locator('path')).toHaveAttribute(
    'd',
    /.+/,
  );
  await page.getByTestId('qr-toggle-overlay-tag').click();
  await expect(overlay).toHaveJSProperty('tagName', 'STRONG');
  await expect(overlay).toHaveAttribute('data-qr-ref', 'strong');
  await expect(overlay).toHaveCSS('display', 'flex');

  await page.getByTestId('qr-toggle-root-tag').click();
  await page.getByTestId('qr-toggle-provider-tag').click();
  await page.getByTestId('qr-toggle-overlay-tag').click();
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(provider).toHaveJSProperty('tagName', 'DIV');
  await expect(overlay).toHaveJSProperty('tagName', 'DIV');
}

test('QR roots and parts react to selected native tag changes', verifiesReactiveTags);
