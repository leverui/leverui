import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Listbox as ListboxExport, createListCollection as CollectionExport } from '../../src';

type ServerComponents = {
  Listbox: typeof ListboxExport;
  createListCollection: typeof CollectionExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render both transfer columns through the installed server entry. */
function renderTransferColumns(): string {
  const item = { label: 'Wren', value: 'wren' };
  const available = server.createListCollection({ items: [item] });
  const selected = server.createListCollection<typeof item>({ items: [] });
  return renderToString(
    /** Keep both controlled machines in one provider scope. */
    () => [
      createComponent(server.Listbox.Root, {
        collection: available,
        selectionMode: 'multiple' as const,
        value: [],
        /** Label the source machine and render its one option. */
        get children() {
          return [
            createComponent(server.Listbox.Label, { children: 'Available characters' }),
            createComponent(server.Listbox.Content, {
              /** Keep the option under the source collection. */
              get children() {
                return createComponent(server.Listbox.List, {
                  /** Render the option inside the primitive's listbox. */
                  get children() {
                    return createComponent(server.Listbox.Item, { item, children: 'Wren' });
                  },
                });
              },
            }),
          ];
        },
      }),
      createComponent(server.Listbox.Root, {
        collection: selected,
        selectionMode: 'multiple' as const,
        value: [],
        /** Label the destination machine and its empty state. */
        get children() {
          return [
            createComponent(server.Listbox.Label, { children: 'Selected characters' }),
            createComponent(server.Listbox.Content, {
              /** Show the empty state beside the primitive's empty listbox. */
              get children() {
                return [
                  createComponent(server.Listbox.Empty, { children: 'No items available' }),
                  createComponent(server.Listbox.List, {}),
                ];
              },
            }),
          ];
        },
      }),
    ],
  );
}

/** Keep both machine scopes, accessible labels, and empty state in server HTML. */
function verifiesServerTransfer(): void {
  const markup = renderTransferColumns();
  expect(markup.match(/role="listbox"/g)).toHaveLength(2);
  expect(markup).toContain('Available characters');
  expect(markup).toContain('Selected characters');
  expect(markup).toContain('Wren');
  expect(markup).toContain('No items available');
  expect(markup).toContain('leverui-listbox__content');
}

test('published Listbox renders both transfer columns on the server', verifiesServerTransfer);
