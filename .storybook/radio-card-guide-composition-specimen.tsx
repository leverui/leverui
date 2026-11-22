import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Group, RadioCard } from '../src';
import type { RadioCardStoryProps } from '../demos/examples/radio-card-story-props';
import '../demos/radio-card-consumer.css';

const experience = [
  { value: 'advanced', title: 'Advanced', description: 'I love complex things' },
  { value: 'professional', title: 'Professional', description: 'I can hack simple things' },
  { value: 'beginner', title: 'Beginner', description: "I don't write code" },
] as const;

/** Keep the attached-card contract specimen addressable by browser tests. */
export function RadioCardComposition(props: RadioCardStoryProps = {}): JSX.Element {
  return (
    <RadioCard.Root
      defaultValue="next"
      class="leverui-radio-card-composition"
      data-testid={props.testId}
    >
      <RadioCard.Label>How well do you know SolidJS?</RadioCard.Label>
      <Group attached orientation="vertical">
        <For each={experience}>
          {
            /** Keep each option's native radio and description together. */
            (item) => (
              <RadioCard.Item value={item.value}>
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
