import { expect, test, type Page } from '@playwright/test';

/** Verify authored styling, consumer overrides, and semantic strength colors. */
async function verifiesPasswordCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-password-input--css-contract');
  const root = page.locator('#password-css-root');
  const trigger = root.getByRole('button', { name: 'Toggle password visibility' });
  const meter = page.getByTestId('password-css-meter');
  const track = meter.locator('.leverui-password-strength-meter__track');
  const segment = meter.locator('.leverui-password-strength-meter__segment').first();
  const label = meter.locator('.leverui-password-strength-meter__label');
  await expect(root).toHaveClass(/leverui-password-input/);
  await expect(trigger).toHaveClass(/leverui-password-input__visibility-trigger/);
  await expect(meter).toHaveAttribute('data-strength-level', 'low');
  await expect(segment).toHaveAttribute('data-selected', '');
  await page.addStyleTag({
    content:
      '.consumer-password-demo { --lui-password-strength-segment-height: 9px; --lui-password-strength-selected-background: rgb(0, 0, 255); } .consumer-password-demo .leverui-password-input { margin-left: 3px; } .consumer-password-demo .leverui-password-input__visibility-trigger { border-radius: 2px; } .consumer-password-demo .leverui-password-strength-meter { margin-top: 7px; } .consumer-password-demo .leverui-password-strength-meter__track { gap: 3px; } .consumer-password-demo .leverui-password-strength-meter__label { letter-spacing: 1px; }',
  });
  await expect(root).toHaveCSS('margin-left', '3px');
  await expect(trigger).toHaveCSS('border-top-left-radius', '2px');
  await expect(meter).toHaveCSS('margin-top', '7px');
  await expect(track).toHaveCSS('gap', '3px');
  await expect(segment).toHaveCSS('height', '9px');
  await expect(segment).toHaveCSS('background-color', 'rgb(0, 0, 255)');
  await expect(label).toHaveCSS('letter-spacing', '1px');
  await page.getByRole('button', { name: 'Advance strength' }).click();
  await expect(meter).toHaveAttribute('data-strength-level', 'medium');
}

test('Password Input and Strength Meter use authored CSS', verifiesPasswordCss);

/** Verify visibility and native input semantics when presentation is suppressed. */
async function verifiesUnstyledPassword({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-password-input--css-contract');
  const root = page.locator('#password-unstyled-root');
  const input = root.getByLabel('Unstyled password');
  const trigger = root.getByRole('button', { name: 'Toggle password visibility' });
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(trigger).toHaveAttribute('data-unstyled', '');
  await expect(input).toHaveAttribute('type', 'password');
  await trigger.click();
  await expect(input).toHaveAttribute('type', 'text');
}

test('Unstyled Password Input preserves native visibility behavior', verifiesUnstyledPassword);
