import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, RadioCard } from '../src';
import { guideFrameworks, type GuideFramework } from './radio-card-guide-data';

export type FrameworkCardsProps = {
  readonly label?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'surface' | 'subtle' | 'outline' | 'solid';
  readonly colorPalette?: string;
  readonly description?: boolean;
  readonly addon?: boolean;
  readonly items?: readonly GuideFramework[];
  readonly value?: string | null;
  readonly onValueChange?: (details: { value: string | null }) => void;
  readonly testId?: string;
};

/** Render the guide's shared framework choices with optional explanatory parts. */
export function FrameworkCards(props: FrameworkCardsProps): JSX.Element {
  return (
    <RadioCard.Root
      size={props.size}
      variant={props.variant}
      colorPalette={props.colorPalette}
      defaultValue="next"
      value={props.value}
      onValueChange={props.onValueChange}
      data-testid={props.testId}
    >
      <RadioCard.Label>{props.label ?? 'Select framework'}</RadioCard.Label>
      <HStack align="stretch">
        <For each={props.items ?? guideFrameworks}>
          {
            /** Preserve each native input and card value in collection order. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Show
                    when={props.description || props.addon}
                    fallback={<RadioCard.ItemText>{item.title}</RadioCard.ItemText>}
                  >
                    <RadioCard.ItemContent>
                      <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                      <Show when={props.description}>
                        <RadioCard.ItemDescription>{item.description}</RadioCard.ItemDescription>
                      </Show>
                    </RadioCard.ItemContent>
                  </Show>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
                <Show when={props.addon}>
                  <RadioCard.ItemAddon>Some addon text</RadioCard.ItemAddon>
                </Show>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}
