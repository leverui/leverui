import assert from 'node:assert/strict';
import { Kbd, KbdPropsProvider } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Construct a new semantic key label for each published Kbd. */
function renderSharedKey() {
  return createComponent(Dynamic, { component: 'span', children: 'Esc' });
}

/** Render published Kbd exports with packaged CSS. */
function renderPackedKbd() {
  return renderToString(
    /** Construct reactive defaults for the installed component. */
    () =>
      createComponent(KbdPropsProvider, {
        value: { size: 'lg', variant: 'outline', children: renderSharedKey },
        /** Render inherited and locally overridden key labels. */
        get children() {
          return [
            createComponent(Kbd, { id: 'packed-server-kbd-first' }),
            createComponent(Kbd, { id: 'packed-server-kbd-second' }),
            createComponent(Kbd, {
              as: 'span',
              id: 'packed-server-kbd-local',
              children: 'Tab',
            }),
          ];
        },
      }),
  );
}

const markup = renderPackedKbd();
assert.match(markup, /<kbd[^>]*id="packed-server-kbd-first"[^>]*><span[^>]*>Esc<\/span><\/kbd>/);
assert.match(markup, /<kbd[^>]*id="packed-server-kbd-second"[^>]*><span[^>]*>Esc<\/span><\/kbd>/);
assert.match(markup, /<span[^>]*id="packed-server-kbd-local"[^>]*>Tab<\/span>/);
assert.match(markup, /lui-kbd/);
assert.doesNotMatch(markup, /\s(?:size|variant|as)=/);
