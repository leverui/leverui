import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Select as SelectExport } from '../../src';

type ServerComponents = {
  Select: typeof SelectExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Select through its published server entry. */
function renderServerSelect(): string {
  const collection = server.Select.createListCollection({
    items: [
      { label: 'React', value: 'react' },
      { label: 'Solid', value: 'solid' },
    ],
  });
  return renderToString(
    /** Keep the primitive and Lever UI contexts around every compound part. */
    () =>
      createComponent(server.Select.Root, {
        collection,
        name: 'framework',
        defaultValue: ['solid'],
        /** Provide accessible label, trigger, and hidden select. */
        get children() {
          return [
            createComponent(server.Select.HiddenSelect, {}),
            createComponent(server.Select.Label, { children: 'Framework' }),
            createComponent(server.Select.Control, {
              /** Keep value text inside the interactive trigger. */
              get children() {
                return createComponent(server.Select.Trigger, {
                  /** Show the selected collection label in server markup. */
                  get children() {
                    return createComponent(server.Select.ValueText, {
                      placeholder: 'Choose a framework',
                    });
                  },
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Retain select semantics, value, authored part classes, and clean DOM props. */
function verifiesServerSelect(): void {
  const markup = renderServerSelect();
  expect(markup).toContain('data-select-');
  expect(markup).toContain('leverui-select__root');
  expect(markup).toContain('leverui-select__trigger');
  expect(markup).toContain('role="combobox"');
  expect(markup).toContain('name="framework"');
  expect(markup).toContain('Solid');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size|variant)=/);
}

test('published Select renders native form and accessible trigger', verifiesServerSelect);
