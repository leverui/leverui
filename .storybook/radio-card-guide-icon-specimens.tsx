import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Icon, RadioCard } from '../src';
import { RadioCardGuideIcon } from './radio-card-guide-icons';
import type { RadioCardStoryProps } from '../demos/examples/radio-card-story-props';
import '../demos/radio-card-consumer.css';

const contracts = [
  { value: 'fixed', title: 'Fixed Rate', icon: 'dollar' },
  { value: 'milestone', title: 'Milestone', icon: 'trend' },
  { value: 'hourly', title: 'Hourly', icon: 'clock' },
] as const;

const permissions = [
  { value: 'allow', title: 'Allow', description: 'This user can access the system', icon: 'arrow' },
  {
    value: 'deny',
    title: 'Deny',
    description: 'This user will be denied access to the system',
    icon: 'blocked',
  },
  {
    value: 'lock',
    title: 'Lock',
    description: 'This user will be locked out of the system',
    icon: 'lock',
  },
] as const;

/** Center the contract icons above their radio card labels. */
export function RadioCardCentered(props: RadioCardStoryProps = {}): JSX.Element {
  return (
    <RadioCard.Root
      orientation="vertical"
      align="center"
      defaultValue="next"
      data-testid={props.testId}
    >
      <RadioCard.Label>Select contract type</RadioCard.Label>
      <HStack align="stretch">
        <For each={contracts}>
          {
            /** Render an accessible option with its decorative contract icon. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon class="radio-card-centered-icon">
                    <RadioCardGuideIcon kind={item.icon} />
                  </Icon>
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

/** Place each permission icon above its title and explanation. */
export function RadioCardIcon(props: RadioCardStoryProps = {}): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next" data-testid={props.testId}>
      <RadioCard.Label>Select permission</RadioCard.Label>
      <HStack align="stretch">
        <For each={permissions}>
          {
            /** Keep the native input and permission copy inside one card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <Icon size="xl" class="radio-card-choice-icon">
                      <RadioCardGuideIcon kind={item.icon} />
                    </Icon>
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
