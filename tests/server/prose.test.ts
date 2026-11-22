import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Prose as ProseExport } from '../../src/components/prose';

type ServerComponents = { Prose: typeof ProseExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public Prose entry without a provider or styling runtime. */
function renderProse(): string {
  return renderToString(
    /** Exercise native attributes, choices, consumer classes, and selected tags. */
    () => [
      createComponent(server.Prose<'div'>, {
        id: 'article',
        size: 'lg',
        class: 'article-copy',
        innerHTML: '<h2>Heading</h2><p>Body</p>',
      }),
      createComponent(server.Prose<'article'>, {
        as: 'article',
        id: 'plain-article',
        unstyled: true,
        children: 'Plain text',
      }),
    ],
  );
}

/** Keep the emitted DOM independent of runtime styles and provider state. */
function verifiesNativeProse(): void {
  const markup = renderProse();
  expect(markup).toMatch(/<div[^>]*id="article"/);
  expect(markup).toMatch(/class="leverui-prose article-copy\s*"/);
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('<h2>Heading</h2><p>Body</p>');
  expect(markup).toMatch(/<article[^>]*id="plain-article"/);
  expect(markup).toMatch(/\sdata\-unstyled(?:=""|(?=[\s/>]))/);
  expect(markup).not.toMatch(/\s(?:css|unstyled|as|size)=/);
}

test('Prose emits native SSR markup with stable CSS hooks', verifiesNativeProse);
