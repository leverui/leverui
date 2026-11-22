import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { countries } from '../../demos/listbox-virtualized-data';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an existing server option to detect replacement during hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser tree to the matching server fixture. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-virtualized-hydration-example.tsx';
  const { hydrateVirtualizedListbox } = await import(modulePath);
  const target = document.getElementById('listbox-virtualized-hydration-root');
  if (!target) throw new Error('Virtualized Listbox hydration root was not found.');
  hydrateVirtualizedListbox(target);
}

/** Verify retained server rows and offscreen keyboard selection after attach. */
async function verifiesVirtualizedHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/listbox-virtualized-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-virtualized-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox', { name: `Select Country (${countries.length} items)` });
  const options = listbox.getByRole('option');
  /** Count options still mounted after initial rendering or hydration. */
  function countOptions(): Promise<number> {
    return options.count();
  }
  const first = page.getByRole('option', { name: 'Andorra' });
  const styleCount = await page.locator('style').count();
  await expect(first).toBeVisible();
  await expect.poll(countOptions).toBeLessThan(countries.length);
  await first.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture browser exceptions from hydration and later navigation. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#listbox-virtualized-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await listbox.focus();
  await listbox.press('End');
  const last = page.getByRole('option', { name: 'Zimbabwe' });
  await expect(last).toBeVisible();
  await expect(last).toHaveAttribute('data-highlighted');
  await expect(listbox).toBeFocused();
  await listbox.press('Enter');
  await expect(last).toHaveAttribute('aria-selected', 'true');
  await expect.poll(countOptions).toBeLessThan(countries.length);
  expect(errors).toEqual([]);
}

test(
  'published virtualized Listbox hydrates and navigates offscreen rows',
  verifiesVirtualizedHydration,
);
