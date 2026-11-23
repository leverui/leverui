import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read the visual styles most likely to drift across hydration. */
function readCriticalStyles(element: Element): string[] {
  const style = getComputedStyle(element);
  return [style.display, style.height, style.borderColor, style.backgroundColor];
}

/** Attach the published browser DateInput to the server-rendered nodes. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/date-input-hydration-example.tsx';
  const { hydrateDateInputExample } = await import(modulePath);
  const host = document.getElementById('date-input-hydration-root');
  if (!host) throw new Error('DateInput hydration root was not found.');
  hydrateDateInputExample(host);
}

/** Keep machine IDs, styles, and keyboard editing across the hydration boundary. */
async function verifiesDateInputHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/date-input-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="date-input-hydration-root">${markup}</div>`,
  );
  const host = page.locator('#date-input-hydration-root');
  const root = host.locator('.lui-date-input__root');
  const group = host.locator('.lui-date-input__segmentGroup');
  const hidden = host.locator('input[name="hydrated-date"]');
  const day = group.locator('[data-type="day"]');
  await expect(group.getByRole('spinbutton')).toHaveCount(3);
  await expect(hidden).toHaveValue('3/14/2026');
  const rootId = await root.getAttribute('id');
  const groupId = await group.getAttribute('id');
  const hiddenId = await hidden.getAttribute('id');
  const rootStyles = await root.evaluate(readCriticalStyles);
  const groupStyles = await group.evaluate(readCriticalStyles);
  await root.evaluate(
    /** Mark the exact server root before the browser hydrates it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await day.evaluate(
    /** Mark the server's editable day rather than a replacement. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  /** Record browser errors and hydration warnings. */
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
  await expect(day).toHaveAttribute('data-server-node', 'true');
  expect(await root.getAttribute('id')).toBe(rootId);
  expect(await group.getAttribute('id')).toBe(groupId);
  expect(await hidden.getAttribute('id')).toBe(hiddenId);
  expect(await root.evaluate(readCriticalStyles)).toEqual(rootStyles);
  expect(await group.evaluate(readCriticalStyles)).toEqual(groupStyles);
  await day.focus();
  await day.press('ArrowUp');
  await expect(hidden).toHaveValue('3/15/2026');
  expect(errors).toEqual([]);
}

test('published DateInput hydrates and keeps keyboard editing', verifiesDateInputHydration);
