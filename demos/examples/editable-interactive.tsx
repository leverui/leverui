import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Code,
  Editable,
  Input,
  Stack,
  useEditable,
  type EditableValueChangeDetails,
} from '../../src';

/** Keep the Editable value in caller-owned Solid state. */
export function EditableControlled(): JSX.Element {
  const [name, setName] = createSignal('');

  /** Reflect every committed or draft value in the signal. */
  function updateName(details: EditableValueChangeDetails): void {
    setName(details.value);
  }

  return (
    <Editable.Root value={name()} onValueChange={updateName} placeholder="Click to edit">
      <Editable.Preview />
      <Editable.Input />
    </Editable.Root>
  );
}

/** Send keyboard focus to the next field after editing ends. */
export function EditableWithFinalFocus(): JSX.Element {
  let nextInput: HTMLInputElement | undefined;

  /** Return the native field to focus after submission. */
  function finalFocus(): HTMLElement | null {
    return nextInput ?? null;
  }

  return (
    <Stack>
      <Editable.Root finalFocusEl={finalFocus} defaultValue="Weekly report">
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger>Edit</Editable.EditTrigger>
          <Editable.CancelTrigger>Cancel</Editable.CancelTrigger>
          <Editable.SubmitTrigger>Submit</Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <Input placeholder="Focus moves here next" ref={nextInput} />
    </Stack>
  );
}

/** Show a caller-owned Editable machine and its editing state. */
export function EditableWithStore(): JSX.Element {
  const editable = useEditable({ defaultValue: 'Click to edit' });

  return (
    <Stack align="flex-start">
      <Editable.RootProvider value={editable}>
        <Editable.Preview />
        <Editable.Input />
      </Editable.RootProvider>
      <Code>{editable().editing ? 'editing' : 'not editing'}</Code>
    </Stack>
  );
}
