import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChartBarStackedIcon, TagsIcon } from '@lucide/solid';
import { Accordion, Heading, Icon, Stack } from '../../src';
import './accordion-rich.css';

const productItems = [
  { value: 'info', title: 'Product info', icon: TagsIcon },
  { value: 'stats', title: 'Stats', icon: ChartBarStackedIcon },
] as const;

/** Show product details with decorative icons beside the item titles. */
export function AccordionWithIcon(): JSX.Element {
  return (
    <Stack class="accordion-rich-product">
      <Heading size="md">Product details</Heading>
      <Accordion.Root collapsible defaultValue={['info']}>
        <For each={productItems}>
          {
            /** Render one product disclosure with its matching icon. */
            (item) => (
              <Accordion.Item value={item.value}>
                <Accordion.ItemTrigger>
                  <Icon class="accordion-rich-icon">
                    <item.icon />
                  </Icon>
                  {item.title}
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    A lightweight running shoe that weighs 240 g. More than 12,000 pairs were sold
                    this year.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            )
          }
        </For>
      </Accordion.Root>
    </Stack>
  );
}

/** Show the product-details demo with anatomy indicators. */
export function AccordionExplorerDemo(): JSX.Element {
  return (
    <Stack class="accordion-rich-product">
      <Heading size="md">Product details</Heading>
      <Accordion.Root collapsible defaultValue={['info']}>
        <For each={productItems}>
          {
            /** Render one product disclosure with its matching icon. */
            (item) => (
              <Accordion.Item value={item.value}>
                <Accordion.ItemTrigger>
                  <Icon class="accordion-rich-icon">
                    <item.icon />
                  </Icon>
                  {item.title}
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    A lightweight running shoe that weighs 240 g. More than 12,000 pairs were sold
                    this year.
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            )
          }
        </For>
      </Accordion.Root>
    </Stack>
  );
}
