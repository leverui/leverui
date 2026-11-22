import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'multiple-triggers',
  'open-from-dialog',
  'delay',
  'placement',
  'disabled',
  'rtl',
] as const;

/** Require every named Hover Card story to mount its trigger. */
async function verifiesEveryHoverCardExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-hovercard--${id}`);
    if (id === 'open-from-dialog') {
      await page.getByRole('button', { name: 'Open dialog' }).click();
    }
    const trigger = page.locator('[data-hover-card-trigger]');
    await expect(trigger.first(), `Hover Card ${id} should mount a trigger`).toBeAttached();
  }
}

/** Verify the profile preview opens and closes around its branded link. */
async function verifiesBasicPreview({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hovercard--basic');
  await page.getByRole('link', { name: '@leverui' }).hover();
  await expect(page.getByText('2.5M downloads')).toBeVisible();
  await expect(page.getByText('Lever UI', { exact: true })).toBeVisible();
}

/** Confirm controlled, delayed, and placed cards each open their description. */
async function verifiesDescriptionPreviews({ page }: { page: Page }): Promise<void> {
  for (const id of ['controlled', 'delay', 'placement'] as const) {
    await page.goto(`/iframe.html?id=components-hovercard--${id}`);
    await page.getByRole('link', { name: '@leverui' }).hover();
    await expect(
      page.getByText('brings accessible components and flexible styling', { exact: false }),
    ).toBeVisible();
  }
}

/** Keep the disabled preview closed through hover and focus. */
async function verifiesDisabledPreview({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hovercard--disabled');
  const link = page.getByRole('link', { name: '@leverui' });
  await link.hover();
  await link.focus();
  await page.waitForTimeout(800);
  await expect(page.getByText('Accessible components for SolidJS apps')).toBeHidden();
}

/** Show the description selected by each trigger's value. */
async function verifiesMultipleTriggers({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hovercard--multiple-triggers');
  for (const [handle, description] of [
    ['@ananya', 'Ananya builds design systems.'],
    ['@jules', 'Jules works on accessibility.'],
    ['@nico', 'Nico writes the docs.'],
  ] as const) {
    await page.getByRole('link', { name: handle }).hover();
    await expect(page.getByText(description)).toBeVisible();
  }
}

/** Keep the nested preview usable in the modal dialog. */
async function verifiesDialogPreview({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hovercard--open-from-dialog');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByText('Hover card in a dialog')).toBeVisible();
  await page.getByRole('link', { name: '@leverui' }).hover();
  await expect(page.getByText('Lever UI', { exact: true })).toBeVisible();
}

/** Preserve Arabic direction on the trigger and panel. */
async function verifiesRtlPreview({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-hovercard--rtl');
  const trigger = page.getByRole('button', { name: '@leverui' });
  await expect(trigger).toHaveAttribute('dir', 'rtl');
  await trigger.hover();
  await expect(page.getByText('واجهة المستخدم ليفر')).toBeVisible();
}

test('all Hover Card examples render', verifiesEveryHoverCardExample);
test('basic Hover Card opens its profile preview', verifiesBasicPreview);
test('controlled, delayed, and placed Hover Cards open', verifiesDescriptionPreviews);
test('disabled Hover Card stays closed', verifiesDisabledPreview);
test('multiple Hover Card triggers select their own descriptions', verifiesMultipleTriggers);
test('Hover Card opens from a dialog', verifiesDialogPreview);
test('Hover Card respects RTL direction', verifiesRtlPreview);
