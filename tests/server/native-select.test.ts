import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Field as FieldExport, NativeSelect as NativeSelectExport } from '../../src';

type ServerComponents = {
  Field: typeof FieldExport;
  NativeSelect: typeof NativeSelectExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published compound API with the primitive Field's native association. */
function renderServerSelect(): string {
  return renderToString(
    /** Render the native field in one server owner. */
    () =>
      createComponent(server.Field.Root, {
        id: 'server-country',
        invalid: true,
        required: true,
        /** Resolve the Native Select after the Field owner exists. */
        get children() {
          return createComponent(server.NativeSelect.Root<'div'>, {
            size: 'sm',
            variant: 'outline',
            /** Render compound parts within the select state provider. */
            get children() {
              return [
                createComponent(server.NativeSelect.Field, {
                  name: 'country',
                  placeholder: 'Choose',
                }),
                createComponent(server.NativeSelect.Indicator, {}),
              ];
            },
          });
        },
      }),
  );
}

/** Preserve native options, Field semantics, and public style hooks in SSR. */
function verifiesServerMarkup(): void {
  const markup = renderServerSelect();
  expect(markup).toContain('id="server-country"');
  expect(markup).toContain('name="country"');
  expect(markup).toContain('required');
  expect(markup).toContain('aria-invalid="true"');
  expect(markup).toContain('leverui-native-select__root');
  expect(markup).toContain('leverui-native-select__field');
  expect(markup).toContain('leverui-native-select__indicator');
  expect(markup).toMatch(/<option[^>]*\svalue(?:="")?[^>]*>Choose<\/option>/);
  expect(markup).not.toContain('placeholder="Choose"');
}

test('published Native Select keeps its native server markup', verifiesServerMarkup);
