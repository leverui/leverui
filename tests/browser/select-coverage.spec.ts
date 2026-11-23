import { expect, test, type Page } from '@playwright/test';

/** Verify inherited CSS choices and an external machine keep native form behavior. */
async function verifiesProviders({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-providers--contract');
  const owned = page.getByRole('combobox', { name: 'Owned framework' });
  const external = page.getByRole('combobox', { name: 'External framework' });
  const ownedRoot = page.getByTestId('select-owned-root');
  const externalRoot = page.getByTestId('select-external-root');
  await expect(owned).toHaveText('Solid', { timeout: 30_000 });
  await expect(external).toHaveText('React');
  const beforeOwned = await owned.evaluate(
    /** Read the inherited small trigger height. */
    (element) => getComputedStyle(element).height,
  );
  const beforeExternal = await external.evaluate(
    /** Read the external root's inherited trigger height. */
    (element) => getComputedStyle(element).height,
  );
  await ownedRoot.evaluate(
    /** Detect unnecessary replacement after changing provider defaults. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await externalRoot.evaluate(
    /** Detect unnecessary replacement of the external machine root. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByRole('button', { name: 'Toggle inherited appearance' }).click();
  await expect(ownedRoot).toHaveAttribute('data-original-root', 'true');
  await expect(externalRoot).toHaveAttribute('data-original-root', 'true');
  expect(
    await owned.evaluate(
      /** Read the owned root's updated large height. */
      (element) => getComputedStyle(element).height,
    ),
  ).not.toBe(beforeOwned);
  expect(
    await external.evaluate(
      /** Read the external root's updated large height. */
      (element) => getComputedStyle(element).height,
    ),
  ).not.toBe(beforeExternal);
  await external.click();
  await page.getByRole('option', { name: 'Solid' }).click();
  expect(
    await page.getByTestId('select-providers-form').evaluate(
      /** Read native values from both machine ownership modes. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ owned: 'solid', external: 'solid' });
}

test('Select providers retain inherited CSS choices and external machine forms', verifiesProviders);

/** Verify every size and variant plus required, invalid, and placement props. */
async function verifiesMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-coverage--matrix');
  const trigger = page.getByTestId('select-matrix-trigger');
  const root = page.getByTestId('select-matrix-root');
  await expect(trigger).toHaveAttribute('aria-required', 'true', { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('select[name="matrix"]')).toHaveAttribute('required', '');
  const heights: string[] = [];
  for (let index = 0; index < 4; index += 1) {
    heights.push(
      await trigger.evaluate(
        /** Record each finite size's computed trigger height. */
        (element) => getComputedStyle(element).height,
      ),
    );
    if (index < 3) await page.getByRole('button', { name: 'Next size' }).click();
  }
  expect(new Set(heights).size).toBe(4);
  const outlines = await trigger.evaluate(
    /** Record outline's computed border and background. */
    (element) => ({
      border: getComputedStyle(element).borderWidth,
      bg: getComputedStyle(element).backgroundColor,
    }),
  );
  await page.getByRole('button', { name: 'Next variant' }).click();
  const subtle = await trigger.evaluate(
    /** Record subtle's computed border and background. */
    (element) => ({
      border: getComputedStyle(element).borderWidth,
      bg: getComputedStyle(element).backgroundColor,
    }),
  );
  await page.getByRole('button', { name: 'Next variant' }).click();
  const ghost = await trigger.evaluate(
    /** Record ghost's computed border and background. */
    (element) => ({
      border: getComputedStyle(element).borderWidth,
      bg: getComputedStyle(element).backgroundColor,
    }),
  );
  expect(subtle.bg).not.toBe(outlines.bg);
  expect(ghost.border).not.toBe(outlines.border);
  await trigger.click();
  await expect(page.getByRole('listbox', { name: 'Matrix framework' })).toBeVisible();
  const content = page.locator('[data-select-content]');
  await expect(content).toHaveAttribute('data-placement', /top/);
  await expect(content).toHaveAttribute('data-size', 'lg');
  await expect(content).toHaveAttribute('data-variant', 'ghost');
  await page.evaluate(
    /** Verify public tokens inherit from the document into portalled parts. */
    () => document.documentElement.style.setProperty('--lui-select-radius', '17px'),
  );
  await expect(trigger).toHaveCSS('border-radius', '17px');
  await expect(content).toHaveCSS('border-radius', '17px');
  await page.getByRole('option', { name: 'Solid' }).click();
  expect(await root.locator('select[name="matrix"]').inputValue()).toBe('solid');
}

test('Select preserves the size and variant matrix with custom placement', verifiesMatrix);

/** Verify asynchronously loaded items and reactive collection labels. */
async function verifiesReactiveCollection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-coverage--reactive');
  const trigger = page.getByRole('combobox', { name: 'Reactive framework' });
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await page.evaluate(
    /** Record the short loading state before opening starts the async request. */
    () => {
      const observer = new MutationObserver(
        /** Capture the loading element even if it is removed before the next assertion. */
        () => {
          if (!document.querySelector('[data-testid="select-loading"]')) return;
          Reflect.set(window, '__leveruiSelectLoadingSeen', true);
          observer.disconnect();
        },
      );
      observer.observe(document.body, { childList: true, subtree: true });
    },
  );
  await trigger.click();
  const loadedOption = page.getByRole('option', { name: 'Solid 0' });
  await expect(loadedOption).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, '__leveruiSelectLoadingSeen'))).toBe(true);
  await loadedOption.click();
  await expect(trigger).toHaveText('Solid 0');
  await page.getByRole('button', { name: 'Rename options' }).click();
  await expect(trigger).toHaveText('Solid 1');
  await trigger.click();
  await expect(page.getByRole('option', { name: 'Solid 1' })).toBeVisible();
}

test('Select updates async and reactive collections', verifiesReactiveCollection);
