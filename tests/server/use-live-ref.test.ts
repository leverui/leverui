import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { useLiveRef as LiveRefExport } from '../../src';

interface ServerHooks {
  useLiveRef: typeof LiveRefExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Read the latest value through the published server bundle. */
function verifiesServerRendering(): void {
  const markup = renderToString(
    /** Render without any browser-only state. */
    () => server.useLiveRef(() => 'server').current,
  );
  expect(markup).toBe('server');
}

test('published useLiveRef reads the current value on the server', verifiesServerRendering);
