import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'checkbox-tree',
  'collapse-animation',
  'colors',
  'context-menu',
  'controlled-expansion',
  'custom-icon',
  'default-expanded',
  'disabled-node',
  'expand-collapse-all',
  'expand-icon',
  'expanded-styling',
  'explicit-expand',
  'filter',
  'lazy-load',
  'links',
  'multi-select',
  'mutation',
  'remove-indentation',
  'sizes',
  'store',
  'variants',
] as const;

/** Open a Tree View story in its gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-treeview--${id}`);
}

/** Verify lazy children become visible after the mock request resolves. */
async function verifiesLazyLoading({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'lazy-load');
  await page.getByRole('row', { name: 'node_modules' }).click();
  await expect(page.getByRole('row', { name: 'solid-js' })).toBeVisible();
}

/** Verify per-node actions add and remove file rows. */
async function verifiesMutation({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'mutation');
  // The primitive branch controls are grid rows, which may hold the row's action buttons.
  await expect(page.locator('[data-tree-view-node]').first()).toHaveAttribute('role', 'row');
  await expect(page.getByRole('button', { name: 'node_modules Remove node Add node' })).toHaveCount(
    0,
  );
  await page.getByRole('row', { name: 'node_modules' }).hover();
  await page
    .getByRole('row', { name: 'node_modules' })
    .getByRole('button', { name: 'Add node', exact: true })
    .click();
  await expect(page.getByRole('row', { name: 'untitled-3.tsx' })).toBeVisible();
  await page.getByRole('row', { name: 'untitled-3.tsx' }).hover();
  await page
    .getByRole('row', { name: 'untitled-3.tsx' })
    .getByRole('button', { name: 'Remove node', exact: true })
    .click();
  await expect(page.getByRole('row', { name: 'untitled-3.tsx' })).toHaveCount(0);
}

/** Verify a file's context gesture opens the two actions. */
async function verifiesContextMenu({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'context-menu');
  await page.getByRole('row', { name: 'README.md' }).click({ button: 'right' });
  await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
}

/** Check every named story renders the common file tree. */
async function verifiesStoryInventory({ page }: { page: Page }): Promise<void> {
  for (const id of stories) {
    await openStory(page, id);
    await expect(page.getByRole('treegrid').first()).toBeVisible();
    if (id === 'custom-icon') {
      await expect(page.getByRole('row', { name: 'Page' })).toBeVisible();
    } else if (id === 'links') {
      await expect(page.getByRole('row', { name: 'Documentation' })).toBeVisible();
    } else {
      await expect(page.getByRole('row', { name: 'node_modules' }).first()).toBeVisible();
    }
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check linked files remain native anchors inside the tree. */
async function verifiesLinkedFiles({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'links');
  await page.getByRole('row', { name: 'Documentation' }).click();
  await expect(page.getByRole('row', { name: 'Getting started' })).toHaveAttribute(
    'href',
    '/docs/getting-started',
  );
  await page.getByRole('row', { name: 'External links' }).click();
  await expect(page.getByRole('row', { name: 'GitHub repository' })).toHaveAttribute(
    'href',
    'https://github.com/leverui/leverui',
  );
  await expect(page.getByRole('row', { name: 'npm package' })).toHaveAttribute(
    'href',
    'https://www.npmjs.com/package/@leverui/components',
  );
  await expect(page.getByRole('row', { name: 'Official docs' })).toHaveAttribute(
    'href',
    'https://leverui.com/docs',
  );
}

/** Check matrix examples expose the full set of recipes. */
async function verifiesMatrices({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'colors');
  await expect(page.getByRole('treegrid')).toHaveCount(10);
  await openStory(page, 'sizes');
  await expect(page.getByRole('treegrid')).toHaveCount(3);
  await openStory(page, 'variants');
  await expect(page.getByRole('treegrid')).toHaveCount(2);
}

/** Check the expansion controls change the nested file rows. */
async function verifiesExpansionControls({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'expand-collapse-all');
  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(page.getByRole('row', { name: 'react-dom' })).toBeVisible();
  await page.getByRole('button', { name: 'Collapse all' }).click();
  await expect(page.getByRole('row', { name: 'react-dom' })).toHaveCount(0);

  await openStory(page, 'explicit-expand');
  await page.getByRole('row', { name: 'node_modules' }).click();
  await expect(page.getByRole('row', { name: 'solid-js' })).toHaveCount(0);
  await page.locator('[data-tree-view-node-expand-trigger]').first().click();
  await expect(page.getByRole('row', { name: 'solid-js' })).toBeVisible();
}

/** Check filtering and parent checkboxes preserve the interactions. */
async function verifiesFilterAndChecks({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'filter');
  await page.getByPlaceholder("Search for files: 'react'").fill('react');
  await expect(page.getByRole('row', { name: 'react-dom' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'vite.config.ts' })).toHaveCount(0);

  await openStory(page, 'checkbox-tree');
  await page.getByRole('checkbox', { name: 'check node' }).first().click();
  await expect(page.getByRole('checkbox', { name: 'check node' }).first()).toHaveAttribute(
    'aria-checked',
    'true',
  );
}

/** Check controlled and default expansion reveal nested files. */
async function verifiesExpansion({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'controlled-expansion');
  await expect(page.getByRole('row', { name: 'solid-js' })).toBeVisible();
  await page.getByRole('row', { name: 'node_modules' }).click();
  await expect(page.getByRole('row', { name: 'solid-js' })).toHaveCount(0);

  await openStory(page, 'default-expanded');
  await expect(page.getByRole('row', { name: 'react-dom' })).toBeVisible();
}

/** Check disabled selection and caller-owned store expansion. */
async function verifiesMachineVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'disabled-node');
  await expect(page.getByRole('row', { name: 'renovate.json' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );

  await openStory(page, 'store');
  await expect(page.locator('#storybook-root pre')).toHaveText('[]');
  await page.getByRole('row', { name: 'node_modules' }).click();
  await expect(page.locator('#storybook-root pre')).toContainText('node_modules');
}

test('Tree View gallery variants render', verifiesStoryInventory);
test('Tree View expansion variants reveal the expected files', verifiesExpansion);
test('Tree View disabled and store variants expose machine state', verifiesMachineVariants);
test('Tree View matrices include every recipe', verifiesMatrices);
test('Tree View expand-all and explicit triggers control branches', verifiesExpansionControls);
test('Tree View filter and checkbox examples update', verifiesFilterAndChecks);
test('Tree View file links retain their destinations', verifiesLinkedFiles);
test('Tree View lazy folders load their children', verifiesLazyLoading);
test('Tree View actions mutate the file collection', verifiesMutation);
test('Tree View node context menu opens actions', verifiesContextMenu);
