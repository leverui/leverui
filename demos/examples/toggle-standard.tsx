import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { BoldIcon } from '@lucide/solid';
import { Button, Code, Stack, Toggle } from '../../src';

/** Show a bold button whose solid variant follows the pressed state. */
export function ToggleBasic(): JSX.Element {
  return (
    <Toggle.Root
      style={{ 'padding-inline': '0' }}
      asChild={
        /** Attach the toggle semantics to the styled Button. */
        (getProps) => (
          <Button
            {...getProps({ class: 'toggle-example-solid-when-pressed' })}
            variant="subtle"
            aria-label="Bold"
          >
            <BoldIcon />
          </Button>
        )
      }
    />
  );
}

/** Keep the button and displayed state synchronized through a Solid signal. */
export function ToggleControlled(): JSX.Element {
  const [pressed, setPressed] = createSignal(false);

  /** Store the next pressed value in the controlled signal. */
  function handlePressedChange(value: boolean): void {
    setPressed(value);
  }

  return (
    <Stack align="flex-start">
      <Toggle.Root
        pressed={pressed()}
        onPressedChange={handlePressedChange}
        asChild={
          /** Preserve one interactive button for the controlled root. */
          (getProps) => (
            <Button {...getProps({ class: 'toggle-example-solid-when-pressed' })} variant="subtle">
              Pressed
            </Button>
          )
        }
      />
      <Code size="sm" style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
        Pressed: {pressed() ? 'true' : 'false'}
      </Code>
    </Stack>
  );
}
