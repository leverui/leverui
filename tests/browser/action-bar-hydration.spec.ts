import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { ActionBarHydrationComponents } from '../../.storybook/action-bar-hydration-tree';
import { renderActionBarHydrationTree } from '../../.storybook/action-bar-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ActionBarHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server node before hydration to detect replacement. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the published tree through the browser source entry. */
async function hydrateInBrowser(input: {
  initiallyOpen: boolean;
  portalled: boolean;
}): Promise<void> {
  const modulePath = '/.storybook/action-bar-hydration-example.tsx';
  const { hydrateActionBarExample } = await import(modulePath);
  const root = document.getElementById('action-bar-hydration-root');
  if (!root) throw new Error('Action Bar hydration root was not found.');
  hydrateActionBarExample(root, input.initiallyOpen, input.portalled);
}

/** Verify DOM reuse, stable styles, and open or close after hydration. */
async function verifiesHydration(
  page: Page,
  initiallyOpen: boolean,
  portalled = false,
): Promise<void> {
  const markup = renderToString(
    /** Render the same initial machine state as the browser. */
    () => renderActionBarHydrationTree(components, initiallyOpen, portalled),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="action-bar-hydration-root">${markup}</div>`,
  );
  const positioner = page.getByTestId('hydrated-action-bar-positioner');
  const content = page.getByTestId('hydrated-action-bar-content');
  await positioner.evaluate(markServerNode);
  if (initiallyOpen) await content.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture browser errors raised during hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, { initiallyOpen, portalled });
  await expect(page.locator('#action-bar-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(positioner).toHaveAttribute('data-server-node', 'true');
  if (portalled) {
    const bridge = page.locator('#hydrated-action-bar-theme-bridge');
    await expect(bridge).toHaveAttribute('data-lui-color-mode', 'dark');
    expect(
      await bridge.evaluate(
        /** Keep the hydrated theme bridge in the owning document body. */
        (element) => document.body.contains(element),
      ),
    ).toBe(true);
    expect(
      await bridge.evaluate(
        /** Confirm the server node moved outside its hydration root. */
        (element) => document.getElementById('action-bar-hydration-root')?.contains(element),
      ),
    ).toBe(false);
    await expect(positioner).toHaveCSS('position', 'fixed');
  }

  if (initiallyOpen) {
    await expect(content).toHaveAttribute('data-server-node', 'true');
    await page.getByTestId('hydrated-action-bar-close').click();
    await expect(content).toHaveCount(0);
  } else {
    await expect(content).toHaveCount(0);
    await page.getByTestId('hydrated-action-bar-open').click();
    await expect(content).toBeVisible();
  }
}

/** Hydrate an initially closed Action Bar and open it. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, false);
}

/** Hydrate an open Action Bar and close it from its reused content. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, true);
}

test('published closed Action Bar hydrates and opens', verifiesClosedHydration);
test('published open Action Bar hydrates and closes', verifiesOpenHydration);

/** Hydrate an open scoped Action Bar and move its original nodes into the body portal. */
async function verifiesPortalledHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, true, true);
}

test('published scoped Action Bar hydrates through Portal', verifiesPortalledHydration);
