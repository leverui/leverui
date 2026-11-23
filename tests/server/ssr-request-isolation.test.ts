import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Box as BoxExport, Button as ButtonExport } from '../../src';

type ServerExports = { Box: typeof BoxExport; Button: typeof ButtonExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render a provider-free component tree for one isolated server request. */
function renderRequest(buttonClass: string): string {
  /** Create the same semantic children for each request. */
  function renderTree() {
    return [
      createComponent(server.Box, {
        id: 'ssr-box',
        class: 'consumer-box',
        children: 'Box',
      }),
      createComponent(server.Button, {
        id: 'ssr-button',
        class: buttonClass,
        children: 'Button',
      }),
    ];
  }

  return renderToString(renderTree);
}

/** Keep server markup deterministic without a style cache shared across requests. */
function verifiesRequestIsolation(): void {
  const first = renderRequest('first-consumer');
  expect(first).toContain('lui-box consumer-box');
  expect(first).toContain('lui-button first-consumer');
  expect(first).not.toContain('<style');
  expect(renderRequest('first-consumer')).toBe(first);

  const second = renderRequest('second-consumer');
  expect(second).toContain('lui-button second-consumer');
  expect(second).not.toContain('first-consumer');
  expect(renderRequest('first-consumer')).toBe(first);
}

test('server requests render deterministic provider-free markup', verifiesRequestIsolation);
