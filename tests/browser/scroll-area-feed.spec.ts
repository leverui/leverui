import { expect, test, type Page } from '@playwright/test';

/** Read the remaining scroll distance below the feed viewport. */
async function distanceToBottom(page: Page): Promise<number> {
  return page.getByTestId('feed-viewport').evaluate(
    /** Measure the native scrolling extent after each update. */
    (element) => element.scrollHeight - element.clientHeight - element.scrollTop,
  );
}

/** Follow new items while pinned and respect a reader who scrolls away. */
async function verifiesFeed({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-feed--stick-to-bottom');
  await expect
    .poll(
      /** Wait for the initial feed to settle at its lower edge. */
      () => distanceToBottom(page),
    )
    .toBeLessThanOrEqual(2);
  await page.getByRole('button', { name: 'Add message' }).click();
  await expect(page.getByTestId('feed-message').last()).toHaveText('Message 16');
  await expect
    .poll(
      /** Wait for the appended item to remain visible at the lower edge. */
      () => distanceToBottom(page),
    )
    .toBeLessThanOrEqual(2);

  const viewport = page.getByTestId('feed-viewport');
  await viewport.evaluate(
    /** Simulate a reader returning to an earlier message. */
    (element) => {
      element.scrollTop = 0;
    },
  );
  await expect(page.getByRole('button', { name: 'Jump to bottom' })).toBeVisible();
  const before = await viewport.evaluate(
    /** Capture the reader's current native position. */
    (element) => element.scrollTop,
  );
  await page.getByRole('button', { name: 'Add message' }).click();
  await expect(page.getByTestId('feed-message').last()).toHaveText('Message 17');
  expect(
    await viewport.evaluate(
      /** Confirm the new item did not move a reader who scrolled away. */
      (element) => element.scrollTop,
    ),
  ).toBe(before);
  await page.getByRole('button', { name: 'Jump to bottom' }).click();
  await expect
    .poll(
      /** Wait for the jump button to reach the lower edge. */
      () => distanceToBottom(page),
    )
    .toBeLessThanOrEqual(2);
}

test('ScrollArea feed follows only while pinned', verifiesFeed);
