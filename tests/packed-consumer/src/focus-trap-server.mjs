import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { FocusTrap } from '@leverui/components';

/** Render an initially disabled trap with packaged CSS. */
function renderTrap() {
  return createComponent(FocusTrap, {
    as: 'section',
    disabled: true,
    'data-testid': 'installed-focus-trap',
    style: { padding: '17px' },
    children: 'Installed focus trap',
  });
}

const markup = renderToString(renderTrap);
assert.match(markup, /<section\b[^>]*data-testid="installed-focus-trap"/);
assert.match(markup, /Installed focus trap/);
assert.match(markup, /padding:17px/);
assert.match(markup, /lui-focus-trap/);
assert.doesNotMatch(markup, /\bdisabled=/);
