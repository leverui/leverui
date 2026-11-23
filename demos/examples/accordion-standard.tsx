import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Accordion, Span, Stack, Text } from '../../src';

const items = [
  { value: 'a', title: 'First item', text: 'Click a title to open its panel.' },
  { value: 'b', title: 'Second item', text: 'This panel is open when the page loads.' },
  { value: 'c', title: 'Third item', text: 'A panel can hold text, links, or other components.' },
] as const;
const controlledItems = [
  { value: 'first-item', title: 'First item', text: 'Click a title to open its panel.' },
  { value: 'second-item', title: 'Second item', text: 'This panel is open when the page loads.' },
  {
    value: 'third-item',
    title: 'Third item',
    text: 'A panel can hold text, links, or other components.',
  },
] as const;

/** Show one initially expanded, collapsible Accordion item. */
export function AccordionBasic(): JSX.Element {
  return (
    <Accordion.Root collapsible defaultValue={['b']}>
      <For each={items}>
        {(item) => (
          <Accordion.Item value={item.value}>
            <Accordion.ItemTrigger>
              <Span style={{ flex: '1' }}>{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        )}
      </For>
    </Accordion.Root>
  );
}

/** Show the expanded value while controlling it from a Solid signal. */
export function AccordionControlled(): JSX.Element {
  const [value, setValue] = createSignal(['second-item']);
  return (
    <Stack gap="4">
      <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
        Expanded: {value().join(', ')}
      </Text>
      <Accordion.Root
        value={value()}
        onValueChange={
          /** Follow value changes from the Accordion machine. */
          (details) => setValue(details.value)
        }
      >
        <For each={controlledItems}>
          {(item) => (
            <Accordion.Item value={item.value}>
              <Accordion.ItemTrigger>
                <Span style={{ flex: '1' }}>{item.title}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          )}
        </For>
      </Accordion.Root>
    </Stack>
  );
}

/** Allow more than one standard item to remain expanded. */
export function AccordionWithMultiple(): JSX.Element {
  return (
    <Accordion.Root multiple defaultValue={['b']}>
      <For each={items}>
        {(item) => (
          <Accordion.Item value={item.value}>
            <Accordion.ItemTrigger>
              <Span style={{ flex: '1' }}>{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        )}
      </For>
    </Accordion.Root>
  );
}

/** Keep the final item disabled while the second starts expanded. */
export function AccordionWithDisabledItem(): JSX.Element {
  return (
    <Accordion.Root collapsible defaultValue={['b']}>
      <For each={items}>
        {(item) => (
          <Accordion.Item value={item.value} disabled={item.value === 'c'}>
            <Accordion.ItemTrigger>
              <Span style={{ flex: '1' }}>{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        )}
      </For>
    </Accordion.Root>
  );
}
