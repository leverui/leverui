import assert from 'node:assert/strict';
import { Badge } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Badge from the installed package's server entry. */
function renderInstalledBadge() {
  return renderToString(
    /** Render the installed Badge with packaged CSS. */
    () =>
      createComponent(Badge, {
        id: 'packed-server-badge',
        variant: 'solid',
        size: 'lg',
        colorPalette: 'blue',
        title: 'Server status',
        children: 'Active',
      }),
  );
}

const markup = renderInstalledBadge();
assert.match(markup, /<span[^>]*id="packed-server-badge"/);
assert.match(markup, /leverui-badge/);
assert.match(markup, /title="Server status"/);
assert.match(markup, />Active<\/span>/);
assert.doesNotMatch(markup, /\s(?:size|variant|colorPalette)=/);
console.log('Packed Badge server rendering passed.');
