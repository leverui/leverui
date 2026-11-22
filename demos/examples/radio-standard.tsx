import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioGroup } from '../../src';
import { RadioChoices } from './radio-choices';

/** Render the three native radio choices. */
export function RadioBasic(): JSX.Element {
  return (
    <RadioGroup.Root defaultValue="1">
      <RadioChoices />
    </RadioGroup.Root>
  );
}

/** Keep selection in a Solid signal for the controlled example. */
export function RadioControlled(): JSX.Element {
  const [value, setValue] = createSignal<string | null>(null);

  /** Store the radio group's selected value. */
  function updateValue(details: { value: string | null }): void {
    setValue(details.value);
  }

  return (
    <RadioGroup.Root value={value()} onValueChange={updateValue}>
      <RadioChoices />
    </RadioGroup.Root>
  );
}

const disabledOptions = [
  { label: 'Standard', value: '1' },
  { label: 'Express', value: '2', disabled: true },
  { label: 'Pickup', value: '3' },
];

/** Disable one radio item while the others stay selectable. */
export function RadioDisabled(): JSX.Element {
  return (
    <RadioGroup.Root defaultValue="2">
      <HStack gap="6">
        <For each={disabledOptions}>
          {
            /** Render one radio item with its disabled state. */
            (item) => (
              <RadioGroup.Item value={item.value} disabled={item.disabled}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
              </RadioGroup.Item>
            )
          }
        </For>
      </HStack>
    </RadioGroup.Root>
  );
}
