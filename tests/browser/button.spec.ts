import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Button as ButtonExport } from '../../src';

type ServerExports = {
  Button: typeof ButtonExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one server Button through the published package entry. */
function renderServerButton(): JSX.Element {
  return createComponent(Button, {
    id: 'server-button',
    variant: 'outline' as const,
    size: 'lg' as const,
    colorPalette: 'blue' as const,
    class: 'consumer-button',
    'aria-label': 'Server action',
    children: 'Server action',
  });
}

/** Verify native behavior, accessible names, and reactive recipe states. */
async function verifiesButtonBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-button--contract');
  const button = page.getByTestId('default-button');
  const loading = page.getByTestId('loading-button');
  await expect(button).toBeVisible({ timeout: 30_000 });
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('data-ref-tag', 'button');
  await expect(button).toHaveCSS('height', '36px');
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('button-activations')).toHaveText('2');
  await expect(page.getByTestId('disabled-button')).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Linked action' })).toHaveAttribute(
    'href',
    '#button-target',
  );
  const disabledLink = page.getByRole('link', { name: 'Disabled link' });
  await expect(disabledLink).toHaveAttribute('data-disabled', '');
  await disabledLink.click();
  await expect(page).not.toHaveURL(/#button-target$/);
  const customLoading = page.getByTestId('custom-spinner-button');
  await expect(page.getByTestId('start-spinner-button')).toHaveText('●Starting');
  await expect(customLoading).toBeDisabled();
  await expect(customLoading.locator('[data-testid="custom-spinner"]')).toHaveText('●');
  await expect(customLoading).toHaveText('Sending●');
  await expect(page.getByTestId('css-button')).toHaveCSS('letter-spacing', '1.6px');
  await expect(page.getByTestId('css-button')).not.toHaveAttribute(
    'data-lui-private-style-runtime',
  );
  await expect(page.getByTestId('grow-group')).toHaveCSS('display', 'flex');
  await expect(page.getByRole('button', { name: 'Open settings' })).toHaveCSS(
    'padding-left',
    '0px',
  );
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  const attachedGroup = page.getByTestId('button-group');
  const firstGroupButton = attachedGroup.getByRole('button', { name: 'First', exact: true });
  const lastGroupButton = attachedGroup.getByRole('button', { name: 'Last', exact: true });
  await expect(attachedGroup).toHaveCSS('gap', '0px');
  await expect(attachedGroup).toHaveAttribute('data-ref-tag', 'div');
  await expect(firstGroupButton).toHaveAttribute('data-lui-group-first', '');
  await expect(lastGroupButton).toHaveAttribute('data-lui-group-last', '');
  await expect(firstGroupButton).toHaveCSS('z-index', '0');
  await expect(lastGroupButton).toHaveCSS('z-index', '1');
  await expect(page.getByRole('button', { name: 'Only' })).toHaveCSS(
    'border-start-start-radius',
    '4px',
  );
  await expect(page.getByRole('button', { name: 'Keep' })).toHaveCSS(
    'border-start-end-radius',
    '4px',
  );
  await expect(page.getByTestId('vertical-group')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByRole('button', { name: 'Top' })).toHaveCSS('z-index', '2');
  await expect(page.getByRole('button', { name: 'Bottom' })).toHaveCSS('z-index', '1');
  await expect(page.getByRole('button', { name: 'Top' })).toHaveCSS(
    'border-bottom-left-radius',
    '0px',
  );
  await expect(page.getByRole('button', { name: 'Bottom' })).toHaveCSS(
    'border-top-left-radius',
    '0px',
  );

  await page.getByTestId('button-toggle').click();
  await expect(button).toHaveCSS('height', '44px');
  await expect(loading).toBeDisabled();
  await expect(loading).not.toHaveAttribute('aria-busy');
  await expect(loading).toHaveAttribute('data-loading', '');
  await expect(page.getByRole('button', { name: 'Saving' })).toBeVisible();
}

/** Verify published server markup and stylesheet style a Button independently. */
async function verifiesServerButton({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerButton);
  expect(markup).toContain('id="server-button"');
  expect(markup).toContain('aria-label="Server action"');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('data-variant="outline"');
  expect(markup).toContain('data-lui-color-palette="blue"');
  expect(markup).toContain('lui-button');
  expect(markup).not.toMatch(/<style[^>]*>[^<]+<\/style>/);
  expect(markup).not.toMatch(/<button[^>]*\s(?:variant|size)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const button = page.locator('#server-button');
  await expect(button).toHaveCSS('height', '44px');
  await expect(button).toHaveCSS('border-width', '1px');
  await page.addStyleTag({
    content: '.consumer-button { --lui-colors-blue-border: rgb(30, 50, 70); }',
  });
  await expect(button).toHaveCSS('border-color', 'rgb(30, 50, 70)');
  await page.addStyleTag({ content: '.consumer-button { background-color: rgb(30, 50, 70); }' });
  await expect(button).toHaveCSS('background-color', 'rgb(30, 50, 70)');
}

/** Keep native inline styles and unstyled semantics without a styling provider. */
async function verifiesNativeStyleContract({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render native styling through the published server entry. */
    () =>
      createComponent(Button, {
        id: 'native-style-button',
        class: 'consumer-native-button',
        style: { 'background-color': 'rgb(34, 197, 94)' },
        unstyled: true,
        children: 'Native action',
      }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const button = page.getByRole('button', { name: 'Native action' });
  await expect(button).toHaveClass(/lui-button/);
  await expect(button).toHaveClass(/consumer-native-button/);
  await expect(button).toHaveAttribute('data-unstyled', '');
  await expect(button).toHaveCSS('background-color', 'rgb(34, 197, 94)');
  await expect(button).not.toHaveAttribute('data-lui-private-style-runtime');
}

test('Button family browser contract', verifiesButtonBrowserContract);
test('published Button server rendering', verifiesServerButton);
test('Button keeps native style and unstyled semantics', verifiesNativeStyleContract);
