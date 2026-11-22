import { expect, test, type Page } from '@playwright/test';

/** Check SVG progress semantics, CSS sizes, and accessible task naming. */
async function verifiesCircleSemantics({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=feedback-progress-circle--contract');
  const circle = page.getByTestId('circle-default');
  await expect(circle).toHaveAttribute('role', 'progressbar', { timeout: 15_000 });
  await expect(page.getByRole('progressbar', { name: 'Uploading', exact: true })).toBeVisible();
  await expect(circle).toHaveAttribute('aria-valuenow', '40');
  await expect(circle).toHaveAttribute('aria-valuemin', '0');
  await expect(circle).toHaveAttribute('aria-valuemax', '100');
  await expect(circle).toHaveCSS('width', '40px');
  await expect(page.getByTestId('circle-xs')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('circle-xl')).toHaveCSS('width', '64px');
  await expect(page.getByTestId('circle-default-value')).toHaveText('40%');
  await expect(page.getByTestId('circle-thick').locator('circle').first()).toHaveCSS(
    'stroke-width',
    '10px',
  );
  await expect(page.getByTestId('circle-red-range')).toHaveCSS('stroke-linecap', 'round');
  await expect(page.getByTestId('circle-responsive')).toHaveCSS('width', '32px');
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByTestId('circle-responsive')).toHaveCSS('width', '64px');
  for (const attribute of ['size', 'recipe', 'unstyled']) {
    await expect(page.getByTestId('circle-default-root')).not.toHaveAttribute(attribute);
  }
}

test(
  'Progress Circle preserves the primitive SVG semantics and CSS sizes',
  verifiesCircleSemantics,
);

/** Keep controlled and external updates on their original SVG nodes. */
async function verifiesReactiveCircle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress-circle--contract');
  const reactive = page.getByTestId('circle-reactive');
  const range = page.getByTestId('circle-reactive-range');
  const external = page.getByTestId('circle-external');
  await expect(reactive).toHaveAttribute('aria-valuenow', '25', { timeout: 15_000 });
  await range.evaluate(
    /** Mark the native arc before the controlled update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('circle-toggle').click();
  await expect(reactive).toHaveAttribute('aria-valuenow', '75');
  await expect(reactive).toHaveCSS('width', '48px');
  await expect(range).toHaveAttribute('data-original-node', 'true');
  await expect(page.getByTestId('circle-reactive-value')).toHaveText('75%');
  await page.getByTestId('circle-external-toggle').click();
  await expect(external).toHaveAttribute('aria-valuenow', '80');
}

test('Progress Circle updates controlled and external machines', verifiesReactiveCircle);

/** Verify indeterminate ARIA and reduced-motion styles. */
async function verifiesCircleMotion({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=feedback-progress-circle--contract');
  const circle = page.getByTestId('circle-indeterminate');
  const range = page.getByTestId('circle-indeterminate-range');
  await expect(circle).toHaveAttribute('role', 'progressbar', { timeout: 15_000 });
  await expect(circle).not.toHaveAttribute('aria-valuenow');
  await expect(circle).toHaveCSS('animation-name', 'none');
  await expect(range).toHaveCSS('animation-name', 'none');
  await expect(range).toHaveCSS('transition-duration', '0s');
}

test('Progress Circle keeps indeterminate semantics with reduced motion', verifiesCircleMotion);

/** Verify the two documented Circle compositions in the browser. */
async function verifiesCircleCompositions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress-circle--contract');
  const ring = page.getByTestId('circle-centered');
  const value = page.getByTestId('circle-centered-value');
  await expect(value).toHaveText('75%', { timeout: 15_000 });
  await expect(page.getByTestId('circle-centered-value-host')).toHaveCSS('position', 'absolute');
  const ringBounds = await ring.boundingBox();
  const valueBounds = await value.boundingBox();
  if (!ringBounds || !valueBounds) throw new Error('Centered Circle specimen did not render.');
  expect(
    Math.abs(ringBounds.x + ringBounds.width / 2 - valueBounds.x - valueBounds.width / 2),
  ).toBeLessThan(1);
  expect(
    Math.abs(ringBounds.y + ringBounds.height / 2 - valueBounds.y - valueBounds.height / 2),
  ).toBeLessThan(1);
  const indeterminate = page.getByTestId('circle-custom-indeterminate-range');
  await expect(indeterminate).toHaveAttribute('data-state', 'indeterminate');
  await expect(indeterminate).toHaveCSS('stroke', 'rgb(168, 85, 247)');
}

test(
  'Progress Circle renders centered value and indeterminate color examples',
  verifiesCircleCompositions,
);

/** Verify consumer CSS wins while unstyled SVG parts keep their machine state. */
async function verifiesCircleConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-progress-circle--contract');
  await page.addStyleTag({
    content: `
      [data-testid='circle-default-root'] { --leverui-progress-circle-size: 56px; }
      .consumer-circle-range { stroke: rgb(12, 34, 56); }
    `,
  });
  await expect(page.getByTestId('circle-default')).toHaveCSS('width', '56px');
  await expect(page.getByTestId('circle-default-range')).toHaveCSS('stroke', 'rgb(12, 34, 56)');
  const unstyledCircle = page.getByTestId('circle-unstyled');
  await expect(unstyledCircle).toHaveAttribute('role', 'progressbar');
  await expect(unstyledCircle).toHaveAttribute('aria-valuenow', '35');
  await expect(unstyledCircle).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('circle-unstyled-track')).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('circle-unstyled-range')).toHaveAttribute('data-unstyled', '');
}

test('Progress Circle accepts consumer CSS and unstyled composition', verifiesCircleConsumerCss);
