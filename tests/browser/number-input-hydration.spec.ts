import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderNumberInputHydrationTree,
  type NumberInputHydrationComponents,
} from '../../.storybook/number-input-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as NumberInputHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Number Input to the published server markup. */
async function hydrateNumberInputInBrowser(): Promise<void> {
  const modulePath = '/.storybook/number-input-hydration-example.tsx';
  const { hydrateNumberInputExample } = await import(modulePath);
  const root = document.getElementById('number-input-hydration-root');
  if (!root) throw new Error('Number Input hydration root was not found.');
  hydrateNumberInputExample(root);
}

/** Check node reuse, accessible links, styles, and post-hydration stepping. */
async function verifiesNumberInputHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared public tree through the published server entry. */
    () => renderNumberInputHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="number-input-hydration-root">${markup}</div>`,
  );
  const input = page.getByTestId('hydrated-number-input');
  const root = page.locator('#number-input-hydration-root > section');
  await expect(root).toHaveClass(/lui-number-input__root/);
  const inputId = await input.getAttribute('id');
  expect(inputId).toBeTruthy();
  await expect(page.locator(`label[for="${inputId}"]`)).toHaveCount(1);
  await expect(input).toHaveValue('3');
  await expect(input).toHaveAttribute('aria-roledescription', 'number field');
  await input.evaluate(
    /** Mark the server input so a replacement becomes observable. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  const errors: string[] = [];

  /** Capture client errors during attachment and interaction. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateNumberInputInBrowser);
  await expect(page.locator('#number-input-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(input).toHaveAttribute('data-server-element', 'true');
  await expect(input).toHaveAttribute('id', inputId ?? '');
  await expect(input).toHaveValue('3');
  // Zag 2 submits the number through the hidden input, which carries the name.
  await expect(page.getByTestId('hydrated-number-hidden')).toHaveAttribute(
    'name',
    'hydrated-quantity',
  );
  await expect(root).toHaveAttribute('data-root-ref', 'true');
  await expect(input).toHaveAttribute('data-parent-ref', 'true');
  await expect(input).toHaveAttribute('data-child-ref', 'true');
  await expect(input).toHaveClass(/lui-number-input__input/);
  await expect(page.locator(`label[for="${inputId}"]`)).toHaveCount(1);
  await page.getByTestId('hydrated-number-increment').click();
  await expect(input).toHaveValue('4');
  await expect(page.getByTestId('hydrated-number-value')).toHaveText('4');
  await page.evaluate(
    /** Let Zag finish its frame-based cursor sync before replacing text. */
    async () => {
      await new Promise<number>(requestAnimationFrame);
      await new Promise<number>(requestAnimationFrame);
    },
  );
  await input.selectText();
  await input.press('6');
  await expect(input).toHaveValue('6');
  await expect(input).toHaveAttribute('data-child-input', 'true');
  await expect(page.getByTestId('hydrated-number-value')).toHaveText('6');
  expect(errors).toEqual([]);
}

test('published Number Input hydrates on its server nodes', verifiesNumberInputHydration);
