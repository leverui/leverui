import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { TrophyIcon } from '@lucide/solid';
import { Accordion, Avatar, Badge, HStack } from '../../src';
import './accordion-rich.css';

const people = [
  {
    name: 'Iris',
    image: '/demo-images/avatars/avatar-3.webp',
    topRated: false,
  },
  {
    name: 'Theo',
    image: '/demo-images/avatars/avatar-2.webp',
    topRated: true,
  },
  {
    name: 'Jonah',
    image: '/demo-images/avatars/avatar-4.webp',
    topRated: false,
  },
] as const;

/** Show profile avatars and a top-rated badge in Accordion triggers. */
export function AccordionWithAvatar(): JSX.Element {
  return (
    <Accordion.Root collapsible defaultValue={['b']}>
      <For each={people}>
        {
          /** Render one profile and its disclosure body. */
          (person) => (
            <Accordion.Item value={person.name}>
              <Accordion.ItemTrigger>
                <Avatar.Root shape="rounded">
                  <Avatar.Image src={person.image} />
                  <Avatar.Fallback name={person.name} />
                </Avatar.Root>
                <HStack class="accordion-rich-fill">
                  {person.name}{' '}
                  <Show when={person.topRated}>
                    <Badge colorPalette="green">
                      <TrophyIcon /> Top rated
                    </Badge>
                  </Show>
                </HStack>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <p>
                    Part of the customer support team. Answers questions about orders, billing and
                    returns, and replies to most messages within one working day. Send a message if
                    you need help with something the help pages do not cover.
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
