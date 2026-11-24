import { expect, test, type Page } from '@playwright/test';

test.setTimeout(180_000);

/** Wait for the List story after Storybook loads its source graph. */
async function openListStory(page: Page): Promise<void> {
  await page.goto('/iframe.html?id=content-list--contract');
  await expect(page.getByTestId('list-default')).toBeAttached({ timeout: 60_000 });
}

/** Check native list markup, variants, and part styling. */
async function verifiesListSemantics({ page }: { page: Page }): Promise<void> {
  await openListStory(page);
  const unordered = page.getByTestId('list-default');
  const ordered = page.getByTestId('list-ordered');
  await expect(unordered).toHaveJSProperty('tagName', 'UL');
  await expect(unordered).toHaveAttribute('role', 'list');
  await expect(unordered).toHaveAttribute('title', 'Tasks');
  await expect(unordered).toHaveAttribute('data-variant', 'marker');
  await expect(unordered).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(unordered).toHaveCSS('display', 'flex');
  await expect(unordered).toHaveCSS('list-style-type', 'disc');
  await expect(page.getByTestId('list-default-item')).toHaveCSS('display', 'list-item');
  await expect(ordered).toHaveJSProperty('tagName', 'OL');
  await expect(ordered).toHaveAttribute('start', '3');
  await expect(ordered).toHaveCSS('list-style-type', 'decimal');
  await expect(ordered).not.toHaveAttribute('variant');
  await expect(page.getByTestId('list-icon-item')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('list-icon-item')).toHaveCSS('align-items', 'center');
  await expect(page.getByTestId('list-indicator')).toHaveJSProperty('tagName', 'svg');
  await expect(page.getByTestId('list-indicator')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('list-indicator')).toHaveClass(/consumer-list-icon/);
  await expect(page.getByTestId('list-indicator')).toHaveClass(/lui-list__indicator/);
  await expect(page.getByTestId('list-indicator')).toHaveAttribute('role', 'img');
  await expect(page.getByTestId('list-indicator')).toHaveAttribute('aria-label', 'Complete');
  await expect(page.getByTestId('list-indicator')).toHaveAttribute('data-parent-ref', 'received');
  await expect(page.getByTestId('list-indicator')).toHaveAttribute('data-child-ref', 'received');
  await expect(page.getByTestId('list-nested-inner')).toHaveJSProperty('tagName', 'UL');
  await expect(page.getByTestId('list-nested-item')).toHaveCSS('display', 'list-item');
  await expect(page.getByTestId('list-unstyled')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('list-unstyled-indicator')).toHaveCSS('margin-inline-end', '0px');
  const childRoot = page.locator('#list-child-root');
  const childItem = page.locator('#list-child-item');
  await expect(childRoot).toHaveJSProperty('tagName', 'OL');
  await expect(childRoot).toHaveAttribute('start', '4');
  await expect(childRoot).toHaveAttribute('title', 'Owned tasks');
  await expect(childRoot).toHaveAttribute('role', 'list');
  await expect(childRoot).toHaveAttribute('data-root-ref', 'received');
  await expect(childRoot).toHaveClass(/consumer-list-root/);
  await expect(childRoot).toHaveClass(/lui-list__root/);
  await expect(childItem).toHaveJSProperty('tagName', 'LI');
  await expect(childItem).toHaveText('Selected child item');
  await expect(childItem).toHaveAttribute('data-item-ref', 'received');
  await expect(childItem).toHaveClass(/consumer-list-item/);
  await expect(childItem).toHaveClass(/lui-list__item/);
  await expect(page.getByTestId('list-align-start-item')).toHaveCSS('align-items', 'flex-start');
  await expect(page.getByTestId('list-align-end-item')).toHaveCSS('align-items', 'flex-end');
  await expect(page.getByTestId('list-ordered-item')).toHaveCSS('display', 'list-item');
  const markerColor = await page.getByTestId('list-ordered-item').evaluate(
    /** Read the browser's resolved pseudo-element color. */
    (element) => getComputedStyle(element, '::marker').color,
  );
  expect(markerColor).toBe('rgb(1, 2, 3)');
}

test('List renders semantic parts and variants', verifiesListSemantics);

/** Verify inherited variant updates and ordinary consumer CSS. */
async function verifiesListReactivity({ page }: { page: Page }): Promise<void> {
  await openListStory(page);
  const reactive = page.getByTestId('list-reactive');
  const changing = page.getByTestId('list-reactive-item');
  const fixed = page.getByTestId('list-fixed-item');
  const probe = page.getByTestId('list-reactive-probe');
  const nestedProbe = page.getByTestId('list-probe-nested');
  const icon = page.getByTestId('list-indicator');
  const childRoot = page.locator('#list-child-root');
  const childItem = page.locator('#list-child-item');
  await expect(changing).toHaveCSS('display', 'list-item');
  await expect(childItem).toHaveCSS('display', 'list-item');
  await expect(probe).toHaveCSS('display', 'list-item');
  await expect(nestedProbe).toHaveCSS('display', 'list-item');
  const originalIconColor = await icon.evaluate(
    /** Read the selected SVG's initial recipe color. */
    (element) => getComputedStyle(element).color,
  );
  await reactive.evaluate(
    /** Mark the original native root before a provider update. */
    (element) => element.setAttribute('data-original-list', 'true'),
  );
  await icon.evaluate(
    /** Mark the original consumer-owned SVG before its color changes. */
    (element) => element.setAttribute('data-original-icon', 'true'),
  );
  await probe.evaluate(
    /** Mark the custom descendant before its recipe updates. */
    (element) => element.setAttribute('data-original-probe', 'true'),
  );
  await childRoot.evaluate(
    /** Mark the consumer-owned root before provider variants change. */
    (element) => {
      Reflect.set(window, 'originalListChildRoot', element);
      element.setAttribute('data-original-root', 'true');
    },
  );
  await childItem.evaluate(
    /** Mark the consumer-owned item before provider variants change. */
    (element) => {
      Reflect.set(window, 'originalListChildItem', element);
      element.setAttribute('data-original-item', 'true');
    },
  );
  await page.getByTestId('list-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-list', 'true');
  await expect(changing).toHaveCSS('display', 'flex');
  expect(
    await childRoot.evaluate(
      /** Compare the selected root with its original native node. */
      (element) => element === Reflect.get(window, 'originalListChildRoot'),
    ),
  ).toBe(true);
  expect(
    await childItem.evaluate(
      /** Compare the selected item with its original native node. */
      (element) => element === Reflect.get(window, 'originalListChildItem'),
    ),
  ).toBe(true);
  await expect(childRoot).toHaveAttribute('data-original-root', 'true');
  await expect(childItem).toHaveAttribute('data-original-item', 'true');
  await expect(childItem).toHaveCSS('display', 'flex');
  await expect(probe).toHaveAttribute('data-original-probe', 'true');
  await expect(probe).toHaveCSS('display', 'flex');
  await expect(nestedProbe).toHaveCSS('display', 'list-item');
  await expect(fixed).toHaveCSS('display', 'list-item');
  await expect(icon).toHaveAttribute('data-original-icon', 'true');
  await expect(icon).toHaveAttribute('data-parent-ref', 'received');
  const updatedIconColor = await icon.evaluate(
    /** Read the live SVG color after its parent component updates. */
    (element) => getComputedStyle(element).color,
  );
  expect(updatedIconColor).not.toBe(originalIconColor);

  await page.addStyleTag({
    content:
      '.lui-list__item[data-testid="list-default-item"]{color:rgb(10, 20, 30)}' +
      '.lui-list__root[data-testid="list-default"]{--lui-list-gap:12px}',
  });
  await expect(page.getByTestId('list-default-item')).toHaveCSS('color', 'rgb(10, 20, 30)');
  await expect(page.getByTestId('list-default')).toHaveCSS('row-gap', '12px');
}

test('List reacts to provider defaults and consumer CSS', verifiesListReactivity);

/** Confirm responsive recipe values follow the viewport breakpoint. */
async function verifiesResponsiveAlignment({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await openListStory(page);
  const item = page.getByTestId('list-align-responsive-item');
  const variantItem = page.getByTestId('list-variant-responsive-item');
  await expect(item).toHaveCSS('align-items', 'flex-start');
  await expect(variantItem).toHaveCSS('display', 'list-item');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(item).toHaveCSS('align-items', 'flex-end');
  await expect(variantItem).toHaveCSS('display', 'flex');
}

test('List alignment responds to a breakpoint change', verifiesResponsiveAlignment);
