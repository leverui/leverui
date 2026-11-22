import { expect, test, type Page } from '@playwright/test';

/** Check external signal updates, native reset, and reactive provider appearance. */
async function verifiesSwitchStateContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-state--contract');
  const controlled = page.getByRole('checkbox', { name: 'Controlled updates' });
  await expect(controlled).not.toBeChecked({ timeout: 30_000 });
  await controlled.evaluate(
    /** Mark the native input so a remount becomes observable. */
    (element) => element.setAttribute('data-original-input', 'true'),
  );
  await page.getByTestId('controlled-switch-toggle').click();
  await expect(controlled).toBeChecked();
  await expect(controlled).toHaveAttribute('data-original-input', 'true');
  expect(
    await page.getByTestId('controlled-switch-form').evaluate(
      /** Read the submitted value after the external signal update. */
      (form) => new FormData(form as HTMLFormElement).get('controlled-notifications'),
    ),
  ).toBe('yes');

  const resettable = page.getByRole('checkbox', { name: 'Resettable' });
  await expect(resettable).toBeChecked();
  await resettable.focus();
  await resettable.press('Space');
  await expect(resettable).not.toBeChecked();
  await page.getByTestId('reset-switch-button').click();
  await expect(resettable).toBeChecked();
  expect(
    await page.getByTestId('reset-switch-form').evaluate(
      /** Read the restored native value after form reset. */
      (form) => new FormData(form as HTMLFormElement).get('reset-notifications'),
    ),
  ).toBe('yes');

  const ownedRoot = page.getByTestId('inherited-switch-root');
  const externalRoot = page.getByTestId('inherited-provider-root');
  await ownedRoot.evaluate(
    /** Mark the owned root before a provider default changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await externalRoot.evaluate(
    /** Mark the external root before a provider default changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  for (const control of ['inherited-switch-control', 'inherited-provider-control']) {
    await expect(page.getByTestId(control)).toHaveCSS('width', '48px');
    await expect(page.getByTestId(control)).toHaveCSS('height', '12px');
  }
  await page.getByTestId('provider-size-toggle').click();
  for (const control of ['inherited-switch-control', 'inherited-provider-control']) {
    await expect(page.getByTestId(control)).toHaveCSS('width', '32px');
    await expect(page.getByTestId(control)).toHaveCSS('height', '8px');
  }
  await expect(ownedRoot).toHaveAttribute('data-original-root', 'true');
  await expect(externalRoot).toHaveAttribute('data-original-root', 'true');
}

test('Switch follows controlled, reset, and provider state', verifiesSwitchStateContract);
