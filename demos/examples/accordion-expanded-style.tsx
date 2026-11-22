import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Accordion, Span } from '../../src';
import './accordion-expanded.css';

const items = [
  {
    value: 'a',
    title: 'First item',
    text: 'Click a title to see how it looks when its item is open.',
  },
  {
    value: 'b',
    title: 'Second item',
    text: 'The title gets a muted gray background while its item is open.',
  },
  {
    value: 'c',
    title: 'Third item',
    text: 'Use a CSS class and the data-state attribute to style an open item.',
  },
] as const;

/** Highlight an expanded trigger with its custom style override. */
export function AccordionWithExpandedStyle(): JSX.Element {
  return (
    <Accordion.Root collapsible defaultValue={['b']}>
      <For each={items}>
        {(item) => (
          <Accordion.Item value={item.value}>
            <Accordion.ItemTrigger class="accordion-example__expanded-trigger">
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
