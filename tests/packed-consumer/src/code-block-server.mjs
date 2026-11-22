import assert from 'node:assert/strict';
import { CodeBlock } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render native Code Block parts from the isolated installed package. */
function renderInstalledCodeBlock() {
  return renderToString(
    /** Mount the public provider before the compound Code Block. */
    () =>
      createComponent(CodeBlock.Root, {
        code: '<safe>\nnext',
        maxLines: 1,
        id: 'packed-server-code-block',
        /** Nest the published native content and source elements. */
        get children() {
          return createComponent(CodeBlock.Content, {
            /** Render a focusable pre with escaped source. */
            get children() {
              return createComponent(CodeBlock.Code, {
                /** Preserve the source in the installed code part. */
                get children() {
                  return createComponent(CodeBlock.CodeText, {});
                },
              });
            },
          });
        },
      }),
  );
}

const markup = renderInstalledCodeBlock();
assert.match(markup, /<div[^>]*id="packed-server-code-block"/);
assert.match(markup, /<pre[^>]*tabindex="0"/i);
assert.match(markup, /<code[^>]*data-plaintext/);
assert.match(markup, /&lt;safe&gt;\nnext/);
assert.match(markup, /aria-expanded="false"/);
assert.doesNotMatch(markup, /\s(?:code|maxLines)=/);
console.log('Packed Code Block server rendering passed.');
