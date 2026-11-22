import { expect, test, type Locator, type Page } from '@playwright/test';

/** Measure horizontal offset between the selected item and its indicator. */
async function indicatorOffset(indicator: Locator, item: Locator): Promise<number> {
  const indicatorBox = await indicator.boundingBox();
  const itemBox = await item.boundingBox();
  if (!indicatorBox || !itemBox) throw new Error('Segment geometry was unavailable.');
  return Math.abs(indicatorBox.x - itemBox.x);
}

/** Verify browser pointer, keyboard, form, and indicator behavior. */
async function verifiesSegmentSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--contract');
  const react = page.getByRole('radio', { name: 'React' });
  const solid = page.getByRole('radio', { name: 'Solid' });
  const vue = page.getByRole('radio', { name: 'Vue' });
  const indicator = page.getByTestId('segment-group-indicator');
  await expect(page.getByRole('radiogroup', { name: 'Framework' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(react).toBeChecked();
  await expect(vue).toBeDisabled();
  await expect(indicator).toBeVisible();
  await expect
    .poll(
      /** Wait for the measured indicator to align with the first item. */
      () => indicatorOffset(indicator, page.locator('.leverui-segment-group__item').first()),
    )
    .toBeLessThan(2);
  await page.getByText('Solid', { exact: true }).click();
  await expect(solid).toBeChecked();
  await expect
    .poll(
      /** Follow the machine's indicator after selecting the second item. */
      () => indicatorOffset(indicator, page.locator('.leverui-segment-group__item').nth(1)),
    )
    .toBeLessThan(2);
  await expect(page.getByTestId('segment-group-selected')).toHaveText('Solid');
  expect(
    await page.getByTestId('segment-group-form').evaluate(
      /** Read the browser's actual native form value. */
      (form) => new FormData(form as HTMLFormElement).get('framework'),
    ),
  ).toBe('Solid');
  await solid.focus();
  await solid.press('ArrowLeft');
  await expect(react).toBeChecked();
}

test('Segment Group selects by pointer and keyboard', verifiesSegmentSelection);

/** Confirm a reactive size change keeps selected state and native nodes. */
async function verifiesSegmentSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--contract');
  const root = page.getByTestId('segment-group-root');
  const react = page.getByRole('radio', { name: 'React' });
  const item = page.locator('.leverui-segment-group__item').first();
  await expect(root).toHaveAttribute('data-orientation', 'horizontal', { timeout: 30_000 });
  expect(
    await root.evaluate(
      /** Read the scoped size variable exposed in computed CSS. */
      (element) =>
        getComputedStyle(element).getPropertyValue('--leverui-private-segment-radius').trim(),
    ),
  ).not.toBe('');
  expect(
    await root.evaluate(
      /** Reject the former unscoped private variable. */
      (element) => getComputedStyle(element).getPropertyValue('--segment-radius').trim(),
    ),
  ).toBe('');
  const before = await item.evaluate(
    /** Read the initial item height from authored CSS. */
    (element) => getComputedStyle(element).height,
  );
  await root.evaluate(
    /** Mark the native root to detect replacement. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('toggle-segment-group-size').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(react).toBeChecked();
  const after = await item.evaluate(
    /** Observe the changed item height after the CSS update. */
    (element) => getComputedStyle(element).height,
  );
  expect(after).not.toBe(before);
  await expect
    .poll(
      /** Confirm the resized indicator still tracks the selected item. */
      () => indicatorOffset(page.getByTestId('segment-group-indicator'), item),
    )
    .toBeLessThan(2);
}

test('Segment Group changes CSS size without remounting', verifiesSegmentSize);

/** Keep native radio activation when Items selects another outer element. */
async function verifiesPolymorphicItems({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--polymorphic');
  const root = page.getByRole('radiogroup', { name: 'Polymorphic' });
  const items = root.locator('.leverui-segment-group__item');
  await expect(items).toHaveCount(2, { timeout: 30_000 });
  await expect(items.first()).toHaveJSProperty('tagName', 'DIV');
  await expect(items.first()).not.toHaveAttribute('for');
  await items.nth(1).click({ position: { x: 2, y: 16 } });
  await expect(root.getByRole('radio', { name: 'Solid' })).toBeChecked();
  const direct = page.getByRole('radiogroup', { name: 'Direct item' });
  await direct
    .locator('.leverui-segment-group__item')
    .nth(1)
    .click({ position: { x: 2, y: 16 } });
  await expect(direct.getByRole('radio', { name: 'Solid' })).toBeChecked();
  const child = page.getByRole('radiogroup', { name: 'Child item' });
  await expect(child.locator('.leverui-segment-group__item').first()).not.toHaveAttribute('for');
  await child
    .locator('.leverui-segment-group__item')
    .nth(1)
    .click({ position: { x: 2, y: 16 } });
  await expect(child.getByRole('radio', { name: 'Solid' })).toBeChecked();
  expect(
    await page.getByTestId('segment-polymorphic-form').evaluate(
      /** Read the selected value from the native browser form. */
      (form) => new FormData(form as HTMLFormElement).get('framework'),
    ),
  ).toBe('Solid');
  expect(
    await page.getByTestId('segment-polymorphic-form').evaluate(
      /** Read the caller-owned child's native radio form value. */
      (form) => new FormData(form as HTMLFormElement).get('child'),
    ),
  ).toBe('Solid');
  expect(
    await page.getByTestId('segment-polymorphic-form').evaluate(
      /** Read the directly composed item's native value. */
      (form) => new FormData(form as HTMLFormElement).get('direct'),
    ),
  ).toBe('Solid');
}

test('polymorphic Items and Item retain native radio selection', verifiesPolymorphicItems);

/** Verify disabled, readonly, and vertical keyboard behavior at the root. */
async function verifiesGroupStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--states');
  const disabled = page.getByRole('radiogroup', { name: 'Disabled' });
  const readonly = page.getByRole('radiogroup', { name: 'Readonly' });
  const vertical = page.getByRole('radiogroup', { name: 'Vertical' });
  await expect(disabled).toHaveAttribute('aria-disabled', 'true', { timeout: 30_000 });
  await expect(readonly).toHaveAttribute('aria-readonly', 'true');
  await expect(disabled.getByRole('radio', { name: 'Solid' })).toBeDisabled();
  // Zag 2 submits a read-only group's value, so its radios stay enabled.
  await expect(readonly.getByRole('radio', { name: 'Solid' })).toBeEnabled();
  await disabled.getByText('Solid').click({ force: true });
  await readonly.getByText('Solid').click({ force: true });
  await expect(disabled.getByRole('radio', { name: 'React' })).toBeChecked();
  await expect(readonly.getByRole('radio', { name: 'React' })).toBeChecked();
  const first = vertical.getByRole('radio', { name: 'React' });
  const second = vertical.getByRole('radio', { name: 'Solid' });
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  await first.focus();
  await first.press('ArrowDown');
  await expect(second).toBeChecked();
  await expect(second).toBeFocused();
  // Zag 2 submits a read-only group's value; only the disabled group is left out.
  expect(
    await page.getByTestId('segment-states-form').evaluate(
      /** Report which group values enter native form data. */
      (form) => Object.fromEntries(new FormData(form as HTMLFormElement)),
    ),
  ).toEqual({ readonly: 'React', vertical: 'Solid' });
}

test('root states preserve disabled and vertical native behavior', verifiesGroupStates);
