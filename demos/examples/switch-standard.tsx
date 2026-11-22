import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { MoonIcon, SunIcon } from '@lucide/solid';
import { HStack, Stack, Switch, Text, type SwitchCheckedChangeDetails } from '../../src';
import { colorPalettes } from './playground-matrix';
import './switch-examples.css';

/** Render the default switch with the requested visible copy. */
export function SwitchBasic(): JSX.Element {
  return (
    <Switch.Root>
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Email notifications</Switch.Label>
    </Switch.Root>
  );
}

/** Keep the checked state in a Solid signal. */
export function SwitchControlled(): JSX.Element {
  const [checked, setChecked] = createSignal(false);

  /** Reflect the checked change in the controlled signal. */
  function updateChecked(details: SwitchCheckedChangeDetails): void {
    setChecked(details.checked);
  }

  return (
    <Switch.Root checked={checked()} onCheckedChange={updateChecked}>
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label />
    </Switch.Root>
  );
}

/** Display all four switch sizes in the horizontal stack. */
export function SwitchWithSizes(): JSX.Element {
  return (
    <HStack gap="8">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Render one switch for the selected size. */
          (size) => (
            <Switch.Root size={size}>
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label />
            </Switch.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare the raised and solid treatments side by side. */
export function SwitchWithVariants(): JSX.Element {
  return (
    <HStack gap="8">
      <For each={['raised', 'solid'] as const}>
        {
          /** Render one switch for the selected variant. */
          (variant) => (
            <Switch.Root variant={variant}>
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label />
            </Switch.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare unchecked and checked switches in every color palette. */
export function SwitchWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Render a palette label beside its unchecked and checked switches. */
          (colorPalette) => (
            <Stack align="center" direction="row" gap="10" class="example-switch-row">
              <Text class="example-switch-label">{colorPalette}</Text>
              <Switch.Root colorPalette={colorPalette}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label />
              </Switch.Root>
              <Switch.Root colorPalette={colorPalette} defaultChecked>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label />
              </Switch.Root>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Show the noninteractive disabled state. */
export function SwitchWithDisabled(): JSX.Element {
  return (
    <Switch.Root disabled>
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Email notifications</Switch.Label>
    </Switch.Root>
  );
}

/** Show the invalid border around the track. */
export function SwitchWithInvalid(): JSX.Element {
  return (
    <Switch.Root invalid>
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Email notifications</Switch.Label>
    </Switch.Root>
  );
}

/** Render every Switch anatomy part for the guide Explorer. */
export function SwitchExplorerDemo(): JSX.Element {
  return (
    <Switch.Root size="lg">
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
        <Switch.Indicator fallback={<MoonIcon />}>
          <SunIcon />
        </Switch.Indicator>
      </Switch.Control>
      <Switch.Label>Light mode</Switch.Label>
    </Switch.Root>
  );
}
