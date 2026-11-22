import { expect, test, type Page } from '@playwright/test';

/** Verify vertical direction, reverse animation, speed, and loop callbacks. */
async function verifiesVerticalMotion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-motion--vertical');
  const root = page.getByTestId('marquee-vertical-root');
  const content = page.getByTestId('marquee-vertical-content').first();
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  const loopCount = await root.evaluate(
    /** Read the public loop count after recipe and machine styles merge. */
    (element) => getComputedStyle(element).getPropertyValue('--leverui-marquee-loop-count').trim(),
  );
  expect(loopCount).toBe('3');
  await expect(page.getByTestId('marquee-vertical-viewport')).toHaveAttribute(
    'data-side',
    'bottom',
  );
  await expect(content).toHaveAttribute('data-reverse', '');
  await expect(page.getByTestId('marquee-top-edge')).toHaveAttribute('data-side', 'top');
  const animation = await content.evaluate(
    /** Read the active recipe animation after layout measurement. */
    (element) => ({
      name: getComputedStyle(element).animationName,
      direction: getComputedStyle(element).animationDirection,
    }),
  );
  expect(animation.name).toContain('marqueeY');
  expect(animation.direction).toBe('reverse');
  await expect(page.getByTestId('marquee-complete')).toHaveText('complete', { timeout: 10_000 });
  await expect(page.getByTestId('marquee-loop-count')).toHaveText('2');
}

test('Marquee honors vertical motion and finite-loop callbacks', verifiesVerticalMotion);

/** Verify auto-fill creates additional machine-managed, hidden copies. */
async function verifiesAutoFill({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-motion--auto-fill');
  const root = page.getByTestId('marquee-fill-root');
  const copies = page.getByTestId('marquee-fill-content');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(
      /** Wait for Zag's ResizeObserver to measure and duplicate content. */
      async () => copies.count(),
    )
    .toBeGreaterThan(2);
  await expect(copies.nth(1)).toHaveAttribute('aria-hidden', 'true');
  const initialCopies = await copies.count();
  await root.evaluate(
    /** Narrow the mounted root without replacing its machine. */
    (element) => {
      element.style.width = '120px';
    },
  );
  await expect(copies).toHaveCount(3);
  await expect(copies.nth(1)).toHaveAttribute('aria-hidden', 'true');
  await root.evaluate(
    /** Restore the original width to verify growth as well as shrinkage. */
    (element) => {
      element.style.width = '600px';
    },
  );
  await expect(copies).toHaveCount(initialCopies);
}

test('Marquee auto-fill responds to measured container space', verifiesAutoFill);

/** Verify an external machine recalculates copies after root resizing. */
async function verifiesStoreAutoFill({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-motion--store-auto-fill');
  const root = page.getByTestId('marquee-store-fill-root');
  const copies = page.getByTestId('marquee-store-fill-content');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(
      /** Wait for Zag's first measured copy count. */
      async () => copies.count(),
    )
    .toBeGreaterThan(2);
  await root.evaluate(
    /** Force a responsive width change on the same machine root. */
    (element) => {
      element.style.width = '120px';
    },
  );
  await expect(copies).toHaveCount(3);
  await expect(copies.nth(1)).toHaveAttribute('aria-hidden', 'true');
}

test('Marquee external machine updates auto-fill copies on resize', verifiesStoreAutoFill);

/** Match the recipe's motion-preference fallback. */
async function verifiesReducedMotion({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=components-marquee-motion--vertical');
  const content = page.getByTestId('marquee-vertical-content').first();
  await expect(content).toBeVisible({ timeout: 30_000 });
  const animation = await content.evaluate(
    /** Inspect the browser's resolved reduced-motion animation. */
    (element) => getComputedStyle(element).animationName,
  );
  expect(animation).toBe('none');
}

test('Marquee stops animation for reduced motion', verifiesReducedMotion);
