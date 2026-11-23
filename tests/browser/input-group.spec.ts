import { expect, test, type Page } from '@playwright/test';

/** Verify native editing, adornment placement, and live input padding. */
async function verifiesElementComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const group = page.getByTestId('input-group-elements');
  const input = page.getByRole('textbox', { name: 'Website' });
  const start = group.locator('.leverui-input-element').first();
  const end = group.locator('.leverui-input-element').last();
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(group).toHaveCSS('display', 'flex');
  await expect(start).toHaveAttribute('data-leverui-input-group-start-element', '');
  await expect(start).not.toHaveAttribute('style');
  await expect(start).toHaveCSS('pointer-events', 'none');
  await expect(start).toHaveCSS('position', 'absolute');
  const groupBox = await group.boundingBox();
  const inputBox = await input.boundingBox();
  const startBox = await start.boundingBox();
  const endBox = await end.boundingBox();
  if (!groupBox || !inputBox || !startBox || !endBox) {
    throw new Error('Input Group composition bounds were not available.');
  }
  expect(Math.abs(startBox.y - inputBox.y)).toBeLessThan(2);
  expect(Math.abs(endBox.y - inputBox.y)).toBeLessThan(2);
  expect(Math.abs(endBox.x + endBox.width - groupBox.x - groupBox.width)).toBeLessThan(2);
  const initialPadding = await input.evaluate(
    /** Read actual input spacing after CSS variables resolve. */
    (element) => getComputedStyle(element).paddingInlineStart,
  );
  await input.fill('example');
  await page.getByTestId('input-group-offset-toggle').click();
  await expect(input).toHaveValue('example');
  const changedPadding = await input.evaluate(
    /** Read the recomputed spacing after the group offset changes. */
    (element) => getComputedStyle(element).paddingInlineStart,
  );
  expect(changedPadding).not.toBe(initialPadding);
  await page.getByTestId('input-group-end-toggle').click();
  await expect(group.locator('.leverui-input-element')).toHaveCount(1);
  await expect(input).toHaveValue('example');
  await page.addStyleTag({ content: '.leverui-input-group { --lui-colors-fg-muted: red; }' });
  await expect(start).toHaveCSS('color', 'rgb(255, 0, 0)');
  await page.addStyleTag({
    content:
      '.leverui-input-group [data-leverui-input-group-start-element] { pointer-events: auto; }',
  });
  await expect(start).toHaveCSS('pointer-events', 'auto');
}

test(
  'Input Group keeps an editable field aligned with live adornments',
  verifiesElementComposition,
);

/** Verify attached addons join the ordinary input without receiving group padding. */
async function verifiesAttachedAddons({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const group = page.getByTestId('input-group-addons');
  const addons = group.locator('.leverui-input-addon');
  const input = page.getByRole('spinbutton', { name: 'Amount' });
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(addons).toHaveCount(2);
  await expect(group).toHaveCSS('gap', '0px');
  await expect(addons.first()).toHaveAttribute('data-leverui-group-first', '');
  await expect(input).toHaveAttribute('data-leverui-group-between', '');
  await expect(addons.last()).toHaveAttribute('data-leverui-group-last', '');
  await input.fill('12');
  await expect(input).toHaveValue('12');
}

test('Input Group joins addons without disturbing native input behavior', verifiesAttachedAddons);

/** Verify the copyable custom field gets resolved space for its inside element. */
async function verifiesCustomFieldPadding({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const input = page.getByRole('textbox', { name: 'Custom username' });
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveCSS('padding-inline-start', '40px');
  await page.addStyleTag({
    content: '.leverui-input-group__field { --lui-input-group-field-height: 48px; }',
  });
  await expect(input).toHaveCSS('padding-inline-start', '48px');
  await input.fill('justin');
  await expect(input).toHaveValue('justin');
}

test('Input Group gives a custom field usable element padding', verifiesCustomFieldPadding);

/** Resolve numeric offsets through the theme's spacing scale. */
async function verifiesNumericOffset({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const input = page.getByRole('textbox', { name: 'Token offset' });
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveCSS('padding-inline-start', '24px');
}

test('Input Group resolves numeric offsets to spacing tokens', verifiesNumericOffset);

/** Preserve an explicit native override from startElementProps. */
async function verifiesStartElementPropsOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const start = page.getByTestId('input-group-interactive').locator('.leverui-input-element');
  await expect(start).toHaveAttribute('data-leverui-input-group-start-element', '');
  await expect(start).toHaveCSS('pointer-events', 'auto');
}

test('Input Group keeps explicit start-element interaction', verifiesStartElementPropsOverride);

/** Resolve inherited group offsets through the authored breakpoint rules. */
async function verifiesResponsiveOffset({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=components-input-group--contract&viewMode=story');
  const group = page.getByTestId('input-group-responsive');
  const field = page.getByRole('textbox', { name: 'Responsive offset' });
  await expect(field).toHaveCSS('padding-inline-start', '40px');
  await expect(group).toHaveAttribute('data-group-start-md', '');
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(field).toHaveCSS('padding-inline-start', '24px');
}

test('Input Group applies responsive offsets through CSS', verifiesResponsiveOffset);
