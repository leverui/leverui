import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read visible geometry and color across the hydration boundary. */
function readCriticalStyles(element: Element): string[] {
  const style = getComputedStyle(element);
  return [style.display, style.height, style.borderColor, style.backgroundColor];
}

/** Attach the published browser entry to the server-rendered date table. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/date-picker-hydration-example.tsx';
  const { hydrateDatePickerExample } = await import(modulePath);
  const host = document.getElementById('date-picker-hydration-root');
  if (!host) throw new Error('DatePicker hydration root was not found.');
  hydrateDatePickerExample(host);
}

/** Preserve real table nodes, IDs, styles, and selection after hydration. */
async function verifiesDatePickerHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/date-picker-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="date-picker-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#date-picker-hydration-root');
  const root = host.locator('.lui-date-picker__root');
  const table = host.locator('.lui-date-picker__table');
  const input = host.locator('input[data-date-picker-input]');
  const day = host.locator('[data-date-picker-table-cell-trigger][data-value="2026-03-15"]');
  await expect(table).toBeVisible();
  await expect(table).toHaveAttribute('aria-label', 'March 2026');
  const rootId = await root.getAttribute('id');
  const tableId = await table.getAttribute('id');
  const dayId = await day.getAttribute('id');
  const rootStyles = await root.evaluate(readCriticalStyles);
  const tableStyles = await table.evaluate(readCriticalStyles);
  await root.evaluate(
    /** Mark the exact server root before the browser hydrates it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await day.evaluate(
    /** Mark a selectable server cell to detect DOM replacement. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Record hydration warnings and console errors. */
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
  await expect(input).toHaveValue('03/14/2026');
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(day).toHaveAttribute('data-server-node', 'true');
  await expect(table).toHaveAttribute('aria-label', 'March 2026');
  expect(await root.getAttribute('id')).toBe(rootId);
  expect(await table.getAttribute('id')).toBe(tableId);
  expect(await day.getAttribute('id')).toBe(dayId);
  expect(await root.evaluate(readCriticalStyles)).toEqual(rootStyles);
  expect(await table.evaluate(readCriticalStyles)).toEqual(tableStyles);
  await day.click();
  await expect(input).toHaveValue('03/15/2026');
  expect(errors).toEqual([]);
}

test('published DatePicker hydrates a selectable calendar', verifiesDatePickerHydration);
