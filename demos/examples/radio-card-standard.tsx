import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioCard } from '../../src';

const frameworks = [
  { value: 'next', title: 'Next.js', description: 'Best for apps' },
  { value: 'vite', title: 'Vite', description: 'Best for SPAs' },
  { value: 'astro', title: 'Astro', description: 'Best for static sites' },
] as const;

/** Render three framework cards with a title and indicator. */
export function RadioCardBasic(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
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
  );
}

/** Add a description under each framework title. */
export function RadioCardDescription(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Select framework</RadioCard.Label>
      <HStack align="stretch">
        <For each={frameworks}>
          {
            /** Render one described framework card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                    <RadioCard.ItemDescription>{item.description}</RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}

/** Keep the selected card in a Solid signal. */
export function RadioCardControlled(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('next');

  /** Store the newly selected card value. */
  function updateValue(details: { value: string | null }): void {
    setValue(details.value);
  }

  return (
    <RadioCard.Root value={value()} onValueChange={updateValue}>
      <RadioCard.Label>Select framework</RadioCard.Label>
      <HStack align="stretch">
        <For each={frameworks}>
          {
            /** Render one controlled framework card. */
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
  );
}

/** Add a metadata strip under each described framework. */
export function RadioCardAddon(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Select framework</RadioCard.Label>
      <HStack align="stretch">
        <For each={frameworks}>
          {
            /** Render one framework card with its addon. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                    <RadioCard.ItemDescription>{item.description}</RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
                <RadioCard.ItemAddon>Free and open source</RadioCard.ItemAddon>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}
