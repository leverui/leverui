import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import type { ListboxCollectionGuide } from '../../.storybook/listbox-collection-guide-tree';
import {
  expectCollectionGuideActive,
  expectCollectionGuideOptions,
} from './listbox-collection-guide-contract';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an option so replacement during hydration is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser package to the matching server guide. */
async function hydrateInBrowser(guide: ListboxCollectionGuide): Promise<void> {
  const modulePath = '/.storybook/listbox-collection-guide-hydration-example.tsx';
  const { hydrateListboxCollectionGuide } = await import(modulePath);
  const target = document.getElementById('listbox-collection-guide-hydration-root');
  if (!target) throw new Error('Listbox collection guide hydration root is missing.');
  hydrateListboxCollectionGuide(target, guide);
}

/** Check the selected server values independently of the guide data module. */
async function expectServerSelection(
  options: Locator,
  guide: ListboxCollectionGuide,
): Promise<void> {
  const selected = guide === 'multiple' ? [0, 2] : [0];
  for (const index of selected)
    await expect(options.nth(index)).toHaveAttribute('aria-selected', 'true');
}

/** Exercise disabled, grouped, or multiple selection after browser attachment. */
async function exerciseHydratedGuide(
  listbox: Locator,
  options: Locator,
  guide: ListboxCollectionGuide,
): Promise<void> {
  switch (guide) {
    case 'disabled':
      await expect(options.nth(1)).toHaveAttribute('aria-disabled', 'true');
      await options.nth(1).click({ force: true });
      await expect(options.first()).toHaveAttribute('aria-selected', 'true');
      await listbox.focus();
      await listbox.press('Home');
      await listbox.press('ArrowDown');
      await expectCollectionGuideActive(listbox, options.nth(2));
      await listbox.press('Enter');
      await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
      await expect(options.first()).toHaveAttribute('aria-selected', 'false');
      break;
    case 'grouped':
      await expect(listbox.getByRole('group', { name: 'Books' })).toBeVisible();
      await expect(listbox.getByRole('group', { name: 'Movies' })).toBeVisible();
      await listbox.focus();
      await listbox.press('End');
      await expectCollectionGuideActive(listbox, options.last());
      await listbox.press('Enter');
      await expect(options.last()).toHaveAttribute('aria-selected', 'true');
      await expect(options.first()).toHaveAttribute('aria-selected', 'false');
      break;
    case 'multiple':
      await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
      await options.nth(1).click();
      await listbox.focus();
      await listbox.press('End');
      await expectCollectionGuideActive(listbox, options.last());
      await listbox.press('Enter');
      for (const index of [0, 1, 2, 6]) {
        await expect(options.nth(index)).toHaveAttribute('aria-selected', 'true');
      }
      await listbox.press('Enter');
      await expect(options.last()).toHaveAttribute('aria-selected', 'false');
      for (const index of [0, 1, 2]) {
        await expect(options.nth(index)).toHaveAttribute('aria-selected', 'true');
      }
      await options.nth(2).click();
      await expect(options.nth(2)).toHaveAttribute('aria-selected', 'false');
      await expect(options.first()).toHaveAttribute('aria-selected', 'true');
      await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
      break;
  }
  await expect(listbox).toBeFocused();
}

/** Retain server nodes and styles, then verify each guide's live selection. */
async function verifyHydration(page: Page, guide: ListboxCollectionGuide): Promise<void> {
  const markup = await readFile(
    new URL(`../../.tmp/listbox-collection-guide-${guide}-hydration.html`, import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-collection-guide-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox');
  const options = listbox.getByRole('option');
  await expectCollectionGuideOptions(options, guide);
  await expectServerSelection(options, guide);
  await options.first().evaluate(markServerNode);
  await options.last().evaluate(markServerNode);
  const originalId = await listbox.getAttribute('id');
  const styleCount = await page.locator('style').count();
  const errors: string[] = [];

  /** Retain errors from attachment and subsequent keyboard use. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, guide);
  await expect(page.locator('#listbox-collection-guide-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expectCollectionGuideOptions(options, guide);
  await expect(options.first()).toHaveAttribute('data-server-node', 'true');
  await expect(options.last()).toHaveAttribute('data-server-node', 'true');
  await expect(listbox).toHaveAttribute('id', originalId ?? '');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await exerciseHydratedGuide(listbox, options, guide);
  expect(errors).toEqual([]);
}

/** Exercise published disabled-option guide hydration. */
async function verifiesDisabledHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'disabled');
}

/** Exercise published grouped guide hydration. */
async function verifiesGroupedHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'grouped');
}

/** Exercise published multiple-selection guide hydration. */
async function verifiesMultipleHydration({ page }: { page: Page }): Promise<void> {
  await verifyHydration(page, 'multiple');
}

test('published disabled Listbox guide hydrates', verifiesDisabledHydration);
test('published grouped Listbox guide hydrates', verifiesGroupedHydration);
test('published multiple Listbox guide hydrates', verifiesMultipleHydration);
