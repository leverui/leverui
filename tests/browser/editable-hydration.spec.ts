import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderEditableHydrationTree,
  type EditableHydrationComponents,
} from '../../.storybook/editable-hydration-tree';
import { readEditableSubmitKey } from './editable-submit-key';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as EditableHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Editable tree to its published server markup. */
async function hydrateEditableInBrowser(): Promise<void> {
  const modulePath = '/.storybook/editable-hydration-example.tsx';
  const { hydrateEditableExample } = await import(modulePath);
  const root = document.getElementById('editable-hydration-root');
  if (!root) throw new Error('Editable hydration root was not found.');
  hydrateEditableExample(root);
}

/** Verify initial native values and machine updates survive hydration. */
async function verifiesEditableHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the published server entry for the same client-rendered tree. */
    () => renderEditableHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="editable-hydration-root">${markup}</div>`,
  );

  const input = page.getByTestId('hydrated-editable-input');
  const textarea = page.getByTestId('hydrated-editable-textarea');
  await expect(input).toHaveValue('Server input');
  await expect(textarea).toHaveValue('Server textarea');
  await expect(page.getByTestId('hydrated-input-preview')).toHaveText('Server input');
  await expect(page.getByTestId('hydrated-textarea-preview')).toHaveText('Server textarea');
  await expect(page.getByTestId('hydrated-input-machine-value')).toHaveText('Server input');
  await expect(page.getByTestId('hydrated-textarea-machine-value')).toHaveText('Server textarea');
  const inputId = await input.getAttribute('id');
  const textareaId = await textarea.getAttribute('id');
  expect(inputId).toBeTruthy();
  expect(textareaId).toBeTruthy();
  expect(inputId).not.toBe(textareaId);
  await input.evaluate(
    /** Mark the published input so node replacement becomes observable. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  await textarea.evaluate(
    /** Mark the published textarea so node replacement becomes observable. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  const errors: string[] = [];

  /** Collect errors raised while Solid attaches to the server controls. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateEditableInBrowser);
  await expect(page.locator('#editable-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(input).toHaveAttribute('data-server-element', 'true');
  await expect(textarea).toHaveAttribute('data-server-element', 'true');
  await expect(input).toHaveAttribute('id', inputId ?? '');
  await expect(textarea).toHaveAttribute('id', textareaId ?? '');
  await expect(input).toHaveValue('Server input');
  await expect(textarea).toHaveValue('Server textarea');
  await expect(page.getByTestId('hydrated-input-preview')).toHaveText('Server input');
  await expect(page.getByTestId('hydrated-textarea-preview')).toHaveText('Server textarea');
  await expect(page.getByTestId('hydrated-input-machine-value')).toHaveText('Server input');
  await expect(page.getByTestId('hydrated-textarea-machine-value')).toHaveText('Server textarea');

  await page.getByTestId('hydrated-input-preview').focus();
  await expect(input).toBeFocused();
  await input.fill('Hydrated input value');
  await expect(page.getByTestId('hydrated-input-machine-value')).toHaveText('Hydrated input value');
  await input.press('Enter');
  await expect(page.getByTestId('hydrated-input-preview')).toHaveText('Hydrated input value');
  await page.getByTestId('hydrated-textarea-preview').focus();
  await expect(textarea).toBeFocused();
  await textarea.fill('Hydrated textarea value');
  await textarea.press(await readEditableSubmitKey(page));
  await expect(page.getByTestId('hydrated-textarea-preview')).toHaveText('Hydrated textarea value');
  expect(errors).toEqual([]);
}

test(
  'published Editable input and textarea hydrate on their server nodes',
  verifiesEditableHydration,
);
