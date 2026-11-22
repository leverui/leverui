import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { settleTagFrame } from './tags-input-guide-frame';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Reject server markup without a usable ID before comparing hydration. */
async function requireServerId(locator: Locator, name: string): Promise<string> {
  const id = await locator.getAttribute('id');
  if (!id) throw new Error(`${name} has no server-rendered ID.`);
  return id;
}

/** Hydrate the guide using the published browser bundle. */
async function hydrateGuideInBrowser(): Promise<void> {
  const modulePath = '/.storybook/tags-input-guide-hydration-example.tsx';
  const { hydrateTagsInputGuideExample } = await import(modulePath);
  const root = document.getElementById('tags-input-guide-hydration-root');
  if (!root) throw new Error('Tags Input guide hydration root was not found.');
  hydrateTagsInputGuideExample(root);
}

/** Preserve server nodes and IDs across the guide's three compound paths. */
async function verifiesGuideHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/tags-input-guide-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="tags-input-guide-hydration-root">${markup}</div>`,
  );

  const host = page.locator('#tags-input-guide-hydration-root');
  const colored = page.getByTestId('hydrated-tags-guide-colors');
  const field = page.getByTestId('hydrated-tags-guide-field');
  const combo = page.getByTestId('hydrated-tags-guide-combo-root');
  const comboInput = page.getByPlaceholder('Add suggested tag');
  const categoryInput = page.getByPlaceholder('Add category');
  const colorInput = page.getByPlaceholder('Add colored tag');
  const comboLabel = combo.getByText('Suggested tags');
  const fieldHelper = page.getByText('Add project categories');
  const originalComboId = await requireServerId(comboInput, 'Combobox input');
  const originalLabelId = await requireServerId(comboLabel, 'Combobox label');
  const originalFieldId = await requireServerId(categoryInput, 'Field input');
  const originalColorId = await requireServerId(colorInput, 'colored input');
  const originalHelperId = await requireServerId(fieldHelper, 'Field helper');
  const coloredTags = colored.locator('[data-tags-input-item]');
  const fieldTags = field.locator('[data-tags-input-item]');
  const comboTags = combo.locator('[data-tags-input-item]');
  await expect(coloredTags).toHaveCount(2);
  await expect(fieldTags).toHaveCount(1);
  await expect(comboTags).toHaveCount(1);
  const serverTags = [coloredTags.nth(0), coloredTags.nth(1), fieldTags.first(), comboTags.first()];
  for (const [index, tag] of serverTags.entries()) {
    await tag.evaluate(
      /** Mark every initial server tag so partial replacement is visible. */
      (node, marker) => node.setAttribute('data-server-node', marker),
      `tag-${index}`,
    );
  }
  const errors: string[] = [];

  /** Record hydration and interaction exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateGuideInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  for (const [index, tag] of serverTags.entries()) {
    await expect(tag).toHaveAttribute('data-server-node', `tag-${index}`);
  }
  await expect(comboInput).toHaveAttribute('id', originalComboId);
  await expect(comboLabel).toHaveAttribute('id', originalLabelId);
  await expect(categoryInput).toHaveAttribute('id', originalFieldId);
  await expect(colorInput).toHaveAttribute('id', originalColorId);
  await expect(fieldHelper).toHaveAttribute('id', originalHelperId);
  await expect(categoryInput).toHaveAttribute('aria-describedby', originalHelperId);
  await expect(categoryInput).toHaveAccessibleDescription('Add project categories');

  await colorInput.fill('TypeScript');
  await colorInput.press('Enter');
  await colorInput.evaluate(settleTagFrame);
  await expect(colored.locator('[data-tags-input-item-text]')).toHaveText([
    'SolidJS',
    'Lever UI',
    'TypeScript',
  ]);
  const addedColor = await colored
    .locator('[data-tags-input-item-preview]')
    .last()
    .evaluate(
      /** Read the hydrated Index item's consumer color. */
      (node) => getComputedStyle(node).backgroundColor,
    );
  expect(addedColor).not.toBe('rgba(0, 0, 0, 0)');
  await categoryInput.fill('Vitest');
  await categoryInput.press('Enter');
  await categoryInput.evaluate(settleTagFrame);
  await expect(field.locator('[data-tags-input-item-text]')).toHaveText(['Solid', 'Vitest']);
  await comboInput.fill('Type');
  await expect(comboInput).toHaveAttribute('aria-expanded', 'true');
  const listbox = page.getByRole('listbox', { name: 'Suggested tags' });
  await expect(listbox).toBeVisible();
  const suggestion = page.getByTestId('hydrated-suggestion-TypeScript');
  await expect(suggestion).toBeVisible();
  await suggestion.click();
  await expect(combo.locator('[data-tags-input-item-text]')).toHaveText(['SolidJS', 'TypeScript']);
  expect(errors).toEqual([]);
}

test(
  'published guide compositions hydrate existing nodes and stay interactive',
  verifiesGuideHydration,
);
