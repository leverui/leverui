import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Stack, Steps } from '../../src';

const items = [
  { title: 'Step 1', description: 'Step 1 description' },
  { title: 'Step 2', description: 'Step 2 description' },
  { title: 'Step 3', description: 'Step 3 description' },
] as const;

/** Compare the three step sizes from a fresh first step. */
export function StepsWithSizes(): JSX.Element {
  return (
    <Stack gap="16">
      <For each={['sm', 'md', 'lg'] as const}>
        {(size) => (
          <Steps.Root size={size} items={items.map((_, index) => ({ value: `step-${index}` }))}>
            <Steps.List>
              <For each={items}>
                {(item, index) => (
                  <Steps.Item value={`step-${index()}`} title={item.title}>
                    <Steps.Indicator />
                    <Steps.Title>{item.title}</Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
                )}
              </For>
            </Steps.List>
            <For each={items}>
              {(item, index) => (
                <Steps.Content value={`step-${index()}`}>{item.description}</Steps.Content>
              )}
            </For>
            <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>
            <ButtonGroup size="sm" variant="outline">
              <Steps.PrevTrigger asChild={(getProps) => <Button {...getProps()}>Prev</Button>} />
              <Steps.NextTrigger asChild={(getProps) => <Button {...getProps()}>Next</Button>} />
            </ButtonGroup>
          </Steps.Root>
        )}
      </For>
    </Stack>
  );
}

/** Compare the subtle and solid step treatments. */
export function StepsWithVariants(): JSX.Element {
  return (
    <Stack gap="16">
      <For each={['subtle', 'solid'] as const}>
        {(variant) => (
          <Steps.Root
            variant={variant}
            items={items.map((_, index) => ({ value: `step-${index}` }))}
          >
            <Steps.List>
              <For each={items}>
                {(item, index) => (
                  <Steps.Item value={`step-${index()}`} title={item.title}>
                    <Steps.Indicator />
                    <Steps.Title>{item.title}</Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
                )}
              </For>
            </Steps.List>
            <For each={items}>
              {(item, index) => (
                <Steps.Content value={`step-${index()}`}>{item.description}</Steps.Content>
              )}
            </For>
            <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>
            <ButtonGroup size="sm" variant="outline">
              <Steps.PrevTrigger asChild={(getProps) => <Button {...getProps()}>Prev</Button>} />
              <Steps.NextTrigger asChild={(getProps) => <Button {...getProps()}>Next</Button>} />
            </ButtonGroup>
          </Steps.Root>
        )}
      </For>
    </Stack>
  );
}
