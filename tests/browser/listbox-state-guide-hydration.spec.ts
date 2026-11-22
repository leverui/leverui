import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { expectGuideOptions } from './listbox-guide-contract';
import type { ListboxStateGuide } from '../../.storybook/listbox-state-guide-tree';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server option to prove hydration retains that native element. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser package to a matching server fixture. */
async function hydrateInBrowser(guide: ListboxStateGuide): Promise<void> {
  const modulePath = '/.storybook/listbox-state-guide-hydration-example.tsx';
  const { hydrateListboxStateGuide } = await import(modulePath);
  const target = document.getElementById('listbox-state-guide-hydration-root');
  if (!target) throw new Error('Listbox state guide hydration root is missing.');
  hydrateListboxStateGuide(target, guide);
}

/** Verify one published root mode retains selected nodes and updates after hydration. */
async function verifyHydration(page: Page, guide: ListboxStateGuide): Promise<void> {
  const markup = await readFile(
    new URL(`../../.tmp/listbox-state-guide-${guide}-hydration.html`, import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-state-guide-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox', { name: 'Select framework' });
  const options = listbox.getByRole('option');
  const first = options.first();
  const last = options.last();
  await expectGuideOptions(options, 'extended');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await first.evaluate(markServerNode);
  await last.evaluate(markServerNode);
  const originalId = await listbox.getAttribute('id');
  const styleCount = await page.locator('style').count();
  const errors: string[] = [];

  /** Retain exceptions from hydration and subsequent selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, guide);
  await expect(page.locator('#listbox-state-guide-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expectGuideOptions(options, 'extended');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await expect(last).toHaveAttribute('data-server-node', 'true');
  await expect(listbox).toHaveAttribute('id', originalId ?? '');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await options.nth(1).click();
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(first).toHaveAttribute('aria-selected', 'false');
  if (guide !== 'basic') {
    await expect(page.getByTestId('listbox-state-value')).toContainText('"vue"');
    await listbox.focus();
    await listbox.press('End');
    await expect(last).toHaveAttribute('data-highlighted');
    await expect(last).toHaveAttribute('id', /.+/);
    await expect(listbox).toHaveAttribute(
      'aria-activedescendant',
      (await last.getAttribute('id')) ?? '',
    );
    await listbox.press('Enter');
    await expect(last).toHaveAttribute('aria-selected', 'true');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByTestId('listbox-state-value')).toContainText('"svelte"');
    await expect(page.getByTestId('listbox-state-value')).not.toContainText('"vue"');
    await expect(listbox).toBeFocused();
  }
  expect(errors).toEqual([]);
}

/** Exercise published Basic server markup through browser attachment. */
async function verifiesBasicHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'basic');
}

/** Exercise published controlled selection through browser attachment. */
async function verifiesControlledHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'controlled');
}

/** Exercise a published external store through browser attachment. */
async function verifiesStoreHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'store');
}

test('published Basic Listbox guide hydrates selection', verifiesBasicHydration);
test('published controlled Listbox guide hydrates selection', verifiesControlledHydration);
test('published store Listbox guide hydrates selection', verifiesStoreHydration);
