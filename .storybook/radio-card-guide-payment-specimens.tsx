import { createSignal, For, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Icon, RadioCard } from '../src';
import { guidePayments } from './radio-card-guide-data';
import { RadioCardGuideIcon } from './radio-card-guide-icons';
import type { RadioCardStoryProps } from '../demos/examples/radio-card-story-props';
import '../demos/radio-card-consumer.css';

interface PaymentCardsProps {
  orientation: 'horizontal' | 'vertical';
  wideHorizontal?: boolean | undefined;
  testId?: string | undefined;
}

/** Render the three payment options without dot indicators. */
function PaymentCards(props: PaymentCardsProps): JSX.Element {
  return (
    <RadioCard.Root
      orientation={props.orientation}
      align="center"
      justify={props.wideHorizontal ? 'center' : undefined}
      class={
        props.wideHorizontal
          ? 'leverui-radio-card-payment-wide'
          : 'leverui-radio-card-payment-compact'
      }
      defaultValue="wallet"
      data-testid={props.testId}
    >
      <RadioCard.Label>Payment method</RadioCard.Label>
      <HStack align={props.wideHorizontal ? 'stretch' : undefined}>
        <For each={guidePayments}>
          {
            /** Pair each payment icon with a native selectable card. */
            (item) => (
              <RadioCard.Item value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Icon
                    class={
                      props.wideHorizontal
                        ? 'radio-card-payment-icon-wide'
                        : 'radio-card-payment-icon-compact'
                    }
                  >
                    <RadioCardGuideIcon kind={item.icon} />
                  </Icon>
                  <RadioCard.ItemText
                    class={props.wideHorizontal ? 'leverui-radio-card-payment-offset' : undefined}
                  >
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

/** Center payment choices in horizontal cards. */
export function RadioCardWithoutIndicator(props: RadioCardStoryProps = {}): JSX.Element {
  return <PaymentCards orientation="horizontal" wideHorizontal testId={props.testId} />;
}

/** Stack payment icon and label within each card. */
export function RadioCardWithoutIndicatorVertical(props: RadioCardStoryProps = {}): JSX.Element {
  return <PaymentCards orientation="vertical" testId={props.testId} />;
}

/** Switch the payment card orientation at the md breakpoint. */
export function RadioCardResponsiveOrientation(props: RadioCardStoryProps = {}): JSX.Element {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('horizontal');

  /** Observe the viewport breakpoint for this mounted story. */
  function connectBreakpoint(): (() => void) | undefined {
    const query = window.matchMedia('(min-width: 48rem)');
    setOrientation(query.matches ? 'vertical' : 'horizontal');

    /** Keep the radio machine aligned with later viewport changes. */
    function updateOrientation(event: MediaQueryListEvent): void {
      setOrientation(event.matches ? 'vertical' : 'horizontal');
    }

    query.addEventListener('change', updateOrientation);
    /** Release the story's media-query listener on unmount. */
    return () => query.removeEventListener('change', updateOrientation);
  }

  onSettled(connectBreakpoint);
  return <PaymentCards orientation={orientation()} testId={props.testId} />;
}
