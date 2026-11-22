import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';
import { expectGuideOptions, type ListboxGuide } from './listbox-guide-contract';
import { alignGuidePlatform, guideModifier } from './listbox-guide-platform';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server option so hydration cannot silently replace it. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser tree to a server-rendered guide. */
async function hydrateInBrowser(guide: string): Promise<void> {
  if (guide !== 'select-all' && guide !== 'extended') throw new Error('Unknown Listbox guide.');
  const modulePath = '/.storybook/listbox-guide-hydration-example.tsx';
  const { hydrateListboxGuide } = await import(modulePath);
  const target = document.getElementById('listbox-guide-hydration-root');
  if (!target) throw new Error('Listbox guide hydration root was not found.');
  hydrateListboxGuide(target, guide);
}

/** Load one published server fixture and attach browser error tracking. */
async function mountGuide(
  page: Page,
  guide: ListboxGuide,
): Promise<{ errors: string[]; styleCount: number }> {
  const markup = await readFile(
    new URL(`../../.tmp/listbox-guide-${guide}-hydration.html`, import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="listbox-guide-hydration-root">${markup}</div>`,
  );
  const errors: string[] = [];

  /** Retain browser exceptions from attachment and later selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  return { errors, styleCount: await page.locator('style').count() };
}

/** Verify mixed server selection survives hydration and select-all updates. */
async function verifiesSelectAllHydration({ page }: { page: Page }): Promise<void> {
  const { errors, styleCount } = await mountGuide(page, 'select-all');
  const listbox = page.getByRole('listbox', { name: 'Select Frameworks' });
  const options = listbox.getByRole('option');
  const react = listbox.getByRole('option', { name: 'React.js' });
  const header = page.getByRole('button', { name: 'Select Frameworks' });
  await expectGuideOptions(options, 'select-all');
  await expect(react).toHaveAttribute('aria-selected', 'true');
  await expect(header).toHaveAttribute('aria-pressed', 'mixed');
  await expect(header.locator('svg')).toHaveAttribute('data-state', 'indeterminate');
  await react.evaluate(markServerNode);
  const originalId = await react.getAttribute('id');
  await page.evaluate(hydrateInBrowser, 'select-all');
  await expect(page.locator('#listbox-guide-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(react).toHaveAttribute('data-server-node', 'true');
  await expect(react).toHaveAttribute('id', originalId ?? '');
  await expectGuideOptions(options, 'select-all');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await header.click();
  await expect(header).toHaveAttribute('aria-pressed', 'true');
  for (const option of await options.all())
    await expect(option).toHaveAttribute('aria-selected', 'true');
  await header.click();
  await expect(header).toHaveAttribute('aria-pressed', 'false');
  await header.focus();
  await header.press('Tab');
  await expect(listbox).toBeFocused();
  await listbox.press('Home');
  await expect(options.first()).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.first().getAttribute('id')) ?? '',
  );
  await listbox.press('Enter');
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await listbox.press('Shift+ArrowDown');
  await expect(options.nth(2)).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(2).getAttribute('id')) ?? '',
  );
  await expect(listbox).toBeFocused();
  // Zag 2 selects the range from the anchor, the option chosen with Enter,
  // through the newly highlighted option.
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
}

test('published Select All guide hydrates its mixed selection', verifiesSelectAllHydration);

/** Verify modifier selection remains live after the Extended guide hydrates. */
async function verifiesExtendedHydration({ page }: { page: Page }): Promise<void> {
  await alignGuidePlatform(page);
  const { errors, styleCount } = await mountGuide(page, 'extended');
  const listbox = page.getByRole('listbox', { name: /Select frameworks \(hold/ });
  const options = listbox.getByRole('option');
  await expectGuideOptions(options, 'extended');
  await options.first().evaluate(markServerNode);
  await page.evaluate(hydrateInBrowser, 'extended');
  await expect(page.locator('#listbox-guide-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(options.first()).toHaveAttribute('data-server-node', 'true');
  await expectGuideOptions(options, 'extended');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await options.first().click();
  await options.nth(1).click({ modifiers: [await guideModifier(page)] });
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(listbox).toBeFocused();
  await listbox.press('Home');
  await expect(options.first()).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.first().getAttribute('id')) ?? '',
  );
  await listbox.press('ArrowDown');
  await expect(options.nth(1)).toHaveAttribute('data-highlighted');
  await expect(listbox).toHaveAttribute(
    'aria-activedescendant',
    (await options.nth(1).getAttribute('id')) ?? '',
  );
  await expect(listbox).toBeFocused();
  expect(errors).toEqual([]);
}

test('published Extended Select guide hydrates modifier selection', verifiesExtendedHydration);
