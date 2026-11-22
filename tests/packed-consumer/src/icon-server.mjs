import assert from 'node:assert/strict';
import { Icon, IconPropsProvider, createIcon } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

const CheckIcon = createIcon({ d: 'M4 12l5 5 11-11' });

/** Render published SVG components in an isolated server consumer. */
function renderPackedIcons() {
  return createComponent(IconPropsProvider, {
    value: { size: 'lg', title: 'Server shared icon' },
    /** Construct both native SVGs from installed package exports. */
    get children() {
      return [
        createComponent(Icon, { id: 'packed-server-icon' }),
        createComponent(CheckIcon, { id: 'packed-server-created', size: 'sm' }),
      ];
    },
  });
}

const markup = renderToString(renderPackedIcons);
assert.match(markup, /<svg[^>]*id="packed-server-icon"/);
assert.match(markup, /<svg[^>]*id="packed-server-created"/);
assert.match(markup, /title="Server shared icon"/);
assert.match(markup, /focusable="false"/);
assert.match(markup, /aria-hidden="true"/);
assert.match(markup, /d="M4 12l5 5 11-11"/);
assert.doesNotMatch(markup, /<svg[^>]*\ssize=/);
