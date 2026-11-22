import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

const palettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
];

/** Read a checked Switch's resolved track color from the browser. */
function trackColor(element: HTMLElement): string {
  const control = element.querySelector('.leverui-switch__control');
  if (!control) throw new Error('Switch guide control was not rendered.');
  return getComputedStyle(control).backgroundColor;
}

/** Read a checkbox form entry after checking the DOM boundary. */
function formValue(element: HTMLElement, name: string): FormDataEntryValue | null {
  if (!(element instanceof HTMLFormElement)) throw new TypeError('Expected a Switch guide form.');
  return new FormData(element).get(name);
}

/** Prove every palette has distinct checked and unchecked states. */
async function verifiesPalettes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-colors--palettes');
  const colors: string[] = [];
  for (const palette of palettes) {
    const off = page.getByTestId(`switch-guide-color-${palette}-off`);
    const on = page.getByTestId(`switch-guide-color-${palette}-on`);
    await expect(
      off.getByRole('checkbox', { name: `${palette} palette example 1` }),
    ).not.toBeChecked({ timeout: 30_000 });
    await expect(on.getByRole('checkbox', { name: `${palette} palette example 2` })).toBeChecked();
    const unchecked = await off.evaluate(trackColor);
    const checked = await on.evaluate(trackColor);
    expect(checked).not.toBe(unchecked);
    colors.push(checked);
  }
  expect(new Set(colors).size).toBe(palettes.length);
  const first = page
    .getByTestId('switch-guide-color-gray-off')
    .getByRole('checkbox', { name: 'gray palette example 1' });
  await first.press('Space');
  await expect(first).toBeChecked();
  await expect(first).toHaveAccessibleName('gray palette example 1');
}

test('Switch renders all ten guide palettes in both states', verifiesPalettes);

/** Verify both public indicator slots replace their fallback on selection. */
async function verifiesIndicators({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-indicators--contract');
  const track = page.getByTestId('switch-guide-track');
  const thumb = page.getByTestId('switch-guide-thumb');
  await expect(track.locator('[data-icon="moon"]')).toBeVisible({ timeout: 30_000 });
  await expect(thumb.locator('[data-icon="x"]')).toBeVisible();
  await track.getByRole('checkbox').press('Space');
  await thumb.getByRole('checkbox').press('Space');
  await expect(track.locator('[data-icon="sun"]')).toBeVisible();
  await expect(thumb.locator('[data-icon="check"]')).toBeVisible();
  await expect(track.locator('[data-icon="moon"]')).toHaveCount(0);
  await expect(thumb.locator('[data-icon="x"]')).toHaveCount(0);
}

test('Switch shows track and thumb indicator branches', verifiesIndicators);

/** Prove the guide icon honors live Solid prop changes across both renderers. */
async function verifiesIconMode({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-indicators--reactive-mode');
  const icon = page.locator('[data-icon="check"]');
  const mode = page.getByTestId('switch-guide-icon-mode');
  const toggle = page.getByRole('button', { name: 'Toggle icon mode' });
  await expect(icon).toHaveClass(/leverui-icon/, { timeout: 30_000 });
  await expect(mode).toHaveText('styled');
  await toggle.click();
  await expect(icon).not.toHaveAttribute('class', /leverui-icon/);
  await expect(icon.locator('path')).toHaveCount(1);
  await expect(mode).toHaveText('raw');
  await toggle.click();
  await expect(icon).toHaveClass(/leverui-icon/);
  await expect(mode).toHaveText('styled');
}

test('Switch guide icon changes renderer reactively', verifiesIconMode);

/** Prove the application wrapper forwards refs, input props, and form state. */
async function verifiesClosedSwitch({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-closed--contract');
  const form = page.getByTestId('switch-closed-form');
  const basic = page.getByTestId('switch-closed-basic');
  const custom = page.getByTestId('switch-closed-custom');
  await expect(basic.getByRole('checkbox', { name: 'Basic closed switch' })).not.toBeChecked({
    timeout: 30_000,
  });
  await expect(custom).toHaveAttribute('data-root-ref', 'true');
  const input = custom.getByRole('checkbox', { name: 'Customized closed switch' });
  await expect(input).toHaveAttribute('data-input-ref', 'true');
  await expect(input).toBeChecked();
  await expect(custom.getByText('On')).toBeVisible();
  expect(await form.evaluate(formValue, 'custom')).toBe('yes');
  await input.press('Space');
  await expect(input).not.toBeChecked();
  await expect(custom.getByText('Off')).toBeVisible();
  expect(await form.evaluate(formValue, 'custom')).toBeNull();
}

test('Switch supports a consumer-owned closed component', verifiesClosedSwitch);

/** Keep Tooltip hover and Switch selection on the same native trigger. */
async function verifiesTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch-guide-tooltip--contract');
  const root = page.getByTestId('switch-guide-tooltip-root');
  const input = root.getByRole('checkbox', { name: 'Switch with tooltip' });
  const content = page.getByTestId('switch-guide-tooltip-content');
  await expect(input).not.toBeChecked({ timeout: 30_000 });
  await root.hover();
  await expect(content).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Switch Tooltip content has no ID.');
  await expect(input).toHaveAttribute('aria-describedby', contentId);
  await expect(input).toHaveAccessibleDescription('This is a tooltip');
  await page.mouse.move(0, 0);
  await expect(content).toHaveCount(0);
  await pressBrowserTab(page);
  await expect(input).toBeFocused();
  await expect(content).toBeVisible();
  await expect(input).toHaveAttribute('aria-describedby', contentId);
  await input.press('Space');
  await expect(input).toBeChecked();
}

test('Switch composes with Tooltip without losing selection', verifiesTooltip);
