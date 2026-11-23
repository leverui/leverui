import { expect, test, type Page } from '@playwright/test';

test.setTimeout(90_000);

/** Wait until the Data List story has finished its cold module load. */
async function openDataListStory(page: Page): Promise<void> {
  await page.goto('/iframe.html?id=content-data-list--matrix');
  await expect(page.getByTestId('data-list-default')).toBeAttached({ timeout: 60_000 });
}

/** Check semantic parts and the size, orientation, and variant styles. */
async function verifiesDataListMatrix({ page }: { page: Page }): Promise<void> {
  await openDataListStory(page);
  const list = page.getByTestId('data-list-default');
  await expect(list).toHaveJSProperty('tagName', 'DL');
  await expect(list).toHaveAttribute('title', 'Account details');
  await expect(page.getByTestId('default-item')).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('default-label')).toHaveJSProperty('tagName', 'DT');
  await expect(page.getByTestId('default-value')).toHaveJSProperty('tagName', 'DD');
  await expect(page.getByTestId('default-label')).toHaveText('Status');
  await expect(page.getByTestId('default-value')).toHaveText('Active');
  await expect(list).toHaveClass(/lui-data-list__root/);
  await expect(list).toHaveAttribute('data-size', 'md');
  await expect(list).toHaveAttribute('data-orientation', 'vertical');
  await expect(list).toHaveAttribute('data-variant', 'subtle');
  await expect(list).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(list).not.toHaveAttribute('size');
  await expect(list).not.toHaveAttribute('orientation');
  await expect(list).not.toHaveAttribute('variant');

  await expect(page.getByTestId('data-list-vertical-item')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('data-list-horizontal-item')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('data-list-horizontal-item')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('data-list-horizontal')).not.toHaveAttribute('orientation');
  await expect(page.getByTestId('data-list-horizontal-label')).toHaveCSS('min-width', '120px');
  await expect(page.getByTestId('data-list-sm')).toHaveCSS('gap', '12px');
  await expect(page.getByTestId('data-list-md')).toHaveCSS('gap', '16px');
  await expect(page.getByTestId('data-list-lg')).toHaveCSS('gap', '20px');
  await expect(page.getByTestId('data-list-sm-item')).toHaveCSS('font-size', '12px');
  await expect(page.getByTestId('data-list-md-item')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('data-list-lg-item')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('data-list-bold-label')).toHaveCSS('font-weight', '500');
  await expect(page.getByTestId('data-list-divided-second')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('data-list-unstyled')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('data-list-unstyled-item')).toHaveCSS('display', 'block');
}

test('Data List renders semantic parts and variants', verifiesDataListMatrix);

/** Verify responsive layout and inherited variants on existing native nodes. */
async function verifiesResponsiveAndReactiveDataList({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await openDataListStory(page);
  await expect(page.getByTestId('data-list-responsive-item')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('data-list-responsive-style-item')).toHaveCSS('font-size', '12px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('data-list-responsive-item')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('data-list-responsive-style-item')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('data-list-responsive-style-label')).toHaveCSS(
    'font-weight',
    '500',
  );

  const reactive = page.getByTestId('data-list-reactive');
  await expect(reactive).toHaveCSS('gap', '12px');
  await expect(page.getByTestId('data-list-reactive-item')).toHaveCSS('flex-direction', 'column');
  await reactive.evaluate(
    /** Mark the original root before changing its provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('data-list-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('gap', '20px');
  await expect(page.getByTestId('data-list-reactive-item')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('data-list-fixed')).toHaveCSS('gap', '16px');
  await expect(page.getByTestId('data-list-fixed-item')).toHaveCSS('flex-direction', 'column');
}

test('Data List responds to viewport and provider changes', verifiesResponsiveAndReactiveDataList);

/** Apply consumer CSS to custom parts under two independent roots. */
async function verifiesScopedDataListConsumerCss({ page }: { page: Page }): Promise<void> {
  await openDataListStory(page);
  const changing = page.getByTestId('data-list-reactive-slot');
  const fixed = page.getByTestId('data-list-fixed-slot');
  await expect(changing).toHaveCSS('gap', '12px');
  await expect(fixed).toHaveCSS('gap', '16px');
  await changing.evaluate(
    /** Mark the changing custom part before the provider update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await fixed.evaluate(
    /** Mark the fixed custom part before the provider update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('data-list-toggle').click();
  await expect(changing).toHaveAttribute('data-original-node', 'true');
  await expect(changing).toHaveCSS('gap', '20px');
  await expect(fixed).toHaveAttribute('data-original-node', 'true');
  await expect(fixed).toHaveCSS('gap', '16px');
}

test('Data List consumer CSS follows reactive root choices', verifiesScopedDataListConsumerCss);

/** Keep a nested description list independent of its ancestor's size and treatment. */
async function verifiesNestedDataListScopes({ page }: { page: Page }): Promise<void> {
  await openDataListStory(page);
  const outer = page.getByTestId('data-list-outer-item');
  const inner = page.getByTestId('data-list-inner-item');
  await expect(outer).toHaveCSS('font-size', '16px');
  await expect(inner).toHaveCSS('font-size', '12px');
  await expect(page.getByTestId('data-list-outer')).toHaveAttribute('data-variant', 'bold');
  await expect(page.getByTestId('data-list-inner')).toHaveAttribute('data-variant', 'subtle');
  await expect(page.getByTestId('data-list-inner-slot')).toHaveCSS('gap', '12px');
}

test('nested Data Lists keep independent authored scopes', verifiesNestedDataListScopes);

/** Check that public CSS hooks and scoped dark tokens reach item labels. */
async function verifiesDataListTheme({ page }: { page: Page }): Promise<void> {
  await openDataListStory(page);
  await expect(page.getByTestId('data-list-css-label')).toHaveCSS('color', 'rgb(102, 51, 153)');
  const light = await page.getByTestId('default-label').evaluate(
    /** Read the resolved light semantic label color. */
    (element) => getComputedStyle(element).color,
  );
  const dark = await page.getByTestId('data-list-dark-label').evaluate(
    /** Read the nearest dark-scope semantic label color. */
    (element) => getComputedStyle(element).color,
  );
  expect(dark).not.toBe(light);
}

test('Data List accepts consumer CSS and nearest theme scope', verifiesDataListTheme);
