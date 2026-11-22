import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioGroup } from '../../src';

const options = [
  { label: 'Standard', value: '1' },
  { label: 'Express', value: '2' },
  { label: 'Pickup', value: '3' },
] as const;

/** Render the three native radio choices. */
export function RadioChoices(): JSX.Element {
  return (
    <HStack gap="6">
      <For each={options}>
        {
          /** Render one labeled radio option. */
          (option) => (
            <RadioGroup.Item value={option.value}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
            </RadioGroup.Item>
          )
        }
      </For>
    </HStack>
  );
}
