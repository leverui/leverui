import { expect, test, type Page } from '@playwright/test';

/** Install a deterministic browser EyeDropper before the machine starts. */
async function installEyeDropper(page: Page): Promise<void> {
  await page.addInitScript(
    /** Replace the browser capability for a repeatable interaction check. */
    () => {
      const browser = window as Window & { eyeDropperOpens?: number };
      browser.eyeDropperOpens = 0;

      /** Supply deterministic colors to the browser's sampling API. */
      class StubEyeDropper {
        /** Resolve successive selections to distinct colors. */
        open(): Promise<{ sRGBHex: string }> {
          browser.eyeDropperOpens = (browser.eyeDropperOpens ?? 0) + 1;
          return Promise.resolve({
            sRGBHex: ['#00ff00', '#0000ff', '#ff00ff'][browser.eyeDropperOpens - 1] ?? '#ff00ff',
          });
        }
      }

      Object.defineProperty(window, 'EyeDropper', {
        configurable: true,
        value: StubEyeDropper,
      });
    },
  );
}

/** Keep Zag's click action and the caller's callback on both button forms. */
async function verifiesEyeDropperCallbacks({ page }: { page: Page }): Promise<void> {
  await installEyeDropper(page);
  await page.goto('/iframe.html?id=components-colorpicker-eyedropper--callbacks');
  const input = page.getByTestId('color-picker-eye-input');
  const convenience = page.getByTestId('color-picker-eye-convenience');
  const direct = page.getByTestId('color-picker-eye-direct');
  const loading = page.getByTestId('color-picker-eye-loading');
  const custom = page.getByTestId('color-picker-eye-custom');
  await expect(input).toHaveValue('#EB5E41', { timeout: 30_000 });
  await expect(convenience).toHaveAttribute('aria-label', 'Pick a color from the screen');
  await convenience.click();
  await expect(input).toHaveValue('#00FF00');
  await expect(page.getByTestId('color-picker-eye-clicks')).toHaveText('1');
  await expect(page.getByTestId('color-picker-eye-ends')).toHaveText('1');
  await expect(direct).toHaveClass(/leverui-color-picker__eyeDropperTrigger/);
  await expect(direct).toHaveClass(/leverui-button/);
  await expect(direct).toHaveCSS('border-top-width', '1px');
  await expect(direct).toHaveCSS(
    'min-height',
    await convenience.evaluate(
      /** Compare the direct trigger's selected size with the convenience button. */
      (element) => getComputedStyle(element).minHeight,
    ),
  );
  await direct.click();
  await expect(input).toHaveValue('#0000FF');
  await expect(page.getByTestId('color-picker-eye-clicks')).toHaveText('2');
  await expect(page.getByTestId('color-picker-eye-ends')).toHaveText('2');
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute('data-loading', '');
  await expect(loading.locator('.leverui-spinner')).toBeVisible();
  expect(
    await page.evaluate(
      /** Ensure the loading button has not invoked the browser API. */
      () => (window as Window & { eyeDropperOpens?: number }).eyeDropperOpens,
    ),
  ).toBe(2);
  await expect(custom).toHaveClass(/leverui-color-picker__eyeDropperTrigger/);
  await custom.click();
  await expect(input).toHaveValue('#FF00FF');
  await expect(page.getByTestId('color-picker-eye-clicks')).toHaveText('3');
  await expect(page.getByTestId('color-picker-eye-ends')).toHaveText('3');
}

test('ColorPicker EyeDropper composes caller callbacks with Zag', verifiesEyeDropperCallbacks);

/** Keep the current color when the browser has no EyeDropper API. */
async function verifiesUnsupportedEyeDropper({ page }: { page: Page }): Promise<void> {
  const errors: string[] = [];
  /** Capture browser errors from an unavailable screen sampler. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.addInitScript(
    /** Remove the optional browser capability before the primitive creates its machine. */
    () => {
      Reflect.deleteProperty(window, 'EyeDropper');
    },
  );
  await page.goto('/iframe.html?id=components-colorpicker-eyedropper--callbacks');
  expect(
    await page.evaluate(
      /** Confirm the browser has no sampler before activating its trigger. */
      () => 'EyeDropper' in window,
    ),
  ).toBe(false);
  const input = page.getByTestId('color-picker-eye-input');
  await expect(input).toHaveValue('#EB5E41', { timeout: 30_000 });
  await page.getByTestId('color-picker-eye-convenience').click();
  await page.getByTestId('color-picker-eye-direct').click();
  await expect(input).toHaveValue('#EB5E41');
  await expect(page.getByTestId('color-picker-eye-clicks')).toHaveText('2');
  await expect(page.getByTestId('color-picker-eye-ends')).toHaveText('0');
  expect(errors).toEqual([]);
}

test('ColorPicker keeps its value when EyeDropper is unavailable', verifiesUnsupportedEyeDropper);
