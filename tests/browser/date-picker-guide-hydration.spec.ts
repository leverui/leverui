import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to the shared Jalali tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/date-picker-guide-hydration-example.tsx';
  const { hydrateDatePickerGuideExample } = await import(modulePath);
  const host = document.getElementById('date-picker-guide-hydration-root');
  if (!host) throw new Error('The Jalali hydration host was not found.');
  hydrateDatePickerGuideExample(host);
}

/** Preserve server nodes, IDs, styles, and selection across hydration. */
async function verifiesJalaliHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/date-picker-guide-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="date-picker-guide-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#date-picker-guide-hydration-root');
  const root = host.locator('.leverui-date-picker__root');
  const grid = host.getByTestId('hydrated-jalali-days');
  const input = host.getByTestId('hydrated-jalali-input');
  const selected = grid.locator('td[aria-selected="true"]');
  await expect(grid).toBeVisible();
  await expect(selected).toHaveCount(1);
  const rootId = await root.getAttribute('id');
  const gridId = await grid.getAttribute('id');
  const selectedId = await selected.getAttribute('id');
  const initialValue = await input.inputValue();
  await root.evaluate(
    /** Mark the exact server root before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await selected.evaluate(
    /** Detect a replaced server cell after hydration. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture browser exceptions from the hydration operation. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Capture console failures and hydration warnings. */
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
  await expect(selected).toHaveAttribute('data-server-node', 'true');
  expect(await root.getAttribute('id')).toBe(rootId);
  expect(await grid.getAttribute('id')).toBe(gridId);
  expect(await selected.getAttribute('id')).toBe(selectedId);
  expect(await input.inputValue()).toBe(initialValue);
  const nextDay = grid
    .locator(
      'td[data-value]:not([aria-selected="true"]) [data-date-picker-table-cell-trigger][data-selectable]',
    )
    .first();
  const nextValue = await nextDay.locator('..').getAttribute('data-value');
  expect(nextValue).not.toBeNull();
  await nextDay.click();
  await expect(grid.locator(`td[data-value="${nextValue}"]`)).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(await input.inputValue()).not.toBe(initialValue);
  expect(errors).toEqual([]);
}

test(
  'published Jalali DatePicker hydrates without replacing calendar state',
  verifiesJalaliHydration,
);
