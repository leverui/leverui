import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Checkbox,
  CheckboxGroup,
  HStack,
  Stack,
  Text,
  useCheckbox,
  type CheckboxCheckedChangeDetails,
} from '../../src';
import './checkbox-examples.css';

/** Show the unchecked checkbox and terms label. */
export function CheckboxBasic(): JSX.Element {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
    </Checkbox.Root>
  );
}

/** Keep the check state in a caller-owned Solid signal. */
export function CheckboxControlled(): JSX.Element {
  const [checked, setChecked] = createSignal(false);

  /** Convert the checked detail into the boolean controlled contract. */
  function updateChecked(details: CheckboxCheckedChangeDetails): void {
    setChecked(details.checked === true);
  }

  return (
    <Checkbox.Root checked={checked()} onCheckedChange={updateChecked}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
    </Checkbox.Root>
  );
}

/** Show disabled, checked disabled, read-only, and invalid states. */
export function CheckboxWithStates(): JSX.Element {
  return (
    <Stack>
      <Checkbox.Root disabled>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Disabled</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root defaultChecked disabled>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Disabled</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root readOnly>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Read-only</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root invalid>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Invalid</Checkbox.Label>
      </Checkbox.Root>
    </Stack>
  );
}

/** Give the checkbox an external machine store. */
export function CheckboxWithStore(): JSX.Element {
  const checkbox = useCheckbox();
  return (
    <Checkbox.RootProvider value={checkbox}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
    </Checkbox.RootProvider>
  );
}

/** Place the label before its control in the inline layout. */
export function CheckboxWithLabelPosition(): JSX.Element {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
      <Checkbox.Control />
    </Checkbox.Root>
  );
}

/** Compare the Checkbox variants. */
export function CheckboxWithVariants(): JSX.Element {
  return (
    <HStack align="flex-start">
      <For each={['outline', 'subtle', 'solid'] as const}>
        {
          /** Label one checked Checkbox with its variant. */
          (variant) => (
            <Stack align="flex-start" class="example-checkbox-column">
              <Text>{variant}</Text>
              <Checkbox.Root defaultChecked variant={variant}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Checkbox</Checkbox.Label>
              </Checkbox.Root>
            </Stack>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare the Checkbox sizes. */
export function CheckboxWithSizes(): JSX.Element {
  return (
    <Stack align="flex-start" gap="4" class="example-checkbox-column">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render one checked Checkbox at each size. */
          (size) => (
            <Checkbox.Root defaultChecked size={size}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Checkbox</Checkbox.Label>
            </Checkbox.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Show every public Checkbox part for the guide's anatomy explorer. */
export function CheckboxExplorerDemo(): JSX.Element {
  return (
    <CheckboxGroup defaultValue={['terms']} style={{ gap: 'var(--leverui-spacing-4)' }}>
      <For
        each={[
          { value: 'terms', label: 'Accept terms and conditions' },
          { value: 'newsletter', label: 'Subscribe to newsletter' },
          { value: 'updates', label: 'Receive product updates' },
        ]}
      >
        {
          /** Render one explorable option. */
          (item) => (
            <Checkbox.Root value={item.value}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>{item.label}</Checkbox.Label>
            </Checkbox.Root>
          )
        }
      </For>
    </CheckboxGroup>
  );
}
