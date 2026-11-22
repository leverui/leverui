import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Field, HStack, Input, Textarea } from '../../src';
import './textarea-examples.css';

type FieldMode = 'error' | 'field' | 'helper';

/** Compare subtle and outline textareas in one Field state. */
function TextareaFieldPair(props: { mode: FieldMode }): JSX.Element {
  return (
    <HStack gap="10" class="example-textarea-row">
      <For each={['subtle', 'outline'] as const}>
        {
          /** Render one variant with matching Field state and copy. */
          (variant) => (
            <Field.Root invalid={props.mode === 'error'} required={props.mode !== 'error'}>
              <Field.Label>
                Comment <Field.RequiredIndicator />
              </Field.Label>
              <Textarea placeholder="Start typing..." variant={variant} />
              <Show when={props.mode === 'error'}>
                <Field.ErrorText>A comment is required</Field.ErrorText>
              </Show>
              <Show when={props.mode === 'helper'}>
                <Field.HelperText>Max 500 characters.</Field.HelperText>
              </Show>
            </Field.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Show the invalid Field pair. */
export function TextareaWithErrorText(): JSX.Element {
  return <TextareaFieldPair mode="error" />;
}

/** Show the required Field pair. */
export function TextareaWithField(): JSX.Element {
  return <TextareaFieldPair mode="field" />;
}

/** Show the helper text under both variants. */
export function TextareaWithHelperText(): JSX.Element {
  return <TextareaFieldPair mode="helper" />;
}

/** Render a Field example that pairs Inputs. */
export function TextareaWithInputField(): JSX.Element {
  return (
    <HStack gap="10" class="example-textarea-row">
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="subtle" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="outline" />
      </Field.Root>
    </HStack>
  );
}
