import { expect, test, type Locator, type Page } from '@playwright/test';

/** Require a layout rectangle before comparing grouped children. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Group layout box is absent.');
  return box;
}

/** Verify variants, child positions, native paths, and reactive changes. */
async function verifiesGroup({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-group--contract');
  const basic = page.getByTestId('group-default');
  await expect(basic).toBeVisible({ timeout: 30_000 });
  await expect(basic).toHaveCSS('display', 'inline-flex');
  await expect(basic).toHaveCSS('flex-direction', 'row');
  await expect(basic).toHaveCSS('gap', '8px');
  await expect(basic).toHaveCSS('align-items', 'center');
  await expect(basic).toHaveCSS('justify-content', 'flex-start');
  await expect(basic).toHaveClass(/lui-group/);
  const firstBox = await requiredBox(page.getByTestId('group-default-first'));
  const lastBox = await requiredBox(page.getByTestId('group-default-last'));
  expect(Math.abs(lastBox.x - firstBox.x - firstBox.width - 8)).toBeLessThan(1.5);

  const attached = page.getByTestId('group-attached');
  const first = page.getByTestId('group-attached-first');
  const middle = page.getByTestId('group-attached-middle');
  const last = page.getByTestId('group-attached-last');
  await expect(attached).toHaveCSS('gap', '0px');
  await expect(first).toHaveCSS('border-top-right-radius', '0px');
  await expect(middle).toHaveCSS('border-radius', '0px');
  await expect(last).toHaveCSS('border-top-left-radius', '0px');
  await expect(first).toHaveCSS('margin-inline-end', '-1px');
  await expect(first).toHaveAttribute('data-lui-group-first', '');
  await expect(middle).toHaveAttribute('data-lui-group-between', '');
  await expect(last).toHaveAttribute('data-lui-group-last', '');
  await expect(first).toHaveAttribute('data-lui-group-item', '');
  await expect(first).toHaveCSS('--lui-group-count', '3');
  await expect(middle).toHaveCSS('--lui-group-index', '1');

  const vertical = page.getByTestId('group-vertical');
  await expect(vertical).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('group-vertical-first')).toHaveCSS(
    'border-bottom-left-radius',
    '0px',
  );
  await expect(page.getByTestId('group-vertical-first')).toHaveCSS('margin-bottom', '-1px');
  await expect(page.getByTestId('group-vertical-last')).toHaveCSS('border-top-left-radius', '0px');
  const grow = page.getByTestId('group-grow');
  await expect(grow).toHaveCSS('display', 'flex');
  const grownFirst = await requiredBox(page.getByTestId('group-grow-first'));
  const grownLast = await requiredBox(page.getByTestId('group-grow-last'));
  expect(Math.abs(grownFirst.width - grownLast.width)).toBeLessThan(1.5);

  await expect(page.getByTestId('group-stack-first')).toHaveCSS('z-index', '2');
  await expect(page.getByTestId('group-stack-last')).toHaveCSS('z-index', '1');
  await expect(page.getByTestId('group-stack-last-first')).toHaveCSS('z-index', '0');
  await expect(page.getByTestId('group-stack-last-last')).toHaveCSS('z-index', '1');
  await expect(page.getByTestId('group-separator')).toHaveAttribute('data-lui-group-auto-skip', '');
  await expect(page.getByTestId('group-skipped-first')).toHaveCSS('--lui-group-count', '2');
  await expect(page.getByTestId('group-skipped-last')).toHaveCSS('--lui-group-index', '1');
  await expect(page.getByTestId('group-single-item')).not.toHaveAttribute('data-lui-group-item');

  const responsive = page.getByTestId('group-responsive');
  const detached = page.getByTestId('group-responsive-detach');
  const attachedLater = page.getByTestId('group-responsive-attach');
  await expect(detached).toHaveAttribute('data-joined-base', 'horizontal');
  await expect(detached).toHaveAttribute('data-joined-md', 'none');
  await expect(detached).toHaveCSS('gap', '0px');
  await expect(detached).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('group-detach-first')).toHaveCSS('margin-inline-end', '-1px');
  await expect(attachedLater).toHaveCSS('gap', '8px');
  await expect(responsive).toHaveAttribute('data-orientation-md', 'vertical');
  await expect(responsive).toHaveAttribute('data-grow-md', 'true');
  await expect(responsive).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(responsive).toHaveCSS('display', 'inline-flex');
  await expect(responsive).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('group-aliases')).toHaveCSS('align-items', 'flex-start');
  await page.addStyleTag({
    content: '@layer lui.base { [data-testid="group-radius-first"] { border-radius: 19px; } }',
  });
  await expect(page.getByTestId('group-radius-first')).toHaveCSS('border-top-right-radius', '0px');
  await expect(page.getByTestId('group-aliases')).toHaveCSS('justify-content', 'space-between');
  await expect(page.getByTestId('group-aliases')).toHaveCSS('flex-wrap', 'wrap');
  await expect(page.getByTestId('group-css-override')).toHaveCSS('gap', '7px');
  await expect(page.getByTestId('group-unstyled')).toHaveCSS('display', 'block');

  const reactive = page.getByTestId('group-reactive');
  const reactiveFirst = page.getByTestId('group-reactive-first');
  const reactiveLast = page.getByTestId('group-reactive-last');
  await expect(reactive).toHaveAttribute('data-group-ref', 'section');
  await expect(reactive).toHaveCSS('flex-direction', 'row');
  await reactiveFirst.evaluate(
    /** Mark the original native child before a variant change. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('group-toggle-orientation').click();
  await expect(reactive).toHaveCSS('flex-direction', 'column');
  await expect(reactiveFirst).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('group-toggle-skip').click();
  await expect(reactiveFirst).toHaveCSS('--lui-group-count', '2');
  await expect(reactiveLast).toHaveCSS('--lui-group-index', '1');
  await page.getByTestId('group-toggle-skip').click();
  await expect(reactiveFirst).toHaveCSS('--lui-group-count', '3');

  const link = page.getByRole('link', { name: 'Group link' });
  await expect(link).toHaveCSS('display', 'inline-flex');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#group-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('display', 'flex');
  await expect(responsive).toHaveCSS('flex-direction', 'column');
  await expect(detached).toHaveCSS('gap', '8px');
  await expect(detached).toHaveCSS('display', 'inline-flex');
  await expect(detached).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('group-detach-first')).not.toHaveCSS(
    'border-top-right-radius',
    '0px',
  );
  await expect(page.getByTestId('group-detach-first')).toHaveCSS('z-index', '2');
  await expect(page.getByTestId('group-radius-first')).toHaveCSS('border-top-right-radius', '19px');
  await expect(attachedLater).toHaveCSS('gap', '0px');
  await expect(attachedLater).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('group-attach-first')).toHaveCSS('margin-bottom', '-1px');
  await expect(page.getByTestId('group-attach-first')).toHaveCSS(
    'border-bottom-left-radius',
    '0px',
  );
  await page.addStyleTag({ content: '.lui-group[data-testid="group-default"] { gap: 13px; }' });
  await expect(basic).toHaveCSS('gap', '13px');
}

test('Group preserves layout, positioning, and native behavior', verifiesGroup);
