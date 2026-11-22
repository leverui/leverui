import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Field as FieldExport, Input as InputExport } from '../../src';

type ServerComponents = {
  Field: typeof FieldExport;
  Input: typeof InputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a complete Field through the published server entry. */
function renderServerField(): string {
  return renderToString(
    /** Construct the compound Field in one server owner. */
    () =>
      createComponent(server.Field.Root, {
        id: 'server-email',
        required: true,
        invalid: true,
        /** Render label, control, helper, and error in one Field. */
        get children() {
          return [
            createComponent(server.Field.Label, { children: 'Email' }),
            createComponent(server.Input, { type: 'email' }),
            createComponent(server.Field.HelperText, { children: 'Use a working address' }),
            createComponent(server.Field.ErrorText, { children: 'Enter a valid address' }),
          ];
        },
      }),
  );
}

/** Verify server markup retains native field state and scoped style hooks. */
function verifiesServerField(): void {
  const markup = renderServerField();
  expect(markup).toContain('leverui-field__root');
  expect(markup).toContain('leverui-field__label');
  expect(markup).toContain('leverui-field__errorText');
  expect(markup).toContain('data-orientation="vertical"');
  expect(markup).toContain('for="server-email"');
  expect(markup).toContain('aria-invalid="true"');
  expect(markup).toContain('required');
  expect(markup).toContain('Enter a valid address');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|orientation)=/);
}

test('published Field renders accessible compound markup on the server', verifiesServerField);

/** Prove the default Field can render without a styling provider. */
function verifiesProviderFreeField(): void {
  const markup = renderToString(
    /** Keep the native Field tree under one server owner. */
    () =>
      createComponent(server.Field.Root, {
        id: 'provider-free-field',
        /** Render a linked label and control without a style cache. */
        get children() {
          return [
            createComponent(server.Field.Label, { children: 'Name' }),
            createComponent(server.Input, { type: 'text' }),
          ];
        },
      }),
  );
  expect(markup).toContain('leverui-field__root');
  expect(markup).toContain('for="provider-free-field"');
}

test(
  'published Field needs no styling provider for default presentation',
  verifiesProviderFreeField,
);
