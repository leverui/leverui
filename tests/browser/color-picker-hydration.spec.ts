import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read visible layout and border properties across the hydration boundary. */
function readCriticalStyles(element: Element): string[] {
  const style = getComputedStyle(element);
  return [style.display, style.width, style.height, style.borderRadius, style.borderColor];
}

/** Attach the published browser ColorPicker to its server-rendered tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/color-picker-hydration-example.tsx';
  const { hydrateColorPickerExample } = await import(modulePath);
  const host = document.getElementById('color-picker-hydration-root');
  if (!host) throw new Error('ColorPicker hydration root was not found.');
  hydrateColorPickerExample(host);
}

/** Keep server nodes, machine IDs, styles, and color interaction through hydration. */
async function verifiesColorPickerHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/color-picker-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="color-picker-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#color-picker-hydration-root');
  const root = host.locator('.leverui-color-picker__root');
  const input = host.getByRole('textbox', { name: 'hex' });
  const hidden = host.locator('input[name="hydrated-color"]');
  const trigger = host.getByRole('button', { name: 'Hydrated color' });
  await expect(input).toHaveValue('#EB5E41');
  // Zag 2 gives the root no `id`; the scoped part attribute keeps the server ID.
  const rootId = await root.getAttribute('data-color-picker-root');
  const hiddenId = await hidden.getAttribute('id');
  const triggerId = await trigger.getAttribute('id');
  expect(rootId).toBeTruthy();
  expect(hiddenId).toBeTruthy();
  expect(triggerId).toBeTruthy();
  const rootStyles = await root.evaluate(readCriticalStyles);
  const inputStyles = await input.evaluate(readCriticalStyles);
  const triggerStyles = await trigger.evaluate(readCriticalStyles);
  await root.evaluate(
    /** Mark the exact server element so a replacement cannot pass. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await input.evaluate(
    /** Mark the original hex input before hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Record hydration warnings and browser console errors. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      message.type() === 'error' ||
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    )
      errors.push(message.text());
  }

  page.on('pageerror', recordError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveAttribute('data-server-node', 'true');
  expect(await root.getAttribute('data-color-picker-root')).toBe(rootId);
  expect(await hidden.getAttribute('id')).toBe(hiddenId);
  expect(await trigger.getAttribute('id')).toBe(triggerId);
  expect(await root.evaluate(readCriticalStyles)).toEqual(rootStyles);
  expect(await input.evaluate(readCriticalStyles)).toEqual(inputStyles);
  expect(await trigger.evaluate(readCriticalStyles)).toEqual(triggerStyles);
  await trigger.click();
  const content = page.getByRole('dialog');
  await expect(content).toBeVisible();
  const alpha = content.getByRole('slider', { name: 'alpha' });
  const before = await hidden.inputValue();
  await alpha.focus();
  await alpha.press('ArrowLeft');
  await expect(hidden).not.toHaveValue(before);
  expect(errors).toEqual([]);
}

test('published ColorPicker hydrates and remains interactive', verifiesColorPickerHydration);
