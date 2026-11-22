import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Icon, RadioCard, useBreakpointValue } from '../../src';
import './radio-card-examples.css';
import { CreditCard, SmartphoneIcon, WalletIcon } from '@lucide/solid';

const payments = [
  { value: 'wallet', title: 'Wallet', icon: WalletIcon },
  { value: 'mobile-pay', title: 'Mobile pay', icon: SmartphoneIcon },
  { value: 'card', title: 'Card', icon: CreditCard },
] as const;

/** Center payment choices in horizontal cards without an indicator. */
export function RadioCardWithoutIndicator(): JSX.Element {
  return (
    <RadioCard.Root
      orientation="horizontal"
      align="center"
      justify="center"
      defaultValue="wallet"
      class="example-radio-card-payment-wide"
    >
      <RadioCard.Label>Payment method</RadioCard.Label>
      <HStack align="stretch">
        <For each={payments}>
          {
            /** Render one payment card with a leading icon. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon
                    as="span"
                    class="example-radio-card-payment-icon example-radio-card-payment-icon-subtle"
                  >
                    <item.icon />
                  </Icon>
                  <RadioCard.ItemText class="example-radio-card-payment-text">
                    {item.title}
                  </RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}

/** Stack each payment icon above its label. */
export function RadioCardWithoutIndicatorVertical(): JSX.Element {
  return (
    <RadioCard.Root
      orientation="vertical"
      align="center"
      defaultValue="wallet"
      class="example-radio-card-payment-compact"
    >
      <RadioCard.Label>Payment method</RadioCard.Label>
      <HStack>
        <For each={payments}>
          {
            /** Render one vertical payment card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon as="span" class="example-radio-card-payment-icon">
                    <item.icon />
                  </Icon>
                  <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}

/** Switch the payment cards from horizontal to vertical at the md breakpoint. */
export function RadioCardResponsiveOrientation(): JSX.Element {
  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'horizontal',
    md: 'vertical',
  });

  return (
    <RadioCard.Root
      orientation={orientation()}
      align="center"
      defaultValue="wallet"
      class="example-radio-card-payment-compact"
    >
      <RadioCard.Label>Payment method</RadioCard.Label>
      <HStack>
        <For each={payments}>
          {
            /** Render one responsive payment card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon as="span" class="example-radio-card-payment-icon">
                    <item.icon />
                  </Icon>
                  <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            )
          }
        </For>
      </HStack>
    </RadioCard.Root>
  );
}
