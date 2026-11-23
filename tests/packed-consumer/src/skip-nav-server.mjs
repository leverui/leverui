import assert from 'node:assert/strict';
import { SkipNavContent, SkipNavLink } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed pair with packaged CSS. */
function renderInstalledPair() {
  return renderToString(
    /** Keep the link before its programmatically focusable destination. */
    () => [
      createComponent(SkipNavLink, { id: 'packed-server-main', children: 'Skip to content' }),
      createComponent(SkipNavContent, { id: 'packed-server-main', children: 'Main content' }),
    ],
  );
}

const markup = renderInstalledPair();
assert.match(markup, /<a[^>]*href="#packed-server-main"/);
assert.match(markup, /<div[^>]*id="packed-server-main"/);
assert.match(markup, /tabindex="-1"/i);
assert.match(markup, /lui-skip-nav/);
