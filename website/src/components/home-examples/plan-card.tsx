import { Button, Card, RadioCard } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const plans = [
  { name: 'Monthly', price: '$12 a month' },
  { name: 'Yearly', price: '$120 a year' },
] as const;

/** A choice between two billing plans. */
export function PlanCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Plan</Card.Title>
        <Card.Description>Change it at any time.</Card.Description>
      </Card.Header>
      <Card.Body>
        <div class="home-example-stack">
          <RadioCard.Root defaultValue="Yearly" size="sm" colorPalette="cyan">
            <div class="home-example-stack">
              <For each={plans}>
                {/** Show one plan as a card. */}
                {(plan) => (
                  <RadioCard.Item value={plan.name}>
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemContent>
                        <RadioCard.ItemText>{plan.name}</RadioCard.ItemText>
                        <RadioCard.ItemDescription>{plan.price}</RadioCard.ItemDescription>
                      </RadioCard.ItemContent>
                      <RadioCard.ItemIndicator />
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                )}
              </For>
            </div>
          </RadioCard.Root>
          <Button type="button" variant="outline" size="sm">
            Update plan
          </Button>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
