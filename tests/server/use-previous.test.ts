import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { usePrevious as PreviousExport } from '../../src';

interface ServerHooks {
  usePrevious: typeof PreviousExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Confirm the shipped previous-value hook starts without history on the server. */
function verifiesInitialPreviousValue(): void {
  const result = renderToString(
    /** Read a stable server-side value through the public hook. */
    () => String(server.usePrevious(() => 'current')() ?? 'none'),
  );
  expect(result).toBe('none');
}

test(
  'published usePrevious renders without prior state on the server',
  verifiesInitialPreviousValue,
);
