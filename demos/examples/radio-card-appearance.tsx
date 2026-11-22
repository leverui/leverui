import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioCard, Stack } from '../../src';
import { colorPalettes } from './playground-matrix';

const frameworks = [
  { value: 'next', title: 'Next.js' },
  { value: 'vite', title: 'Vite' },
] as const;

/** Compare the three card sizes. */
export function RadioCardSizes(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render one independently selectable size group. */
          (size) => (
            <RadioCard.Root size={size} defaultValue="next">
              <RadioCard.Label>size = ({size})</RadioCard.Label>
              <HStack align="stretch">
                <For each={frameworks}>
                  {
                    /** Render one framework card. */
                    (item) => (
                      <RadioCard.Item value={item.value}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    )
                  }
                </For>
              </HStack>
            </RadioCard.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the framework cards across every color palette. */
export function RadioCardColors(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={colorPalettes}>
        {
          /** Render one independently selectable palette group. */
          (colorPalette) => (
            <RadioCard.Root colorPalette={colorPalette} defaultValue="next">
              <RadioCard.Label>Select framework</RadioCard.Label>
              <HStack align="stretch">
                <For each={frameworks}>
                  {
                    /** Render one framework card. */
                    (item) => (
                      <RadioCard.Item value={item.value}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    )
                  }
                </For>
              </HStack>
            </RadioCard.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the four teal card variants. */
export function RadioCardVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['surface', 'subtle', 'outline', 'solid'] as const}>
        {
          /** Render one independently selectable variant group. */
          (variant) => (
            <RadioCard.Root colorPalette="teal" variant={variant} defaultValue="next">
              <RadioCard.Label>variant = ({variant})</RadioCard.Label>
              <HStack align="stretch">
                <For each={frameworks}>
                  {
                    /** Render one framework card. */
                    (item) => (
                      <RadioCard.Item value={item.value}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    )
                  }
                </For>
              </HStack>
            </RadioCard.Root>
          )
        }
      </For>
    </Stack>
  );
}
