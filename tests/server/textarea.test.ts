import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Field as FieldExport, Textarea as TextareaExport } from '../../src';

type ServerComponents = {
  Field: typeof FieldExport;
  Textarea: typeof TextareaExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published control inside a required Field on the server. */
function renderServerTextarea(): string {
  return renderToString(
    /** Establish Lever UI's system context before Field and Textarea. */
    () =>
      createComponent(server.Field.Root, {
        id: 'server-notes',
        required: true,
        invalid: true,
        /** Render the native textarea and its label together. */
        get children() {
          return [
            createComponent(server.Field.Label, { children: 'Notes' }),
            createComponent(server.Textarea, {
              defaultValue: 'First line\nSecond line',
              size: 'lg' as const,
              variant: 'outline' as const,
            }),
          ];
        },
      }),
  );
}

/** Check native textarea content, accessible state, and recipe identity. */
function verifiesServerTextarea(): void {
  const markup = renderServerTextarea();
  const openingTag = markup.match(/<textarea\b[^>]*>/)?.[0];
  expect(openingTag).toBeDefined();
  expect(openingTag).toContain('id="server-notes"');
  expect(openingTag).toContain('aria-invalid="true"');
  expect(openingTag).toContain('required');
  expect(openingTag).toContain('lui-textarea');
  expect(openingTag).not.toMatch(/\s(?:value|defaultValue|size|variant|autoresize)=/);
  expect(markup).toMatch(/<textarea\b[^>]*>First line\nSecond line<\/textarea>/);
  expect(markup).toContain('for="server-notes"');
}

test('published Textarea keeps Field semantics and native server content', verifiesServerTextarea);

/** Keep a selected native input's default value in published server markup. */
function verifiesSelectedServerInput(): void {
  const markup = renderToString(
    /** Render the selected element through the published provider. */
    () =>
      createComponent(server.Textarea, {
        as: 'input' as const,
        defaultValue: 'Draft',
        'aria-label': 'Selected input',
      }),
  );
  const openingTag = markup.match(/<input\b[^>]*>/)?.[0];
  expect(openingTag).toContain('value="Draft"');
  expect(openingTag).not.toContain('defaultValue');
  expect(markup).not.toContain('>Draft</input>');
}

test('published Textarea serializes selected input defaults', verifiesSelectedServerInput);
