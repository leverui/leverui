import assert from 'node:assert/strict';
import { ClientOnly } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Fail if server rendering evaluates browser-only child content. */
function renderBrowserContent() {
  return window.location.pathname;
}

/** Render the installed export with a fallback and deferred child. */
function renderWithFallback() {
  return createComponent(ClientOnly, {
    fallback: 'Loading in consumer',
    children: renderBrowserContent,
  });
}

/** Render the installed export without a fallback. */
function renderWithoutFallback() {
  return createComponent(ClientOnly, { children: renderBrowserContent });
}

assert.match(renderToString(renderWithFallback), /Loading in consumer/);
assert.equal(renderToString(renderWithoutFallback), '');
console.log('Packed ClientOnly server rendering passed.');
