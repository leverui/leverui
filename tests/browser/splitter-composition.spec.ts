import { expect, test, type Page } from '@playwright/test';

/** Verify native composition, inherited defaults, parts, and CSS override. */
async function verifiesComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-composition--parts');
  const root = page.getByTestId('splitter-composed-root');
  const trigger = page.getByTestId('splitter-composed-trigger');
  const separator = page.getByTestId('splitter-composed-separator');
  const indicator = page.getByTestId('splitter-composed-indicator');
  await expect(trigger).toHaveAttribute('role', 'separator', { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('aria-valuenow', '30');
  await expect(trigger).toHaveAttribute('aria-label', 'Resize');
  await expect(root).toHaveClass(/leverui-splitter__root/);
  await expect(trigger).toHaveClass(/leverui-splitter__resizeTrigger/);
  await expect(separator).toHaveClass(/leverui-splitter__resizeTriggerSeparator/);
  await expect(indicator).toHaveClass(/leverui-splitter__resizeTriggerIndicator/);
  await expect(trigger).toHaveCSS('min-width', '8px');
  await page.addStyleTag({
    content: `
      [data-testid="splitter-composed-root"] { --leverui-splitter-thumb-size: 16px; }
      [data-testid="splitter-composed-indicator"] { background: rgb(80, 20, 140); }
      [data-testid="splitter-composed-separator"] { background: rgb(20, 80, 140); }
    `,
  });
  await expect(trigger).toHaveCSS('min-width', '16px');
  await expect(indicator).toHaveCSS('background-color', 'rgb(80, 20, 140)');
  await expect(separator).toHaveCSS('background-color', 'rgb(20, 80, 140)');
  const unstyledRoot = page.getByTestId('splitter-unstyled-root');
  const unstyledTrigger = page.getByTestId('splitter-unstyled-trigger');
  await expect(unstyledRoot).toHaveAttribute('data-unstyled', '');
  await expect(unstyledTrigger).toHaveAttribute('data-unstyled', '');
  await expect(
    unstyledTrigger.locator('.leverui-splitter__resizeTriggerIndicator'),
  ).toHaveAttribute('data-unstyled', '');
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(trigger).toHaveAttribute('aria-valuenow', '31');
  await expect(page.getByTestId('splitter-composed-a')).toBeVisible();
  await unstyledTrigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(unstyledTrigger).toHaveAttribute('aria-valuenow', '51');
  const childRoot = page.getByTestId('splitter-child-root');
  const childTrigger = page.getByTestId('splitter-child-trigger');
  await expect(childRoot).toHaveAttribute('data-orientation', 'horizontal');
  await expect(childRoot).toHaveClass(/leverui-splitter__root/);
  await expect(page.getByTestId('splitter-child-root-ref')).toHaveText('DIV');
  await childRoot.evaluate(
    /** Mark the caller-owned node before keyboard resizing. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await childTrigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(childTrigger).toHaveAttribute('aria-valuenow', '41');
  await expect(childRoot).toHaveAttribute('data-original-node', 'true');
}

test('Splitter supports inherited props and native handle composition', verifiesComposition);
