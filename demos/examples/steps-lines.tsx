import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Center, HStack, Steps } from '../../src';
import './steps-lines.css';

const lineSteps = [
  { title: 'Step one', description: 'Contact info' },
  { title: 'Step two', description: 'Date and time' },
  { title: 'Step three', description: 'Select rooms' },
] as const;

/** Place progress lines above clickable step titles. */
export function StepsLines(): JSX.Element {
  return (
    <Steps.Root
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
      items={lineSteps.map((_, index) => ({ value: `step-${index}` }))}
    >
      <Steps.List class="steps-lines-list">
        <For each={lineSteps}>
          {
            /** Draw one progress line and clickable heading. */
            (item, index) => (
              <Steps.Item value={`step-${index()}`} class="steps-lines-item">
                <Steps.Separator class="steps-lines-separator" />
                <Steps.Trigger>
                  <Steps.Title>{item.title}</Steps.Title>
                </Steps.Trigger>
              </Steps.Item>
            )
          }
        </For>
      </Steps.List>
      <For each={lineSteps}>
        {
          /** Match each card's content to its line heading. */
          (item, index) => (
            <Steps.Content value={`step-${index()}`}>
              <Center style={{ 'min-height': 'var(--leverui-sizes-20)', 'border-width': '1px' }}>
                {item.title} - {item.description}
              </Center>
            </Steps.Content>
          )
        }
      </For>
      <Steps.CompletedContent>
        <Center style={{ 'min-height': 'var(--leverui-sizes-20)', 'border-width': '1px' }}>
          Complete - Thank you!
        </Center>
      </Steps.CompletedContent>
      <HStack style={{ 'margin-top': 'var(--leverui-spacing-5)' }}>
        <Steps.PrevTrigger
          asChild={
            /** Forward the previous-step action to the outlined button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Prev
              </Button>
            )
          }
        />
        <Steps.NextTrigger
          asChild={
            /** Forward the next-step action to the outlined button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Next
              </Button>
            )
          }
        />
      </HStack>
    </Steps.Root>
  );
}
