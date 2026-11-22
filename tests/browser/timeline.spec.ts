import { expect, test, type Page } from '@playwright/test';

/** Verify list semantics, native parts, classes, refs, and event content. */
async function verifiesTimelineParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-timeline--contract');
  const root = page.getByTestId('timeline-root');
  const first = page.getByTestId('timeline-first-item');
  const indicator = page.getByTestId('timeline-first-indicator');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveAttribute('role', 'list');
  await expect(root).toHaveAttribute('data-timeline-ref', 'div');
  await expect(root).not.toHaveAttribute('size');
  await expect(root).not.toHaveAttribute('showLastSeparator');
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'solid');
  await expect(root).toHaveAttribute('data-show-last-separator', 'false');
  await expect(root).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(first).toHaveAttribute('role', 'listitem');
  await expect(first).toHaveCSS('display', 'flex');
  await expect(indicator).toHaveCSS('width', '16px');
  await expect(page.getByTestId('timeline-first-title')).toHaveText('Order placed');
  await expect(page.getByTestId('timeline-description')).toHaveText('Yesterday');
  const action = page.getByTestId('timeline-action');
  await action.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('timeline-actions')).toHaveText('1');
}

test('Timeline renders list parts and preserves nested native interactions', verifiesTimelineParts);

/** Verify provider-driven size and the final separator on existing nodes. */
async function verifiesReactiveTimeline({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-timeline--contract');
  const root = page.getByTestId('timeline-root');
  const indicator = page.getByTestId('timeline-first-indicator');
  const title = page.getByTestId('timeline-first-title');
  const probe = page.getByTestId('timeline-style-probe');
  const lastSeparator = page.getByTestId('timeline-last-separator');
  await expect(indicator).toHaveCSS('width', '16px');
  await expect(title).toHaveCSS('font-size', '12px');
  await expect(lastSeparator).toHaveCSS('display', 'none');
  await root.evaluate(
    /** Mark the original root before inherited variants change. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('timeline-size-toggle').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(indicator).toHaveCSS('width', '32px');
  await expect(title).toHaveCSS('font-size', '14px');
  await expect(probe).toHaveCSS('font-size', '14px');
  await page.getByTestId('timeline-line-toggle').click();
  await expect(lastSeparator).not.toHaveCSS('display', 'none');
}

test(
  'Timeline provider updates size and final separator without remounting',
  verifiesReactiveTimeline,
);

/** Verify responsive size and each variant's marker styling. */
async function verifiesResponsiveVariants({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=content-timeline--contract');
  const responsive = page.getByTestId('timeline-responsive-indicator');
  const treatment = page.getByTestId('timeline-responsive-treatment');
  const treatmentIndicator = page.getByTestId('timeline-responsive-treatment-indicator');
  const lastLine = page.getByTestId('timeline-responsive-last-separator');
  await expect(responsive).toHaveCSS('width', '16px');
  await expect(treatment).toHaveAttribute('data-variant-md', 'outline');
  await expect(treatment).toHaveAttribute('data-show-last-separator-md', 'true');
  await expect(treatmentIndicator).toHaveCSS('border-top-width', '0px');
  await expect(lastLine).toHaveCSS('display', 'none');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('width', '32px');
  await expect(treatmentIndicator).toHaveCSS('border-top-width', '1px');
  await expect(lastLine).not.toHaveCSS('display', 'none');

  const subtle = page.getByTestId('timeline-subtle').locator('.leverui-timeline__indicator');
  const solid = page.getByTestId('timeline-solid').locator('.leverui-timeline__indicator');
  const outline = page.getByTestId('timeline-outline').locator('.leverui-timeline__indicator');
  const plain = page.getByTestId('timeline-plain').locator('.leverui-timeline__indicator');
  await expect(subtle).toHaveCSS('width', '16px');
  await expect(solid).toHaveCSS('width', '20px');
  await expect(outline).toHaveCSS('width', '24px');
  await expect(plain).toHaveCSS('width', '32px');
  await expect(outline).toHaveCSS('border-top-width', '1px');
  await expect(plain).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

test('Timeline supports responsive sizes and marker variants', verifiesResponsiveVariants);

/** Verify public variables and classes accept consumer CSS overrides. */
async function verifiesConsumerCssHooks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-timeline--contract');
  const root = page.getByTestId('timeline-root');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveClass(/consumer-timeline/);
  await page.addStyleTag({
    content: `
      .consumer-timeline {
        --leverui-timeline-indicator-size: 40px;
        --leverui-timeline-line-color: rgb(200 10 20);
      }
      .consumer-timeline .leverui-timeline__title { font-size: 18px; }
    `,
  });
  await expect(page.getByTestId('timeline-first-indicator')).toHaveCSS('width', '40px');
  await expect(page.getByTestId('timeline-first-separator')).toHaveCSS(
    'border-inline-start-color',
    'rgb(200, 10, 20)',
  );
  await expect(page.getByTestId('timeline-first-title')).toHaveCSS('font-size', '18px');
}

test('Timeline accepts consumer CSS through variables and part classes', verifiesConsumerCssHooks);

/** Verify content can appear before and on alternating sides of a marker. */
async function verifiesFlexibleComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-timeline--contract');
  const before = page.getByTestId('timeline-content-before').locator('[role="listitem"]');
  const alternating = page.getByTestId('timeline-alternating').locator('[role="listitem"]');
  await expect(before.locator('.leverui-timeline__content').first()).toContainText('2026');
  await expect(before.locator('.leverui-timeline__connector')).toHaveCount(1);
  await expect(before.locator('.leverui-timeline__content').last()).toContainText('First event');
  await expect(alternating).toHaveCount(2);
  await expect(alternating.nth(0).locator('.leverui-timeline__content').last()).toContainText(
    'First event',
  );
  await expect(alternating.nth(1).locator('.leverui-timeline__content').first()).toContainText(
    'Second event',
  );
}

test(
  'Timeline composes content before and alternates around the indicator',
  verifiesFlexibleComposition,
);

/** Verify an Avatar fills a Timeline indicator without changing list semantics. */
async function verifiesAvatarComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-timeline--contract');
  const marker = page.getByTestId('timeline-avatar-indicator');
  const avatar = marker.locator('[data-avatar-root]');
  await expect(marker).toHaveCSS('width', '24px');
  await expect(avatar).toBeVisible();
  await expect(avatar).toHaveCSS('width', '24px');
  await expect(page.getByTestId('timeline-avatar-root')).toHaveAttribute('role', 'list');
}

test('Timeline composes a full-sized Avatar in its indicator', verifiesAvatarComposition);
