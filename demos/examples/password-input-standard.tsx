import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PasswordInput, Stack, Text } from '../../src';

/** Show the default password field and visibility button. */
export function PasswordInputBasic(): JSX.Element {
  return <PasswordInput />;
}

/** Keep the password value in a Solid signal. */
export function PasswordInputControlled(): JSX.Element {
  const [value, setValue] = createSignal('');

  /** Update the controlled password on each native input event. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
  }

  return <PasswordInput value={value()} onInput={updateValue} />;
}

/** Show an externally controlled visibility state beside the input. */
export function PasswordInputControlledVisibility(): JSX.Element {
  const [visible, setVisible] = createSignal(false);

  /** Let the visibility trigger update the example's signal. */
  function updateVisible(next: boolean): void {
    setVisible(next);
  }

  return (
    <Stack>
      <PasswordInput defaultValue="secret" visible={visible()} onVisibleChange={updateVisible} />
      <Text>Password is {visible() ? 'visible' : 'hidden'}</Text>
    </Stack>
  );
}

/** Compare the four Password Input sizes. */
export function PasswordInputWithSizes(): JSX.Element {
  return (
    <Stack style={{ 'max-width': '300px' }}>
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one labeled size. */
          (size) => <PasswordInput placeholder={size} size={size} />
        }
      </For>
    </Stack>
  );
}
