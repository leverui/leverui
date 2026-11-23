import { expect, test, type Page } from '@playwright/test';

/** Verify caller-owned Dialog state and styled layout slots in Chromium. */
async function verifiesDialogFamily({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog-family--contract');
  const trigger = page.getByTestId('dialog-family-trigger');
  const content = page.getByTestId('dialog-family-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('dialog-family-state')).toHaveText('false');

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('dialog-family-action')).toHaveClass(/lui-dialog__actionTrigger/);
  // The prevented action is a Lever-owned button, not a primitive dialog part.
  await expect(page.getByTestId('dialog-family-prevented-action')).not.toHaveAttribute(
    'data-dialog-close-trigger',
  );
  const beforePrevented = Number(await page.getByTestId('dialog-bubbles').textContent());
  await page.getByTestId('dialog-family-prevented-action').click();
  await expect(page.getByTestId('dialog-prevented-action')).toHaveText('true');
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-bubbles')).toHaveText(String(beforePrevented + 1));

  await trigger.click();
  await expect(content).toBeVisible();
  const beforeChild = Number(await page.getByTestId('dialog-bubbles').textContent());
  await page.getByTestId('dialog-family-child-action').click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-bubbles')).toHaveText(String(beforeChild + 1));
  await expect(page.getByTestId('dialog-family-actions')).toHaveText('1');

  await page.getByTestId('dialog-external-open').click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(page.getByTestId('dialog-family-state')).toHaveText('true');
  await expect(page.getByRole('textbox', { name: 'Dialog family input' })).toBeFocused();
  await expect(page.getByTestId('dialog-family-header')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('dialog-family-body')).toHaveCSS('padding-top', '8px');
  await expect(page.getByTestId('dialog-family-footer')).toHaveJSProperty('tagName', 'DIV');
  await expect(content).toHaveCSS('max-width', '448px');

  await page.getByTestId('dialog-variant-toggle').click();
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(page.getByTestId('dialog-family-state')).toHaveText('true');
  await page.getByTestId('dialog-family-action').click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-family-state')).toHaveText('false');
  await expect(page.getByTestId('dialog-family-actions')).toHaveText('2');
  await expect(page.getByTestId('dialog-action-open-state')).toHaveText('true');

  await trigger.click();
  await expect(content).toBeVisible();
  await page.getByTestId('dialog-family-bound-action').click();
  await expect(page.getByTestId('dialog-bound-action')).toHaveText('bound-data:click:BUTTON:true');
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-family-state')).toHaveText('false');

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Dialog family input' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Dialog exposes root provider, context, layout, and action trigger', verifiesDialogFamily);

/** Verify the primitive attributes and refs survive caller-selected Dialog elements. */
async function verifiesDialogPolymorphism({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog-polymorphic--contract');
  const trigger = page.getByTestId('dialog-child-trigger');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toHaveAttribute('data-dialog-trigger-ref', 'attached');
  await trigger.click();
  const content = page.getByTestId('dialog-article-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('data-dialog-ref', 'attached');
  const layoutSlots = [
    ['header', 'HEADER', '12px'],
    ['body', 'SECTION', '14px'],
    ['footer', 'FOOTER', '16px'],
  ] as const;
  for (const [slot, tag, padding] of layoutSlots) {
    const layout = page.getByTestId(`dialog-layout-${slot}`);
    await expect(layout).toHaveJSProperty('tagName', tag);
    await expect(layout).toHaveAttribute('data-layout-parent-ref', 'attached');
    await expect(layout).toHaveAttribute('data-layout-child-ref', 'attached');
    await expect(layout).toHaveCSS('padding-top', padding);
  }
  await expect(page.getByTestId('dialog-layout-header')).toHaveClass(/layout-parent/);
  await expect(page.getByTestId('dialog-layout-header')).toHaveClass(/layout-child/);
  const description = page.getByTestId('dialog-child-description');
  await expect(description).toHaveJSProperty('tagName', 'SPAN');
  const descriptionId = await description.getAttribute('id');
  if (!descriptionId) throw new Error('Caller-rendered Dialog description has no ID.');
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await page.getByTestId('dialog-child-close').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  const selectedClose = page.getByTestId('dialog-selected-close');
  await expect(selectedClose).toHaveJSProperty('tagName', 'A');
  await expect(selectedClose).toHaveAttribute('data-selected-close-ref', 'attached');
  await expect(selectedClose).toHaveCSS('position', 'static');
  await expect(selectedClose).toHaveCSS('margin-left', '8px');
  await selectedClose.click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test('Dialog preserves native composition and caller refs', verifiesDialogPolymorphism);
