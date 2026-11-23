import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type {
  CheckboxControl as ControlExport,
  CheckboxHiddenInput as HiddenInputExport,
  CheckboxIndicator as IndicatorExport,
  CheckboxGroup as GroupExport,
  CheckboxLabel as LabelExport,
  CheckboxRoot as RootExport,
  CheckboxRootProvider as RootProviderExport,
  useCheckbox as UseCheckboxExport,
} from '../../src';
import { renderCheckboxHydrationTree } from '../../.storybook/checkbox-hydration-tree';

type ServerExports = {
  CheckboxControl: typeof ControlExport;
  CheckboxHiddenInput: typeof HiddenInputExport;
  CheckboxIndicator: typeof IndicatorExport;
  CheckboxGroup: typeof GroupExport;
  CheckboxLabel: typeof LabelExport;
  CheckboxRoot: typeof RootExport;
  CheckboxRootProvider: typeof RootProviderExport;
  useCheckbox: typeof UseCheckboxExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

interface HydratedCheckbox {
  input: Locator;
  root: Locator;
  id: string;
  rootClass: string;
}

/** Require a server attribute before comparing it with hydrated output. */
async function requiredAttribute(locator: Locator, name: string): Promise<string> {
  const value = await locator.getAttribute(name);
  if (!value) throw new Error(`Server Checkbox is missing ${name}.`);
  return value;
}

/** Mark a server element so a later assertion detects replacement. */
function markServerElement(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Attach the browser tree to published Checkbox server markup. */
async function hydrateCheckboxInBrowser(): Promise<void> {
  const modulePath = '/.storybook/checkbox-hydration-example.tsx';
  const { hydrateCheckboxExample } = await import(modulePath);
  const root = document.getElementById('checkbox-hydration-root');
  if (!root) throw new Error('Checkbox hydration root was not found.');
  hydrateCheckboxExample(root);
}

/** Verify generated IDs, native state, nodes, and styles through hydration. */
async function verifiesCheckboxHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCheckboxHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="checkbox-hydration-root">${markup}</div>`,
  );
  const updatesInput = page.getByRole('checkbox', { name: 'Hydrated updates' });
  const consentInput = page.getByRole('checkbox', { name: 'Hydrated consent' });
  const mixedInput = page.getByRole('checkbox', { name: 'Hydrated mixed' });
  const alphaInput = page.getByRole('checkbox', { name: 'Hydrated alpha' });
  const betaInput = page.getByRole('checkbox', { name: 'Hydrated beta' });
  const externalInput = page.getByRole('checkbox', { name: 'Hydrated external' });
  const updatesRoot = updatesInput.locator('xpath=..');
  const consentRoot = consentInput.locator('xpath=..');
  const mixedRoot = mixedInput.locator('xpath=..');
  const fixtures = [
    { input: updatesInput, root: updatesRoot },
    { input: consentInput, root: consentRoot },
    { input: mixedInput, root: mixedRoot },
    { input: alphaInput, root: alphaInput.locator('xpath=..') },
    { input: betaInput, root: betaInput.locator('xpath=..') },
    { input: externalInput, root: externalInput.locator('xpath=..') },
  ];
  const originals: HydratedCheckbox[] = [];
  const ids = new Set<string>();
  for (const { input, root } of fixtures) {
    const id = await requiredAttribute(input, 'id');
    const rootClass = await requiredAttribute(root, 'class');
    ids.add(id);
    await expect(root).toHaveAttribute('for', id);
    const labelId = await requiredAttribute(input, 'aria-labelledby');
    await expect(page.locator(`[id="${labelId}"]`)).toHaveCount(1);
    await input.evaluate(markServerElement);
    await root.evaluate(markServerElement);
    originals.push({ input, root, id, rootClass });
  }
  expect(ids.size).toBe(fixtures.length);
  await expect(updatesInput).toBeChecked();
  await expect(consentInput).not.toBeChecked();
  await expect(mixedRoot).toHaveAttribute('data-state', 'indeterminate');
  await expect(alphaInput).toBeChecked();
  await expect(betaInput).toBeDisabled();
  await expect(externalInput).toBeChecked();
  const group = page.getByTestId('hydrated-group');
  await group.evaluate(markServerElement);
  await expect(page.getByTestId('hydrated-checked-mark')).toHaveAttribute('data-state', 'checked');
  await expect(page.getByTestId('hydrated-mixed-mark')).toHaveAttribute(
    'data-state',
    'indeterminate',
  );
  await page.getByTestId('hydrated-checked-mark').evaluate(markServerElement);
  await page.getByTestId('hydrated-mixed-mark').evaluate(markServerElement);
  const errors: string[] = [];

  /** Collect browser errors during hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCheckboxInBrowser);
  await expect(page.locator('#checkbox-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  for (const { input, root, id, rootClass } of originals) {
    await expect(input).toHaveAttribute('data-server-element', 'true');
    await expect(root).toHaveAttribute('data-server-element', 'true');
    await expect(input).toHaveAttribute('id', id);
    await expect(root).toHaveAttribute('class', rootClass);
  }
  await expect(updatesInput).toBeChecked();
  await expect(mixedInput).not.toBeChecked();
  await expect(mixedRoot).toHaveAttribute('data-state', 'indeterminate');
  await expect(group).toHaveAttribute('data-server-element', 'true');
  await expect(page.getByRole('group', { name: 'Topics' })).toHaveAttribute(
    'data-testid',
    'hydrated-group',
  );
  await expect(alphaInput).toBeChecked();
  await expect(betaInput).toBeDisabled();
  await expect(externalInput).toBeChecked();
  await expect(mixedRoot.locator('.lui-checkbox__indicator')).toHaveAttribute(
    'data-state',
    'indeterminate',
  );
  await expect(page.getByTestId('hydrated-checked-mark')).toHaveAttribute(
    'data-server-element',
    'true',
  );
  await expect(page.getByTestId('hydrated-mixed-mark')).toHaveAttribute(
    'data-server-element',
    'true',
  );
  await expect(page.getByTestId('hydrated-checked-mark')).toHaveClass(/lui-checkbox__indicator/);
  await expect(page.getByTestId('hydrated-mixed-mark')).toHaveClass(/lui-checkbox__indicator/);
  await updatesRoot.getByText('Hydrated updates').click();
  await expect(updatesInput).not.toBeChecked();
  await expect(page.getByTestId('hydrated-checked-mark')).toHaveCount(0);
  await expect(updatesRoot.locator('.lui-checkbox__indicator')).toHaveAttribute(
    'data-state',
    'unchecked',
  );
  await consentRoot.getByText('Hydrated consent').click();
  await expect(consentInput).toBeChecked();
  await expect(consentRoot).toHaveAttribute('data-state', 'checked');
  await alphaInput.focus();
  await page.keyboard.press('Space');
  await expect(alphaInput).not.toBeChecked();
  await expect(betaInput).toBeEnabled();
  await betaInput.focus();
  await page.keyboard.press('Space');
  await expect(betaInput).toBeChecked();
  await externalInput.focus();
  await page.keyboard.press('Space');
  await expect(externalInput).not.toBeChecked();
  const entries = await page.getByTestId('hydrated-composition-form').evaluate(
    /** Read actual native values after hydrated keyboard transitions. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(entries).toContainEqual(['topics', 'beta']);
  expect(entries).not.toContainEqual(['external', 'yes']);
}

test(
  'published Checkbox hydrates its original native controls and styles',
  verifiesCheckboxHydration,
);
