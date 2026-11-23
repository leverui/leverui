import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Verify click and Space update the controlled button and indicator. */
async function verifiesToggleInteraction({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--contract');
  const root = page.getByRole('button', { name: 'Bold', exact: true });
  await expect(root).toHaveAttribute('aria-pressed', 'false', { timeout: 30_000 });
  await expect(root).toHaveAttribute('data-testid', 'toggle-root');
  await expect(root).toHaveAttribute('type', 'button');
  await expect(root).toContainText('Bold off');
  await root.click();
  await expect(root).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Bold', exact: true })).toBeVisible();
  await expect(root).toContainText('Bold on');
  await expect(page.getByTestId('toggle-value')).toHaveText('on');
  await expect(page.getByTestId('toggle-context')).toHaveText('on');
  await root.press('Space');
  await expect(root).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Bold', exact: true })).toBeVisible();
  await expect(root).toContainText('Bold off');
}

test('Toggle preserves pressed state with click and Space', verifiesToggleInteraction);

/** Verify CSS customization and native form non-submission of a toggle button. */
async function verifiesTogglePresentation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--contract');
  const root = page.getByTestId('toggle-root');
  await expect(root).toHaveClass(/lui-toggle__root/, { timeout: 30_000 });
  const before = await root.evaluate(
    /** Read the child Button's unpressed background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.click();
  await expect(root).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(
      /** Wait for the pressed CSS rule to take effect after Zag updates state. */
      () =>
        root.evaluate(
          /** Read the active button's computed background. */
          (element) => getComputedStyle(element).backgroundColor,
        ),
    )
    .not.toBe(before);
  expect(
    await page.getByTestId('toggle-form').evaluate(
      /** Confirm a button Toggle adds no native form field. */
      (form) => [...new FormData(form as HTMLFormElement).entries()],
    ),
  ).toEqual([]);
}

test('Toggle composes Button styling and remains a button in forms', verifiesTogglePresentation);

/** Verify keyboard tab order, visible focus, and retained focus on a styled child. */
async function verifiesToggleFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--contract');
  const root = page.getByRole('button', { name: 'Bold', exact: true });
  await expect(root).toBeVisible({ timeout: 30_000 });
  await pressBrowserTab(page);
  await expect(root).toBeFocused();
  await expect(root).toHaveCSS('outline-style', 'solid');
  await expect(root).toHaveCSS('outline-width', '2px');
  await page.keyboard.press('Space');
  await expect(root).toBeFocused();
  await expect(root).toHaveAttribute('aria-pressed', 'true');
}

test('Toggle remains focused and visibly focused during keyboard use', verifiesToggleFocus);

/** Verify disabled and inherited state on native button roots. */
async function verifiesToggleStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--states');
  const disabled = page.getByRole('button', { name: 'Disabled Toggle' });
  await expect(disabled).toBeDisabled({ timeout: 30_000 });
  await expect(disabled).toHaveAttribute('aria-pressed', 'true');
  await pressBrowserTab(page);
  const pressed = page.getByRole('button', { name: 'Initially pressed Toggle' });
  await expect(pressed).toBeFocused();
  await expect(disabled).not.toBeFocused();
  const inherited = page.getByRole('button', { name: 'Inherited Toggle' });
  await expect(inherited).toBeEnabled();
  await inherited.click();
  await expect(inherited).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('toggle-defaults').click();
  await expect(inherited).toBeDisabled();
  await expect(inherited).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(inherited).not.toBeFocused();
  await page.keyboard.press('Space');
  await expect(inherited).toHaveAttribute('aria-pressed', 'true');
  const empty = page.getByTestId('toggle-empty-indicator');
  await expect(empty).toBeEmpty();
  await expect(empty).toHaveCSS('display', 'none');
}

test('Toggle keeps disabled, inherited, and empty-indicator behavior', verifiesToggleStates);

/** Verify the guide's pressed icon remains inside one accessible button. */
async function verifiesPressedIcon({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--pressed-icon');
  const button = page.getByRole('button', { name: 'Declined' });
  const icon = page.getByTestId('pressed-icon');
  await expect(button).toHaveAttribute('aria-pressed', 'true', { timeout: 30_000 });
  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(icon.locator('svg')).toBeVisible();
  const pressedBackground = await button.evaluate(
    /** Read the solid red button background before switching to gray outline. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(icon).toHaveCSS('display', 'none');
  await expect(button).not.toHaveCSS('background-color', pressedBackground);
  await button.press('Space');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(icon.locator('svg')).toBeVisible();
}

test('Toggle composes the pressed icon guide example', verifiesPressedIcon);

/** Verify the basic icon composition retains its name and pressed variant. */
async function verifiesBasicGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-guide--basic');
  const button = page.getByRole('button', { name: 'Bold', exact: true });
  await expect(button).toHaveAttribute('aria-pressed', 'false', { timeout: 30_000 });
  await expect(button.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  const background = await button.evaluate(
    /** Read the initial button background before pressing. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(button).not.toHaveCSS('background-color', background);
  await expect(page.getByRole('button', { name: 'Bold', exact: true })).toBeVisible();
}

test('Toggle basic guide keeps one named icon button', verifiesBasicGuide);

/** Verify two indicator branches switch together under one pressed state. */
async function verifiesIndicatorGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-guide--indicators');
  const button = page.getByRole('button', { name: 'Mute', exact: true });
  const label = page.getByTestId('volume-label');
  const icon = page.getByTestId('volume-icon');
  await expect(button).toHaveAttribute('aria-pressed', 'false', { timeout: 30_000 });
  await expect(label).toHaveText('Mute');
  await expect(icon.locator('svg')).toHaveAttribute('data-icon', 'volume2');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(label).toHaveText('Unmute');
  await expect(icon.locator('svg')).toHaveAttribute('data-icon', 'volumeX');
  await button.press('Space');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(label).toHaveText('Mute');
  await expect(icon.locator('svg')).toHaveAttribute('data-icon', 'volume2');
}

test('Toggle guide composes icon and text indicators', verifiesIndicatorGuide);

/** Verify caller CSS reaches roots, indicators, and nested content. */
async function verifiesToggleCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle-css--custom');
  const named = page.getByRole('button', { name: 'Named CSS Toggle' });
  const instance = page.getByRole('button', { name: 'Instance CSS Toggle' });
  await expect(named).toHaveCSS('border-top-width', '3px', { timeout: 30_000 });
  await expect(instance).toHaveCSS('border-top-width', '5px');
  await expect(named.locator('.toggle-css-indicator')).toHaveCSS('letter-spacing', '2px');
  await expect(instance.locator('.toggle-css-indicator')).toHaveCSS('letter-spacing', '4px');
  await expect(page.getByTestId('toggle-named-probe')).toHaveCSS('letter-spacing', '2px');
  await expect(page.getByTestId('toggle-instance-probe')).toHaveCSS('letter-spacing', '4px');
  await expect(page.getByTestId('toggle-empty-override')).toHaveCSS('display', 'inline');
  const unstyled = page.getByRole('button', { name: 'Unstyled Toggle' });
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('toggle-unstyled-indicator')).toHaveCSS('display', 'inline');
  await instance.click();
  await expect(instance).toHaveAttribute('aria-pressed', 'true');
}

test('Toggle exposes CSS hooks without inserting presentation styles', verifiesToggleCss);
