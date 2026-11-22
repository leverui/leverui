import { readFile } from 'node:fs/promises';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server option so client replacement becomes observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the server tree from the built browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-hydration-example.tsx';
  const { hydrateListboxExample } = await import(modulePath);
  const root = document.getElementById('listbox-hydration-root');
  if (!root) throw new Error('Listbox hydration root was not found.');
  hydrateListboxExample(root);
}

/** Keep both root modes' selected options through browser hydration. */
async function verifiesListboxHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('listbox', { name: 'Hydrated primary' });
  const external = page.getByRole('listbox', { name: 'Hydrated external' });
  const primarySolid = page.getByTestId('Hydrated primary-solid');
  const externalReact = page.getByTestId('Hydrated external-react');
  await expect(primarySolid).toHaveAttribute('aria-selected', 'true');
  await expect(externalReact).toHaveAttribute('aria-selected', 'true');
  const originalIds = [await primary.getAttribute('id'), await external.getAttribute('id')];
  await primarySolid.evaluate(markServerNode);
  await externalReact.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record client failures while the published browser package attaches. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(primarySolid).toHaveAttribute('data-server-node', 'true');
  await expect(externalReact).toHaveAttribute('data-server-node', 'true');
  await expect(primary).toHaveAttribute('id', originalIds[0] ?? '');
  await expect(external).toHaveAttribute('id', originalIds[1] ?? '');
  await page.getByTestId('Hydrated primary-react').click();
  await expect(page.getByTestId('Hydrated primary-react')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('Hydrated external-solid').click();
  await expect(page.getByTestId('Hydrated external-solid')).toHaveAttribute(
    'aria-selected',
    'true',
  );
}

test('published Listbox options and selection survive hydration', verifiesListboxHydration);

/** Verify the server tree remains styled by the distributed CSS without JavaScript. */
async function verifiesStaticListboxCss({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(`<style>${defaultCss}</style><div>${markup}</div>`);
  // The primitive puts the listbox role on List; Content is its styled parent surface.
  const content = page.getByRole('listbox', { name: 'Hydrated primary' }).locator('xpath=..');
  const selected = page.getByTestId('Hydrated primary-solid');
  await expect(content).toHaveCSS('border-top-width', '1px');
  await expect(content).toHaveCSS('flex-direction', 'column');
  await expect(selected).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

/** Open an isolated context that never executes the client bundle. */
async function verifiesDisabledJavaScript({ browser }: { browser: Browser }): Promise<void> {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await verifiesStaticListboxCss({ page });
  } finally {
    await context.close();
  }
}

test(
  'published Listbox CSS styles server markup with JavaScript disabled',
  verifiesDisabledJavaScript,
);
