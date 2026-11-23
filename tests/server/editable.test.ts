import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Editable as EditableExport } from '../../src';

type ServerComponents = {
  Editable: typeof EditableExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render native Editable parts through the published server entry. */
function renderServerEditable(): string {
  return renderToString(
    /** Construct the primitive machine in the server owner. */
    () =>
      createComponent(server.Editable.Root, {
        id: 'server-editable',
        defaultValue: 'Server name',
        /** Render label, preview, input, and controls. */
        get children() {
          return [
            createComponent(server.Editable.Label, { children: 'Name' }),
            createComponent(server.Editable.Preview, {}),
            createComponent(server.Editable.Input, {}),
            createComponent(server.Editable.Control, {
              children: createComponent(server.Editable.EditTrigger, { children: 'Edit' }),
            }),
          ];
        },
      }),
  );
}

/** Preserve the native input, visible value, and slot hooks in server markup. */
function verifiesServerEditable(): void {
  const markup = renderServerEditable();
  expect(markup).toContain('data-editable-');
  expect(markup).toContain('lui-editable__root');
  expect(markup).toContain('lui-editable__input');
  expect(markup).toContain('Server name');
  expect(markup).toContain('Name');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|activationMode)=/);
}

test('published Editable renders its native form composition', verifiesServerEditable);

/** Keep the initial multiline value visible before hydration. */
function verifiesServerTextarea(): void {
  const markup = renderToString(
    /** Render a published textarea under the Editable machine. */
    () =>
      createComponent(server.Editable.Root, {
        defaultValue: 'Server draft',
        defaultEdit: true,
        /** Render the multiline input before any client JavaScript. */
        get children() {
          return createComponent(server.Editable.Textarea, {});
        },
      }),
  );
  expect(markup).toMatch(/<textarea[^>]*>Server draft<\/textarea>/);
}

test(
  'published Editable textarea includes its initial text in server HTML',
  verifiesServerTextarea,
);
