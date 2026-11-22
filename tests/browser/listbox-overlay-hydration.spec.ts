import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the published browser tree against existing server nodes. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-overlay-hydration-example.tsx';
  const { hydrateListboxOverlayExample } = await import(modulePath);
  const root = document.getElementById('listbox-overlay-hydration-root');
  if (!root) throw new Error('Listbox overlay hydration root was not found.');
  hydrateListboxOverlayExample(root, true);
}

/** Mark one server-rendered option so replacement becomes visible. */
function markServerOption(element: Element): void {
  element.setAttribute('data-server-option', 'true');
}

/** Check that the open portal moves outside the server root after hydration. */
function isOutsideRoot(element: Element): boolean {
  return element.closest('#listbox-overlay-hydration-root') === null;
}

/** Verify nested Listbox and Popover state survives published hydration. */
async function verifiesOverlayHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-overlay-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-overlay-hydration-root">${markup}</div>`,
  );
  const trigger = page.getByTestId('hydrated-overlay-trigger');
  const content = page.getByTestId('hydrated-overlay-content');
  const listbox = page.getByTestId('hydrated-overlay-listbox');
  const react = page.getByTestId('hydrated-overlay-react');
  await expect(content).toBeVisible();
  await expect(listbox).toHaveAttribute('role', 'listbox');
  await expect(react).toHaveAttribute('aria-selected', 'true');
  // Zag 2 gives the trigger no `id`; its scoped part attribute keeps the server ID.
  const ids = [
    await trigger.getAttribute('data-popover-trigger'),
    await content.getAttribute('id'),
  ];
  await react.evaluate(markServerOption);
  const errors: string[] = [];

  /** Collect browser failures while the published client package attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-overlay-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(react).toHaveAttribute('data-server-option', 'true');
  await expect(react).toHaveAttribute('aria-selected', 'true');
  await expect(trigger).toHaveAttribute('data-popover-trigger', ids[0] ?? '');
  await expect(content).toHaveAttribute('id', ids[1] ?? '');
  expect(await content.evaluate(isOutsideRoot)).toBe(true);
  await page.getByTestId('hydrated-overlay-solid').click();
  await expect(content).not.toBeVisible();
  await expect(trigger).toHaveText('Solid');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByTestId('hydrated-overlay-solid')).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Listbox inside Popover retains nodes and state through hydration',
  verifiesOverlayHydration,
);
