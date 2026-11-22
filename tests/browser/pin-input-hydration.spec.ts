import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderPinInputHydrationTree,
  type PinInputHydrationComponents,
} from '../../.storybook/pin-input-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as PinInputHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach Pin Input's browser machine to the published server markup. */
async function hydratePinInputInBrowser(): Promise<void> {
  const modulePath = '/.storybook/pin-input-hydration-example.tsx';
  const { hydratePinInputExample } = await import(modulePath);
  const root = document.getElementById('pin-input-hydration-root');
  if (!root) throw new Error('Pin Input hydration root was not found.');
  hydratePinInputExample(root);
}

/** Check node reuse, masking, refs, static CSS, and a post-hydration edit. */
async function verifiesPinInputHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared public tree through the published server entry. */
    () => renderPinInputHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="pin-input-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#pin-input-hydration-root > section');
  const first = page.getByTestId('hydrated-pin-0');
  const second = page.getByTestId('hydrated-pin-1');
  const hidden = root.locator('input[name="hydrated-code"]');
  await expect(root).toHaveClass(/leverui-pin-input__root/);
  await expect(first).toHaveValue('3');
  await expect(first).toHaveAttribute('type', 'password');
  await expect(first).toHaveAttribute('aria-label', 'pin code 1 of 4');
  await expect(hidden).toHaveValue('3');
  const inputId = await first.getAttribute('id');
  expect(inputId).toBeTruthy();
  await root.evaluate(
    /** Mark the selected server root so a replacement is observable. */
    (element) => element.setAttribute('data-server-root', 'true'),
  );
  await first.evaluate(
    /** Mark the original node so a replacement is observable. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  await expect(first).toHaveCSS('height', '40px');
  const errors: string[] = [];

  /** Capture client errors during attachment and editing. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePinInputInBrowser);
  await expect(page.locator('#pin-input-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(root).toHaveAttribute('data-server-root', 'true');
  await expect(first).toHaveAttribute('data-server-element', 'true');
  await expect(first).toHaveAttribute('id', inputId ?? '');
  await expect(first).toHaveValue('3');
  await expect(first).toHaveAttribute('type', 'password');
  await expect(first).toHaveClass(/leverui-pin-input__input/);
  await expect(root).toHaveAttribute('data-root-ref', 'true');
  await expect(first).toHaveAttribute('data-parent-ref', 'true');
  await expect(first).toHaveAttribute('data-child-ref', 'true');
  await first.fill('4');
  await expect(first).toHaveValue('4');
  await expect(second).toBeFocused();
  await expect(hidden).toHaveValue('4');
  await expect(first).toHaveAttribute('data-child-input', 'true');
  expect(errors).toEqual([]);
}

test('published Pin Input hydrates on its server nodes', verifiesPinInputHydration);
