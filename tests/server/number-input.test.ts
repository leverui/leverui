import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { NumberInput as NumberInputExport } from '../../src';

type ServerComponents = {
  NumberInput: typeof NumberInputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Number Input composition through the server entry. */
function renderServerNumberInput(): string {
  return renderToString(
    /** Construct the primitive machine in the server owner. */
    () =>
      createComponent(server.NumberInput.Root, {
        defaultValue: 3,
        min: 0,
        max: 6,
        name: 'quantity',
        /** Render the form field and controls. */
        get children() {
          return [
            createComponent(server.NumberInput.Label, { children: 'Quantity' }),
            createComponent(server.NumberInput.Input, {}),
            createComponent(server.NumberInput.HiddenInput, {}),
            createComponent(server.NumberInput.Control, {}),
            createComponent(server.NumberInput.ValueText, {}),
          ];
        },
      }),
  );
}

/** Preserve the number field, native form name, and slot styling on the server. */
function verifiesServerNumberInput(): void {
  const markup = renderServerNumberInput();
  expect(markup).toContain('data-number-input-');
  expect(markup).toContain('lui-number-input__root');
  expect(markup).toContain('lui-number-input__input');
  expect(markup).toContain('lui-input');
  expect(markup).toContain('data-size="md"');
  // Zag 2 renders a text field described as a number field, not a spinbutton.
  expect(markup).toContain('aria-roledescription="number field"');
  expect(markup).toContain('name="quantity"');
  expect(markup).toContain('Quantity');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size)=/);
}

test('published Number Input renders its native form composition', verifiesServerNumberInput);
