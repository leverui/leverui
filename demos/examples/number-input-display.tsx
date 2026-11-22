import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ArrowRightLeftIcon, DollarSignIcon, MinusIcon, PlusIcon } from '@lucide/solid';
import { HStack, IconButton, InputGroup, NumberInput, Stack } from '../../src';
import { NumberInputExampleControl } from './number-input-standard';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Compare percent, currency, and length formatting. */
export function NumberInputFormatOptions(): JSX.Element {
  return (
    <Stack gap="5" style={{ 'max-width': '200px' }}>
      <NumberInput.Root defaultValue={0.05} step={0.01} formatOptions={{ style: 'percent' }}>
        <NumberInputExampleControl />
      </NumberInput.Root>
      <NumberInput.Root
        defaultValue={45}
        formatOptions={{
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'code',
          currencySign: 'accounting',
        }}
      >
        <NumberInputExampleControl />
      </NumberInput.Root>
      <NumberInput.Root
        defaultValue={4}
        formatOptions={{ style: 'unit', unit: 'inch', unitDisplay: 'long' }}
      >
        <NumberInputExampleControl />
      </NumberInput.Root>
    </Stack>
  );
}

/** Expose pointer scrubbing before the editable numeric field. */
export function NumberInputScrubber(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }}>
      <NumberInput.Control />
      <InputGroup
        startElementProps={{ style: { 'pointer-events': 'auto' } }}
        startElement={
          <NumberInput.Scrubber>
            <ArrowRightLeftIcon />
          </NumberInput.Scrubber>
        }
      >
        <NumberInput.Input />
      </InputGroup>
    </NumberInput.Root>
  );
}

/** Render all four field sizes. */
export function NumberInputSizes(): JSX.Element {
  return (
    <Stack gap="5" style={{ width: '200px' }}>
      <For each={sizes}>
        {
          /** Give each CSS size its own number machine. */
          (size) => (
            <NumberInput.Root size={size} defaultValue={10}>
              <NumberInputExampleControl />
            </NumberInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Replace built-in spin controls with outline icon buttons. */
export function NumberInputStepper(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={3} unstyled spinOnPress={false}>
      <HStack gap="2">
        <NumberInput.DecrementTrigger
          asChild={
            /** Preserve decrement behavior on the outline button. */
            (getProps) => (
              <IconButton {...getProps()} variant="outline" size="sm">
                <MinusIcon />
              </IconButton>
            )
          }
        />
        <NumberInput.ValueText
          style={{
            'text-align': 'center',
            'font-size': 'var(--leverui-font-sizes-lg)',
            'min-width': '3ch',
          }}
        />
        <NumberInput.IncrementTrigger
          asChild={
            /** Preserve increment behavior on the outline button. */
            (getProps) => (
              <IconButton {...getProps()} variant="outline" size="sm">
                <PlusIcon />
              </IconButton>
            )
          }
        />
      </HStack>
    </NumberInput.Root>
  );
}

/** Place the currency icon before the numeric field. */
export function NumberInputElement(): JSX.Element {
  return (
    <NumberInput.Root defaultValue={10} style={{ width: '200px' }}>
      <NumberInput.Control />
      <InputGroup startElement={<DollarSignIcon />}>
        <NumberInput.Input />
      </InputGroup>
    </NumberInput.Root>
  );
}
