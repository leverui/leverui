import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Command as CommandExport } from '../../src';

type ServerComponents = {
  Command: typeof CommandExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Command through its published server entry. */
function renderServerCommand(): string {
  return renderToString(
    /** Keep the provider and collection under one server owner. */
    () => {
      const command = server.Command.useCommandCollection({
        initialItems: [{ value: 'open', label: 'Open file' }],
      });
      return createComponent(server.Command.Root, {
        command,
        size: 'sm' as const,
        /** Render the search control and result list in one root. */
        get children() {
          return [
            createComponent(server.Command.Label, { children: 'Actions' }),
            createComponent(server.Command.Control, {
              /** Keep the primitive input and indicator under their native control. */
              get children() {
                return [
                  createComponent(server.Command.Indicator, {}),
                  createComponent(server.Command.Input, {}),
                ];
              },
            }),
            createComponent(server.Command.List, {
              /** Retain the ranked option in server output. */
              get children() {
                return createComponent(server.Command.Item, {
                  item: { value: 'open', label: 'Open file' },
                  /** Keep the visible option label in the primitive's text part. */
                  get children() {
                    return createComponent(server.Command.ItemText, { children: 'Open file' });
                  },
                });
              },
            }),
          ];
        },
      });
    },
  );
}

/** Preserve native semantics and authored hooks without leaking appearance props. */
function verifiesServerCommand(): void {
  const markup = renderServerCommand();
  expect(markup).toContain('leverui-command__root');
  expect(markup).toContain('leverui-command__input');
  expect(markup).toContain('leverui-command__item');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('role="combobox"');
  expect(markup).toContain('Open file');
  expect(markup).not.toMatch(/\s(?:recipe|css|unstyled|size)=/);
}

test('published Command renders native search and result parts', verifiesServerCommand);
