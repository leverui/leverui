import { expect, test, type Page } from '@playwright/test';

/** Verify card keyboard, form, CSS choices, and Field behavior in Chromium. */
async function verifiesCardContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--contract');
  const alpha = page.getByRole('checkbox', { name: 'Alpha' });
  const beta = page.getByRole('checkbox', { name: 'Beta' });
  const external = page.getByRole('checkbox', { name: 'External' });
  const terms = page.getByRole('checkbox', { name: 'Accept terms' });
  const alphaRoot = page.getByTestId('alpha-root');
  const alphaControl = page.getByTestId('alpha-control');
  await expect(alphaRoot).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('group', { name: 'Topics' })).toBeVisible();
  await expect(alpha).toBeChecked();
  await expect(beta).toBeDisabled();
  await expect(external).toBeChecked();
  await expect(terms).toHaveAttribute('required', '');
  await expect(terms).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(alphaControl).toHaveCSS('padding-top', '12px');
  await alpha.evaluate(
    /** Mark the original native input before changing its card size. */
    (element) => element.setAttribute('data-original-input', 'true'),
  );
  await page.getByTestId('toggle-card-size').click();
  await expect(alphaControl).toHaveCSS('padding-top', '16px');
  await expect(alpha).toHaveAttribute('data-original-input', 'true');
  await expect(alpha).toBeChecked();
  await alpha.focus();
  await page.keyboard.press('Space');
  await expect(alpha).toBeFocused();
  await expect(alpha).not.toBeChecked();
  await expect(beta).toBeEnabled();
  await beta.focus();
  await page.keyboard.press('Space');
  await expect(beta).toBeChecked();
  await external.focus();
  await page.keyboard.press('Space');
  await expect(external).not.toBeChecked();
  await expect(page.getByTestId('external-root')).toHaveAttribute('data-state', 'unchecked');
  await page.getByText('Accept terms').click();
  await expect(terms).toBeChecked();
  const entries = await page.getByTestId('card-form').evaluate(
    /** Read submitted values from actual native inputs. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(entries).toContainEqual(['topics', 'beta']);
  expect(entries).toContainEqual(['terms', 'yes']);
  expect(entries).not.toContainEqual(['external', 'yes']);
  await page.getByTestId('toggle-card-invalid').click();
  await expect(terms).toHaveAttribute('aria-invalid', 'true');
  await expect(terms).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('You must accept')).toBeVisible();
}

test(
  'Checkbox Card preserves keyboard, form, CSS choices, and Field behavior',
  verifiesCardContract,
);

/** Verify native consumer classes override the authored Card layer. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--contract');
  await expect(page.getByTestId('alpha-control')).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `
      .consumer-card { border-radius: 17px; }
      .consumer-card-control { padding: 19px; --lui-checkbox-card-control-gap: 23px; }
      .consumer-card-content { gap: 11px; }
      .consumer-card-label { font-weight: 800; }
      .consumer-card-description { opacity: 0.9; }
      .consumer-card-addon { padding-top: 12px; }
      .consumer-card-indicator { width: 28px; }
    `,
  });
  await expect(page.getByTestId('alpha-root')).toHaveCSS('border-radius', '17px');
  await expect(page.getByTestId('alpha-control')).toHaveCSS('padding-top', '19px');
  await expect(page.getByTestId('alpha-control')).toHaveCSS('gap', '23px');
  await expect(page.locator('.consumer-card-content')).toHaveCSS('gap', '11px');
  await expect(page.locator('.consumer-card-label')).toHaveCSS('font-weight', '800');
  await expect(page.locator('.consumer-card-description')).toHaveCSS('opacity', '0.9');
  await expect(page.locator('.consumer-card-addon')).toHaveCSS('padding-top', '12px');
  await expect(page.getByTestId('alpha-indicator')).toHaveCSS('width', '28px');
}

test('consumer CSS overrides every Checkbox Card part', verifiesConsumerCss);

/** Verify responsive CSS changes retain the original native card input. */
async function verifiesResponsiveCard({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-checkbox-card--contract');
  const input = page.getByRole('checkbox', { name: 'Responsive card' });
  const root = page.getByTestId('responsive-card-root');
  const control = page.getByTestId('responsive-card-control');
  await expect(control).toHaveCSS('padding-top', '12px');
  const narrowBackground = await root.evaluate(
    /** Capture the outline variant's computed background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await input.evaluate(
    /** Mark the original native input across viewport changes. */
    (element) => element.setAttribute('data-original-input', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(control).toHaveCSS('padding-top', '16px');
  await expect(input).toHaveAttribute('data-original-input', 'true');
  await expect(input).toBeChecked();
  const wideBackground = await root.evaluate(
    /** Capture the solid variant's computed background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(wideBackground).not.toBe(narrowBackground);
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(control).toHaveCSS('padding-top', '12px');
  await expect(root).toHaveCSS('background-color', narrowBackground);
}

test('Checkbox Card size and variant follow viewport breakpoints', verifiesResponsiveCard);

/** Verify child-rendered SVG and input respond to real keyboard selection. */
async function verifiesChildRenderedCard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--contract');
  const input = page.getByTestId('custom-card-input');
  const indicator = page.getByTestId('custom-card-indicator');
  await expect(input).toHaveAttribute('type', 'checkbox', { timeout: 30_000 });
  await expect(input).not.toBeChecked();
  await expect(indicator).toHaveAttribute('aria-hidden', 'false');
  await expect(indicator).toHaveAttribute('data-state', 'unchecked');
  const classNames = (await indicator.getAttribute('class'))?.trim().split(/\s+/) ?? [];
  expect(classNames.length).toBeGreaterThan(0);
  expect(new Set(classNames).size).toBe(classNames.length);
  await indicator.evaluate(
    /** Mark the original SVG before the native state transition. */
    (element) => element.setAttribute('data-original-svg', 'true'),
  );
  await input.focus();
  await page.keyboard.press('Space');
  await expect(input).toBeChecked();
  await expect(indicator).toHaveAttribute('data-state', 'checked');
  await expect(indicator.locator('polyline')).toHaveCount(1);
  const entries = await page.getByTestId('card-form').evaluate(
    /** Read the real form entry from the caller-rendered native input. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(entries).toContainEqual(['custom', 'yes']);
  await expect(indicator).toHaveAttribute('data-original-svg', 'true');
}

test(
  'Checkbox Card child-rendered parts keep keyboard and form behavior',
  verifiesChildRenderedCard,
);
