import { expect, test, type Page } from '@playwright/test';

/** Check pointer and keyboard selection through native radio inputs. */
async function verifiesRadioGroupSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-group--contract');
  const react = page.getByRole('radio', { name: 'React' });
  const solid = page.getByRole('radio', { name: 'Solid' });
  const vue = page.getByRole('radio', { name: 'Vue' });
  await expect(react).toBeChecked({ timeout: 30_000 });
  await expect(vue).toBeDisabled();
  await page.getByText('Solid', { exact: true }).click();
  await expect(solid).toBeChecked();
  await expect(page.getByTestId('radio-group-selected')).toHaveText('solid');
  expect(
    await page.getByTestId('radio-group-form').evaluate(
      /** Read the browser's submitted value from the native form. */
      (form) => new FormData(form as HTMLFormElement).get('framework'),
    ),
  ).toBe('solid');
  await solid.focus();
  await solid.press('ArrowLeft');
  await expect(react).toBeChecked();
}

test('Radio Group selects with pointer and keyboard', verifiesRadioGroupSelection);

/** Confirm CSS choices change without replacing selection or the root. */
async function verifiesRadioGroupCssChoices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-group--contract');
  const root = page.getByTestId('radio-group-root');
  const solid = page.getByRole('radio', { name: 'Solid' });
  await expect(root).toHaveClass(/leverui-radio-group__root/, { timeout: 30_000 });
  await page.getByText('Solid', { exact: true }).click();
  const mark = page.locator('.leverui-radio-group__itemControl').nth(1);
  const outlineBackground = await mark.evaluate(
    /** Read the initial selected indicator color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.evaluate(
    /** Mark the native element to detect accidental remounts. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('toggle-radio-group-variant').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(solid).toBeChecked();
  const solidBackground = await mark.evaluate(
    /** Confirm authored CSS reaches the existing indicator. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(solidBackground).not.toBe(outlineBackground);
}

test('Radio Group updates CSS choices without replacing selection', verifiesRadioGroupCssChoices);

/** Verify native consumer classes and variables win over authored defaults. */
async function verifiesRadioGroupConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-group--contract');
  await expect(page.getByTestId('radio-group-root')).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `
      .consumer-radio-group { display: grid; }
      .consumer-radio-group-label { font-size: 18px; }
      .consumer-radio-group-item { --lui-radio-group-item-gap: 17px; }
      .consumer-radio-group-control { width: 26px; }
      .consumer-radio-group-text { letter-spacing: 2px; }
    `,
  });
  await expect(page.getByTestId('radio-group-root')).toHaveCSS('display', 'grid');
  await expect(page.locator('.consumer-radio-group-label')).toHaveCSS('font-size', '18px');
  await expect(page.locator('.consumer-radio-group-item').first()).toHaveCSS('gap', '17px');
  await expect(page.locator('.consumer-radio-group-control').first()).toHaveCSS('width', '26px');
  await expect(page.locator('.consumer-radio-group-control').first()).toHaveClass(
    /leverui-radio-group__itemIndicator/,
  );
  await expect(page.locator('.consumer-radio-group-text').first()).toHaveCSS(
    'letter-spacing',
    '2px',
  );
}

test('consumer CSS overrides every Radio Group part', verifiesRadioGroupConsumerCss);
