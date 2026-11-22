import { expect, test, type Page } from '@playwright/test';

const storyPrefix = '/iframe.html?id=feedback-toast-advanced--';

/** Click a fixture button without waiting for a frozen animation frame. */
async function activateButton(page: Page, testId: string): Promise<void> {
  await page.getByTestId(testId).evaluate(
    /** Preserve the fixture's native button contract. */
    (element) => {
      if (!(element instanceof HTMLButtonElement)) throw new Error('Expected a button.');
      element.click();
    },
  );
}

/** Simulate a browser visibility change while keeping the story mounted. */
async function setVisibility(page: Page, visibility: 'hidden' | 'visible'): Promise<void> {
  await page.evaluate(
    /** Publish the document state read by the toast page-idle listener. */
    (state) => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: state });
      document.dispatchEvent(new Event('visibilitychange'));
    },
    visibility,
  );
}

/** Freeze browser time after installing Playwright's virtual clock. */
async function freezeBrowserTime(page: Page): Promise<void> {
  await page.clock.install();
  const browserTime = await page.evaluate(
    /** Read the clock from the browser context that will advance it. */
    () => Date.now(),
  );
  await page.clock.pauseAt(browserTime + 60_000);
}

/** Start a finite toast after its page-idle story is ready. */
async function startToast(page: Page, story: string): Promise<void> {
  await page.goto(`${storyPrefix}${story}`);
  await freezeBrowserTime(page);
  await activateButton(page, 'advanced-create');
  await page.clock.runFor(50);
  await expect(page.getByTestId('advanced-toast')).toBeVisible();
}

/** Confirm hidden time does not consume a toast's remaining duration. */
async function verifiesIdlePause({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await page.clock.runFor(250);
  await setVisibility(page, 'hidden');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await setVisibility(page, 'visible');
  await page.clock.runFor(350);
  await expect(toast).toBeVisible();
  await page.clock.runFor(500);
  await expect(toast).toHaveCount(0);
}

test('Toast pauses its finite timer while the page is hidden', verifiesIdlePause);

/** Confirm a disabled page-idle policy lets the finite timer expire. */
async function verifiesIdleContinues({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-continues');
  await setVisibility(page, 'hidden');
  await page.clock.runFor(1_100);
  await expect(page.getByTestId('advanced-toast')).toHaveCount(0);
}

test('Toast timer continues while hidden when idle pause is disabled', verifiesIdleContinues);

/** Keep a toast paused by an explicit consumer action across hide and show. */
async function verifiesManualPause({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await activateButton(page, 'advanced-pause');
  await expect(toast).toHaveAttribute('data-paused', '');
  await setVisibility(page, 'hidden');
  await page.clock.runFor(1_100);
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await activateButton(page, 'advanced-resume');
  await page.clock.runFor(1_100);
  await expect(toast).toHaveCount(0);
}

test('Toast preserves an explicit pause across visibility changes', verifiesManualPause);

/** Keep a focused notification paused across hide and show. */
async function verifiesFocusPause({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await toast.evaluate(
    /** Focus the public toast root to trigger the primitive's region focus policy. */
    (element) => {
      if (!(element instanceof HTMLElement)) throw new Error('Expected a toast root.');
      element.focus();
    },
  );
  await expect(toast).toHaveAttribute('data-paused', '');
  await setVisibility(page, 'hidden');
  await page.clock.runFor(1_100);
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
}

test('Toast preserves its focus pause across visibility changes', verifiesFocusPause);

/** Keep a hovered notification paused across hide and show. */
async function verifiesPointerPause({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await page.getByTestId('advanced-region').evaluate(
    /** Trigger the region's public pointer-enter behavior. */
    (element) => element.dispatchEvent(new MouseEvent('mouseenter')),
  );
  await expect(toast).toHaveAttribute('data-paused', '');
  await setVisibility(page, 'hidden');
  await page.clock.runFor(1_100);
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
}

test('Toast preserves its pointer pause across visibility changes', verifiesPointerPause);

/** Pause a toast created after the page has already become hidden. */
async function verifiesHiddenCreation({ page }: { page: Page }): Promise<void> {
  await page.goto(`${storyPrefix}idle-pauses`);
  await freezeBrowserTime(page);
  await setVisibility(page, 'hidden');
  await activateButton(page, 'advanced-create');
  await page.clock.runFor(1_100);
  const toast = page.getByTestId('advanced-toast');
  await expect(toast).toBeVisible();
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toHaveCount(0);
}

test('Toast created during page idle waits for visibility', verifiesHiddenCreation);

/** Resume a page-idle toast after its content changes while hidden. */
async function verifiesHiddenUpdate({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await setVisibility(page, 'hidden');
  await activateButton(page, 'advanced-update');
  await expect(toast).toContainText('Updated notification');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toHaveCount(0);
}

test('Toast resumes after an update made while the page is hidden', verifiesHiddenUpdate);

/** Retain a consumer pause added after page-idle already paused the toast. */
async function verifiesPauseDuringIdle({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await setVisibility(page, 'hidden');
  await activateButton(page, 'advanced-pause');
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await activateButton(page, 'advanced-resume');
  await page.clock.runFor(1_100);
  await expect(toast).toHaveCount(0);
}

test('Toast retains a consumer pause made during page idle', verifiesPauseDuringIdle);

/** Keep the page-idle pause after a consumer resumes while still hidden. */
async function verifiesResumeDuringIdle({ page }: { page: Page }): Promise<void> {
  await startToast(page, 'idle-pauses');
  const toast = page.getByTestId('advanced-toast');
  await setVisibility(page, 'hidden');
  await activateButton(page, 'advanced-pause');
  await activateButton(page, 'advanced-resume');
  await page.clock.runFor(1_100);
  await expect(toast).toBeVisible();
  await setVisibility(page, 'visible');
  await page.clock.runFor(1_100);
  await expect(toast).toHaveCount(0);
}

test('Toast remains page-idle paused after a hidden consumer resume', verifiesResumeDuringIdle);
