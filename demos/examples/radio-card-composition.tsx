import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon } from '@lucide/solid';
import { Group, HStack, Icon, RadioCard } from '../../src';
import '../radio-card-consumer.css';
import './radio-card-examples.css';

const frameworks = [
  { value: 'next', title: 'Next.js' },
  { value: 'vite', title: 'Vite' },
  { value: 'astro', title: 'Astro' },
] as const;

const experience = [
  { value: 'advanced', title: 'Advanced', description: 'I build large apps with it' },
  { value: 'professional', title: 'Intermediate', description: 'I can build small things' },
  { value: 'beginner', title: 'Beginner', description: 'I am just getting started' },
] as const;

const explorerItems = [
  {
    value: 'next',
    title: 'Next.js',
    description: 'For full-stack web apps',
    addon: 'Most popular',
  },
  {
    value: 'vite',
    title: 'Vite',
    description: 'A fast build tool for single-page apps',
    addon: 'Fast dev server',
  },
  {
    value: 'astro',
    title: 'Astro',
    description: 'For static sites with a lot of content',
    addon: 'Good for blogs and docs',
  },
] as const;

/** Attach vertically stacked experience cards with the Group component. */
export function RadioCardComposition(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next" class="example-radio-card-composition">
      <RadioCard.Label>How well do you know SolidJS?</RadioCard.Label>
      <Group attached orientation="vertical">
        <For each={experience}>
          {
            /** Render one attached experience card. */
            (item) => (
              <RadioCard.Item value={item.value} class="example-radio-card-full">
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemIndicator />
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                    <RadioCard.ItemDescription>{item.description}</RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </Group>
    </RadioCard.Root>
  );
}

/** Use a selected check icon in place of the ordinary radio dot. */
export function RadioCardCustomIndicator(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Select framework</RadioCard.Label>
      <HStack align="stretch">
        <For each={frameworks}>
          {
            /** Give each framework an accessible checked icon renderer. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                  <RadioCard.ItemIndicator
                    class="example-radio-card-custom-indicator"
                    checked={
                      /** Forward the indicator attributes to an Icon that wraps the check. */
                      (getProps) => (
                        <Icon as="span" {...getProps()}>
                          <CheckIcon />
                        </Icon>
                      )
                    }
                  />
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}

/** Show the card parts highlighted by the anatomy explorer. */
export function RadioCardExplorerDemo(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Select your favorite framework</RadioCard.Label>
      <HStack align="stretch" gap="4" wrap="wrap">
        <For each={explorerItems}>
          {
            /** Render one explorer card with description and addon. */
            (item) => (
              <RadioCard.Item value={item.value} style={{ flex: '1' }}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText
                      style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}
                    >
                      {item.title}
                    </RadioCard.ItemText>
                    <RadioCard.ItemDescription
                      style={{
                        'font-size': 'var(--leverui-font-sizes-sm)',
                        color: 'var(--leverui-colors-gray-600)',
                      }}
                    >
                      {item.description}
                    </RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                  <RadioCard.ItemIndicator
                    style={{ color: 'var(--leverui-colors-green-500)', 'border-width': '0' }}
                    checked={
                      /** Render the selected check inside an Icon that takes the indicator attributes. */
                      (getProps) => (
                        <Icon as="span" {...getProps()}>
                          <CheckIcon />
                        </Icon>
                      )
                    }
                  />
                </RadioCard.ItemControl>
                <RadioCard.ItemAddon
                  style={{
                    'font-size': 'var(--leverui-font-sizes-xs)',
                    color: 'var(--leverui-colors-gray-500)',
                  }}
                >
                  {item.addon}
                </RadioCard.ItemAddon>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}
