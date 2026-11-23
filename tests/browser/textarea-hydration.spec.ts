import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { TextareaHydrationComponents } from '../../.storybook/textarea-hydration-tree';
import { renderTextareaHydrationTree } from '../../.storybook/textarea-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as TextareaHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Connect the browser implementation to the existing published markup. */
async function hydrateTextareaInBrowser(): Promise<void> {
  const modulePath = '/.storybook/textarea-hydration-example.tsx';
  const { hydrateTextareaExample } = await import(modulePath);
  const root = document.getElementById('textarea-hydration-root');
  if (!root) throw new Error('Textarea hydration root was not found.');
  hydrateTextareaExample(root);
}

/** Verify native values, Field IDs, node reuse, and styles survive hydration. */
async function verifiesTextareaHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render both controls through the published server package. */
    () => renderTextareaHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready&viewMode=story');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style data-lui-default>${defaultCss}</style><div id="textarea-hydration-root">${markup}</div>`,
  );
  const notes = page.getByTestId('hydrated-textarea');
  const selected = page.getByTestId('hydrated-selected-input');
  const controls = [notes, selected];
  const ids: string[] = [];
  for (const control of controls) {
    const id = await control.getAttribute('id');
    expect(id).toBeTruthy();
    ids.push(id ?? '');
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
    await control.evaluate(
      /** Mark the original native node before Solid hydrates it. */
      (element) => {
        (element as HTMLElement).dataset.serverElement = 'true';
      },
    );
  }
  await expect(notes).toHaveValue('Server draft');
  await expect(selected).toHaveValue('Selected draft');
  await notes.fill('Typed before hydration');
  await expect(notes).toHaveCSS('border-style', 'solid');
  await expect(page.locator('style[data-lui-default]')).toHaveCount(1);
  const errors: string[] = [];

  /** Capture browser exceptions across the hydration boundary. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTextareaInBrowser);
  await expect(page.locator('#textarea-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  for (const [index, control] of controls.entries()) {
    await expect(control).toHaveAttribute('data-server-element', 'true');
    await expect(control).toHaveAttribute('id', ids[index] ?? '');
    const describedBy = await control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).toHaveCount(1);
  }
  await expect(notes).toHaveCSS('border-style', 'solid');
  await expect(page.locator('style[data-lui-default]')).toHaveCount(1);
  await expect(notes).toHaveValue('Typed before hydration');
  await expect(selected).toHaveValue('Selected draft');
  await selected.fill('Changed after hydration');
  await expect(selected).toHaveValue('Changed after hydration');
  await notes.fill('New hydrated notes');
  await expect(notes).toHaveValue('New hydrated notes');
}

test('published Textarea and selected input hydrate existing controls', verifiesTextareaHydration);
