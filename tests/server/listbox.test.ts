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

/** Render native and external Listbox roots through the published server entry. */
function renderServerListbox(): string {
  const solid = { label: 'Solid', value: 'solid' };
  const react = { label: 'React', value: 'react' };
  const collection = server.createListCollection({
    items: [solid, react],
  });
  return renderToString(
    /** Create both machine-owned roots in one server owner. */
    () => {
      const external = server.Listbox.useListbox({ collection, defaultValue: ['react'] });
      return [
        createComponent(server.Listbox.Root, {
          collection,
          defaultValue: ['solid'],
          variant: 'solid' as const,
          /** Render the label, selected value, and an option. */
          get children() {
            return [
              createComponent(server.Listbox.Label, {
                /** Keep the value text under the primitive's label context. */
                get children() {
                  return [
                    'Frameworks',
                    createComponent(server.Listbox.ValueText, { placeholder: 'Choose one' }),
                  ];
                },
              }),
              createComponent(server.Listbox.Content, {
                /** Keep an option under the same collection, inside the primitive's List. */
                get children() {
                  return createComponent(server.Listbox.List, {
                    /** Render the option inside the listbox. */
                    get children() {
                      return createComponent(server.Listbox.Item, {
                        item: solid,
                        children: 'Solid',
                      });
                    },
                  });
                },
              }),
            ];
          },
        }),
        createComponent(server.Listbox.RootProvider, {
          value: external,
          /** Render a second listbox from the caller-owned machine. */
          get children() {
            return createComponent(server.Listbox.Content, {
              /** Preserve a selected item in the external collection, inside the primitive's List. */
              get children() {
                return createComponent(server.Listbox.List, {
                  /** Render the option inside the listbox. */
                  get children() {
                    return createComponent(server.Listbox.Item, {
                      item: react,
                      children: 'React',
                    });
                  },
                });
              },
            });
          },
        }),
      ];
    },
  );
}

/** Retain roles, items, selected states, and Lever UI classes in server HTML. */
function verifiesServerListbox(): void {
  const markup = renderServerListbox();
  expect(markup).toContain('data-listbox-');
  expect(markup).toContain('lui-listbox__root');
  expect(markup).toContain('lui-listbox__content');
  expect(markup).toContain('role="listbox"');
  expect(markup).toContain('role="option"');
  expect(markup).toContain('aria-selected="true"');
  expect(markup).toContain('Solid');
  expect(markup).toContain('React');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|variant)=/);
}

test('published Listbox renders both root modes with native semantics', verifiesServerListbox);
