import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type {
  Stack as StackExport,
  StackProps,
  StackSeparator as SeparatorExport,
} from '../../src';

type ServerExports = {
  Stack: typeof StackExport;
  StackSeparator: typeof SeparatorExport;
};

const serverEntry = '../../dist/server/index.js';
const { Stack, StackSeparator } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render a responsive Stack and separators through the published server entry. */
function renderServerStack(gap: StackProps['gap'] = '8px'): JSX.Element {
  return createComponent(Stack, {
    id: 'server-stack',
    direction: { base: 'column' as const, md: 'row' as const },
    gap,
    separator: StackSeparator,
    /** Keep two native items in the server Stack. */
    get children() {
      return [
        createComponent(Dynamic, { component: 'span', children: 'First' }),
        createComponent(Dynamic, { component: 'span', children: 'Second' }),
      ];
    },
  });
}

/** Render spacing tokens through the published server entry. */
function renderTokenStack(): JSX.Element {
  return renderServerStack({ base: '4', md: '6' });
}

/** Measure server Stack direction and separator orientation at breakpoints. */
async function verifiesServerStack({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerStack);
  expect(markup).toContain('First');
  expect(markup).toContain('Second');
  expect(markup).toMatch(/lui-stack-separator/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:gap|direction|separator)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const stack = page.locator('#server-stack');
  const line = stack.locator('.lui-stack-separator');
  await expect(line).toHaveCount(1);
  await expect(stack).toHaveCSS('flex-direction', 'column');
  await expect(line).toHaveCSS('border-top-width', '1px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(line).toHaveCSS('border-inline-start-width', '1px');
}

/** Verify spacing tokens keep separator margins across responsive axes. */
async function verifiesTokenSeparatorSpacing({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderTokenStack);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const stack = page.locator('#server-stack');
  const line = stack.locator('.lui-stack-separator');
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(stack).toHaveCSS('flex-direction', 'column');
  await expect(line).toHaveCSS('margin-top', '16px');
  await expect(line).toHaveCSS('margin-left', '0px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(line).toHaveCSS('margin-top', '0px');
  await expect(line).toHaveCSS('margin-left', '24px');
}

/** Verify CSS functions survive token conversion on both Stack axes. */
async function verifiesExpressionSeparatorSpacing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const cases = [
    { width: 600, gap: 'calc(1rem + 2px)', edge: 'margin-top', expected: '18px' },
    { width: 900, gap: 'clamp(1rem, 2vw, 2rem)', edge: 'margin-left', expected: '18px' },
  ] as const;

  for (const { width, gap, edge, expected } of cases) {
    await page.setViewportSize({ width, height: 700 });
    const markup = renderToString(
      /** Render the expression through the package's server component. */
      () => renderServerStack(gap),
    );
    await page.setContent(`<style>${defaultCss}</style>${markup}`);
    await expect(page.locator('#server-stack .lui-stack-separator')).toHaveCSS(edge, expected);
  }
}

test('published Stack renders responsive separators on the server', verifiesServerStack);
test(
  'published Stack resolves responsive token gaps around separators',
  verifiesTokenSeparatorSpacing,
);
test(
  'published Stack preserves CSS function gaps around separators',
  verifiesExpressionSeparatorSpacing,
);
