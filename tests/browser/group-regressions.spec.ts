import { expect, test, type Page } from '@playwright/test';

/** Verify focus elevation applies only to eligible children in a real browser. */
async function verifiesFocusSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--contract');
  const first = page.getByTestId('focus-first');
  const skipped = page.getByTestId('focus-skipped');
  const only = page.getByTestId('focus-only');
  await expect(first).toHaveAttribute('data-leverui-group-item', '');
  await expect(skipped).not.toHaveAttribute('data-leverui-group-item');
  await expect(only).not.toHaveAttribute('data-leverui-group-item');

  await page.keyboard.press('Tab');
  await first.focus();
  await expect(first).toHaveCSS('z-index', '1');
  await skipped.focus();
  await expect(skipped).toHaveCSS('z-index', 'auto');
  await only.focus();
  await expect(only).toHaveCSS('z-index', 'auto');
}

/** Verify SVG indexing and live skip changes preserve the mounted child. */
async function verifiesSvgAndReactiveSkip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--contract');
  const svgFirst = page.getByTestId('svg-first');
  const svgLast = page.getByTestId('svg-last');
  await expect(svgFirst).toHaveAttribute('data-leverui-group-first', '');
  await expect(svgLast).toHaveAttribute('data-leverui-group-last', '');
  await expect(svgFirst).toHaveCSS('--lui-group-count', '2');
  await expect(svgLast).toHaveCSS('--lui-group-index', '1');

  const separator = page.getByTestId('reactive-separator');
  const last = page.getByTestId('reactive-skip-last');
  await expect(separator).toHaveAttribute('data-leverui-group-item', '');
  await expect(last).toHaveCSS('--lui-group-index', '2');
  await separator.evaluate(
    /** Mark the original node before the Solid signal changes its attribute. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('toggle-separator').click();
  await expect(separator).toHaveAttribute('data-separator', 'yes');
  await expect(separator).toHaveAttribute('data-leverui-group-auto-skip', '');
  await expect(separator).not.toHaveAttribute('data-leverui-group-item');
  await expect(separator).toHaveAttribute('data-original-node', 'true');
  await expect(last).toHaveCSS('--lui-group-index', '1');

  await page.getByTestId('toggle-separator').click();
  await expect(separator).toHaveAttribute('data-leverui-group-item', '');
  await expect(last).toHaveCSS('--lui-group-index', '2');
}

test('Group focuses only eligible items', verifiesFocusSelection);
test('Group indexes SVG and reindexes changed skip attributes', verifiesSvgAndReactiveSkip);

/** Verify MathML children receive the same indexing and skip handling. */
async function verifiesMathChildren({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--contract');
  const first = page.getByTestId('math-first');
  const skipped = page.getByTestId('math-skipped');
  const last = page.getByTestId('math-last');
  await expect(first).toHaveAttribute('data-leverui-group-first', '');
  await expect(first).toHaveCSS('--lui-group-count', '2');
  await expect(skipped).toHaveAttribute('data-leverui-group-auto-skip', '');
  await expect(skipped).not.toHaveAttribute('data-leverui-group-item');
  await expect(last).toHaveCSS('--lui-group-index', '1');
}

/** Verify a new native root is observed after the polymorphic tag changes. */
async function verifiesRootRebinding({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--contract');
  const root = page.getByTestId('changing-root');
  const first = page.getByTestId('changing-first');
  const last = page.getByTestId('changing-last');
  await expect(root).toHaveJSProperty('tagName', 'DIV');
  await expect(first).toHaveCSS('--lui-group-count', '2');
  await page.getByTestId('toggle-root').click();
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(first).toHaveAttribute('data-leverui-group-first', '');
  await last.evaluate(
    /** Trigger a direct child mutation on the replacement root. */
    (element) => element.setAttribute('data-leverui-group-skip', ''),
  );
  await expect(first).not.toHaveAttribute('data-leverui-group-item');
  await last.evaluate(
    /** Restore the child after the replacement root has observed its skip marker. */
    (element) => element.removeAttribute('data-leverui-group-skip'),
  );
  await expect(first).toHaveAttribute('data-leverui-group-first', '');
  await expect(last).toHaveAttribute('data-leverui-group-last', '');
}

/** Verify moved children release old markers before a new Group indexes them. */
async function verifiesMovedChildCleanup({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--contract');
  const child = page.getByTestId('move-child');
  await expect(child).toHaveAttribute('data-leverui-group-item', '');
  await page.evaluate(
    /** Move the native child outside the first Group. */
    () => {
      const child = document.querySelector('[data-testid="move-child"]');
      const outside = document.querySelector('[data-testid="move-outside"]');
      if (!child || !outside) throw new Error('Move fixture is missing.');
      outside.append(child);
    },
  );
  await expect(child).not.toHaveAttribute('data-leverui-group-item');
  await expect
    .poll(
      /** Read the child's inline value after the source observer has cleaned up. */
      () =>
        child.evaluate(
          /** Read the generated count without inheriting a parent value. */
          (element) => (element as HTMLElement).style.getPropertyValue('--lui-group-count'),
        ),
    )
    .toBe('');
  await page.evaluate(
    /** Move the same native child into a second Group. */
    () => {
      const child = document.querySelector('[data-testid="move-child"]');
      const target = document.querySelector('[data-testid="move-target"]');
      if (!child || !target) throw new Error('Move fixture is missing.');
      target.append(child);
    },
  );
  await expect(child).toHaveAttribute('data-leverui-group-last', '');
  await expect(child).toHaveCSS('--lui-group-count', '2');
  await expect(child).toHaveCSS('--lui-group-index', '1');
}

/** Verify grouped Buttons keep their full label when the Group is too narrow for them. */
async function verifiesButtonsKeepTheirWidth({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-group-regressions--narrow-buttons');
  const group = page.getByTestId('narrow-group');
  await expect(group).toHaveCSS('width', '200px');
  const buttons = group.getByRole('button');
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    await expect(button).toHaveCSS('flex-shrink', '0');
    const clipped = await button.evaluate(
      /** Compare the label's natural width with the room the Button gives it. */
      (element) => element.scrollWidth > element.clientWidth,
    );
    expect(clipped).toBe(false);
  }
}

test('Group indexes MathML children', verifiesMathChildren);
test('Group rebinds after changing its native root', verifiesRootRebinding);
test('Group releases a child before another Group indexes it', verifiesMovedChildCleanup);
test('Grouped Buttons keep their label when the Group is narrow', verifiesButtonsKeepTheirWidth);
