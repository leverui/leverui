import { expect, test, type Page } from '@playwright/test';

/** Verify Zag attaches to each native textarea after a reactive tag swap. */
async function verifiesElementReplacement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--contract');
  const control = page.getByTestId('swappable-textarea');
  await expect(control).toBeVisible({ timeout: 30_000 });
  await expect(control).toHaveJSProperty('tagName', 'TEXTAREA');
  await control.evaluate(
    /** Mark the original node so a later query detects replacement. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );

  await page.getByTestId('textarea-element-toggle').click();
  await expect(control).toHaveJSProperty('tagName', 'INPUT');
  await page.getByTestId('textarea-element-toggle').click();
  await expect(control).toHaveJSProperty('tagName', 'TEXTAREA');
  await expect(control).not.toHaveAttribute('data-original-node');
  await control.fill('One\nTwo\nThree\nFour\nFive\nSix');
  await expect
    .poll(
      /** Wait for the adapter on the replacement node to size its content. */
      async () =>
        control.evaluate(
          /** Read the new element's Zag-owned inline height. */
          (element) => (element as HTMLTextAreaElement).style.height,
        ),
    )
    .toMatch(/\d+px/);
}

test('Textarea reconnects autoresize after its native element changes', verifiesElementReplacement);

/** Verify cleanup restores the latest consumer height instead of the initial one. */
async function verifiesCurrentConsumerSizing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--contract');
  const control = page.getByTestId('autoresize-textarea');
  await expect(control).toBeVisible({ timeout: 30_000 });
  await control.fill('One\nTwo\nThree\nFour\nFive\nSix');
  await page.getByTestId('textarea-height-toggle').click();
  await page.getByTestId('textarea-autoresize-toggle').click();
  await expect(control).toHaveCSS('resize', 'vertical');
  await page.waitForTimeout(100);
  await expect(
    control.evaluate(
      /** Read the inline height after Zag's queued frames have settled. */
      (element) => (element as HTMLTextAreaElement).style.height,
    ),
  ).resolves.toBe('96px');
}

test('Textarea cleanup preserves a reactive consumer height', verifiesCurrentConsumerSizing);
