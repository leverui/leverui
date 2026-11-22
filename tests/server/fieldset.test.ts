import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Field as FieldExport,
  Fieldset as FieldsetExport,
  Input as InputExport,
} from '../../src';

type ServerComponents = {
  Field: typeof FieldExport;
  Fieldset: typeof FieldsetExport;
  Input: typeof InputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a compound Fieldset through the published server entry. */
function renderServerFieldset(): string {
  return renderToString(
    /** Construct the public recipe context before its native parts. */
    () =>
      createComponent(server.Fieldset.Root, {
        id: 'server-group',
        disabled: true,
        invalid: true,
        /** Include each associated public Fieldset part. */
        get children() {
          return [
            createComponent(server.Fieldset.Legend, { children: 'Server group' }),
            createComponent(server.Fieldset.HelperText, { children: 'Server helper' }),
            createComponent(server.Fieldset.Content, {
              /** Keep Input beneath its own public Field context. */
              get children() {
                return createComponent(server.Field.Root, {
                  id: 'server-control',
                  children: createComponent(server.Input, { type: 'text' }),
                });
              },
            }),
            createComponent(server.Fieldset.ErrorText, { children: 'Server error' }),
          ];
        },
      }),
  );
}

/** Verify server markup retains native Fieldset semantics and recipe hooks. */
function verifiesServerFieldset(): void {
  const markup = renderServerFieldset();
  expect(markup).toContain('<fieldset');
  expect(markup).toContain('leverui-fieldset__root');
  expect(markup).toContain('leverui-fieldset__content');
  expect(markup).toContain('leverui-fieldset__legend');
  expect(markup).toContain('leverui-fieldset__errorText');
  expect(markup).toContain('disabled');
  expect(markup).toContain('aria-labelledby="fieldset::server-group::legend"');
  expect(markup).toContain('Server error');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size)=/);
}

test('published Fieldset renders native grouped markup', verifiesServerFieldset);
