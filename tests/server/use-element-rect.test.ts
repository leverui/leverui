import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { useElementRect as ElementRectExport } from '../../src';

interface ServerHooks {
  useElementRect: typeof ElementRectExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Keep the initial rectangle empty while rendering without a browser. */
function verifiesServerRect(): void {
  const result = renderToString(
    /** Read the public hook's initial rectangle during server rendering. */
    () => String(server.useElementRect().rect() ?? 'pending'),
  );
  expect(result).toBe('pending');
}

test('published useElementRect renders safely on the server', verifiesServerRect);
