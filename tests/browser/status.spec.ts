import { expect, test, type Page } from '@playwright/test';

/** Verify native parts, styling, palettes, and public CSS hooks. */
async function verifiesStatusParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-status--contract');
  const root = page.getByTestId('status-default');
  const indicator = page.getByTestId('status-indicator');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(root).toHaveAttribute('data-lui-color-palette', 'red');
  await expect(root).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(root).not.toHaveAttribute('role');
  await expect(indicator).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(indicator).toHaveCSS('border-radius', '9999px');
  for (const name of ['size', 'recipe', 'unstyled', 'css', 'colorPalette']) {
    await expect(root).not.toHaveAttribute(name);
  }
  const paletteColor = await indicator.evaluate(
    /** Read the authored indicator color for a consumer-owned part. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.evaluate(
    /** Compose a custom native part through the documented public class. */
    (element) => {
      const custom = document.createElement('div');
      custom.className = 'lui-status__indicator';
      custom.dataset.testid = 'status-consumer-indicator';
      element.append(custom);
    },
  );
  await expect(page.getByTestId('status-consumer-indicator')).toHaveCSS(
    'background-color',
    paletteColor,
  );
  await indicator.evaluate(
    /** Suppress only this part's authored appearance. */
    (element) => element.setAttribute('data-unstyled', ''),
  );
  await expect(indicator).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.addStyleTag({
    content: '.lui-status__root { gap: 19px; } .lui-status__indicator { width: 15px; }',
  });
  await expect(root).toHaveCSS('gap', '19px');
  await expect(indicator).toHaveCSS('width', '15px');
}

test('Status keeps native parts and consumer CSS hooks', verifiesStatusParts);

/** Verify provider defaults update the same nodes and their custom part. */
async function verifiesStatusProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-status--contract');
  const reactive = page.getByTestId('status-reactive');
  const indicator = page.getByTestId('status-reactive-indicator');
  const probe = page.getByTestId('status-reactive-probe');
  const small = page.getByTestId('status-small');
  const large = page.getByTestId('status-large');
  const red = await page.getByTestId('status-indicator').evaluate(
    /** Capture the static red palette color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  const green = await page.getByTestId('status-large-indicator').evaluate(
    /** Capture the static green palette color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(red).not.toBe(green);
  await expect(reactive).toHaveCSS(
    'font-size',
    await small.evaluate(
      /** Read the static small font size. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );
  await expect(indicator).toHaveCSS('background-color', red);
  await expect(probe).toHaveCSS('background-color', red);
  await reactive.evaluate(
    /** Mark the root before its provider defaults change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('status-toggle').click();
  await expect(reactive).toHaveAttribute('data-size', 'lg');
  await expect(reactive).toHaveAttribute('data-lui-color-palette', 'green');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS(
    'font-size',
    await large.evaluate(
      /** Read the static large font size after the update. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );
  await expect(indicator).toHaveCSS('background-color', green);
  await expect(probe).toHaveCSS('background-color', green);
}

test('Status provider updates size and palette without remounting', verifiesStatusProvider);

/** Verify responsive recipe sizes on an existing root node. */
async function verifiesResponsiveStatus({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-status--contract');
  const responsive = page.getByTestId('status-responsive');
  await expect(responsive).toHaveAttribute('data-size', 'sm');
  await expect(responsive).toHaveAttribute('data-size-md', 'lg');
  const smallSize = await page.getByTestId('status-small').evaluate(
    /** Read the small root font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  const largeSize = await page.getByTestId('status-large').evaluate(
    /** Read the large root font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  await expect(responsive).toHaveCSS('font-size', smallSize);
  await responsive.evaluate(
    /** Mark the original root before changing viewport width. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toHaveAttribute('data-original-node', 'true');
  await expect(responsive).toHaveCSS('font-size', largeSize);
}

test('Status responds to viewport changes on the same root', verifiesResponsiveStatus);

/** Verify the root retains inline flow when it is not a grid item. */
async function verifiesInlineStatus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-status--contract');
  const before = page.getByTestId('status-before');
  const root = page.getByTestId('status-inline-flow');
  const after = page.getByTestId('status-after');
  await expect(root).toHaveCSS('display', 'inline-flex');
  const beforeBox = await before.boundingBox();
  const rootBox = await root.boundingBox();
  const afterBox = await after.boundingBox();
  if (!beforeBox || !rootBox || !afterBox) throw new Error('Inline Status bounds are missing.');
  expect(rootBox.x).toBeGreaterThanOrEqual(beforeBox.x + beforeBox.width);
  expect(afterBox.x).toBeGreaterThanOrEqual(rootBox.x + rootBox.width);
  expect(rootBox.y).toBeLessThan(beforeBox.y + beforeBox.height);
  expect(beforeBox.y).toBeLessThan(rootBox.y + rootBox.height);
}

test('Status stays inline beside ordinary text', verifiesInlineStatus);

/** Verify consumer CSS, native props, and unstyled local styles. */
async function verifiesCustomStatusStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-status--contract');
  const custom = page.getByTestId('status-custom');
  const indicator = page.getByTestId('status-custom-indicator');
  await expect(custom).toHaveAttribute('title', 'Custom status');
  await expect(custom).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(custom).toHaveClass(/status-contract-custom/);
  await expect(custom).toHaveCSS('gap', '24px');
  await expect(indicator).toHaveClass(/lui-status__indicator/);
  await expect(indicator).toHaveCSS('width', '23px');
  await expect(indicator).toHaveCSS('height', '17px');
  await expect(custom).not.toHaveAttribute('recipe');

  const unstyled = page.getByTestId('status-unstyled');
  const plainIndicator = page.getByTestId('status-unstyled-indicator');
  await expect(unstyled).toHaveCSS('display', 'block');
  await expect(unstyled).toHaveCSS('padding', '11px');
  await expect(plainIndicator).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(unstyled).not.toHaveAttribute('unstyled');
}

test('Status supports consumer CSS and unstyled native styles', verifiesCustomStatusStyles);
