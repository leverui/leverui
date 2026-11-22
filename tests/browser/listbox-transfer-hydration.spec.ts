import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server option so replacement during hydration becomes visible. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared transfer tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-transfer-hydration-example.tsx';
  const { hydrateListboxTransferExample } = await import(modulePath);
  const root = document.getElementById('listbox-transfer-hydration-root');
  if (!root) throw new Error('Transfer hydration root was not found.');
  hydrateListboxTransferExample(root);
}

/** Preserve two accessible machines and bidirectional state after hydration. */
async function verifiesTransferHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-transfer-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-transfer-hydration-root">${markup}</div>`,
  );
  const available = page.getByRole('listbox', { name: 'Available characters' });
  const selected = page.getByRole('listbox', { name: 'Selected characters' });
  const wren = available.getByRole('option', { name: 'Wren' });
  const ids = [await available.getAttribute('id'), await selected.getAttribute('id')];
  await expect(wren).toHaveCount(1);
  await wren.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record any client exception during hydration and transfer. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-transfer-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(wren).toHaveAttribute('data-server-node', 'true');
  await expect(available).toHaveAttribute('id', ids[0] ?? '');
  await expect(selected).toHaveAttribute('id', ids[1] ?? '');
  await wren.click();
  await page.getByRole('button', { name: 'Move selected characters right' }).click();
  await expect(selected.getByRole('option', { name: 'Wren' })).toHaveCount(1);
  expect(errors).toEqual([]);
}

test(
  'published Transfer List preserves its nodes and state through hydration',
  verifiesTransferHydration,
);
