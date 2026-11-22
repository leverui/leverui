import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderOverflowHydrationTree,
  type OverflowHydrationComponents,
} from '../../.storybook/code-block-overflow-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as OverflowHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to the existing server Code Block. */
async function hydrateOverflowInBrowser(): Promise<void> {
  const modulePath = '/.storybook/code-block-overflow-hydration-example.tsx';
  const { hydrateOverflowExample } = await import(modulePath);
  const root = document.getElementById('overflow-hydration-host');
  if (!root) throw new Error('Code Block overflow hydration host is missing.');
  hydrateOverflowExample(root);
}

/** Measure horizontal overflow on the same native pre across hydration. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.locator('#overflow-hydration-pre').evaluate(
    /** Compare scrollable width with the visible viewport. */
    (element) => element.scrollWidth - element.clientWidth,
  );
}

/** Select the first source token before the browser attaches Solid. */
async function selectServerSource(page: Page): Promise<string> {
  return page.locator('#overflow-hydration-code').evaluate(
    /** Make a real DOM Range inside highlighted server markup. */
    (element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let text: Node | null;
      do {
        text = walker.nextNode();
      } while (text && (text.textContent?.trim().length ?? 0) < 5);
      if (!text) throw new Error('No selectable highlighted source text was found.');
      const selection = window.getSelection();
      if (!selection) throw new Error('The browser has no text selection.');
      const range = document.createRange();
      range.setStart(text, 0);
      range.setEnd(text, 5);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    },
  );
}

/** Verify highlighted long lines hydrate and reactively wrap without replacement. */
async function verifiesOverflowHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render through the published server entry with a synchronous engine. */
    () => renderOverflowHydrationTree(server),
  );
  expect(markup).toContain('data-line="1"');
  expect(markup).toContain('data-line="2"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="overflow-hydration-host">${markup}</div>`,
  );
  const host = page.locator('#overflow-hydration-host');
  const code = page.locator('#overflow-hydration-code');
  const pre = page.locator('#overflow-hydration-pre');
  await expect(code).not.toHaveAttribute('data-plaintext');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  expect(await horizontalOverflow(page)).toBeGreaterThan(100);
  await code.evaluate(
    /** Identify the original server code element before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await pre.evaluate(
    /** Identify the original native scroll viewport. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  expect(await selectServerSource(page)).toBe('const');
  const errors: string[] = [];

  /** Capture exceptions from hydration and reactive highlighting. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateOverflowInBrowser);
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  await expect(code).toHaveAttribute('data-server-node', 'true');
  await expect(code).toHaveAttribute('data-consumer-ref', 'true');
  await expect(pre).toHaveAttribute('data-server-node', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  expect(
    await page.evaluate(
      /** Keep the server-selected source text through hydration. */
      () => window.getSelection()?.toString(),
    ),
  ).toBe('const');
  expect(await horizontalOverflow(page)).toBeGreaterThan(100);

  await page.locator('#overflow-hydration-toggle').click();
  await expect(code).toHaveAttribute('data-word-wrap', '');
  await expect(code).toHaveAttribute('data-server-node', 'true');
  await expect(pre).toHaveAttribute('data-server-node', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(1);
  const firstLineHeight = await code.locator('[data-line="1"]').evaluate(
    /** Read the visual height of the wrapped source line. */
    (element) => element.getBoundingClientRect().height,
  );
  const lineHeight = await code.evaluate(
    /** Read the current line height from the hydrated code element. */
    (element) => Number.parseFloat(getComputedStyle(element).lineHeight),
  );
  expect(firstLineHeight).toBeGreaterThan(lineHeight * 2);

  await page.locator('#overflow-hydration-tag').click();
  await expect(code).toHaveJSProperty('tagName', 'SPAN');
  await expect(code).toHaveAttribute('data-consumer-ref', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  await page.locator('#overflow-hydration-tag').click();
  await expect(code).toHaveJSProperty('tagName', 'svg');
  expect(
    await code.evaluate(
      /** Confirm client-created SVG uses the native SVG namespace. */
      (element) => element.namespaceURI,
    ),
  ).toBe('http://www.w3.org/2000/svg');
  await expect(code).toHaveAttribute('data-consumer-ref', 'true');
  await expect(code.locator('[data-line]')).toHaveCount(2);
  expect(errors).toEqual([]);
}

test('highlighted long Code Block lines hydrate and wrap reactively', verifiesOverflowHydration);
