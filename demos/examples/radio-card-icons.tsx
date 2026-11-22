import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ArrowRightIcon,
  CircleOffIcon,
  ClockIcon,
  DollarSignIcon,
  LockIcon,
  TrendingUpIcon,
} from '@lucide/solid';
import { HStack, Icon, RadioCard } from '../../src';
import './radio-card-examples.css';

const permissions = [
  {
    icon: ArrowRightIcon,
    value: 'allow',
    title: 'Allow',
    description: 'This user can sign in and use the app',
  },
  {
    icon: CircleOffIcon,
    value: 'deny',
    title: 'Deny',
    description: 'This user cannot sign in to the app',
  },
  {
    icon: LockIcon,
    value: 'lock',
    title: 'Lock',
    description: 'This user is locked out until an admin unlocks them',
  },
] as const;

const contracts = [
  { icon: DollarSignIcon, value: 'fixed', title: 'Fixed rate' },
  { icon: TrendingUpIcon, value: 'milestone', title: 'Milestone' },
  { icon: ClockIcon, value: 'hourly', title: 'Hourly' },
] as const;

/** Place each permission icon above its title and description. */
export function RadioCardIcon(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="next">
      <RadioCard.Label>Select permission</RadioCard.Label>
      <HStack align="stretch">
        <For each={permissions}>
          {
            /** Render one permission card with its decorative icon. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <Icon
                      as="span"
                      size="xl"
                      class="example-radio-card-icon example-radio-card-icon-large"
                    >
                      <item.icon />
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

/** Center each contract icon above its title and indicator. */
export function RadioCardCentered(): JSX.Element {
  return (
    <RadioCard.Root orientation="vertical" align="center" defaultValue="next">
      <RadioCard.Label>Select contract type</RadioCard.Label>
      <HStack align="stretch">
        <For each={contracts}>
          {
            /** Render one centered contract card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon as="span" class="example-radio-card-icon">
                    <item.icon />
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
