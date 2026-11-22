import { expect, test, type Page } from '@playwright/test';

/** Check pointer and keyboard selection through native radio inputs. */
async function verifiesRadioCardSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--contract');
  const react = page.getByRole('radio', { name: /React/ });
  const solid = page.getByRole('radio', { name: /Solid/ });
  const vue = page.getByRole('radio', { name: /Vue/ });
  await expect(react).toBeChecked({ timeout: 30_000 });
  await expect(vue).toBeDisabled();
  const control = page.locator('.leverui-radio-card__itemControl').first();
  await expect(control).toHaveAttribute('aria-hidden', 'false');
  expect(await control.ariaSnapshot()).toContain('Choose React for this project.');
  await page.getByText('Solid', { exact: true }).click();
  await expect(solid).toBeChecked();
  await expect(page.getByTestId('radio-card-selected')).toHaveText('solid');
  expect(
    await page.getByTestId('radio-card-form').evaluate(
      /** Read the browser's submitted value from the native form. */
      (form) => new FormData(form as HTMLFormElement).get('framework'),
    ),
  ).toBe('solid');
  await solid.focus();
  await solid.press('ArrowLeft');
  await expect(react).toBeChecked();
}

test('Radio Card selects with pointer and keyboard', verifiesRadioCardSelection);

/** Confirm CSS treatment changes preserve selection and the native root element. */
async function verifiesRadioCardTreatment({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--contract');
  const root = page.getByTestId('radio-card-root');
  const solid = page.getByRole('radio', { name: /Solid/ });
  await expect(root).toHaveClass(/leverui-radio-card__root/, { timeout: 30_000 });
  await page.getByText('Solid', { exact: true }).click();
  const item = page.locator('.leverui-radio-card__item').nth(1);
  const outlineBackground = await item.evaluate(
    /** Capture the selected card's outline background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.evaluate(
    /** Mark the existing element to detect accidental remounts. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('toggle-radio-card-variant').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(solid).toBeChecked();
  await expect(page.getByTestId('radio-card-selected')).toHaveText('solid');
  const solidBackground = await item.evaluate(
    /** Confirm the solid treatment reaches the existing selected card. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(solidBackground).not.toBe(outlineBackground);
}

test(
  'Radio Card updates its CSS treatment without replacing selection',
  verifiesRadioCardTreatment,
);

/** Verify ordinary consumer CSS can override every visible public part. */
async function verifiesRadioCardConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--contract');
  const root = page.getByTestId('radio-card-root');
  await expect(root).toHaveClass(/consumer-radio-card/, { timeout: 45_000 });
  await page.addStyleTag({
    content: `
      .consumer-radio-card { --leverui-radio-card-root-gap: 33px; }
      .consumer-radio-card-label { letter-spacing: 2px; }
      .consumer-radio-card-item { border-radius: 13px; }
      .consumer-radio-card-control { --leverui-radio-card-control-padding: 21px; }
      .consumer-radio-card-content { gap: 17px; }
      .consumer-radio-card-text { font-style: italic; }
      .consumer-radio-card-description { opacity: .3; }
      .consumer-radio-card-indicator { border-width: 3px; }
      .consumer-radio-card-addon { padding-inline: 19px; }
    `,
  });
  await expect(root).toHaveCSS('row-gap', '33px');
  await expect(page.locator('.consumer-radio-card-label')).toHaveCSS('letter-spacing', '2px');
  await expect(page.locator('.consumer-radio-card-item').first()).toHaveCSS(
    'border-radius',
    '13px',
  );
  await expect(page.locator('.consumer-radio-card-control').first()).toHaveCSS(
    'padding-top',
    '21px',
  );
  await expect(page.locator('.consumer-radio-card-content').first()).toHaveCSS('row-gap', '17px');
  await expect(page.locator('.consumer-radio-card-text').first()).toHaveCSS('font-style', 'italic');
  await expect(page.locator('.consumer-radio-card-description').first()).toHaveCSS(
    'opacity',
    '0.3',
  );
  await expect(page.locator('.consumer-radio-card-indicator').first()).toHaveCSS(
    'border-top-width',
    '3px',
  );
  await expect(page.locator('.consumer-radio-card-addon').first()).toHaveCSS(
    'padding-left',
    '19px',
  );
  await page.getByTestId('toggle-radio-card-variant').click();
}

test('Radio Card accepts consumer CSS on its root and parts', verifiesRadioCardConsumerCss);

/** Keep authored layout and machine orientation aligned across a breakpoint. */
async function verifiesResponsiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-radio-card-responsive--contract');
  const root = page.getByTestId('responsive-radio-card-root');
  const control = page.getByTestId('responsive-radio-card-control');
  const indicator = root.locator('.leverui-radio-card__itemIndicator');
  await expect(root).toHaveAttribute('aria-orientation', 'horizontal', { timeout: 30_000 });
  await expect(control).toHaveCSS('flex-direction', 'row');
  await expect(control).toHaveCSS('padding-top', '12px');
  await expect(indicator).toHaveCSS('width', '16px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveAttribute('aria-orientation', 'vertical');
  await expect(control).toHaveCSS('flex-direction', 'column');
  await expect(control).toHaveCSS('padding-top', '16px');
  await expect(indicator).toHaveCSS('width', '24px');
}

test(
  'Radio Card updates layout and keyboard orientation at a breakpoint',
  verifiesResponsiveOrientation,
);
