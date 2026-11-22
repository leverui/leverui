import { expect, test, type Page } from '@playwright/test';

/** Load a System example through the same iframe used by Storybook's canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=foundations-system--${id}`);
  await expect(page.locator('#storybook-root').first()).toBeVisible();
}

/** Verify consumer classes select appearances without leaking selectors as native props. */
async function checksCssAppearances({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'alert-styles');
  const alert = page.getByText('Your changes were saved');
  await expect(alert).toHaveCSS('text-transform', 'uppercase');
  await expect(alert).toHaveAttribute('data-status', 'success');
  await expect(alert).toHaveAttribute('data-caps', '');
  await expect(alert).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  await openStory(page, 'flex-layout');
  await expect(page.getByText('Item 1')).toBeVisible();
  await expect(page.getByText('Item 2')).toBeVisible();
  await expect(page.locator('.consumer-system-flex')).toHaveCSS('display', 'flex');

  await openStory(page, 'native-button');
  const button = page.getByRole('button', { name: 'Welcome' });
  await expect(button).toHaveCSS('font-weight', '700');
  await expect(button).toHaveClass('consumer-system-inline-button');

  await openStory(page, 'compound-boolean');
  const badges = page.locator('#storybook-root').getByText('Hello');
  await expect(badges).toHaveCount(2);
  const firstColor = await badges.nth(0).evaluate(
    /** Read the visible CSS color independently of generated class names. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  const secondColor = await badges.nth(1).evaluate(
    /** Compare the selected compound variant's computed background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(firstColor).not.toBe(secondColor);

  await openStory(page, 'compound-color-palette');
  await expect(page.getByText('Hello')).toBeVisible();
  await expect(page.getByText('Hello')).toHaveAttribute('data-variant', 'solid');
}

/** Verify authored part hooks retain native checkbox behavior. */
async function checksPartHooks({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'checkbox-parts');
  const checkbox = page.getByRole('checkbox', { name: 'Checkbox' });
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toHaveClass('consumer-system-checkbox__control');
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  await expect(page.getByText('Checkbox')).toHaveCSS('font-weight', '500');
}

/** Exercise public CSS hooks and element forwarding in the rendered examples. */
async function checksCssHooksAndElements({ page }: { page: Page }): Promise<void> {
  for (const [id, text] of [
    ['color-palette', '3'],
    ['animation', '3'],
    ['button-appearance', 'Styled like a button'],
    ['part-hooks', 'Alert title'],
  ] as const) {
    await openStory(page, id);
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('Alert description')).toBeVisible();

  await openStory(page, 'as-child');
  const anchor = page.getByRole('link', { name: 'Read the docs' });
  await expect(anchor).toHaveAttribute('href', 'dfd');
  await expect(page.locator('#storybook-root button')).toHaveCount(0);
  await expect(anchor).toHaveCSS('padding', '20px');
}

test('System examples apply authored variant and state CSS', checksCssAppearances);
test('System part hooks keep checkbox semantics', checksPartHooks);
test('System CSS hooks and asChild render their expected elements', checksCssHooksAndElements);
