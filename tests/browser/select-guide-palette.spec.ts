import { expect, test, type Page } from '@playwright/test';
import { selectGuideFormValue } from './select-guide-form-value';

/** Read the trigger's resolved palette background. */
function background(element: HTMLElement): string {
  return getComputedStyle(element).backgroundColor;
}

/** Verify palette token changes retain the Select machine and selected value. */
async function verifiesPaletteGuide({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-palette--contract');
  const root = page.getByTestId('select-palette-root');
  const trigger = page.getByTestId('select-palette-trigger');
  const form = page.getByTestId('select-palette-form');
  await expect(trigger).toContainText('React.js', { timeout: 30_000 });
  const redBackground = await trigger.evaluate(background);
  await root.evaluate(
    /** Mark the machine root before its reactive palette changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByRole('button', { name: 'Toggle palette' }).click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect
    .poll(
      /** Observe the resolved palette color after Solid applies the new token. */
      () => trigger.evaluate(background),
    )
    .not.toBe(redBackground);
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBe('react');
  await trigger.click();
  await page.getByRole('option', { name: 'Vue.js' }).click();
  await expect(trigger).toContainText('Vue.js');
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBe('vue');
}

test('Select palette styling changes without remounting selection', verifiesPaletteGuide);
