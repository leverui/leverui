import { expect, test, type Locator, type Page } from '@playwright/test';

/** Read the field and stepper geometry selected by authored CSS. */
async function readGeometry(input: Locator, control: Locator): Promise<[number, number, string]> {
  const height = await input.evaluate(
    /** Measure the browser's final field height. */
    (element) => Number.parseFloat(getComputedStyle(element).height),
  );
  const width = await control.evaluate(
    /** Measure the browser's final control width. */
    (element) => Number.parseFloat(getComputedStyle(element).width),
  );
  const background = await input.evaluate(
    /** Read the selected surface treatment. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  return [height, width, background];
}

/** Verify responsive choices and consumer variables without generated styles. */
async function verifiesNumberInputAppearance({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-number-input--responsive-appearance');
  const root = page.getByTestId('responsive-number-root');
  const input = page.getByTestId('responsive-number-input');
  const control = page.getByTestId('responsive-number-control');
  await expect(root).toHaveAttribute('data-size', 'xs');
  await expect(input).toHaveAttribute('data-variant', 'outline');
  await expect(input).toHaveClass(/leverui-input/);
  const small = await readGeometry(input, control);
  await page.setViewportSize({ width: 900, height: 700 });
  const large = await readGeometry(input, control);
  expect(large[0]).toBeGreaterThan(small[0]);
  expect(large[1]).toBeGreaterThan(small[1]);
  expect(large[2]).not.toBe(small[2]);
  await root.evaluate(
    /** Override the documented public stepper variable through native CSS. */
    (element) => element.style.setProperty('--leverui-number-input-stepper-width', '40px'),
  );
  const custom = await readGeometry(input, control);
  expect(custom[1]).toBe(40);
  await expect(input).toHaveValue('3');
}

test(
  'Number Input uses responsive authored CSS and a public variable',
  verifiesNumberInputAppearance,
);
