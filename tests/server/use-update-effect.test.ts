import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { useUpdateEffect as UpdateEffectExport } from '../../src';

interface ServerHooks {
  useUpdateEffect: typeof UpdateEffectExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Ensure a deferred effect does not execute during server rendering. */
function verifiesServerSkipsEffect(): void {
  let runs = 0;
  const output = renderToString(
    /** Register an effect while rendering a stable initial value. */
    () => {
      server.useUpdateEffect(
        /** Select the server's initial dependency value. */
        () => 0,
        /** Record any unexpected server-side effect invocation. */
        () => {
          runs++;
        },
      );
      return 'ready';
    },
  );
  expect(output).toBe('ready');
  expect(runs).toBe(0);
}

test('published useUpdateEffect skips server rendering', verifiesServerSkipsEffect);
