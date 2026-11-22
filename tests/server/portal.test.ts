import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Portal as PortalExport } from '../../src';

type ServerExports = { Portal: typeof PortalExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render one published portal without a browser DOM. */
function renderPortal(disabled: boolean): string {
  return renderToString(
    /** Construct native server content through the package entry. */
    () => createComponent(server.Portal, { disabled, children: ['Plain text', 'More text'] }),
  );
}

/** Keep primitive and multiple children inline on the server. */
function verifiesPortalServerOutput(): void {
  expect(renderPortal(false)).toContain('Plain text');
  expect(renderPortal(false)).toContain('More text');
  expect(renderPortal(true)).toContain('Plain text');
  expect(renderPortal(true)).toContain('More text');
}

test('published Portal renders children inline for SSR', verifiesPortalServerOutput);
