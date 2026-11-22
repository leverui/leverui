import { expect, test, type Page } from '@playwright/test';

/** Publish a visibility change only on the environment's iframe document. */
async function setFrameVisibility(
  page: Page,
  state: 'hidden' | 'visible',
  frameTestId = 'toast-frame',
): Promise<void> {
  await page
    .frameLocator(`[data-testid="${frameTestId}"]`)
    .locator('body')
    .evaluate(
      /** Change the owning document without changing the Storybook document. */
      (element, visibility) => {
        const ownerDocument = element.ownerDocument;
        Object.defineProperty(ownerDocument, 'visibilityState', {
          configurable: true,
          value: visibility,
        });
        ownerDocument.dispatchEvent(new Event('visibilitychange'));
      },
      state,
    );
}

/** Publish a visibility change on the Storybook document only. */
async function setMainVisibility(page: Page, state: 'hidden' | 'visible'): Promise<void> {
  await page.evaluate(
    /** Change the initial root without touching the alternate iframe. */
    (visibility) => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: visibility });
      document.dispatchEvent(new Event('visibilitychange'));
    },
    state,
  );
}

/** Honor an EnvironmentProvider document without a direct getRootNode prop. */
async function verifiesEnvironmentDocument({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-toast-advanced--custom-document');
  const frame = page.frameLocator('[data-testid="toast-frame"]');
  await expect(frame.getByTestId('frame-region')).toHaveCount(1);
  await setFrameVisibility(page, 'hidden');
  await page.getByTestId('frame-create').click();
  const toast = frame.getByTestId('frame-toast');
  await expect(toast).toHaveCount(1);
  await page.waitForTimeout(1_100);
  await expect(toast).toHaveCount(1);
  await setFrameVisibility(page, 'visible');
  await expect(toast).toHaveCount(0);
}

test(
  'Toast page-idle listener follows its EnvironmentProvider document',
  verifiesEnvironmentDocument,
);

/** Follow a provider root that changes after the Toaster has mounted. */
async function verifiesReactiveDocument({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-toast-advanced--reactive-document');
  await page.getByTestId('root-create').click();
  await expect(page.getByTestId('root-region')).toHaveCount(1);
  await page.getByTestId('root-switch').click();
  await expect(page.getByTestId('root-region')).toHaveCount(1);

  await setMainVisibility(page, 'hidden');
  await page.getByTestId('root-read-pause').click();
  await expect(page.getByTestId('root-pause-state')).toHaveText('running');

  await setFrameVisibility(page, 'hidden', 'root-frame');
  await page.getByTestId('root-read-pause').click();
  await expect(page.getByTestId('root-pause-state')).toHaveText('paused');

  await setFrameVisibility(page, 'visible', 'root-frame');
  await page.getByTestId('root-read-pause').click();
  await expect(page.getByTestId('root-pause-state')).toHaveText('running');
}

test('Toast page-idle listener moves when the environment root changes', verifiesReactiveDocument);
