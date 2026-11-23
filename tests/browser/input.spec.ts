import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Field as FieldExport, Input as InputExport } from '../../src';

type ServerExports = {
  Field: typeof FieldExport;
  Input: typeof InputExport;
};

const serverEntry = '../../dist/server/index.js';
const { Field, Input } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify the primitive IDs, native input state, focus, and authored CSS styles. */
async function verifiesInputBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-input--contract');
  const controlled = page.getByTestId('controlled-input');
  const uncontrolled = page.getByRole('textbox', { name: 'Draft name' });
  const controlledTextarea = page.getByRole('textbox', { name: 'Controlled notes' });
  const uncontrolledTextarea = page.getByRole('textbox', { name: 'Draft notes' });
  await expect(controlled).toBeVisible({ timeout: 30_000 });
  await expect(controlled).toHaveAttribute('id', 'email-field');
  await expect(controlled).toHaveAttribute('data-ref-tag', 'input');
  await expect(controlled).toHaveAttribute('required', '');
  await expect(controlled).toHaveAttribute('data-field-input');
  await expect(controlled).toHaveCSS('height', '36px');
  await expect(controlled).toHaveCSS('border-top-width', '1px');
  await expect(page.getByText('Email')).toHaveAttribute('for', 'email-field');
  await expect(page.getByTestId('subtle-input')).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('flushed-input')).toHaveCSS('border-bottom-width', '1px');
  await expect(page.getByTestId('disabled-input')).toBeDisabled();
  await expect(uncontrolled).toHaveValue('draft');

  await controlled.focus();
  await expect(controlled).toBeFocused();
  await controlled.fill('new@example.com');
  await expect(controlled).toHaveValue('new@example.com');
  await expect(page.getByTestId('input-events')).toHaveText('1');
  await uncontrolled.fill('edited');
  await uncontrolledTextarea.fill('edited notes');
  await controlledTextarea.fill('changed notes');
  await page.getByTestId('input-toggle').click();
  await expect(controlled).toHaveCSS('height', '44px');
  await expect(controlled).toHaveAttribute('aria-invalid', 'true');
  await expect(controlled).toHaveAttribute('data-invalid', '');
  await expect(controlled).toHaveAttribute('aria-describedby', /error-text/);
  await expect(uncontrolled).toHaveCSS('height', '44px');
  await expect(uncontrolled).toHaveValue('edited');
  await expect(uncontrolled).toHaveJSProperty('defaultValue', 'draft');
  await expect(controlled).toHaveJSProperty('defaultValue', 'new@example.com');
  await expect(uncontrolledTextarea).toHaveJSProperty('defaultValue', 'notes draft');
  await expect(controlledTextarea).toHaveJSProperty('defaultValue', 'changed notes');
  await page.getByTestId('input-reset').click();
  await expect(uncontrolled).toHaveValue('draft');
  await expect(controlled).toHaveValue('new@example.com');
  await expect(uncontrolledTextarea).toHaveValue('notes draft');
  await expect(controlledTextarea).toHaveValue('changed notes');
}

/** Render a styled Input in a Field through the published server entry. */
function renderServerInput(): JSX.Element {
  return createComponent(Field.Root, {
    id: 'server-email',
    required: true,
    /** Provide the Input after the field context is established. */
    get children() {
      return createComponent(Input, {
        id: 'server-input',
        size: 'lg' as const,
        variant: 'outline' as const,
        defaultValue: 'initial',
        'aria-label': 'Server email',
      });
    },
  });
}

/** Verify server attributes and default CSS without a client render. */
async function verifiesServerInput({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerInput);
  expect(markup).toContain('id="server-input"');
  expect(markup).toContain('value="initial"');
  expect(markup).toContain('aria-label="Server email"');
  expect(markup).not.toMatch(/<style[^>]*>[^<]+<\/style>/);
  expect(markup).not.toMatch(/<input[^>]*\s(?:variant|size|defaultValue)=/);
  const openingTag = markup.match(/<input\b[^>]*>/)?.[0];
  expect(openingTag).toBeDefined();
  expect(openingTag?.match(/\svalue=/g)).toHaveLength(1);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const input = page.locator('#server-input');
  await expect(input).toHaveCSS('height', '44px');
  await expect(input).toHaveCSS('border-top-width', '1px');
  await expect(input).toHaveAttribute('required', '');
}

/** Verify a selected textarea serializes its default as text content. */
function verifiesServerTextarea(): void {
  const markup = renderToString(
    /** Render the selected control through the published server entry. */
    () => createComponent(Input, { as: 'textarea' as const, defaultValue: 'notes draft' }),
  );
  expect(markup).toMatch(/<textarea\b[^>]*>notes draft<\/textarea>/);
  expect(markup.match(/<textarea\b[^>]*>/)?.[0]).not.toMatch(/\svalue=/);
}

test(
  'Input composes native and primitive Field behavior in the browser',
  verifiesInputBrowserContract,
);
test('published Input renders a styled primitive field on the server', verifiesServerInput);
test('published Input serializes textarea defaults as native content', verifiesServerTextarea);

/** Follow authored responsive styles and ordinary consumer CSS overrides. */
async function verifiesInputCssContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=components-input--contract');
  const input = page.getByTestId('responsive-input');
  const plain = page.getByTestId('unstyled-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveCSS('height', '36px');
  await expect(input).toHaveCSS('padding-left', '10px');
  await expect(input).toHaveCSS('border-top-color', /rgb\(/);
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(input).toHaveCSS('height', '44px');
  await expect(input).toHaveCSS('padding-left', '16px');
  await expect(input).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  await expect(plain).toHaveAttribute('data-unstyled', '');
  await expect(plain).toHaveClass(/lui-input/);
  const focusColor = page.getByTestId('custom-focus-input');
  const errorColor = page.getByTestId('custom-error-input');
  await expect(focusColor).toHaveCSS('--lui-private-input-focus-color', 'lime');
  await expect(errorColor).toHaveCSS('border-top-color', 'rgb(0, 128, 0)');
  await page.addStyleTag({ content: '.lui-input { border-radius: 9px; }' });
  await expect(input).toHaveCSS('border-top-left-radius', '9px');
}

test('Input follows responsive authored CSS and consumer overrides', verifiesInputCssContract);
