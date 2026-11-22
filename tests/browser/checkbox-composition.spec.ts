import { expect, test, type Page } from '@playwright/test';

/** Verify the published Checkbox composition APIs with native browser input. */
async function verifiesCheckboxComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-composition--contract');
  const group = page.getByTestId('composition-group');
  const alpha = page.getByRole('checkbox', { name: 'Alpha' });
  const beta = page.getByRole('checkbox', { name: 'Beta' });
  const external = page.getByRole('checkbox', { name: 'External' });
  const selected = page.getByRole('checkbox', { name: 'Selected element' });
  await expect(group).toBeVisible({ timeout: 30_000 });
  await expect(group).toHaveAttribute('role', 'group');
  await expect(page.getByRole('group', { name: 'Topics' })).toBeVisible();
  await expect(group).toHaveCSS('display', 'flex');
  await expect(group).toHaveCSS('flex-direction', 'column');
  await expect(group).toHaveCSS('row-gap', '6px');
  await expect(alpha).toBeChecked();
  await expect(beta).toBeDisabled();
  await expect(page.getByTestId('group-values')).toHaveText('alpha');
  await alpha.focus();
  await page.keyboard.press('Space');
  await expect(alpha).not.toBeChecked();
  await expect(beta).toBeEnabled();
  await beta.focus();
  await page.keyboard.press('Space');
  await expect(beta).toBeChecked();
  await expect(page.getByTestId('group-values')).toHaveText('beta');
  await expect(external).toBeChecked();
  await external.focus();
  await page.keyboard.press('Space');
  await expect(external).not.toBeChecked();
  await expect(page.getByTestId('external-root')).toHaveAttribute('data-state', 'unchecked');
  await expect(page.getByTestId('selected-root')).toHaveJSProperty('tagName', 'DIV');
  await selected.focus();
  await page.keyboard.press('Space');
  await expect(selected).toBeChecked();
  const entries = await page.getByTestId('composition-form').evaluate(
    /** Read native form values after the keyboard interactions. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(entries).toContainEqual(['topics', 'beta']);
  expect(entries).toContainEqual(['custom', 'yes']);
  expect(entries).not.toContainEqual(['external', 'yes']);
}

test(
  'Checkbox composition preserves browser keyboard and form behavior',
  verifiesCheckboxComposition,
);
