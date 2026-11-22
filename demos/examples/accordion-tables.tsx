import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Accordion, Span, Stack, Text } from '../../src';
import './accordion-examples.css';

const items = [
  { value: 'a', title: 'First item', text: 'Click a title to open its panel.' },
  { value: 'b', title: 'Second item', text: 'This panel is open when the page loads.' },
  { value: 'c', title: 'Third item', text: 'A panel can hold text, links, or other components.' },
] as const;

/** Show the three Accordion sizes in the guide's vertical layout. */
export function AccordionSizeTable(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['sm', 'md', 'lg'] as const}>
        {(size) => (
          <Stack gap="2">
            <Text class="example-accordion-label">{size}</Text>
            <Accordion.Root size={size} collapsible defaultValue={['b']}>
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
          </Stack>
        )}
      </For>
    </Stack>
  );
}

/** Show the four Accordion variants in the guide's vertical layout. */
export function AccordionVariantTable(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['outline', 'subtle', 'enclosed', 'plain'] as const}>
        {(variant) => (
          <Stack gap="2">
            <Text class="example-accordion-label">{variant}</Text>
            <Accordion.Root variant={variant} collapsible defaultValue={['b']}>
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
          </Stack>
        )}
      </For>
    </Stack>
  );
}
