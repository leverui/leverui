import assert from 'node:assert/strict';
import { NativeSelect } from '@leverui/components';
import { JSDOM } from 'jsdom';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Build an option through Solid's server renderer. */
function option(value, label, selected = false) {
  return createComponent(Dynamic, { component: 'option', value, selected, children: label });
}

/** Render the installed package with one selected-value prop. */
function renderSelection(prop, value, multiple) {
  return renderToString(
    /** Establish the package's style and Native Select owners. */
    () =>
      createComponent(NativeSelect.Root, {
        /** Resolve the field after its root state exists. */
        get children() {
          return createComponent(NativeSelect.Field, {
            name: 'country',
            placeholder: 'Choose',
            multiple,
            [prop]: value,
            /** Include one unrelated explicitly selected option. */
            get children() {
              return [option('ca', 'Canada'), option('us', 'United States', true)];
            },
          });
        },
      }),
  );
}

/** Check the installed server markup with the browser's form algorithm. */
function verifySelection(prop, value, expected, multiple = false) {
  const dom = new JSDOM(`<form>${renderSelection(prop, value, multiple)}</form>`);
  const form = dom.window.document.querySelector('form');
  const select = form?.querySelector('select');
  assert.ok(form && select, 'The installed Native Select form must render.');
  assert.deepEqual(
    Array.from(select.selectedOptions, (item) => item.value),
    expected,
  );
  assert.deepEqual(new dom.window.FormData(form).getAll('country'), expected);
  assert.equal(select.options[1]?.defaultSelected, expected.includes('ca'));
  assert.equal(select.options[2]?.defaultSelected, expected.includes('us'));
}

verifySelection('value', 'ca', ['ca']);
verifySelection('defaultValue', 'ca', ['ca']);
verifySelection('defaultValue', ['ca', 'us'], ['ca', 'us'], true);
console.log('Packed Native Select server selection passed.');
