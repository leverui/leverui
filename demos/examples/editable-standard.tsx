import { type JSX } from '@solidjs/web';
import { Editable } from '../../src';
import './editable-examples.css';

/** Present the default inline editing flow. */
export function EditableBasic(): JSX.Element {
  return (
    <Editable.Root style={{ 'text-align': 'start' }} defaultValue="Click to edit">
      <Editable.Preview />
      <Editable.Input />
    </Editable.Root>
  );
}

/** Keep a disabled preview visible without allowing editing. */
export function EditableDisabled(): JSX.Element {
  return (
    <Editable.Root disabled defaultValue="Click to edit">
      <Editable.Preview class="example-editable-disabled-preview" />
      <Editable.Input />
    </Editable.Root>
  );
}

/** Require a double click before the input appears. */
export function EditableWithDoubleClick(): JSX.Element {
  return (
    <Editable.Root defaultValue="Double click to edit" activationMode="dblclick">
      <Editable.Preview />
      <Editable.Input />
    </Editable.Root>
  );
}

/** Edit longer values with a native textarea. */
export function EditableWithTextarea(): JSX.Element {
  return (
    <Editable.Root defaultValue="Click to edit">
      <Editable.Preview class="example-editable-textarea-preview" />
      <Editable.Textarea />
    </Editable.Root>
  );
}
