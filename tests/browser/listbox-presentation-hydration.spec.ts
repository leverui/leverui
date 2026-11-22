import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

type Variant = 'checkmark' | 'description' | 'icon';
const labels: Record<Variant, readonly string[]> = {
  checkmark: ['React.js', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'SolidJS'],
  description: ['React.js', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'SolidJS'],
  icon: ['React.js', 'Vue.js', 'Angular', 'Svelte', 'SolidJS'],
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Assert every option's primary accessible label in collection order. */
async function expectAccessibleOptions(options: Locator, variant: Variant): Promise<void> {
  await expect(options).toHaveCount(labels[variant].length);
  for (const [index, label] of labels[variant].entries()) {
    const expected =
      variant === 'description' ? new RegExp(`^${label.replaceAll('.', '\\.')}\\s`) : label;
    await expect(options.nth(index)).toHaveAccessibleName(expected);
  }
}

/** Check the server and hydrated initial selection, including its checkmark. */
async function expectInitialSelection(
  first: Locator,
  variant: Variant,
  selected: boolean,
): Promise<void> {
  await expect(first).toHaveAttribute('aria-selected', String(selected));
  if (selected && variant === 'checkmark') {
    await expect(first.locator('svg')).toHaveAttribute('data-state', 'checked');
  }
}

/** Mark an option created by the published server renderer. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser package to the selected server fixture. */
async function hydrateInBrowser({
  variant,
  selected,
}: {
  variant: Variant;
  selected: boolean;
}): Promise<void> {
  const modulePath = '/.storybook/listbox-presentation-hydration-example.tsx';
  const { hydrateListboxPresentation } = await import(modulePath);
  const root = document.getElementById('listbox-presentation-hydration-root');
  if (!root) throw new Error('Listbox presentation hydration root was not found.');
  hydrateListboxPresentation(root, variant, selected ? ['react'] : []);
}

/** Retain the published option, IDs, and item behavior through hydration. */
async function verifiesPresentationHydration(
  page: Page,
  variant: Variant,
  selected = false,
): Promise<void> {
  const state = selected ? '-selected' : '';
  const markup = await readFile(
    new URL(`../../.tmp/listbox-presentation-${variant}${state}-hydration.html`, import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-presentation-hydration-root">${markup}</div>`,
  );
  const listbox = page.getByRole('listbox');
  const options = listbox.getByRole('option');
  const first = options.first();
  const last = options.last();
  const id = await listbox.getAttribute('id');
  const styleCount = await page.locator('style').count();
  await expectAccessibleOptions(options, variant);
  await expectInitialSelection(first, variant, selected);
  await first.evaluate(markServerNode);
  await last.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record exceptions from hydration and subsequent selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, { variant, selected });
  await expect(page.locator('#listbox-presentation-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await expect(last).toHaveAttribute('data-server-node', 'true');
  await expectAccessibleOptions(options, variant);
  await expectInitialSelection(first, variant, selected);
  await expect(page.locator('style')).toHaveCount(styleCount);
  await expect(listbox).toHaveAttribute('id', id ?? '');
  await listbox.focus();
  await listbox.press('Home');
  await expect(first).toHaveAttribute('data-highlighted');
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  if (!selected) await listbox.press('ArrowUp');
  await listbox.press('Enter');
  const chosen = selected ? options.nth(1) : first;
  await expect(chosen).toHaveAttribute('aria-selected', 'true');
  if (variant === 'checkmark') {
    await expect(chosen.locator('svg')).toHaveAttribute('data-state', 'checked');
    if (selected) await expect(first).toHaveAttribute('aria-selected', 'true');
  }
  if (variant === 'description') {
    await expect(first).toContainText('A JavaScript library for building user interfaces');
  }
  if (variant === 'icon') {
    await expect(first.locator('[data-icon="atom"]')).toHaveAttribute('aria-hidden', 'true');
  }
  expect(errors).toEqual([]);
}

/** Exercise the unselected checkmark tree's server and browser entries. */
async function verifiesCheckmarkHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'checkmark');
}

/** Exercise the unselected description tree's server and browser entries. */
async function verifiesDescriptionHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'description');
}

/** Exercise the unselected icon tree's server and browser entries. */
async function verifiesIconHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'icon');
}

/** Retain the selected checkmark and machine state through hydration. */
async function verifiesSelectedCheckmarkHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'checkmark', true);
}

/** Retain the selected description option through hydration. */
async function verifiesSelectedDescriptionHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'description', true);
}

/** Retain the selected icon option through hydration. */
async function verifiesSelectedIconHydration({ page }: { page: Page }): Promise<void> {
  await verifiesPresentationHydration(page, 'icon', true);
}

test('published checkmark Listbox hydrates', verifiesCheckmarkHydration);
test('published description Listbox hydrates', verifiesDescriptionHydration);
test('published icon Listbox hydrates', verifiesIconHydration);
test('published selected checkmark Listbox hydrates', verifiesSelectedCheckmarkHydration);
test('published selected description Listbox hydrates', verifiesSelectedDescriptionHydration);
test('published selected icon Listbox hydrates', verifiesSelectedIconHydration);
