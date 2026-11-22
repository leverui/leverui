import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CloseButton, Input, InputGroup, Span } from '../../src';

const maxCharacters = 20;

/** Count entered characters beside the native maxlength field. */
export function InputCharacterCounter(): JSX.Element {
  const [value, setValue] = createSignal('');

  /** Follow native edits while respecting the character limit. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value.slice(0, maxCharacters));
  }

  return (
    <InputGroup
      endElement={
        <Span
          textStyle="xs"
          style={{
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          {value().length} / {maxCharacters}
        </Span>
      }
    >
      <Input
        placeholder="Enter your message"
        value={value()}
        maxlength={maxCharacters}
        onInput={updateValue}
      />
    </InputGroup>
  );
}

/** Clear a controlled email input and return focus to it. */
export function InputClearButton(): JSX.Element {
  const [value, setValue] = createSignal('mara@example.com');
  let input: HTMLInputElement | undefined;

  /** Capture the native input for focus restoration. */
  function captureInput(node: HTMLInputElement): void {
    input = node;
  }

  /** Follow edits in the caller-owned string. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
  }

  /** Clear text and keep keyboard focus in the field. */
  function clearValue(): void {
    setValue('');
    input?.focus();
  }

  return (
    <InputGroup
      endElement={
        value() ? (
          <CloseButton
            size="xs"
            onClick={clearValue}
            style={{ 'margin-inline-end': 'calc(-1 * var(--leverui-spacing-2))' }}
          />
        ) : undefined
      }
    >
      <Input ref={captureInput} placeholder="Email" value={value()} onInput={updateValue} />
    </InputGroup>
  );
}

/** Apply the Brazilian telephone grouping to entered digits. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  const area = `(${digits.slice(0, 2)}`;
  if (digits.length <= 2) return area;
  const prefix = `${area}) ${digits.slice(2, 7)}`;
  return digits.length <= 7 ? prefix : `${prefix}-${digits.slice(7)}`;
}

/** Format the telephone input directly from its current value. */
export function InputMask(): JSX.Element {
  const [value, setValue] = createSignal('');

  /** Reformat newly entered digits in the native input. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(formatPhone(event.currentTarget.value));
  }

  return <Input placeholder="(99) 99999-9999" value={value()} onInput={updateValue} />;
}
