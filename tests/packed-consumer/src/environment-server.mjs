import assert from 'node:assert/strict';
import { EnvironmentProvider } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed provider without accessing browser globals. */
function renderEnvironment() {
  return createComponent(EnvironmentProvider, { children: 'Installed environment' });
}

assert.match(renderToString(renderEnvironment), /Installed environment/);
console.log('Packed environment server rendering passed.');
