import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import type { Text as TextExport, TextPropsProvider as PropsProviderExport } from '../../src';
import { renderTextHydrationTree } from '../../.storybook/text-hydration-tree';

type ServerExports = {
  Text: typeof TextExport;
  TextPropsProvider: typeof PropsProviderExport;
};

const serverEntry = '../../dist/server/index.js';
const { Text, TextPropsProvider } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const responsiveTextCss = `
  .text-server-responsive, .text-hydration-responsive {
    font-size: var(--lui-font-sizes-sm);
  }
  @media (min-width: 48rem) {
    .text-server-responsive, .text-hydration-responsive {
      font-size: var(--lui-font-sizes-lg);
    }
  }
`;

/** Render the published server Text with typography and native semantics. */
function renderServerText(): JSX.Element {
  return createComponent(Text, {
    as: 'article' as const,
    id: 'server-text',
    class: 'text-server-responsive',
    lineClamp: 2,
    'aria-label': 'Server Text',
    children: 'Server typography',
  });
}

/** Verify typography, native refs, context overrides, and reactive changes. */
async function verifiesTextContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-text--contract');
  const paragraph = page.getByTestId('default-text');
  const span = page.getByTestId('span-text');
  const link = page.getByRole('link', { name: 'Text link' });
  await expect(paragraph).toBeVisible({ timeout: 30_000 });
  await expect(paragraph).toHaveJSProperty('tagName', 'P');
  await expect(paragraph).toHaveAttribute('data-ref-tag', 'p');
  await expect(paragraph).toHaveCSS('font-size', '14px');
  await expect(paragraph).toHaveCSS('font-weight', '700');
  await expect(paragraph).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(paragraph).toHaveCSS('letter-spacing', '0.7px');
  await expect(paragraph).toHaveClass(/provider-text/);
  await expect(paragraph).toHaveClass(/instance-text/);
  await expect(paragraph).toHaveCSS('text-decoration-line', 'underline');
  await expect(paragraph).toHaveCSS('text-transform', 'uppercase');
  await paragraph.click();
  await expect(page.getByTestId('text-events')).toHaveText('provider,instance,');
  await page.getByRole('button', { name: 'Bound text event' }).click();
  await expect(page.getByTestId('text-events')).toHaveText(
    'provider,instance,provider,instance-bound,',
  );
  await expect(span).toHaveJSProperty('tagName', 'SPAN');
  await expect(span).toHaveAttribute('data-ref-tag', 'span');
  await expect(span).toHaveCSS('color', 'rgb(34, 197, 94)');
  await expect(link).toHaveAttribute('href', '#text-target');
  await link.focus();
  await expect(link).toBeFocused();
  await expect(page.getByTestId('truncate-text')).toHaveCSS('text-overflow', 'ellipsis');
  await expect(page.getByTestId('truncate-text')).toHaveCSS('white-space', 'nowrap');
  await expect(page.getByTestId('clamp-text')).toHaveCSS('-webkit-line-clamp', '2');
  await expect(page.getByTestId('unstyled-text')).toHaveCSS('letter-spacing', 'normal');
  await expect(page.getByTestId('custom-text')).toHaveCSS('letter-spacing', '1.6px');

  await page.getByTestId('text-toggle').click();
  await expect(paragraph).toHaveCSS('font-size', '20px');
  await expect(paragraph).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(paragraph).toHaveAttribute('data-ref-tag', 'p');
  await expect(span).toHaveCSS('color', 'rgb(34, 197, 94)');
  await expect(page.getByTestId('clamp-text')).toHaveCSS('-webkit-line-clamp', 'none');
  await expect(page.getByTestId('custom-text')).toHaveCSS('letter-spacing', '3.2px');
}

/** Verify server markup and responsive text CSS in a browser. */
async function verifiesServerText({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerText);
  expect(markup).toContain('<article');
  expect(markup).toContain('aria-label="Server Text"');
  expect(markup).toContain('Server typography');
  expect(markup).not.toMatch(/<article[^>]*\s(?:textStyle|lineClamp)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${responsiveTextCss}</style>${markup}`);
  const article = page.locator('#server-text');
  await expect(article).toHaveCSS('font-size', '14px');
  await expect(article).toHaveCSS('-webkit-line-clamp', '2');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(article).toHaveCSS('font-size', '18px');
}

/** Hydrate the exact server Text tree through Storybook's browser module graph. */
async function hydrateTextInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateTextExample } = await import(modulePath);
  const root = document.getElementById('text-hydration-root');
  if (!root) throw new Error('Text hydration root was not found.');
  hydrateTextExample(root);
}

/** Verify Text hydration preserves markup, styles, and server rules. */
async function verifiesTextHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same Text tree later hydrated by the browser module. */
    () => renderTextHydrationTree({ Text, TextPropsProvider }),
  );
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `${generateHydrationScript()}<style data-leverui-default>${defaultCss}</style><style>${responsiveTextCss}</style><div id="text-hydration-root">${markup}</div>`,
  );
  const text = page.locator('#hydrated-text');
  const root = page.locator('#text-hydration-root');
  await expect(text).toHaveCSS('font-size', '14px');
  await expect(text).toHaveCSS('color', 'rgb(59, 130, 246)');
  await text.evaluate(
    /** Mark the server element so replacement during hydration is visible. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Retain browser errors raised while hydrating Text. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTextInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(text).toHaveAttribute('data-server-element', 'true');
  await expect(text).toHaveText('Hydrated typography');
  await expect(text).toHaveCSS('font-size', '14px');
  await expect(text).toHaveCSS('color', 'rgb(59, 130, 246)');
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(text).toHaveCSS('font-size', '18px');
}

test('Text preserves native typography, refs, context, and reactive styles', verifiesTextContract);
test('Text renders consumer responsive typography on the server', verifiesServerText);
test('Text hydrates consumer typography without duplicate rules', verifiesTextHydration);
