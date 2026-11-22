import { expect, test, type Page, type Route } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'with-store',
  'anchor-rect',
  'with-avatar',
  'checkbox-items',
  'command',
  'context-trigger',
  'danger-item',
  'group',
  'group-dynamic',
  'hide-when-detached',
  'icon-and-command',
  'links',
  'mixed-layout',
  'overflow',
  'placement',
  'radio-items',
  'submenu',
  'submenu-dynamic',
  'open-from-dialog',
  'open-from-dialog-nested',
] as const;

/** Open one of the checked-in named Menu examples. */
async function openMenuStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-menu--${id}`);
}

/** Require all stories to mount without an error. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openMenuStory(page, id);
    await expect(page.locator('#storybook-root')).not.toBeEmpty();
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Verify the ordinary menu opens with the five actions. */
async function verifiesBasicMenu({ page }: { page: Page }): Promise<void> {
  await openMenuStory(page, 'basic');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByRole('menuitem')).toHaveCount(5);
  await expect(page.getByRole('menuitem', { name: 'New text file' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Export' })).toBeVisible();
  await expect(page.getByRole('menu')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
}

/** Follow both caller-owned and external-machine open state. */
async function verifiesState({ page }: { page: Page }): Promise<void> {
  for (const id of ['controlled', 'with-store']) {
    await openMenuStory(page, id);
    await expect(page.getByText('open: false')).toBeVisible();
    await page.getByRole('button', { name: 'Open' }).click();
    await expect(page.getByText('open: true')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    await expect(page.getByText('open: false')).toBeVisible();
  }
}

/** Check long-menu scrolling, shortcut hints, and outbound anchors. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await openMenuStory(page, 'overflow');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('menuitem')).toHaveCount(23);
  await expect(page.getByRole('menu')).toHaveCSS('max-height', '200px');

  await openMenuStory(page, 'command');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByText('⌘E')).toBeVisible();

  await openMenuStory(page, 'links');
  await page.getByRole('button', { name: 'Select book' }).click();
  await expect(page.getByRole('menuitem', { name: 'Lanternwright' })).toHaveAttribute(
    'href',
    'https://example.com/books/lanternwright',
  );
}

/** Abort a portrait request so the Avatar shows its fallback. */
async function failImageRequest(route: Route): Promise<void> {
  await route.abort();
}

/** Preserve the avatar's fallback name and the first nested menu. */
async function verifiesCompositeTriggers({ page }: { page: Page }): Promise<void> {
  // Fail the portrait request so the trigger is named by its fallback initials.
  await page.route('**/demo-images/avatars/**', failImageRequest);
  await openMenuStory(page, 'with-avatar');
  await page.getByRole('button', { name: 'ME' }).click();
  await expect(page.getByRole('menuitem', { name: 'Account' })).toBeVisible();

  await openMenuStory(page, 'submenu');
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('menuitem', { name: 'Open recent' }).click();
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(page.getByRole('menuitem', { name: 'Lever UI v3' })).toBeVisible();
}

test('all Menu stories mount', verifiesInventory);
test('Menu basic actions open and close', verifiesBasicMenu);
test('Menu controlled and store examples track state', verifiesState);
test('Menu overflow, commands, and links render', verifiesVariants);
test('Menu avatar and nested submenu preserve behavior', verifiesCompositeTriggers);
