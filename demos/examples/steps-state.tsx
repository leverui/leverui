import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Code, Stack, Steps, useSteps } from '../../src';

const items = [
  { title: 'Account', description: 'Enter your email and choose a password.' },
  { title: 'Profile', description: 'Add your name and a photo.' },
  { title: 'Review', description: 'Check your details before you finish.' },
] as const;

/** Keep the current step in caller-owned Solid state. */
export function StepsControlled(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('step-1');
  return (
    <Steps.Root
      value={value() ?? undefined}
      defaultCompletedValues={['step-0']}
      onValueChange={
        /** Follow the machine's step changes. */
        (details) => setValue(details.value)
      }
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
  );
}

/** Display the caller-owned machine's current step beside the guide. */
export function StepsStore(): JSX.Element {
  const steps = useSteps({
    defaultValue: 'step-1',
    defaultCompletedValues: ['step-0'],
    items: items.map((_, index) => ({ value: `step-${index}` })),
  });
  return (
    <Stack align="flex-start">
      <Code>current step: {steps().value}</Code>
      <Steps.RootProvider value={steps}>
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
      </Steps.RootProvider>
    </Stack>
  );
}
