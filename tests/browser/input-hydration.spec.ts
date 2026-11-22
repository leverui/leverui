import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Field as FieldExport, Input as InputExport } from '../../src';
import { renderInputHydrationTree } from '../../.storybook/input-hydration-tree';

type ServerExports = {
  Field: typeof FieldExport;
  Input: typeof InputExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Input tree to its existing published server markup. */
async function hydrateInputInBrowser(): Promise<void> {
  const modulePath = '/.storybook/input-hydration-example.tsx';
  const { hydrateInputExample } = await import(modulePath);
  const root = document.getElementById('input-hydration-root');
  if (!root) throw new Error('Input hydration root was not found.');
  hydrateInputExample(root);
}

/** Verify generated primitive associations and both value paths through hydration. */
async function verifiesInputHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared Input tree with the published server components. */
    () => renderInputHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="input-hydration-root">${markup}</div>`,
  );
  const uncontrolled = page.getByTestId('hydrated-uncontrolled');
  const controlled = page.getByTestId('hydrated-controlled');
  const inputs = [uncontrolled, controlled];
  const ids: string[] = [];
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    expect(id).toBeTruthy();
    ids.push(id ?? '');
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
    await input.evaluate(
      /** Mark each original server control to detect replacement. */
      (element) => {
        (element as HTMLElement).dataset.serverElement = 'true';
      },
    );
  }
  expect(ids[0]).not.toBe(ids[1]);
  await expect(uncontrolled).toHaveValue('uncontrolled draft');
  await expect(controlled).toHaveValue('controlled draft');
  await uncontrolled.fill('typed before hydration');
  const errors: string[] = [];

  /** Collect browser errors during the hydration boundary. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInputInBrowser);
  await expect(page.locator('#input-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  for (const [index, input] of inputs.entries()) {
    await expect(input).toHaveAttribute('data-server-element', 'true');
    await expect(input).toHaveAttribute('id', ids[index] ?? '');
    await expect(page.locator(`label[for="${ids[index]}"]`)).toHaveCount(1);
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).toHaveCount(1);
  }
  await expect(uncontrolled).toHaveValue('typed before hydration');
  await expect(controlled).toHaveValue('controlled draft');
  await controlled.fill('changed after hydration');
  await expect(controlled).toHaveValue('changed after hydration');
  await expect(controlled).toHaveJSProperty('defaultValue', 'changed after hydration');
}

test(
  'published Input hydrates primitive-generated fields and preserves native controls',
  verifiesInputHydration,
);
