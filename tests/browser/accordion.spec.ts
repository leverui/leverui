import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Verify default value, collapse, disabled state, and lazy panel mounting. */
async function verifiesDisclosure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--contract');
  const first = page.getByRole('button', { name: 'First item' });
  const second = page.getByRole('button', { name: 'Second item' });
  const third = page.getByRole('button', { name: 'Third item' });
  await expect(second).toHaveAttribute('aria-expanded', 'true', { timeout: 30_000 });
  await expect(page.getByText('Second panel content')).toBeVisible();
  await expect(page.getByText('First panel content')).toHaveCount(0);
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('First panel content')).toBeVisible();
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(third).toBeDisabled();
}

test('Accordion discloses labeled panels through the primitive state', verifiesDisclosure);

/** Reach enabled triggers with Tab; Zag 2 follows WAI-ARIA and drops arrow navigation. */
async function verifiesKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--contract');
  const first = page.getByRole('button', { name: 'First item' });
  const second = page.getByRole('button', { name: 'Second item' });
  await first.focus();
  await first.press('ArrowDown');
  await expect(first).toBeFocused();
  await first.press('End');
  await expect(first).toBeFocused();
  await pressBrowserTab(page);
  await expect(second).toBeFocused();
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await second.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
}

test('Accordion reaches enabled triggers with Tab', verifiesKeyboard);

/** Follow external controlled changes while retaining multiple expansion. */
async function verifiesControlledMultiple({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--controlled');
  const first = page.getByRole('button', { name: 'First item' });
  const second = page.getByRole('button', { name: 'Second item' });
  await expect(first).toHaveAttribute('aria-expanded', 'true', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Open second externally' }).click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('accordion-values')).toHaveText('second,first');
}

test('Accordion follows controlled values and expands multiple items', verifiesControlledMultiple);

/** Confirm the variants and sizes reach their rendered slots. */
async function verifiesRecipes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion-variants--variants');
  const outline = page.getByTestId('accordion-variant-outline');
  const subtle = page.getByTestId('accordion-variant-subtle');
  const enclosed = page.getByTestId('accordion-variant-enclosed');
  const plain = page.getByTestId('accordion-variant-plain');
  await expect(outline.locator('[data-accordion-item]')).toHaveCSS('border-bottom-width', '1px', {
    timeout: 30_000,
  });
  await expect(enclosed.locator('[data-accordion-root]')).toHaveCSS('border-top-width', '1px');
  await expect(subtle.locator('[data-accordion-item]')).toHaveAttribute('data-state', 'open');
  await expect(plain.locator('[data-accordion-item]')).toHaveCSS('border-bottom-width', '0px');
  await page.goto('/iframe.html?id=components-accordion-variants--sizes');
  const fontSizes = await Promise.all(
    ['sm', 'md', 'lg'].map(
      /** Read each size from the actual trigger. */
      async (size) =>
        page
          .getByTestId(`accordion-size-${size}`)
          .locator('[data-accordion-item-trigger]')
          .evaluate(
            /** Compare rendered CSS without relying on generated class hashes. */
            (element) => Number.parseFloat(getComputedStyle(element).fontSize),
          ),
    ),
  );
  expect(fontSizes[0]).toBeLessThan(fontSizes[1] ?? 0);
  expect(fontSizes[1]).toBeLessThan(fontSizes[2] ?? 0);
}

test('Accordion applies every variant and ordered sizes', verifiesRecipes);
