import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { useDisclosure as DisclosureExport } from '../../src';

interface ServerHooks {
  useDisclosure: typeof DisclosureExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Render an initially open disclosure through the published server entry. */
function renderInitialDisclosure(): string {
  return renderToString(
    /** Read the server-side accessor during Solid rendering. */
    () => String(server.useDisclosure({ defaultOpen: true }).open()),
  );
}

/** Confirm the shipped server bundle exposes initial disclosure state. */
function verifiesInitialDisclosure(): void {
  expect(renderInitialDisclosure()).toBe('true');
}

test('published useDisclosure renders its initial state on the server', verifiesInitialDisclosure);
