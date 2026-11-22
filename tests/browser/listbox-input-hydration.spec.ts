import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

type Variant = 'filter' | 'keyboard-priority';
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const expectedNames = {
  filter: [
    'React.js',
    'Vue.js',
    'Angular',
    'Svelte',
    'SolidJS',
    'Next.js',
    'Nuxt.js',
    'Remix',
    'Gatsby',
    'Ember.js',
    'Preact',
  ],
  'keyboard-priority': ['React.js', 'Vue.js', 'Angular', 'Svelte'],
} satisfies Record<Variant, readonly string[]>;

/** Assert every option's accessible name and position. */
async function expectAccessibleOptions(options: Locator, variant: Variant): Promise<void> {
  await expect(options).toHaveCount(expectedNames[variant].length);
  for (const [index, name] of expectedNames[variant].entries()) {
    await expect(options.nth(index)).toHaveAccessibleName(name);
  }
}

/** Mark one published-server option before browser hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser entry to its matching server fixture. */
async function hydrateInBrowser(variant: Variant): Promise<void> {
  const modulePath = '/.storybook/listbox-input-hydration-example.tsx';
  const { hydrateListboxInput } = await import(modulePath);
  const root = document.getElementById('listbox-input-hydration-root');
  if (!root) throw new Error('Listbox input hydration root was not found.');
  hydrateListboxInput(root, variant);
}

/** Assert that the server options and styles survive browser hydration. */
async function verifiesInputHydration(page: Page, variant: Variant): Promise<void> {
  const markup = await readFile(
    new URL(`../../.tmp/listbox-input-${variant}-hydration.html`, import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-input-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox');
  const input = page.getByRole('textbox');
  const options = listbox.getByRole('option');
  const first = options.first();
  const last = options.last();
  const listboxId = await listbox.getAttribute('id');
  const inputId = await input.getAttribute('id');
  const styleCount = await page.locator('style').count();
  await expectAccessibleOptions(options, variant);
  await first.evaluate(markServerNode);
  await last.evaluate(markServerNode);
  await input.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record hydration and subsequent keyboard exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, variant);
  await expect(page.locator('#listbox-input-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expectAccessibleOptions(options, variant);
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await expect(last).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveAttribute('data-server-node', 'true');
  await expect(listbox).toHaveAttribute('id', listboxId ?? '');
  expect(await input.getAttribute('id')).toBe(inputId);
  await expect(page.locator('style')).toHaveCount(styleCount);

  if (variant === 'filter') {
    await input.fill('NUXT');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveAccessibleName('Nuxt.js');
    await input.fill('');
    await expect(options).toHaveCount(11);
  } else {
    await input.fill('test');
    await input.evaluate(
      /** Detect accidental native caret movement from Home or End. */
      (element: HTMLInputElement) => element.setSelectionRange(2, 2),
    );
    const firstId = await first.getAttribute('id');
    const lastId = await last.getAttribute('id');
    await input.press('End');
    await expect(last).toHaveAttribute('data-highlighted');
    await expect(input).toHaveAttribute('aria-activedescendant', lastId ?? '');
    await expect(input).toHaveJSProperty('selectionStart', 2);
    await expect(input).toBeFocused();
    await input.press('Home');
    await expect(first).toHaveAttribute('data-highlighted');
    await expect(input).toHaveAttribute('aria-activedescendant', firstId ?? '');
    await expect(input).toHaveJSProperty('selectionStart', 2);
    await expect(input).toBeFocused();
    await input.press('Enter');
    await expect(first).toHaveAttribute('aria-selected', 'true');
  }
  expect(errors).toEqual([]);
}

/** Exercise filtering after published server-to-browser hydration. */
async function verifiesFilterHydration({ page }: { page: Page }): Promise<void> {
  await verifiesInputHydration(page, 'filter');
}

/** Exercise navigation priority after published server-to-browser hydration. */
async function verifiesPriorityHydration({ page }: { page: Page }): Promise<void> {
  await verifiesInputHydration(page, 'keyboard-priority');
}

test('published filter Listbox input hydrates without replacing options', verifiesFilterHydration);
test('published keyboard-priority input retains Home and End', verifiesPriorityHydration);
