import { type JSX } from '@solidjs/web';
import { ArrowRightLeftIcon } from '@lucide/solid';
import { InputGroup, NumberInput, Stack, Text } from '../../src';

/** Render every Number Input part so the anatomy Explorer can highlight it. */
export function NumberInputExplorerDemo(): JSX.Element {
  return (
    <Stack
      gap="8"
      style={{ padding: 'var(--leverui-spacing-8)', width: '100%', 'max-width': '400px' }}
    >
      <Stack gap="1" align="flex-start">
        <Text style={{ 'font-size': 'var(--leverui-font-sizes-lg)', 'font-weight': '700' }}>
          Adjust a number
        </Text>
        <Text
          style={{
            'font-size': 'var(--leverui-font-sizes-sm)',
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          Use the arrows, type a number, or drag the scrubber to change the value.
        </Text>
      </Stack>
      <NumberInput.Root defaultValue={10} min={1} max={100} style={{ width: '100%' }}>
        <Stack gap="2" align="flex-start" style={{ width: '100%' }}>
          <NumberInput.Label
            style={{ 'font-size': 'var(--leverui-font-sizes-sm)', 'font-weight': '500' }}
          >
            Quantity
          </NumberInput.Label>
          <div style={{ position: 'relative', width: '100%' }}>
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <InputGroup
              startElementProps={{ style: { 'pointer-events': 'auto' } }}
              startElement={
                <NumberInput.Scrubber style={{ cursor: 'ew-resize' }}>
                  <ArrowRightLeftIcon />
                </NumberInput.Scrubber>
              }
            >
              <NumberInput.Input style={{ 'padding-left': 'var(--leverui-spacing-10)' }} />
            </InputGroup>
          </div>
          <Text
            style={{
              'font-size': 'var(--leverui-font-sizes-xs)',
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            Enter a number between 1 and 100. Current value: <NumberInput.ValueText />
          </Text>
        </Stack>
      </NumberInput.Root>
    </Stack>
  );
}
