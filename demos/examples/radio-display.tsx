import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioGroup, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
] as const;

/** Show the three framework options in each palette. */
export function RadioWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Render one palette row. */
          (palette) => (
            <HStack gap="10" style={{ 'padding-inline': 'var(--leverui-spacing-4)' }}>
              <Text style={{ 'min-width': '8ch' }}>{palette}</Text>
              <RadioGroup.Root colorPalette={palette} defaultValue="react">
                <For each={frameworks}>
                  {
                    /** Render one framework choice, spaced from the previous one. */
                    (item, index) => (
                      <RadioGroup.Item
                        value={item.value}
                        style={
                          index() > 0 ? { 'margin-inline-start': 'var(--leverui-spacing-8)' } : {}
                        }
                      >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    )
                  }
                </For>
              </RadioGroup.Root>
            </HStack>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare three radio sizes in one row. */
export function RadioWithSizes(): JSX.Element {
  return (
    <HStack gap="4">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render one independently selectable size. */
          (size) => (
            <RadioGroup.Root size={size}>
              <RadioGroup.Item value="react">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Radio ({size})</RadioGroup.ItemText>
              </RadioGroup.Item>
            </RadioGroup.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Show the three documented radio variants with teal accents. */
export function RadioWithVariants(): JSX.Element {
  return (
    <Stack gap="4">
      <For each={['solid', 'outline', 'subtle'] as const}>
        {
          /** Render one radio variant row. */
          (variant) => (
            <RadioGroup.Root variant={variant} defaultValue="react" colorPalette="teal">
              <HStack gap="4">
                <RadioGroup.Item value="react" style={{ 'min-width': '120px' }}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>React ({variant})</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="vue">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Vue ({variant})</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          )
        }
      </For>
    </Stack>
  );
}
