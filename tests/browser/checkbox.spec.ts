import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type {
  CheckboxControl as ControlExport,
  CheckboxHiddenInput as HiddenInputExport,
  CheckboxLabel as LabelExport,
  CheckboxRoot as RootExport,
} from '../../src';

type ServerExports = {
  CheckboxControl: typeof ControlExport;
  CheckboxHiddenInput: typeof HiddenInputExport;
  CheckboxLabel: typeof LabelExport;
  CheckboxRoot: typeof RootExport;
};

const serverEntry = '../../dist/server/index.js';
const { CheckboxControl, CheckboxHiddenInput, CheckboxLabel, CheckboxRoot } = (await import(
  serverEntry
)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify the primitive state, native forms, IDs, focus, and changing slot styles. */
async function verifiesCheckboxBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--contract');
  const controlled = page.getByTestId('controlled-input');
  const control = page.getByTestId('controlled-control');
  const root = page.getByTestId('controlled-root');
  await expect(controlled).toBeVisible({ timeout: 30_000 });
  await expect(controlled).toHaveAttribute('id', 'consent-field');
  await expect(controlled).toHaveAttribute('required', '');
  await expect(root).toHaveAttribute('data-ref-tag', 'label');
  await expect(root).toHaveAttribute('data-state', 'unchecked');
  await expect(control).toHaveCSS('width', '16px');
  const indicator = control.locator('.lui-checkbox__indicator');
  await expect(indicator).toHaveCSS('stroke-width', '3px');
  await expect(indicator.locator('[data-glyph="checked"]')).toHaveCSS('display', 'none');
  await expect(page.getByTestId('default-input')).toBeChecked();
  await expect(page.getByTestId('mixed-root')).toHaveAttribute('data-state', 'indeterminate');
  await expect(page.getByTestId('disabled-input')).toBeDisabled();

  await controlled.focus();
  await page.keyboard.press('Space');
  await expect(controlled).toBeFocused();
  await expect(controlled).toBeChecked();
  await expect(page.getByTestId('checkbox-changes')).toHaveText('1');
  await expect(root).toHaveAttribute('data-state', 'checked');
  await expect(control).toHaveAttribute('data-state', 'checked');
  await expect(indicator.locator('[data-glyph="checked"]')).toHaveCSS('display', 'inline');
  await expect(page.getByTestId('checkbox-state')).toHaveText('true');
  const formData = await page.getByTestId('checkbox-form').evaluate(
    /** Read actual browser form entries rather than component state. */
    (form) => Array.from(new FormData(form as HTMLFormElement).entries()),
  );
  expect(formData).toContainEqual(['consent', 'yes']);
  expect(formData).toContainEqual(['updates', 'yes']);

  await page.getByTestId('checkbox-size-toggle').click();
  await expect(control).toHaveCSS('width', '24px');
  await expect(controlled).toBeChecked();
  await expect(control).toHaveAttribute('data-state', 'checked');

  await root.getByText('Consent').click();
  await expect(controlled).not.toBeChecked();
  await expect(page.getByTestId('checkbox-changes')).toHaveText('2');
  const readonlyInput = page.getByTestId('readonly-input');
  await page.getByTestId('readonly-root').getByText('Read only').click();
  await expect(readonlyInput).not.toBeChecked();
  await expect(page.getByTestId('readonly-root')).toHaveAttribute('data-readonly', '');

  const unstyledControl = page.getByTestId('unstyled-control');
  await expect(unstyledControl).toHaveAttribute('data-unstyled', '');
  await expect(unstyledControl).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(unstyledControl).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('unstyled-label')).toHaveCSS('font-weight', '400');
  await expect(page.getByTestId('custom-control')).toHaveCSS('width', '40px');
  await expect(page.getByTestId('custom-label')).toHaveCSS('font-weight', '700');
  const childControl = page.getByTestId('child-control');
  const childLabel = page.getByTestId('child-label');
  const childInput = page.getByTestId('child-input');
  await expect(childControl).toHaveAttribute('data-parent-ref', 'true');
  await expect(childControl).toHaveAttribute('data-child-ref', 'true');
  await expect(childLabel).toHaveAttribute('data-parent-ref', 'true');
  await expect(childLabel).toHaveAttribute('data-child-ref', 'true');
  await expect(childControl).toHaveAttribute('data-state', 'checked');
  await expect(childControl).toHaveCSS('width', '32px');
  await expect(childLabel).toHaveCSS('font-weight', '700');
  await childLabel.click();
  await expect(childInput).not.toBeChecked();
  await expect(childControl).toHaveAttribute('data-state', 'unchecked');
}

/** Render a published Checkbox tree without a styling provider. */
function renderServerCheckbox(): JSX.Element {
  return createComponent(CheckboxRoot, {
    id: 'server-checkbox',
    defaultChecked: true,
    size: 'lg' as const,
    name: 'server-consent',
    value: 'yes',
    /** Create parts after the primitive's provider exists. */
    get children() {
      return [
        createComponent(CheckboxControl, {}),
        createComponent(CheckboxLabel, { children: 'Server consent' }),
        createComponent(CheckboxHiddenInput, {}),
      ];
    },
  });
}

/** Verify server markup and CSS from the published package. */
async function verifiesServerCheckbox({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerCheckbox);
  expect(markup).toContain('data-checkbox-root="server-checkbox"');
  expect(markup).toContain('name="server-consent"');
  expect(markup).toContain('data-checkbox-');
  expect(markup).toContain('data-state="checked"');
  expect(markup).not.toMatch(/<label[^>]*\s(?:variant|size|defaultChecked)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('[data-checkbox-root]')).toHaveAttribute('data-state', 'checked');
  await expect(page.locator('[data-checkbox-control]')).toHaveCSS('width', '24px');
  await expect(page.locator('.lui-checkbox__indicator [data-glyph="checked"]')).toHaveCSS(
    'display',
    'inline',
  );
  await expect(page.getByRole('checkbox', { name: 'Server consent' })).toBeChecked();
}

test(
  'Checkbox composes the primitive state and Lever UI slots in the browser',
  verifiesCheckboxBrowserContract,
);
test('published Checkbox renders form state and styles on the server', verifiesServerCheckbox);

/** Verify consumer classes win over the authored default CSS layer. */
async function verifiesConsumerCssOverrides({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--contract');
  await expect(page.getByTestId('controlled-control')).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `
      .consumer-checkbox { gap: 13px; }
      .consumer-checkbox-control { width: 29px; }
      .consumer-checkbox-label { font-weight: 800; }
      .consumer-checkbox-indicator { stroke-width: 5px; }
    `,
  });
  await expect(page.getByTestId('controlled-root')).toHaveCSS('gap', '13px');
  await expect(page.getByTestId('controlled-control')).toHaveCSS('width', '29px');
  await expect(page.locator('.consumer-checkbox-label')).toHaveCSS('font-weight', '800');
  await expect(page.locator('.consumer-checkbox-indicator')).toHaveCSS('stroke-width', '5px');
}

test(
  'consumer CSS overrides every Checkbox part without important rules',
  verifiesConsumerCssOverrides,
);

/** Verify responsive CSS selections follow media width without remounting. */
async function verifiesResponsiveCheckbox({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-checkbox--contract');
  const input = page.getByRole('checkbox', { name: 'Responsive choice' });
  const control = page.getByTestId('responsive-control');
  await expect(input).toBeChecked({ timeout: 30_000 });
  await expect(control).toHaveCSS('width', '16px');
  await expect(control).toHaveCSS('color', 'rgb(255, 255, 255)');
  await control.evaluate(
    /** Mark the original native element before crossing the breakpoint. */
    (element) => element.setAttribute('data-original-control', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(control).toHaveCSS('width', '24px');
  await expect(control).not.toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(control).toHaveAttribute('data-original-control', 'true');
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(control).toHaveCSS('width', '16px');
  await expect(control).toHaveCSS('color', 'rgb(255, 255, 255)');
}

test('Checkbox size and variant follow viewport breakpoints', verifiesResponsiveCheckbox);
