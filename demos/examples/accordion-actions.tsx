import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AbsoluteCenter, Accordion, Box, Button, Span, Stack, Text } from '../../src';
import './accordion-actions.css';
import './accordion-rich.css';

const items = [
  { value: 'a', title: 'First item' },
  { value: 'b', title: 'Second item' },
  { value: 'c', title: 'Third item' },
] as const;

/** Place a secondary action beside each plain Accordion trigger. */
export function AccordionWithActions(): JSX.Element {
  return (
    <Accordion.Root class="accordion-rich-actions" variant="plain" collapsible defaultValue={['b']}>
      <For each={items}>
        {
          /** Pair one disclosure with an independently clickable action. */
          (item) => (
            <Accordion.Item value={item.value}>
              <Box class="accordion-rich-action-host">
                <Accordion.ItemTrigger>
                  <Span class="accordion-rich-fill">{item.title}</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <AbsoluteCenter axis="vertical" class="absolute-center-accordion-action">
                  <Button variant="subtle" colorPalette="blue">
                    Action
                  </Button>
                </AbsoluteCenter>
              </Box>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <p>
                    The button beside the title works on its own. Clicking it does not open or close
                    this item. Use a button like this for a quick task, such as editing or sharing
                    the item, so people can do it without opening the panel first. The rest of the
                    row still opens and closes the panel as usual.
                  </p>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          )
        }
      </For>
    </Accordion.Root>
  );
}

/** Add a muted hint beneath each disclosure title. */
export function AccordionWithSubtext(): JSX.Element {
  return (
    <Accordion.Root collapsible>
      <For each={items}>
        {
          /** Render one item with a two-line trigger. */
          (item) => (
            <Accordion.Item value={item.value}>
              <Accordion.ItemTrigger>
                <Stack gap="1">
                  <Text>{item.title}</Text>
                  <Text class="accordion-rich-hint">Click to expand</Text>
                </Stack>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <p>
                    The small line under the title gives a hint about what is inside. Keep the hint
                    to a few words so the title stays easy to scan. When the item opens, the panel
                    shows the full details, and the hint stays where it is so people can still see
                    which item they are reading.
                  </p>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          )
        }
      </For>
    </Accordion.Root>
  );
}
