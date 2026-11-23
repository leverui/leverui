import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type {
  Spinner as SpinnerExport,
  SpinnerPropsProvider as SpinnerPropsProviderExport,
} from '../../src';

type ServerExports = {
  Spinner: typeof SpinnerExport;
  SpinnerPropsProvider: typeof SpinnerPropsProviderExport;
};

const serverEntry = '../../dist/server/index.js';
const { Spinner, SpinnerPropsProvider } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify authored sizes, native props, child rendering, and reactive defaults. */
async function verifiesSpinnerBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=components-spinner--contract');
  const defaultSpinner = page.getByTestId('default-spinner');
  const reactive = page.getByTestId('reactive-spinner');
  const inherited = page.getByTestId('inherited-spinner');
  const fixed = page.getByTestId('fixed-spinner');
  await expect(defaultSpinner).toBeVisible({ timeout: 30_000 });
  await expect(defaultSpinner).toHaveAttribute('data-ref-tag', 'span');
  await expect(defaultSpinner).not.toHaveAttribute('role');
  await expect(defaultSpinner).not.toHaveAttribute('aria-label');
  await expect(defaultSpinner).toHaveCSS('width', '20px');
  await expect(reactive).toHaveCSS('width', '16px');
  await expect(page.getByTestId('responsive-spinner')).toHaveCSS('width', '16px');
  await expect(inherited).toHaveCSS('width', '12px');
  await expect(fixed).toHaveCSS('width', '16px');
  await expect(fixed).toHaveClass(/spinner-inherited-blue/);
  await expect(fixed).toHaveClass(/fixed-spinner/);
  await expect(page.getByTestId('track-spinner')).toHaveCSS(
    'border-bottom-color',
    'rgb(171, 205, 239)',
  );
  await expect(page.getByTestId('speed-spinner')).toHaveCSS('animation-duration', '0.8s');
  await expect(page.getByTestId('thick-spinner')).toHaveCSS('border-top-width', '4px');
  await expect(page.getByTestId('custom-indicator')).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('div-spinner')).toHaveAttribute('data-ref-tag', 'div');
  await expect(page.getByTestId('custom-ring-spinner')).toHaveCSS('border-top-width', '5px');
  await expect(page.getByTestId('unstyled-spinner')).toHaveCSS('border-top-width', '0px');
  await expect(page.getByRole('status', { name: 'Fetching results' })).toBeVisible();
  await expect(
    page.locator('[data-testid="spinner-contract"] .lui-spinner[data-lui-private-style-runtime]'),
  ).toHaveCount(0);

  await page.getByTestId('spinner-toggle').click();
  await expect(reactive).toHaveCSS('width', '40px');
  await expect(inherited).toHaveCSS('width', '32px');
  await expect(fixed).toHaveCSS('width', '16px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('responsive-spinner')).toHaveCSS('width', '40px');
}

/** Render a provider-inherited Spinner through the published server entry. */
function renderServerSpinner(): JSX.Element {
  return createComponent(SpinnerPropsProvider, {
    value: { size: 'lg' },
    /** Preserve native attributes under server defaults. */
    get children() {
      return createComponent(Spinner, {
        id: 'server-spinner',
        class: 'consumer-spinner',
        role: 'status' as const,
        'aria-label': 'Server work',
      });
    },
  });
}

/** Verify the published stylesheet styles server markup without a client render. */
async function verifiesServerSpinner({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerSpinner);
  expect(markup).toContain('id="server-spinner"');
  expect(markup).toContain('data-size="lg"');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  expect(markup).not.toMatch(/<span[^>]*\ssize=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-spinner { --lui-spinner-track-color: rgb(10, 20, 30); animation-duration: 0.8s; }</style>${markup}`,
  );
  const spinner = page.locator('#server-spinner');
  await expect(spinner).toHaveCSS('width', '32px');
  await expect(spinner).toHaveCSS('height', '32px');
  await expect(spinner).toHaveCSS('border-top-width', '2px');
  await expect(spinner).toHaveCSS('border-bottom-color', 'rgb(10, 20, 30)');
  await expect(spinner).toHaveCSS('animation-duration', '0.8s');
  await expect(spinner).toHaveAttribute('role', 'status');
}

test('Spinner browser contract', verifiesSpinnerBrowserContract);
test('published Spinner server rendering', verifiesServerSpinner);
