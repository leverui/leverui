import { type JSX } from '@solidjs/web';
import { Field, NumberInput } from '../../src';

/** Render the number input's spin buttons and editable field. */
export function NumberInputExampleControl(): JSX.Element {
  return (
    <>
      <NumberInput.Control />
      <NumberInput.Input />
    </>
  );
}

/** Show the default value and 200px field width. */
export function NumberInputBasic(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }}>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}

/** Disable editing and stepping at the value. */
export function NumberInputDisabled(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }} disabled>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}

/** Connect the number field to its label and helper copy. */
export function NumberInputField(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Quantity</Field.Label>
      <NumberInput.Root style={{ width: '200px' }}>
        <NumberInputExampleControl />
      </NumberInput.Root>
      <Field.HelperText>Enter a number between 1 and 10</Field.HelperText>
    </Field.Root>
  );
}

/** Show an invalid field with the error message. */
export function NumberInputInvalid(): JSX.Element {
  return (
    <Field.Root invalid>
      <Field.Label>Quantity</Field.Label>
      <NumberInput.Root defaultValue={10} style={{ width: '200px' }}>
        <NumberInputExampleControl />
      </NumberInput.Root>
      <Field.ErrorText>The entry is invalid</Field.ErrorText>
    </Field.Root>
  );
}

/** Constrain editing and stepping to the bounds. */
export function NumberInputMinMax(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }} min={5} max={50}>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}

/** Allow mouse wheel input while the field is focused. */
export function NumberInputMouseWheel(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }} allowMouseWheel>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}

/** Advance in increments of three from the value. */
export function NumberInputStep(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={2} style={{ 'max-width': '200px' }} step={3}>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}
