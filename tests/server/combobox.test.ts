import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Combobox as ComboboxExport,
  createListCollection as CollectionExport,
} from '../../src';

type ServerComponents = {
  Combobox: typeof ComboboxExport;
  createListCollection: typeof CollectionExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render machine-owned and caller-owned Combobox roots through the server entry. */
function renderServerCombobox(): string {
  const solid = { label: 'Solid', value: 'solid' };
  const collection = server.createListCollection({
    items: [solid, { label: 'React', value: 'react' }],
  });
  return renderToString(
    /** Establish the styling and machine owner before creating either root. */
    () => {
      const external = server.Combobox.useCombobox({ collection, defaultValue: ['react'] });
      return [
        createComponent(server.Combobox.Root, {
          collection,
          name: 'framework',
          defaultValue: ['solid'],
          size: 'sm' as const,
          /** Keep label, input, and options under one machine. */
          get children() {
            return [
              createComponent(server.Combobox.Label, { children: 'Framework' }),
              createComponent(server.Combobox.Control, {
                /** Place the native input and default trigger together. */
                get children() {
                  return [
                    createComponent(server.Combobox.Input, {}),
                    createComponent(server.Combobox.Trigger, {}),
                  ];
                },
              }),
              createComponent(server.Combobox.Positioner, {
                /** Keep the popup under the primitive's presence context. */
                get children() {
                  return createComponent(server.Combobox.Content, {
                    /** Render an item from the same collection. */
                    get children() {
                      return createComponent(server.Combobox.List, {
                        /** Render the option inside the primitive's listbox. */
                        get children() {
                          return createComponent(server.Combobox.Item, {
                            item: solid,
                            children: 'Solid',
                          });
                        },
                      });
                    },
                  });
                },
              }),
            ];
          },
        }),
        createComponent(server.Combobox.RootProvider, {
          value: external,
          /** Render a second input from the caller-owned machine. */
          get children() {
            return [
              createComponent(server.Combobox.Label, { children: 'External' }),
              createComponent(server.Combobox.Input, {}),
            ];
          },
        }),
      ];
    },
  );
}

/** Retain native input, labels, classes, and both machine values in server HTML. */
function verifiesServerCombobox(): void {
  const markup = renderServerCombobox();
  expect(markup).toContain('data-combobox-');
  expect(markup).toContain('lui-combobox__root');
  expect(markup).toContain('lui-combobox__input');
  expect(markup).toContain('role="combobox"');
  expect(markup).toContain('name="framework"');
  expect(markup).toContain('value="Solid"');
  expect(markup).toContain('value="React"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size)=/);
}

test('published Combobox renders native and caller-owned machines', verifiesServerCombobox);
