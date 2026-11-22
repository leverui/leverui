import { expect, test, type Page } from '@playwright/test';

const story = '/iframe.html?id=feedback-toast--lifecycle';

/** Activate a fixture control while Playwright's virtual browser time is paused. */
async function activateControl(page: Page, testId: string): Promise<void> {
  await page.getByTestId(testId).evaluate(
    /** Dispatch the native click without waiting for a frozen animation frame. */
    (element) => {
      if (!(element instanceof HTMLButtonElement)) {
        throw new Error('Toast lifecycle control must be a button.');
      }
      element.click();
    },
  );
}

/** Keep a loading notification visible until the store updates it. */
async function verifiesLoadingPersistence({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.getByTestId('lifecycle-loading').click();
  const toast = page.getByTestId('lifecycle-toast');
  await expect(toast).toHaveAttribute('data-type', 'loading');
  await expect(page.getByText('Uploading', { exact: true })).toBeVisible();
  const spinner = page.getByTestId('lifecycle-spinner');
  await expect(spinner).toBeVisible();
  await expect(spinner).toHaveAttribute('aria-hidden', 'true');
  const bounds = await spinner.boundingBox();
  expect(bounds?.width).toBeGreaterThan(0);
  expect(bounds?.height).toBeGreaterThan(0);
  await page.waitForTimeout(500);
  await expect(toast).toBeVisible();
  await page.getByTestId('lifecycle-complete').click();
  await expect(toast).toHaveAttribute('data-type', 'success');
  await expect(page.getByText('Uploaded', { exact: true })).toBeVisible();
  await expect(spinner).toHaveCount(0);
}

test('Toast keeps loading visible and updates its status', verifiesLoadingPersistence);

/** Follow a pending promise into its resolved notification state. */
async function verifiesPromiseTransition({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.getByTestId('lifecycle-promise').click();
  await expect(page.getByTestId('lifecycle-promise')).toBeDisabled();
  const toast = page.getByTestId('lifecycle-toast');
  await expect(toast).toHaveAttribute('data-type', 'loading');
  await expect(page.getByText('Promise pending', { exact: true })).toBeVisible();
  await page.getByTestId('lifecycle-resolve').click();
  await expect(page.getByTestId('lifecycle-promise')).toBeEnabled();
  await expect(toast).toHaveAttribute('data-type', 'success');
  await expect(page.getByText('Promise resolved', { exact: true })).toBeVisible();
}

test('Toast promise helper replaces loading with success', verifiesPromiseTransition);

/** Follow a rejected promise into its error notification state. */
async function verifiesPromiseRejection({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.getByTestId('lifecycle-promise').click();
  const toast = page.getByTestId('lifecycle-toast');
  await expect(toast).toHaveAttribute('data-type', 'loading');
  await page.getByTestId('lifecycle-reject').click();
  await expect(toast).toHaveAttribute('data-type', 'error');
  await expect(page.getByText('Promise rejected', { exact: true })).toBeVisible();
}

test('Toast promise helper replaces loading with error', verifiesPromiseRejection);

/** Pause the finite timer, then resume it and observe dismissal. */
async function verifiesPauseAndResume({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.clock.install();
  const browserTime = await page.evaluate(
    /** Anchor the frozen clock to the browser's installed time. */
    () => Date.now(),
  );
  await page.clock.pauseAt(browserTime + 60_000);
  await activateControl(page, 'lifecycle-timed');
  await page.clock.runFor(50);
  const toast = page.getByTestId('lifecycle-toast');
  await expect(toast).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-toast-status', 'visible');
  await page.clock.runFor(350);
  await activateControl(page, 'lifecycle-pause');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await activateControl(page, 'lifecycle-resume');
  await page.clock.runFor(300);
  await expect(page.locator('body')).toHaveAttribute('data-toast-status', 'visible');
  await page.clock.runFor(200);
  await expect(page.locator('body')).toHaveAttribute('data-toast-status', 'dismissing');
  await page.clock.runFor(250);
  await expect(toast).toHaveCount(0);
  await expect(page.locator('body')).toHaveAttribute('data-toast-status', 'unmounted');
}

test('Toast pauses and resumes auto-dismiss with status callbacks', verifiesPauseAndResume);

/** Keep loading and timed controls pointed at their own notifications. */
async function verifiesIndependentControls({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.clock.install();
  const browserTime = await page.evaluate(
    /** Anchor the frozen clock to the browser's installed time. */
    () => Date.now(),
  );
  await page.clock.pauseAt(browserTime + 60_000);
  await activateControl(page, 'lifecycle-loading');
  await activateControl(page, 'lifecycle-timed');
  await page.clock.runFor(50);
  const loading = page.getByTestId('lifecycle-toast').filter({ hasText: 'Uploading' });
  const timed = page.getByTestId('lifecycle-toast').filter({ hasText: 'Timed notification' });
  await expect(loading).toHaveAttribute('data-type', 'loading');
  await expect(timed).toHaveAttribute('data-type', 'info');
  await activateControl(page, 'lifecycle-complete');
  await page.clock.runFor(50);
  await expect(page.getByTestId('lifecycle-toast').filter({ hasText: 'Uploaded' })).toHaveAttribute(
    'data-type',
    'success',
  );
  await expect(timed).toHaveAttribute('data-type', 'info');
  await activateControl(page, 'lifecycle-pause');
  await page.clock.runFor(1_100);
  await expect(timed).toBeVisible();
}

test('Toast loading and timer controls keep independent targets', verifiesIndependentControls);

/** Move the third queued toast into view after a slot becomes free. */
async function verifiesQueueLimit({ page }: { page: Page }): Promise<void> {
  await page.goto(story);
  await page.getByTestId('lifecycle-queue').click();
  await expect(page.getByTestId('lifecycle-toast')).toHaveCount(2);
  await expect(page.getByText('Queue third', { exact: true })).toHaveCount(0);
  await page.getByTestId('lifecycle-dismiss-first').click();
  await expect(page.getByText('Queue third', { exact: true })).toBeVisible();
  await expect(page.getByTestId('lifecycle-toast')).toHaveCount(2);
}

test('Toast respects max visible items and releases queued items', verifiesQueueLimit);
