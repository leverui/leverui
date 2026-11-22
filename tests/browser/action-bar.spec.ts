import { expect, test, type Page } from '@playwright/test';

/** Verify selection, keyboard dismissal, close, actions, and nested dialog use. */
async function verifiesSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--selection');
  const bar = page.getByTestId('action-bar-content');
  await expect(bar).toHaveCount(0, { timeout: 30_000 });
  const checkbox = page.getByRole('checkbox', { name: 'Select row' });
  await checkbox.focus();
  await checkbox.press('Space');
  await expect(bar).toBeVisible();
  await expect(checkbox).toBeFocused();
  await expect(bar).toHaveAttribute('role', 'dialog');
  await expect(page.getByTestId('action-bar-positioner')).toHaveAttribute(
    'data-caller-ref',
    'attached',
  );
  await expect(page.getByTestId('action-bar-positioner')).toHaveCSS('position', 'fixed');
  await expect(page.getByTestId('action-bar-child-close')).toHaveClass(/consumer-close/);
  expect(
    await bar.evaluate(
      /** Confirm the Action Bar's portal moved it beyond the ancestor form. */
      (element) => element.closest('form'),
    ),
  ).toBeNull();
  await page.getByTestId('action-bar-selection').click();
  await expect(bar).toBeVisible();
  await expect(page.getByRole('button', { name: '1 selected' })).toHaveAttribute('type', 'button');
  await page.getByRole('button', { name: '1 selected' }).focus();
  await page.keyboard.press('Escape');
  await expect(bar).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Select row' }).check();
  await expect(bar).toBeVisible();
  await page.getByRole('button', { name: 'Archive' }).click();
  await expect(page.getByTestId('action-bar-last-action')).toHaveText('archived');
  await expect(bar).toBeVisible();
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const dialog = page.getByTestId('action-bar-dialog-content');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Confirm selection');
  expect(
    await dialog.evaluate(
      /** Confirm the nested Dialog portal has moved its content outside the bar. */
      (element) => element.closest('[data-testid="action-bar-content"]'),
    ),
  ).toBeNull();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(bar).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('action-bar-dialog-trigger')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(bar).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Select row' }).check();
  await expect(bar).toBeVisible();
  await page.getByRole('button', { name: 'Close actions' }).click();
  await expect(bar).toHaveCount(0);
  await expect(page.getByTestId('action-bar-selection')).toHaveText('clear');
}

test(
  'Action Bar follows selection and supports actions, nested dialog, and dismissal',
  verifiesSelection,
);

/** Keep the same bar node while placement changes through all finite choices. */
async function verifiesPlacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar-placement--variants');
  const positioner = page.getByTestId('action-bar-positioner');
  await expect(positioner).toBeVisible({ timeout: 30_000 });
  await expect(positioner).toHaveCSS('justify-content', 'center');
  const marker = await positioner.evaluate(
    /** Mark the node so a reactive update cannot quietly replace it. */
    (element) => {
      element.setAttribute('data-stable-node', 'true');
      return element.getAttribute('data-stable-node');
    },
  );
  expect(marker).toBe('true');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(positioner).toHaveCSS('justify-content', 'flex-start');
  await page.getByRole('button', { name: 'End' }).click();
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');
  await expect(positioner).toHaveAttribute('data-stable-node', 'true');
  await page.getByRole('button', { name: 'Center' }).click();
  await expect(positioner).toHaveCSS('justify-content', 'center');
}

test('Action Bar changes placement without replacing its positioner', verifiesPlacement);

/** Reflow the fixed Action Bar at the medium responsive breakpoint. */
async function verifiesResponsivePlacement({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 500, height: 700 });
  await page.goto('/iframe.html?id=components-action-bar-placement--responsive');
  const positioner = page.getByTestId('responsive-action-bar-positioner');
  await expect(positioner).toHaveCSS('justify-content', 'flex-start', { timeout: 30_000 });
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(positioner).toHaveCSS('justify-content', 'flex-end');
  await expect(page.getByRole('button', { name: '3 selected' })).toBeVisible();
}

test('Action Bar placement follows the responsive CSS choice', verifiesResponsivePlacement);

/** Close an initially open Action Bar without external state. */
async function verifiesUncontrolledState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar--uncontrolled');
  const bar = page.getByTestId('uncontrolled-action-bar');
  await expect(bar).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Close selection' }).click();
  await expect(bar).toHaveCount(0);
}

test('Action Bar can close from uncontrolled initial state', verifiesUncontrolledState);

/** Verify the body portal keeps the explicit nested color scope and slot CSS. */
async function verifiesPortalScope({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar-behavior--portal-scope');
  const bridge = page.getByTestId('action-bar-portal-theme');
  const content = page.getByTestId('action-bar-scoped-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(bridge).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(page.getByTestId('action-bar-scoped-positioner')).toHaveAttribute(
    'data-caller-ref',
    'attached',
  );
  expect(
    await bridge.evaluate(
      /** Keep the explicit theme bridge mounted in the document body. */
      (element) => document.body.contains(element),
    ),
  ).toBe(true);
  expect(
    await bridge.evaluate(
      /** Ensure the body portal left its original nested theme scope. */
      (element) =>
        document.querySelector('[data-testid="action-bar-source-theme"]')?.contains(element),
    ),
  ).toBe(false);
  const darkBackground = await content.evaluate(
    /** Read the dark scoped content color before changing the source mode. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByRole('button', { name: 'Toggle scope' }).click();
  await expect(bridge).toHaveAttribute('data-leverui-color-mode', 'light');
  const lightBackground = await content.evaluate(
    /** Read the light scoped content color after updating the theme bridge. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(lightBackground).not.toBe(darkBackground);
  await expect(content).toHaveAttribute('role', 'dialog');
}

test('Action Bar keeps scoped styles and refs through a body portal', verifiesPortalScope);

/** Verify default outside dismissal, focus return, and exit notification. */
async function verifiesOutsideDismissal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar-behavior--outside-dismissal');
  const bar = page.getByTestId('action-bar-outside-content');
  await expect(bar).toBeVisible({ timeout: 30_000 });
  const initialEntries = Number(await page.getByTestId('action-bar-enter-count').textContent());
  await page.getByTestId('action-bar-outside').click();
  await expect(bar).toHaveCount(0);
  await expect(page.getByTestId('action-bar-exit-count')).toHaveText('1');
  await page.getByTestId('action-bar-reopen').click();
  await expect(bar).toBeVisible();
  await expect(page.getByTestId('action-bar-machine-state')).toHaveText('open');
  await expect(page.getByTestId('action-bar-enter-count')).toHaveText(String(initialEntries + 1));
  await page.getByRole('button', { name: '1 selected' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('action-bar-escape-count')).toHaveText('1');
  await expect(bar).toHaveCount(0);
  await expect(page.getByTestId('action-bar-reopen')).toBeFocused();
  await page.getByTestId('action-bar-reopen').click();
  await expect(bar).toBeVisible();
  await page.getByRole('button', { name: 'Close outside actions' }).click();
  await expect(bar).toHaveCount(0);
  await expect(page.getByTestId('action-bar-reopen')).toBeFocused();
}

test(
  'Action Bar dismisses outside and restores focus after Escape or close',
  verifiesOutsideDismissal,
);

/** Verify the primitive's external machine closes through the styled close trigger. */
async function verifiesCallerOwnedClose({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar-behavior--caller-owned');
  const bar = page.getByTestId('caller-action-bar');
  await expect(bar).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Close caller-owned actions' }).click();
  await expect(bar).toHaveCount(0);
}

test('Action Bar RootProvider closes a caller-owned machine', verifiesCallerOwnedClose);
