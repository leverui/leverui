import { expect, test, type Page } from '@playwright/test';

/** Verify native editing, Field state, CSS recipes, and automatic height. */
async function verifiesTextareaBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--contract');
  const controlled = page.getByTestId('controlled-textarea');
  const draft = page.getByTestId('draft-textarea');
  const expanding = page.getByTestId('autoresize-textarea');
  await expect(controlled).toBeVisible({ timeout: 30_000 });
  await expect(controlled).toHaveAttribute('id', 'notes-field');
  await expect(controlled).toHaveAttribute('data-ref-tag', 'textarea');
  await expect(controlled).toHaveAttribute('data-field-textarea');
  await expect(controlled).toHaveAttribute('required', '');
  await expect(page.getByText('Notes', { exact: true })).toHaveAttribute('for', 'notes-field');
  await expect(controlled).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('subtle-textarea')).toHaveCSS(
    'border-top-color',
    'rgba(0, 0, 0, 0)',
  );
  await expect(page.getByTestId('flushed-textarea')).toHaveCSS('border-bottom-width', '1px');
  await expect(page.getByTestId('disabled-textarea')).toBeDisabled();
  await expect(draft).toHaveValue('Draft note');

  await controlled.fill('Second note');
  await expect(page.getByTestId('textarea-events')).toHaveText('1');
  await draft.fill('Edited draft');
  await page.getByTestId('textarea-toggle').click();
  await expect(controlled).toHaveAttribute('aria-invalid', 'true');
  await expect(controlled).toHaveAttribute('aria-describedby', /error-text/);
  await expect(draft).toHaveValue('Edited draft');
  await expect(draft).toHaveJSProperty('defaultValue', 'Draft note');
  await page.getByTestId('textarea-reset').click();
  await expect(draft).toHaveValue('Draft note');
  await expect(controlled).toHaveValue('Second note');

  const initialHeight = await expanding.evaluate(
    /** Measure the empty native textarea before multiple lines are entered. */
    (element) => element.getBoundingClientRect().height,
  );
  await expanding.fill('One\nTwo\nThree\nFour\nFive\nSix');
  await expect
    .poll(
      /** Wait for Zag's scheduled resize frame. */
      async () =>
        expanding.evaluate(
          /** Read the current layout height after automatic resizing. */
          (element) => element.getBoundingClientRect().height,
        ),
    )
    .toBeGreaterThan(initialHeight);
}

test(
  'Textarea composes with Field and autoresizes in the browser',
  verifiesTextareaBrowserContract,
);

/** Verify changing Field state reaches the same native textarea. */
async function verifiesReactiveFieldState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--contract');
  const control = page.getByTestId('controlled-textarea');
  await expect(control).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('textarea-readonly-toggle').click();
  await expect(control).toHaveAttribute('readonly', '');
  await expect(control).toHaveAttribute('data-readonly', '');
  await control.focus();
  await page.keyboard.type('Blocked');
  await expect(control).toHaveValue('First note');
  await page.getByTestId('textarea-readonly-toggle').click();
  await expect(control).not.toHaveAttribute('readonly');
  await control.fill('Writable note');
  await expect(control).toHaveValue('Writable note');
  await page.getByTestId('textarea-disabled-toggle').click();
  await expect(control).toBeDisabled();
  await control.evaluate(
    /** Ask the disabled native control to focus without Playwright retries. */
    (element) => (element as HTMLTextAreaElement).focus(),
  );
  await expect(control).not.toBeFocused();
  await page.getByTestId('textarea-disabled-toggle').click();
  await expect(control).toBeEnabled();
  await page.getByTestId('textarea-toggle').click();
  await expect(control).toHaveAttribute('aria-invalid', 'true');
  await expect(control).toHaveAttribute('aria-describedby', /error-text/);
}

test('Textarea follows reactive Field state without remounting', verifiesReactiveFieldState);

/** Verify disabling and re-enabling autoresize restores native DOM state. */
async function verifiesAutoresizeLifecycle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-textarea--contract');
  const control = page.getByTestId('autoresize-textarea');
  await expect(control).toBeVisible({ timeout: 30_000 });
  const initialHeight = await control.evaluate(
    /** Measure the native two-row height before automatic expansion. */
    (element) => element.getBoundingClientRect().height,
  );
  await control.fill('One\nTwo\nThree\nFour\nFive\nSix');
  await expect
    .poll(
      /** Wait for Zag to expand the multiline control. */
      async () =>
        control.evaluate(
          /** Read the control's current layout height. */
          (element) => element.getBoundingClientRect().height,
        ),
    )
    .toBeGreaterThan(initialHeight);
  await page.getByTestId('textarea-autoresize-toggle').click();
  await expect(control).toHaveCSS('resize', 'vertical');
  await expect
    .poll(
      /** Check both Zag's inline height and patched setter are gone. */
      async () =>
        control.evaluate(
          /** Report the native state after autoresize cleanup. */
          (element) => ({
            height: (element as HTMLTextAreaElement).style.height,
            ownValue: Object.hasOwn(element, 'value'),
          }),
        ),
    )
    .toEqual({ height: '', ownValue: false });
  await control.evaluate(
    /** Programmatic value writes must not restart sizing while disabled. */
    (element) => {
      (element as HTMLTextAreaElement).value = 'One';
    },
  );
  await expect(control).toHaveValue('One');
  await expect
    .poll(
      /** Confirm a value write cannot resize the disabled native control. */
      async () =>
        control.evaluate(
          /** Read the control's current layout height. */
          (element) => element.getBoundingClientRect().height,
        ),
    )
    .toBe(initialHeight);
  await page.getByTestId('textarea-autoresize-toggle').click();
  await expect(control).toHaveCSS('resize', 'none');
  await control.evaluate(
    /** Exercise Zag's value setter after re-enabling automatic sizing. */
    (element) => {
      (element as HTMLTextAreaElement).value = 'One\nTwo\nThree\nFour\nFive\nSix';
    },
  );
  await expect
    .poll(
      /** Wait for the reattached utility to grow the native control. */
      async () =>
        control.evaluate(
          /** Read the control's current layout height. */
          (element) => element.getBoundingClientRect().height,
        ),
    )
    .toBeGreaterThan(initialHeight);
  await page.evaluate(
    /** Disable autoresize while Zag still has a resize frame queued. */
    () => {
      const element = document.querySelector<HTMLTextAreaElement>(
        '[data-testid="autoresize-textarea"]',
      );
      const toggle = document.querySelector<HTMLButtonElement>(
        '[data-testid="textarea-autoresize-toggle"]',
      );
      if (!element || !toggle) throw new Error('Autoresize story controls were not found.');
      element.value = 'One';
      element.dispatchEvent(new InputEvent('input', { bubbles: true }));
      toggle.click();
    },
  );
  await expect(control).toHaveCSS('resize', 'vertical');
  await page.waitForTimeout(100);
  await expect(control).toHaveJSProperty('value', 'One');
  expect(
    await control.evaluate(
      /** Reject a late Zag frame that restores an inline height after cleanup. */
      (element) => (element as HTMLTextAreaElement).style.height,
    ),
  ).toBe('');
}

test('Textarea autoresize cleans up and reattaches reactively', verifiesAutoresizeLifecycle);
