import { expect, test, type Locator, type Page } from '@playwright/test';

/** Verify numeric stepping, keyboard behavior, bounds, and reactive disabled state. */
async function verifiesNumberInputBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input--contract');
  const root = page.getByTestId('number-root');
  const input = page.getByTestId('number-input');
  const increment = page.getByTestId('number-increment');
  const decrement = page.getByTestId('number-decrement');
  await expect(input).toHaveAttribute('aria-roledescription', 'number field', { timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-number-input__root/);
  await expect(input).toHaveClass(/leverui-number-input__input/);
  await expect(input).toHaveValue('2');
  await increment.click();
  await expect(input).toHaveValue('4');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('2');
  await decrement.click();
  await expect(input).toHaveValue('0');
  await expect(decrement).toBeDisabled();
  await page.getByTestId('number-toggle').click();
  await expect(input).toBeDisabled();
  await expect(increment).toBeDisabled();
}

test('Number Input steps and obeys bounds and disabled state', verifiesNumberInputBrowser);

/** Read the browser's resolved start padding on a numeric field. */
async function readStartPadding(input: Locator): Promise<number> {
  return input.evaluate(
    /** Parse the authored CSS result rather than a generated class name. */
    (element) => Number.parseFloat(getComputedStyle(element).paddingInlineStart),
  );
}

/** Verify group offsets stay reactive after the Number Input styling hook is removed. */
async function verifiesGroupedNumberInput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input--grouped');
  const input = page.getByTestId('grouped-number-input');
  await expect(input).toHaveValue('10');
  await expect(input.locator('..')).toHaveAttribute('data-group-start');
  const height = await input.evaluate(
    /** Capture the selected size's actual browser height. */
    (element) => Number.parseFloat(getComputedStyle(element).height),
  );
  expect(await readStartPadding(input)).toBe(height);
  await page.getByTestId('grouped-number-offset').click();
  expect(await readStartPadding(input)).toBe(height - 4);
  await page.addStyleTag({
    content: '.leverui-number-input__input { padding-inline-start: 48px; }',
  });
  expect(await readStartPadding(input)).toBe(48);
  await page.getByTestId('grouped-number-adornment').click();
  await expect(input.locator('..')).not.toHaveAttribute('data-group-start');
  await expect(input).toHaveValue('10');
}

test('Number Input uses reactive authored Input Group padding', verifiesGroupedNumberInput);
