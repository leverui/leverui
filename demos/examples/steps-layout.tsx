import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Stack, Steps } from '../../src';
import './steps-standard.css';

const items = [
  { title: 'Account', description: 'Enter your email and choose a password.' },
  { title: 'Profile', description: 'Add your name and a photo.' },
  { title: 'Review', description: 'Check your details before you finish.' },
] as const;

/** Stack the step list beside its panels in the vertical CSS appearance. */
export function StepsVertical(): JSX.Element {
  return (
    <Steps.Root
      orientation="vertical"
      class="steps-vertical-root"
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
      <Stack>
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
      </Stack>
    </Steps.Root>
  );
}
