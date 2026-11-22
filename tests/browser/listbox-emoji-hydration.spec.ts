import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark the first server option so DOM replacement is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared tree with the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-emoji-hydration-example.tsx';
  const { hydrateListboxEmojiExample } = await import(modulePath);
  const root = document.getElementById('listbox-emoji-hydration-root');
  if (!root) throw new Error('Emoji Grid hydration root was not found.');
  hydrateListboxEmojiExample(root);
}

/** Preserve the server options, accessible names, and selection after hydration. */
async function verifiesEmojiHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-emoji-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-emoji-hydration-root">${markup}</div>`,
  );
  const grid = page.getByRole('listbox', { name: 'Emojis' });
  const first = grid.getByRole('option', { name: 'grinning face', exact: true });
  const id = await grid.getAttribute('id');
  await expect(grid.getByRole('option')).toHaveCount(200);
  await first.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record client exceptions during hydration and later interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-emoji-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await expect(grid).toHaveAttribute('id', id ?? '');
  const filter = page.getByRole('textbox', { name: 'Filter emojis' });
  await filter.fill('GRINNING FACE');
  await expect(grid.getByRole('option')).toHaveCount(4);
  await filter.press('ArrowDown');
  await filter.press('Enter');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('selected-emoji')).toContainText('😀');
  expect(errors).toEqual([]);
}

test(
  'published Emoji Grid retains its server nodes and behavior through hydration',
  verifiesEmojiHydration,
);
