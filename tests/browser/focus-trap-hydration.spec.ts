import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FocusTrapHydrationComponents } from '../../.storybook/focus-trap-hydration-tree';
import { renderFocusTrapHydrationTree } from '../../.storybook/focus-trap-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as FocusTrapHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark the server's native trap node before Solid attaches to it. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Attach client behavior to the published Focus Trap tree. */
async function hydrateFocusTrapInBrowser(initialActive: boolean): Promise<void> {
  const modulePath = '/.storybook/focus-trap-hydration-example.tsx';
  const { hydrateFocusTrapExample } = await import(modulePath);
  const root = document.getElementById('focus-hydration-root');
  if (!root) throw new Error('Focus Trap hydration root was not found.');
  hydrateFocusTrapExample(root, initialActive);
}

/** Load published markup into the Storybook hydration host. */
async function loadServerMarkup(page: Page, initialActive: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same tree from the published server entry. */
    () => renderFocusTrapHydrationTree(components, initialActive),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="focus-hydration-root">${markup}</div>`,
  );
}

/** Verify a disabled server trap activates and restores focus after hydration. */
async function verifiesDisabledTrapHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, false);
  const root = page.locator('#focus-hydration-root');
  const trap = page.getByTestId('hydrated-focus-root');
  const launcher = page.getByTestId('hydrated-focus-launcher');
  const input = page.getByRole('textbox', { name: 'Hydrated focus input' });
  await expect(trap).toHaveCSS('padding', '17px');
  await trap.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record browser errors while Solid attaches to the server node. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFocusTrapInBrowser, false);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(trap).toHaveAttribute('data-server-element', 'true');
  await launcher.focus();
  await launcher.press('Enter');
  await expect(input).toBeFocused();
  await page.getByRole('button', { name: 'Close hydrated trap' }).click();
  await expect(launcher).toBeFocused();
  expect(errors).toEqual([]);
}

test(
  'published disabled Focus Trap hydrates and becomes interactive',
  verifiesDisabledTrapHydration,
);

/** Verify an initially active trap focuses its original server content. */
async function verifiesActiveTrapHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, true);
  const root = page.locator('#focus-hydration-root');
  const trap = page.getByTestId('hydrated-focus-root');
  const input = page.getByRole('textbox', { name: 'Hydrated focus input' });
  await trap.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record browser errors from active trap hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFocusTrapInBrowser, true);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(trap).toHaveAttribute('data-server-element', 'true');
  await expect(trap).toHaveCSS('padding', '17px');
  await expect(input).toBeFocused();
  await page.getByRole('button', { name: 'Close hydrated trap' }).click();
  await page.getByTestId('hydrated-focus-launcher').focus();
  await expect(page.getByTestId('hydrated-focus-launcher')).toBeFocused();
  expect(errors).toEqual([]);
}

test(
  'published active Focus Trap hydrates without replacing its node',
  verifiesActiveTrapHydration,
);
