import { expect, test, type Page } from '@playwright/test';

/** Verify consumer CSS changes the default root and indicator presentation. */
async function verifiesConsumerCSS({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-appearance--css');
  const root = page.getByTestId('carousel-override-root');
  const indicator = page.getByTestId('carousel-override-indicator').first();
  await expect(root).toHaveCSS('gap', '24px', { timeout: 30_000 });
  await expect(indicator).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  await page.getByTestId('carousel-override-next').click();
  await expect(page.getByTestId('carousel-override-indicator').nth(1)).toHaveAttribute(
    'data-current',
    '',
  );
}

/** Preserve the machine and part hooks without authored appearance. */
async function verifiesUnstyledMachine({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-appearance--css');
  const root = page.getByTestId('carousel-unstyled-root');
  const indicator = page.getByTestId('carousel-unstyled-indicator').first();
  await expect(root).toHaveAttribute('data-unstyled', '', { timeout: 30_000 });
  await expect(root).toHaveCSS('display', 'block');
  await expect(indicator).toHaveAttribute('data-unstyled', '');
  await page.getByTestId('carousel-unstyled-next').click();
  await expect(page.getByTestId('carousel-unstyled-progress')).toHaveText('2 / 2');
}

/** Keep each part's orientation and machine local to its nearest root. */
async function verifiesNestedOrientation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-appearance--nested');
  const root = page.getByTestId('carousel-inner-root');
  const control = page.getByTestId('carousel-inner-control');
  const indicators = page.getByTestId('carousel-inner-indicator').first().locator('..');
  await expect(root).toHaveAttribute('data-orientation', 'horizontal', { timeout: 30_000 });
  await expect(control).toHaveCSS('flex-direction', 'row');
  await expect(indicators).toHaveCSS('flex-direction', 'row');
  await page.getByTestId('carousel-inner-next').click();
  await expect(page.getByTestId('carousel-inner-progress')).toHaveText('2 / 2');
}

test('Carousel supports consumer CSS overrides', verifiesConsumerCSS);
test('unstyled Carousel keeps navigation without presentation CSS', verifiesUnstyledMachine);
test('nested Carousel uses its own orientation', verifiesNestedOrientation);
