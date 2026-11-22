import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { InputAddon as InputAddonExport } from '../../src';

type ServerComponents = {
  InputAddon: typeof InputAddonExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public addon through the published server entry. */
function renderServerInputAddon(): string {
  return renderToString(
    /** Render the addon with its published CSS hook. */
    () =>
      createComponent(server.InputAddon, {
        id: 'server-input-addon',
        size: 'lg' as const,
        variant: 'subtle' as const,
        children: 'https://',
      }),
  );
}

/** Keep recipe variants out of the server's native opening tag. */
function verifiesServerInputAddon(): void {
  const markup = renderServerInputAddon();
  expect(markup).toContain('id="server-input-addon"');
  expect(markup).toContain('leverui-input-addon');
  expect(markup).toContain('https://');
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|variant|recipe|unstyled)=/);
}

test('published Input Addon renders native server markup', verifiesServerInputAddon);
