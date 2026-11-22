import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, Stack, Steps } from '../../src';

const items = [
  { title: 'Step 1', description: 'Step 1 description' },
  { title: 'Step 2', description: 'Step 2 description' },
  { title: 'Step 3', description: 'Step 3 description' },
] as const;
const colorPalettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;

/** Show the second step in each color palette. */
export function StepsWithColors(): JSX.Element {
  return (
    <Stack gap="10" style={{ width: '100%' }}>
      <For each={colorPalettes}>
        {(colorPalette) => (
          <Steps.Root
            defaultValue="step-1"
            defaultCompletedValues={['step-0']}
            items={items.map((_, index) => ({ value: `step-${index}` }))}
            colorPalette={colorPalette}
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
