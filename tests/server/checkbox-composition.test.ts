import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Checkbox as CheckboxExport } from '../../src';

type ServerComponents = {
  Checkbox: typeof CheckboxExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render one Checkbox part set under a supplied root component. */
function renderParts(label: string) {
  return [
    createComponent(server.Checkbox.Control, {}),
    createComponent(server.Checkbox.Label, { children: label }),
    createComponent(server.Checkbox.HiddenInput, {}),
  ];
}

/** Render the published group and caller-owned machine on the server. */
function renderServerComposition(): string {
  return renderToString(
    /** Establish the Solid owner and style cache before either machine. */
    () => {
      const external = server.Checkbox.useCheckbox({
        defaultChecked: true,
        name: 'external',
      });
      return [
        createComponent(server.Checkbox.Group, {
          name: 'topics',
          'aria-label': 'Topics',
          defaultValue: ['alpha'],
          /** Keep native inputs under the group context. */
          get children() {
            return createComponent(server.Checkbox.Root, {
              value: 'alpha',
              /** Render the selected group item. */
              get children() {
                return renderParts('Alpha');
              },
            });
          },
        }),
        createComponent(server.Checkbox.RootProvider, {
          value: external,
          /** Render parts from the caller-owned machine. */
          get children() {
            return renderParts('External');
          },
        }),
      ];
    },
  );
}

/** Preserve group semantics, names, and recipe classes in published HTML. */
function verifiesServerComposition(): void {
  const markup = renderServerComposition();
  expect(markup).toContain('role="group"');
  expect(markup).toContain('aria-label="Topics"');
  expect(markup).toContain('name="topics"');
  expect(markup).toContain('name="external"');
  expect(markup).toContain('lui-checkbox-group');
  expect(markup).toContain('lui-checkbox__control');
  expect(markup).toContain('data-state="checked"');
  expect(markup).not.toMatch(/\s(?:defaultValue|defaultChecked|maxSelectedValues)=/);
}

test(
  'published Checkbox group and root provider render native controls',
  verifiesServerComposition,
);
