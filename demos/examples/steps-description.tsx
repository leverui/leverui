import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Steps } from '../../src';

const items = [
  { title: 'Account', description: 'Your login', content: 'Enter your email and a password.' },
  { title: 'Profile', description: 'About you', content: 'Add your name and a photo.' },
  { title: 'Review', description: 'Final check', content: 'Check your details before you finish.' },
] as const;

/** Add the explanatory line under every step title. */
export function StepsDescription(): JSX.Element {
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
              <div>
                <Steps.Title>{item.title}</Steps.Title>
                <Steps.Description>{item.description}</Steps.Description>
              </div>
              <Steps.Separator />
            </Steps.Item>
          )}
        </For>
      </Steps.List>
      <For each={items}>
        {(item, index) => <Steps.Content value={`step-${index()}`}>{item.content}</Steps.Content>}
      </For>
      <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>
      <ButtonGroup size="sm" variant="outline">
        <Steps.PrevTrigger asChild={(getProps) => <Button {...getProps()}>Prev</Button>} />
        <Steps.NextTrigger asChild={(getProps) => <Button {...getProps()}>Next</Button>} />
      </ButtonGroup>
    </Steps.Root>
  );
}
