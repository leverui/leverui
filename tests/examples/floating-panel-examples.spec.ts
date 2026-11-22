import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'anchor-position',
  'boundary',
  'position',
  'size',
  'disable-drag',
  'disable-resize',
  'resize-axes',
  'min-max',
  'controlled-open',
  'store',
  'stages',
  'multiple',
  'overlay',
  'prevent-overflow',
  'context',
  'rtl',
] as const;

/** Open a FloatingPanel example in its isolated gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-floatingpanel--${id}`);
}

/** Activate the first visible opening action. */
async function openPanel(page: Page, id: string): Promise<void> {
  const name = id === 'multiple' ? 'Notes' : id === 'rtl' ? 'فتح اللوحة' : 'Open panel';
  await page.getByRole('button', { name, exact: true }).first().click();
}

/** Require every named example to open its own usable panel. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of stories) {
    await openStory(page, id);
    await openPanel(page, id);
    await expect(page.locator('[data-floating-panel-content]').first()).toBeVisible();
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check the drag, resize, and stage variants. */
async function verifiesControls({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'disable-drag');
  await openPanel(page, 'disable-drag');
  await expect(page.locator('[data-floating-panel-drag-trigger]')).toHaveAttribute(
    'data-disabled',
    '',
  );

  await openStory(page, 'disable-resize');
  await openPanel(page, 'disable-resize');
  await expect(page.locator('[data-floating-panel-resize-trigger]')).toHaveCount(0);

  await openStory(page, 'resize-axes');
  await openPanel(page, 'resize-axes');
  await expect(page.locator('[data-placement]')).toHaveCount(3);

  await openStory(page, 'stages');
  await openPanel(page, 'stages');
  await page.getByRole('button', { name: 'minimized panel' }).click();
  await expect(page.locator('[data-floating-panel-content]')).toHaveAttribute('data-minimized', '');
  await page.getByRole('button', { name: 'default panel' }).click();
  await expect(page.locator('[data-floating-panel-content]')).not.toHaveAttribute('data-minimized');
}

/** Verify caller-owned movement, sizing, and multiple machine instances. */
async function verifiesStateExamples({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'position');
  await expect(page.getByText('x: 16, y: 100')).toBeVisible();
  await page.getByRole('button', { name: 'Move right' }).click();
  await expect(page.getByText('x: 66, y: 100')).toBeVisible();

  await openStory(page, 'size');
  await openPanel(page, 'size');
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await expect(page.getByText('240 x 180px')).toBeVisible();

  await openStory(page, 'multiple');
  await page.getByRole('button', { name: 'Notes' }).click();
  await page.getByRole('button', { name: 'Tasks' }).click();
  await expect(page.locator('[data-floating-panel-content]').filter({ visible: true })).toHaveCount(
    2,
  );
}

/** Verify the external contact action submits and closes its panel. */
async function verifiesOverlay({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'overlay');
  await openPanel(page, 'overlay');
  await page.getByPlaceholder('Enter your name').fill('Taylor');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('[data-floating-panel-content]')).toHaveCount(0);
}

test('all FloatingPanel examples open', verifiesInventory);
test('FloatingPanel control variants render', verifiesControls);
test('FloatingPanel state examples update', verifiesStateExamples);
test('FloatingPanel external contact action closes on submit', verifiesOverlay);
