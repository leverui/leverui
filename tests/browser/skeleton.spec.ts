import { expect, test, type Page } from '@playwright/test';

/** Check public loading variants, circle geometry, and CSS color hooks. */
async function verifiesSkeletonAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-skeleton--contract');
  const pulse = page.getByTestId('skeleton-pulse');
  const shine = page.getByTestId('skeleton-shine');
  const circle = page.getByTestId('skeleton-circle');
  await expect(pulse).toBeVisible({ timeout: 15_000 });
  await expect(pulse).toHaveCSS('animation-name', 'pulse');
  await expect(shine).toHaveCSS('animation-name', 'bg-position');
  await expect(page.getByTestId('skeleton-none')).toHaveCSS('animation-name', 'none');
  await expect(circle).toHaveCSS('width', '40px');
  await expect(circle).toHaveCSS('height', '40px');
  await expect(circle).toHaveCSS('border-radius', '9999px');
  await expect(page.getByTestId('skeleton-hidden-child')).toHaveCSS('visibility', 'hidden');
  await expect(page.getByTestId('skeleton-loaded-child')).toHaveCSS('visibility', 'visible');
  await expect(shine).toHaveCSS('--lui-skeleton-start-color', '#ff0080');
  await expect(shine).toHaveCSS('--lui-skeleton-end-color', '#ffaa00');
  for (const attribute of ['loading', 'variant', 'size', 'noOfLines']) {
    await expect(pulse).not.toHaveAttribute(attribute);
  }
}

test('Skeleton renders states, geometry, and public color hooks', verifiesSkeletonAppearance);

/** Resolve responsive appearance from authored CSS without style injection. */
async function verifiesResponsiveVariant({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=feedback-skeleton--contract');
  const responsive = page.getByTestId('skeleton-responsive');
  await expect(responsive).toHaveAttribute('data-variant', 'pulse');
  await expect(responsive).toHaveAttribute('data-variant-md', 'shine');
  await expect(responsive).toHaveCSS('animation-name', 'pulse');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(responsive).toHaveCSS('animation-name', 'bg-position');
}

test('Skeleton resolves responsive variants with authored CSS', verifiesResponsiveVariant);

/** Preserve mounted content while text lines and inherited styles update. */
async function verifiesSkeletonUpdates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-skeleton--contract');
  const root = page.getByTitle('skeleton-text-root');
  await expect(root).toHaveClass(/lui-skeleton-text/);
  await expect(root).toHaveClass(/custom-text-stack/);
  const lines = root.locator('.lui-skeleton');
  const reactive = page.getByTestId('skeleton-reactive');
  const inherited = page.getByTestId('skeleton-inherited');
  await expect(lines).toHaveCount(3);
  await expect(lines.last()).toHaveCSS('max-width', '80%');
  await expect(inherited).toHaveCSS('animation-name', 'pulse');
  await reactive.evaluate(
    /** Mark the native element before reactive props change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('skeleton-toggle').click();
  await expect(lines).toHaveCount(1);
  await expect(root).toContainText('Finished text');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(page.getByTestId('skeleton-reactive-child')).toHaveCSS('visibility', 'visible');
  await expect(inherited).toHaveCSS('animation-name', 'bg-position');
}

test('Skeleton updates text, content, and provider variants in place', verifiesSkeletonUpdates);

/** Keep loading text content hidden and wrapper spacing independent of provider props. */
async function verifiesSkeletonTextProviderBoundary({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-skeleton--contract');
  const root = page.locator('[title="skeleton-provider-text"]');
  const lines = root.locator('.lui-skeleton');
  const children = page.getByTestId('skeleton-provider-text-child');
  await expect(lines).toHaveCount(2);
  await expect(root).toHaveCSS('gap', '8px');
  await expect(lines.first()).toHaveCSS('animation-name', 'bg-position');
  await expect(children).toHaveCount(2);
  await expect(children.first()).toHaveCSS('visibility', 'hidden');
}

test(
  'SkeletonText retains loading children and owns its line count',
  verifiesSkeletonTextProviderBoundary,
);

/** Suppress placeholder and reveal animations under reduced motion. */
async function verifiesReducedMotion({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=feedback-skeleton--contract');
  await expect(page.getByTestId('skeleton-pulse')).toHaveCSS('animation-name', 'none');
  await expect(page.getByTestId('skeleton-shine')).toHaveCSS('animation-name', 'none');
  await expect(page.getByTestId('skeleton-loaded')).toHaveCSS('animation-name', 'none');
}

test('Skeleton respects reduced motion', verifiesReducedMotion);
