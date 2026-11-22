import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Steps } from '../../src';

const items = [
  { title: 'Account', description: 'Enter your email and choose a password.' },
  { title: 'Profile', description: 'Add your name and a photo.' },
  { title: 'Review', description: 'Check your details before you finish.' },
] as const;

/** Show the default second step and navigation. */
export function StepsBasic(): JSX.Element {
  return (
    <Steps.Root
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
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

/** Make each heading a step navigation trigger. */
export function StepsTrigger(): JSX.Element {
  return (
    <Steps.Root
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
      items={items.map((_, index) => ({ value: `step-${index}` }))}
    >
      <Steps.List>
        <For each={items}>
          {(item, index) => (
            <Steps.Item value={`step-${index()}`} title={item.title}>
              <Steps.Trigger>
                <Steps.Indicator />
                <Steps.Title>{item.title}</Steps.Title>
              </Steps.Trigger>
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

/** Keep only the indicator numbers in the small step list. */
export function StepsNumberOnly(): JSX.Element {
  return (
    <Steps.Root
      size="sm"
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
      items={items.map((_, index) => ({ value: `step-${index}` }))}
    >
      <Steps.List>
        <For each={items}>
          {(item, index) => (
            <Steps.Item value={`step-${index()}`} title={item.title}>
              <Steps.Indicator />
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
