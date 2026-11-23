import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Clipboard as ClipboardExport } from '../../src';

type ServerComponents = { Clipboard: typeof ClipboardExport };

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render public Clipboard parts without a styling provider. */
function renderServerClipboard(): string {
  return renderToString(
    /** Construct disclosure state without a style cache. */
    () =>
      createComponent(server.Clipboard.Root, {
        value: 'Server copy value',
        /** Exercise the public compound parts in server output. */
        get children() {
          return [
            createComponent(server.Clipboard.Label, { children: 'Copy value' }),
            createComponent(server.Clipboard.Control, {
              /** Render input and trigger under the same primitive context. */
              get children() {
                return [
                  createComponent(server.Clipboard.Input, {}),
                  createComponent(server.Clipboard.Trigger, { children: 'Copy server value' }),
                ];
              },
            }),
            createComponent(server.Clipboard.ValueText, {}),
          ];
        },
      }),
  );
}

/** Verify server markup retains values, hooks, and accessible labels. */
function verifiesServerMarkup(): void {
  const markup = renderServerClipboard();
  expect(markup).toContain('lui-clipboard__root');
  expect(markup).toContain('lui-clipboard__label');
  expect(markup).toContain('lui-clipboard__control');
  expect(markup).toContain('lui-clipboard__input');
  expect(markup).toContain('lui-clipboard__trigger');
  expect(markup).toContain('lui-clipboard__valueText');
  expect(markup).toContain('Server copy value');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|timeout|copied)=/);
}

test('published Clipboard renders accessible compound parts on the server', verifiesServerMarkup);
