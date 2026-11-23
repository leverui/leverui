import { expect, test, type Page } from '@playwright/test';

/** Verify semantic parts, close defaults, accessible naming, and refs. */
async function verifiesTagParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-tag--contract');
  const root = page.getByTestId('tag-parts-root');
  const close = page.getByTestId('tag-close');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'surface');
  await expect(root).toHaveAttribute('data-lui-color-palette', 'blue');
  await expect(root).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(root).not.toHaveAttribute('size');
  await expect(root).not.toHaveAttribute('variant');
  await expect(root).toHaveCSS('display', 'inline-flex');
  await expect(page.getByTestId('tag-start')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('tag-label')).toHaveCSS('-webkit-line-clamp', '1');
  await expect(page.getByTestId('tag-end')).toHaveJSProperty('tagName', 'SPAN');
  await expect(close).toHaveJSProperty('tagName', 'BUTTON');
  await expect(close).toHaveAttribute('type', 'button');
  await expect(close).toHaveAttribute('aria-label', 'Close');
  await expect(close.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  await close.click();
  await expect(page.getByTestId('tag-closes')).toHaveText('1');
  await close.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('tag-closes')).toHaveText('2');
  await close.evaluate(
    /** Apply the public focus-visible state to check authored focus styling. */
    (element) => element.setAttribute('data-focus-visible', ''),
  );
  await expect(close).toHaveCSS('outline-width', '2px');
  await page.addStyleTag({
    content: '.lui-tag__root { gap: 13px; } .lui-tag__label { color: rgb(102, 51, 153); }',
  });
  await expect(root).toHaveCSS('gap', '13px');
  await expect(page.getByTestId('tag-label')).toHaveCSS('color', 'rgb(102, 51, 153)');
  await root.evaluate(
    /** Compose a consumer label through the public part class. */
    (element) => {
      const label = document.createElement('span');
      label.className = 'lui-tag__label';
      label.dataset.testid = 'tag-consumer-label';
      label.textContent = 'Custom';
      element.append(label);
    },
  );
  await expect(page.getByTestId('tag-consumer-label')).toHaveCSS('color', 'rgb(102, 51, 153)');
  await page.getByTestId('tag-label').evaluate(
    /** Suppress the authored clamp on this one public part. */
    (element) => element.setAttribute('data-unstyled', ''),
  );
  await expect(page.getByTestId('tag-label')).toHaveCSS('overflow', 'visible');
}

test('Tag renders native parts and a keyboard-operable close control', verifiesTagParts);

/** Verify inherited size and hook styles update without remounting nodes. */
async function verifiesReactiveTag({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-tag--contract');
  const root = page.getByTestId('tag-parts-root');
  const label = page.getByTestId('tag-label');
  const probe = page.getByTestId('tag-style-probe');
  await expect(root).toHaveCSS('padding-left', '6px');
  await expect(label).toHaveCSS('font-size', '12px');
  await root.evaluate(
    /** Mark the original root before the provider changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('tag-size-toggle').click();
  await expect(root).toHaveAttribute('data-size', 'xl');
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(root).toHaveCSS('padding-left', '10px');
  await expect(label).toHaveCSS('font-size', '14px');
  await expect(probe).toHaveCSS('font-size', '14px');
}

test('Tag provider updates size on the same native parts', verifiesReactiveTag);

/** Verify responsive sizing and consumer-owned button composition. */
async function verifiesResponsiveAndChild({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=content-tag--contract');
  const responsive = page.getByTestId('tag-responsive-root');
  const responsiveVariant = page.getByTestId('tag-responsive-variant');
  await expect(responsive).toHaveAttribute('data-size', 'sm');
  await expect(responsive).toHaveAttribute('data-size-md', 'xl');
  await expect(responsiveVariant).toHaveAttribute('data-variant', 'subtle');
  await expect(responsiveVariant).toHaveAttribute('data-variant-md', 'solid');
  const initialVariantColor = await responsiveVariant.evaluate(
    /** Capture the smaller viewport's subtle background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(responsive).toHaveCSS('padding-left', '6px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('padding-left', '10px');
  await expect(responsiveVariant).not.toHaveCSS('background-color', initialVariantColor);
  await expect(responsiveVariant).toHaveCSS(
    'background-color',
    await page.getByTestId('tag-solid').evaluate(
      /** Read the static solid blue treatment for comparison. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );

  const action = page.getByTestId('tag-as-button');
  await expect(action).toHaveJSProperty('tagName', 'BUTTON');
  await expect(action).toHaveAttribute('type', 'button');
  await action.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('tag-actions')).toHaveText('1');
}

test(
  'Tag supports responsive size and keyboard-operable child rendering',
  verifiesResponsiveAndChild,
);

/** Verify that a constrained label truncates while its close button remains visible. */
async function verifiesOverflow({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-tag--contract');
  const root = page.getByTestId('tag-overflow-root');
  const label = page.getByTestId('tag-overflow-label');
  const close = page.getByTestId('tag-overflow-close');
  await expect(root).toHaveCSS('max-width', '130px');
  await expect(label).toHaveCSS('-webkit-line-clamp', '1');
  await expect(label).toHaveCSS('overflow', 'hidden');
  const layout = await label.evaluate(
    /** Detect clipped content rather than a declared clamp on text that fits. */
    (element) => ({
      clipped:
        element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth,
      height: element.getBoundingClientRect().height,
    }),
  );
  expect(layout.clipped).toBe(true);
  expect(layout.height).toBeLessThan(24);
  await expect(close).toBeVisible();
  const [rootBounds, closeBounds] = await Promise.all([root.boundingBox(), close.boundingBox()]);
  if (!rootBounds || !closeBounds) throw new Error('Tag overflow parts have no visible bounds.');
  expect(closeBounds.x + closeBounds.width).toBeLessThanOrEqual(rootBounds.x + rootBounds.width);
}

test('Tag truncates constrained text beside its close button', verifiesOverflow);

/** Verify the avatar-specific Tag slot selector at two recipe sizes. */
async function verifiesAvatarSpacing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-tag--contract');
  const small = page.getByTestId('tag-avatar-small-start');
  const large = page.getByTestId('tag-avatar-xl-start');
  const smallAvatar = small.locator('[data-avatar-root]');
  const largeAvatar = large.locator('[data-avatar-root]');
  await expect(smallAvatar).toBeVisible();
  await expect(largeAvatar).toBeVisible();
  await expect(small).toHaveCSS('width', '12px');
  await expect(small).toHaveCSS('margin-left', '-3px');
  await expect(large).toHaveCSS('width', '24px');
  await expect(large).toHaveCSS('margin-left', '-6px');
  await expect(smallAvatar).toHaveCSS('width', '12px');
  await expect(largeAvatar).toHaveCSS('width', '24px');
}

test('Tag sizes and offsets full-sized avatars', verifiesAvatarSpacing);
