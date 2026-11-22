import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { CheckboxCard as CardExport } from '../../src';
import { renderCheckboxCardHydrationTree } from '../../.storybook/checkbox-card-hydration-tree';

type ServerExports = {
  CheckboxCard: typeof CardExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

interface ServerCard {
  input: Locator;
  root: Locator;
  id: string;
  rootClass: string;
}

/** Mark server nodes so replacement after hydration is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared card fixture from its browser source entry. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/checkbox-card-hydration-example.tsx';
  const { hydrateCheckboxCardExample } = await import(modulePath);
  const root = document.getElementById('checkbox-card-hydration-root');
  if (!root) throw new Error('Checkbox Card hydration root was not found.');
  hydrateCheckboxCardExample(root);
}

/** Verify published card nodes, styles, and native inputs survive hydration. */
async function verifiesCardHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCheckboxCardHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="checkbox-card-hydration-root">${markup}</div>`,
  );
  const first = page.getByRole('checkbox', { name: 'Hydrated card' });
  const customInput = page.getByTestId('hydrated-custom-input');
  const customSvg = page.getByTestId('hydrated-custom-svg');
  const external = page.getByRole('checkbox', { name: 'Hydrated external card' });
  const cards: ServerCard[] = [];
  for (const input of [first, external]) {
    const root = input.locator('xpath=..');
    const id = await input.getAttribute('id');
    const rootClass = await root.getAttribute('class');
    if (!id || !rootClass) throw new Error('Published card is missing an ID or class.');
    await expect(root).toHaveAttribute('for', id);
    await input.evaluate(markServerNode);
    await root.evaluate(markServerNode);
    cards.push({ input, root, id, rootClass });
  }
  await expect(first).toBeChecked();
  expect(await customInput.getAttribute('id')).toBe(await first.getAttribute('id'));
  await expect(customSvg).toHaveAttribute('data-state', 'checked');
  await customSvg.evaluate(markServerNode);
  await expect(external).toBeChecked();
  const errors: string[] = [];
  /** Record browser exceptions while attaching the client machines. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#checkbox-card-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(customSvg).toHaveAttribute('data-server-node', 'true');
  await expect(customSvg).toHaveAttribute('aria-hidden', 'false');
  for (const { input, root, id, rootClass } of cards) {
    await expect(input).toHaveAttribute('data-server-node', 'true');
    await expect(root).toHaveAttribute('data-server-node', 'true');
    await expect(input).toHaveAttribute('id', id);
    await expect(root).toHaveAttribute('class', rootClass);
  }
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).not.toBeChecked();
  await expect(customSvg).toHaveAttribute('data-state', 'unchecked');
  await expect(customSvg).toHaveAttribute('data-server-node', 'true');
  await external.focus();
  await page.keyboard.press('Space');
  await expect(external).not.toBeChecked();
  const entries = await page.getByTestId('hydrated-card-form').evaluate(
    /** Read native form values after hydrated keyboard transitions. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(entries).toEqual([]);
}

test('published Checkbox Card hydrates native nodes and styles', verifiesCardHydration);
