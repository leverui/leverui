import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { expectHorizontalEndReachable } from './listbox-horizontal-contract';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const markup = await readFile(
  new URL('../../.tmp/listbox-horizontal-hydration.html', import.meta.url),
  'utf8',
);

/** Mark one option so browser replacement of server nodes is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser package to the selected server guide. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/listbox-horizontal-hydration-example.tsx';
  const { hydrateHorizontalListbox } = await import(modulePath);
  const target = document.getElementById('listbox-horizontal-hydration-root');
  if (!target) throw new Error('Horizontal Listbox hydration root is missing.');
  hydrateHorizontalListbox(target);
}

/** Verify published server options survive hydration and remain interactive. */
async function verifiesHorizontalHydration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-horizontal-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#listbox-horizontal-hydration-root');
  const listbox = page.getByRole('listbox', { name: 'Select Album' });
  const options = listbox.getByRole('option');
  await expect(listbox).toHaveAttribute('data-orientation', 'horizontal');
  await expect(options).toHaveCount(5);
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await options.first().evaluate(markServerNode);
  await options.last().evaluate(markServerNode);
  const originalId = await listbox.getAttribute('id');
  const styleCount = await page.locator('style').count();
  const errors: string[] = [];

  /** Retain errors from hydration and later selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(options.first()).toHaveAttribute('data-server-node', 'true');
  await expect(options.last()).toHaveAttribute('data-server-node', 'true');
  await expect(listbox).toHaveAttribute('id', originalId ?? '');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await listbox.focus();
  await listbox.press('Home');
  await listbox.press('ArrowRight');
  await listbox.press('ArrowRight');
  await listbox.press('ArrowRight');
  await listbox.press('ArrowRight');
  await expectHorizontalEndReachable(listbox, options.last());
  await listbox.press('Enter');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
  await options.first().click();
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.last()).toHaveAttribute('aria-selected', 'false');
  await expect(listbox).toBeFocused();
  expect(errors).toEqual([]);
}

test('published horizontal Listbox guide hydrates', verifiesHorizontalHydration);
