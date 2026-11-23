import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Presence as PresenceExport } from '../../src';

type ServerExports = {
  Presence: typeof PresenceExport;
};
interface StateOptions {
  present: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Render the published presence element without a styling provider. */
function renderPresence(options: StateOptions): string {
  return renderToString(
    /** Render the requested state through the package server entry. */
    () =>
      createComponent(server.Presence, {
        ...options,
        'data-testid': 'server-presence',
        children: 'Server presence',
      }),
  );
}

/** Verify inline visible, hidden, and initially lazy server states. */
function verifiesPresenceServerOutput(): void {
  const open = renderPresence({ present: true });
  const closed = renderPresence({ present: false });
  const lazy = renderPresence({ present: false, lazyMount: true });
  expect(open).toContain('Server presence');
  expect(open).toContain('data-state="open"');
  expect(open).toContain('lui-presence');
  expect(closed).toContain('Server presence');
  expect(closed).toMatch(/<div[^>]*\shidden(?:\s|=|>)/);
  expect(lazy).not.toContain('Server presence');
}

test(
  'published Presence renders visible, hidden, and lazy SSR states',
  verifiesPresenceServerOutput,
);
