import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { TagsInput as TagsInputExport } from '../../src';

type ServerComponents = {
  TagsInput: typeof TagsInputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Tags Input composition with server-safe CSS hooks. */
function renderServerTagsInput(): string {
  return renderToString(
    /** Create the machine under the active system context. */
    () =>
      createComponent(server.TagsInput.Root as Component<Record<string, unknown>>, {
        name: 'frameworks',
        defaultValue: ['Solid', 'TypeScript'],
        size: 'sm',
        /** Render the convenience items, input, and native form field. */
        get children() {
          return [
            createComponent(server.TagsInput.Label, { children: 'Frameworks' }),
            createComponent(server.TagsInput.Control, {
              /** Place machine items and the editable field in its control. */
              get children() {
                return [
                  createComponent(server.TagsInput.Items, {}),
                  createComponent(server.TagsInput.Input, { placeholder: 'Add framework' }),
                ];
              },
            }),
            createComponent(server.TagsInput.HiddenInput, {}),
          ];
        },
      }),
  );
}

/** Preserve labels, values, native submission, and finite CSS attributes. */
function verifiesServerTagsInput(): void {
  const markup = renderServerTagsInput();
  expect(markup).toContain('data-tags-input-');
  expect(markup).toContain('leverui-tags-input__root');
  expect(markup).toContain('leverui-tags-input__itemPreview');
  expect(markup).toContain('leverui-tags-input__hiddenInput');
  expect(markup).toContain('data-size="sm"');
  expect(markup).toContain('Solid');
  expect(markup).toContain('TypeScript');
  expect(markup).toContain('name="frameworks"');
  expect(markup).toContain('placeholder="Add framework"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size|variant)=/);
}

test(
  'published Tags Input renders labeled values and a native form field',
  verifiesServerTagsInput,
);
