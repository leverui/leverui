import { expect, test, type Page } from '@playwright/test';

/** Keep native editing available while placement changes. */
async function verifiesElementComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-element--contract&viewMode=story');
  const input = page.getByRole('textbox', { name: 'Website' });
  const element = page.getByTestId('input-element');
  const container = page.getByTestId('input-element-container');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(element).toHaveClass(/lui-input-element/);
  await expect(element).toHaveText('https://');
  await expect(element).toHaveCSS('position', 'absolute');
  await expect(element).toHaveCSS('pointer-events', 'none');
  await expect(element).toHaveCSS('font-size', '14px');
  const startBox = await element.boundingBox();
  const containerBox = await container.boundingBox();
  const inputBox = await input.boundingBox();
  if (!startBox || !containerBox || !inputBox) {
    throw new Error('Input Element composition bounds were not available.');
  }
  expect(Math.abs(startBox.x - containerBox.x)).toBeLessThan(2);
  expect(Math.abs(startBox.y - inputBox.y)).toBeLessThan(2);
  expect(Math.abs(startBox.height - inputBox.height)).toBeLessThan(2);
  await input.fill('example.com');
  await page.getByTestId('input-element-toggle').click();
  await expect(input).toHaveValue('example.com');
  const endBox = await element.boundingBox();
  if (!endBox) throw new Error('Placed Input Element bounds were not available.');
  expect(Math.abs(endBox.x + endBox.width - containerBox.x - containerBox.width)).toBeLessThan(2);
  expect(Math.abs(endBox.y - inputBox.y)).toBeLessThan(2);
  await page.mouse.click(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
  await expect(input).toBeFocused();
  await page.addStyleTag({ content: '.lui-input-element { color: rgb(10, 80, 170); }' });
  await expect(element).toHaveCSS('color', 'rgb(10, 80, 170)');
}

test('Input Element composes with Input and follows placement', verifiesElementComposition);

/** Confirm unstyled removes base layout while keeping native props. */
async function verifiesUnstyledElement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input-element--contract&viewMode=story');
  const plain = page.getByTestId('input-element-unstyled');
  await expect(plain).toBeVisible({ timeout: 30_000 });
  await expect(plain).toHaveAttribute('title', 'Plain element');
  await expect(plain).toHaveClass(/lui-input-element/);
  await expect(plain).toHaveCSS('position', 'static');
  await expect(plain).toHaveCSS('padding-left', '0px');
}

test('unstyled Input Element omits authored presentation', verifiesUnstyledElement);

/** Resolve responsive placement from authored CSS without changing the node. */
async function verifiesResponsivePlacement({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-input-element--contract&viewMode=story');
  const element = page.getByTestId('responsive-element');
  await expect(element).toHaveAttribute('data-placement', 'start');
  await expect(element).toHaveAttribute('data-placement-md', 'end');
  await expect(element).toHaveCSS('left', '0px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(element).toHaveCSS('right', '0px');
}

test('Input Element follows authored responsive placement', verifiesResponsivePlacement);
