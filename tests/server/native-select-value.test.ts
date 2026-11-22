// @vitest-environment jsdom
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { NativeSelect as NativeSelectExport, NativeSelectFieldProps } from '../../src';

type ServerComponents = {
  NativeSelect: typeof NativeSelectExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Build one native option without introducing a styled wrapper. */
function option(value: string, label: string, selected = false) {
  return createComponent(Dynamic, { component: 'option', value, selected, children: label });
}

/** Render a published select with options nested in an optgroup. */
function renderServerSelection(props: Partial<NativeSelectFieldProps>): string {
  return renderToString(
    /** Create the same provider owner as an installed application. */
    () =>
      createComponent(server.NativeSelect.Root, {
        /** Resolve the field inside the Native Select state provider. */
        get children() {
          return createComponent(server.NativeSelect.Field, {
            name: 'country',
            placeholder: 'Choose',
            ...props,
            /** Render native options after the field receives its props. */
            get children() {
              return createComponent(Dynamic, {
                component: 'optgroup',
                label: 'North America',
                /** Keep an explicit selected option to test override precedence. */
                get children() {
                  return [option('ca', 'Canada'), option('us', 'United States', true)];
                },
              });
            },
          });
        },
      }),
  );
}

/** Parse the published markup as a browser form would. */
function parsedForm(markup: string): {
  select: HTMLSelectElement;
  formValue: FormDataEntryValue | null;
} {
  const form = document.createElement('form');
  form.innerHTML = markup;
  const select = form.querySelector('select');
  if (!select) throw new Error('The server select form did not render.');
  return { select, formValue: new FormData(form).get('country') };
}

/** Match the first selected option for both initial value forms. */
function verifiesSingleSelection(): void {
  for (const prop of ['value', 'defaultValue'] as const) {
    const markup = renderServerSelection({ [prop]: 'ca' });
    const { select, formValue } = parsedForm(markup);
    expect(select.value).toBe('ca');
    expect(select.selectedIndex).toBe(1);
    expect(select.options[1]?.defaultSelected).toBe(true);
    expect(select.options[2]?.defaultSelected).toBe(false);
    expect(formValue).toBe('ca');
    expect(select.hasAttribute('defaultValue')).toBe(false);
  }
}

test(
  'published Native Select marks controlled and default options during SSR',
  verifiesSingleSelection,
);

/** Preserve multiple defaults while clearing an unrelated selected option. */
function verifiesMultipleSelection(): void {
  const { select } = parsedForm(renderServerSelection({ multiple: true, defaultValue: ['ca'] }));
  expect(Array.from(select.selectedOptions, (item) => item.value)).toEqual(['ca']);
  expect(select.options[1]?.defaultSelected).toBe(true);
  expect(select.options[2]?.defaultSelected).toBe(false);
}

test('published Native Select marks multiple defaults during SSR', verifiesMultipleSelection);
