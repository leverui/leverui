import assert from 'node:assert/strict';
import { Stack, StackSeparator } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Render the installed Stack through its published server entry. */
function renderInstalledStack() {
  return renderToString(
    /** Supply the packaged provider to native Stack children. */
    () =>
      createComponent(Stack, {
        id: 'packed-server-stack',
        direction: { base: 'column', md: 'row' },
        gap: '8px',
        separator: StackSeparator,
        /** Render two native children around the separator. */
        get children() {
          return [
            createComponent(Dynamic, { component: 'span', children: 'First packed item' }),
            createComponent(Dynamic, { component: 'span', children: 'Second packed item' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledStack();
assert.match(markup, /id="packed-server-stack"/);
assert.match(markup, /First packed item[\s\S]*leverui-stack-separator[\s\S]*Second packed item/);
assert.match(markup, /data-direction-md="row"/);
assert.match(markup, /--leverui-private-stack-gap-base:8px/);
assert.match(markup, /\sdata-has-separator(?:=""|(?=[\s/>]))/);
assert.doesNotMatch(markup, /\s(?:gap|direction|separator)=/);
console.log('Packed Stack server rendering passed.');
