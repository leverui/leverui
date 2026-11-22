import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'closable',
  'lifecycle',
  'persistent',
  'static',
  'action',
  'duration',
  'external-close',
  'promise',
  'status',
  'update',
  'pause-and-play',
] as const;

/** Require every Toast story to render its trigger or static cards. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-toast--${id}`);
    if (id === 'static') {
      await expect(page.locator('[data-type="loading"]')).toBeVisible();
    } else {
      await expect(page.getByRole('button').first()).toBeVisible();
    }
  }
}

/** Check basic notification content, optional close, and external dismissal. */
async function verifiesDismissal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--basic');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.getByText('File saved successfully')).toBeVisible();
  await expect(page.locator('[data-toast-root]')).toHaveAttribute('data-type', 'info');

  await page.goto('/iframe.html?id=components-toast--closable');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await page.locator('[data-toast-close-trigger]').click();
  await expect(page.locator('[data-toast-root]')).toHaveCount(0);

  await page.goto('/iframe.html?id=components-toast--external-close');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await page.getByRole('button', { name: 'Close toasts' }).click();
  await expect(page.locator('[data-toast-root]')).toHaveCount(0);
}

/** Check action, status, update, and static status specimens. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--action');
  const logs: string[] = [];
  page.on(
    'console',
    /** Record the action's placeholder side effect. */
    (message) => logs.push(message.text()),
  );
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.getByText('File deleted')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  expect(logs).toContain('Undo');

  await page.goto('/iframe.html?id=components-toast--status');
  for (const status of ['success', 'error', 'warning', 'info']) {
    await page.getByRole('button', { name: status, exact: true }).click();
    await expect(
      page.locator('[data-toast-root]').filter({
        hasText: `Toast status is ${status}`,
      }),
    ).toHaveAttribute('data-type', status);
  }

  await page.goto('/iframe.html?id=components-toast--update');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await page.getByRole('button', { name: 'Update toast' }).click();
  await expect(page.getByText('Connected')).toBeVisible();
  await expect(page.locator('[data-toast-root]')).toHaveCount(1);

  await page.goto('/iframe.html?id=components-toast--static');
  await expect(page.locator('[data-type]')).toHaveCount(4);
  await expect(page.getByText('Your storage is almost full.')).toBeVisible();
}

/** Preserve a loading state before resolving the five-second upload. */
async function verifiesPromiseAndPersistence({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--promise');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.getByText('Uploading...')).toBeVisible();
  await expect(page.getByText('Upload complete')).toBeVisible({ timeout: 8_000 });

  await page.goto('/iframe.html?id=components-toast--persistent');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator('[data-toast-root]')).toHaveAttribute('data-type', 'loading');
  await expect(page.getByText('Saving your file...')).toBeVisible();
}

/** Keep a paused toast on screen past its timeout, then let resume remove it. */
async function verifiesPauseAndPlay({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--pause-and-play');
  await page.getByRole('button', { name: 'Show toast' }).click();
  const toast = page.locator('[data-toast-root]');
  await expect(toast).toBeVisible();
  await page.getByRole('button', { name: 'Pause toast' }).click();
  await page.waitForTimeout(6_000);
  await expect(toast).toBeVisible();
  await page.getByRole('button', { name: 'Play toast' }).click();
  await expect(toast).toHaveCount(0, { timeout: 8_000 });
}

/** Honor the six-second custom lifetime without an explicit close action. */
async function verifiesDuration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--duration');
  await page.getByRole('button', { name: 'Show toast' }).click();
  const toast = page.locator('[data-toast-root]');
  await expect(toast).toBeVisible();
  await expect(toast).toHaveCount(0, { timeout: 8_000 });
}

/** Record a lifecycle transition and disable duplicate creation. */
async function verifiesLifecycle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toast--lifecycle');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  await trigger.click();
  await expect(trigger).toBeDisabled();
  await expect(page.getByRole('log')).toContainText('mounted');
}

test('all Toast examples render', verifiesInventory);
test('Toast examples open and dismiss notifications', verifiesDismissal);
test('Toast action, status, update, and static examples work', verifiesVariants);
test('Toast promise and persistent states work', verifiesPromiseAndPersistence);
test('Toast custom duration dismisses automatically', verifiesDuration);
test('Toast pause and play control the timer', verifiesPauseAndPlay);
test('Toast lifecycle logs status transitions', verifiesLifecycle);
