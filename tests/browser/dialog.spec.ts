import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { DialogRoot as RootExport, DialogTrigger as TriggerExport } from '../../src';

type ServerExports = {
  DialogRoot: typeof RootExport;
  DialogTrigger: typeof TriggerExport;
};

const serverEntry = '../../dist/server/index.js';
const { DialogRoot, DialogTrigger } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a machine ID before comparing it with other Dialog parts. */
async function requiredAttribute(locator: Locator, name: string): Promise<string> {
  const value = await locator.getAttribute(name);
  if (!value) throw new Error(`Dialog is missing ${name}.`);
  return value;
}

/** Verify the primitive's state, modal focus, portal, IDs, and reactive recipe slots. */
async function verifiesDialogBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--contract');
  const trigger = page.getByTestId('dialog-trigger');
  const content = page.getByTestId('dialog-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('data-ref-tag', 'div');
  await expect(content).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('dialog-open-state')).toHaveText('true');
  await expect(page.getByTestId('dialog-first-input')).toBeFocused();
  const contentId = await requiredAttribute(content, 'id');
  const titleId = await requiredAttribute(content, 'aria-labelledby');
  const descriptionId = await requiredAttribute(content, 'aria-describedby');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(page.locator(`[id="${titleId}"]`)).toHaveText('Controlled dialog');
  await expect(page.locator(`[id="${descriptionId}"]`)).toHaveText('Dialog focus and portal proof');
  await expect(page.locator(`[id="${descriptionId}"]`)).toHaveAttribute('data-ref-tag', 'div');
  await expect(page.locator(`[id="${descriptionId}"]`)).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('dialog-backdrop')).toBeVisible();
  await expect(page.getByTestId('dialog-positioner')).toHaveCSS('position', 'fixed');
  await expect(content).toHaveCSS('max-width', '448px');
  await page.getByTestId('dialog-size-toggle').click();
  await expect(content).toHaveCSS('max-width', '672px');
  await expect(content).toHaveAttribute('id', contentId);

  await page.getByTestId('nested-trigger').click();
  const nested = page.getByTestId('nested-content');
  await expect(nested).toBeVisible();
  await expect(nested).toHaveAttribute('role', 'dialog');
  await expect(nested).toHaveAttribute('aria-labelledby', /.+/);
  await nested.getByRole('button', { name: 'Close nested' }).click();
  await expect(nested).toHaveCount(0);
  await expect(page.getByTestId('nested-trigger')).toBeFocused();
  await page.getByTestId('dialog-close').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('dialog-open-state')).toHaveText('false');
  await expect(page.getByTestId('dialog-changes')).toHaveText('2');

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(page.getByTestId('dialog-first-input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByTestId('uncontrolled-trigger').click();
  await expect(page.getByTestId('uncontrolled-content')).toBeVisible();
  await page.getByTestId('uncontrolled-close').click();
  await expect(page.getByTestId('uncontrolled-content')).toHaveCount(0);
  await expect(page.getByTestId('uncontrolled-trigger')).toBeFocused();
}

/** Render a published closed Dialog with a styled primitive trigger. */
function renderServerDialog(): JSX.Element {
  return createComponent(DialogRoot, {
    /** Create the trigger beneath the primitive's Dialog context. */
    get children() {
      return createComponent(DialogTrigger, { children: 'Open server dialog' });
    },
  });
}

/** Verify the published server entry emits stable closed-state markup and CSS. */
function verifiesPublishedDialog(): void {
  const markup = renderToString(renderServerDialog);
  expect(markup).toContain('Open server dialog');
  expect(markup).toContain('lui-dialog__trigger');
  expect(markup).not.toContain('aria-controls=');
  expect(defaultCss).toContain('--lui-');
}

test(
  'Dialog composes the primitive focus, portals, nested state, and recipe slots',
  verifiesDialogBrowserContract,
);
test('published Dialog renders a styled lazy trigger on the server', verifiesPublishedDialog);
