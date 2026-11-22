import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type * as source from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as typeof source;

/** Verify the published server entry emits semantic Code Block markup. */
function verifiesServerCodeBlock(): void {
  const markup = renderToString(
    /** Mount the Code Block root before its compound parts. */
    () =>
      createComponent(server.CodeBlockRoot, {
        code: '<safe>\nsecond line',
        maxLines: 1,
        contentId: 'server-code-content',
        meta: { showLineNumbers: true },
        id: 'server-code-block',
        /** Build the published native content and code elements. */
        get children() {
          return [
            createComponent(server.CodeBlockCollapseTrigger, {
              'aria-label': 'Show source',
              children: 'Expand code',
            }),
            createComponent(server.CodeBlockContent, {
              /** Put escaped source within a native pre and code pair. */
              get children() {
                return createComponent(server.CodeBlockCode, {
                  /** Preserve the source's literal angle brackets. */
                  get children() {
                    return createComponent(server.CodeBlockCodeText, {});
                  },
                });
              },
            }),
          ];
        },
      }),
  );
  expect(markup).toMatch(/<div[^>]*id="server-code-block"/);
  expect(markup).toMatch(/<pre[^>]*tabindex="0"/i);
  expect(markup).toContain('&lt;safe&gt;');
  expect(markup).toContain('data-plaintext');
  expect(markup).toContain('aria-expanded="false"');
  expect(markup).toMatch(/<div[^>]*id="server-code-content"/);
  expect(markup).toContain('aria-controls="server-code-content"');
  expect(markup).toContain('aria-label="Show source"');
  expect(markup).not.toMatch(/\s(?:code|maxLines|language)=/);
}

test('published Code Block renders escaped native markup', verifiesServerCodeBlock);

/** Verify server roots inherit native provider defaults and local tag overrides. */
function verifiesServerProviderDefaults(): void {
  const markup = renderToString(
    /** Mount the published provider around two native root choices. */
    () =>
      createComponent(server.CodeBlockPropsProvider, {
        value: { as: 'section', title: 'Shared code', class: 'shared-code-block' },
        /** Render an inherited section and a locally selected div. */
        get children() {
          return [
            createComponent(server.CodeBlockRoot<'div'>, {
              code: 'one',
              id: 'server-provider-inherited',
              children: 'one',
            }),
            createComponent(server.CodeBlockRoot<'div'>, {
              as: 'div',
              code: 'two',
              id: 'server-provider-override',
              children: 'two',
            }),
          ];
        },
      }),
  );
  expect(markup).toMatch(/<section[^>]*id="server-provider-inherited"/);
  expect(markup).toMatch(/<div[^>]*id="server-provider-override"/);
  expect(markup.match(/title="Shared code"/g)).toHaveLength(2);
  expect(markup.match(/shared-code-block/g)).toHaveLength(2);
  expect(markup).not.toMatch(/<(?:section|div)[^>]*\sas=/);
}

test('published Code Block provider retains root element defaults', verifiesServerProviderDefaults);
