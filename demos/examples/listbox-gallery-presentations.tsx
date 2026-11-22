import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AtomIcon, GlobeIcon, PaletteIcon, ZapIcon } from '@lucide/solid';
import { Box, Image, Listbox, Stack, Text, createListCollection } from '../../src';
import { horizontalAlbums } from '../listbox-horizontal-data';
import './listbox-examples.css';

/** Lay out the five selectable album cards horizontally. */
export function ListboxHorizontal(): JSX.Element {
  const collection = createListCollection({ items: horizontalAlbums });

  return (
    <Listbox.Root collection={collection} orientation="horizontal" style={{ 'max-width': '640px' }}>
      <Listbox.Label>Select album</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={collection.items}>
            {
              /** Render one album cover, title, artist, and selection indicator. */
              (album) => (
                <Listbox.Item item={album} class="example-listbox-album">
                  <Image
                    src={album.image}
                    alt={album.title}
                    fit="cover"
                    class="example-listbox-album-cover"
                  />
                  <Stack gap="0">
                    <Text class="example-listbox-album-title">{album.title}</Text>
                    <Text class="example-listbox-album-artist">{album.artist}</Text>
                  </Stack>
                  <Listbox.ItemIndicator class="example-listbox-album-indicator" />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Pair topic options with decorative icons. */
export function ListboxIcon(): JSX.Element {
  const topics = createListCollection({
    items: [
      { label: 'Science', value: 'science', icon: AtomIcon },
      { label: 'Art', value: 'art', icon: PaletteIcon },
      { label: 'Travel', value: 'travel', icon: GlobeIcon },
      { label: 'Energy', value: 'energy', icon: ZapIcon },
    ],
  });

  return (
    <Listbox.Root collection={topics} class="example-listbox-narrow">
      <Listbox.Label>Select topic</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={topics.items}>
            {
              /** Keep the decorative icon and text under one machine item. */
              (topic) => (
                <Listbox.Item item={topic}>
                  <Box class="example-listbox-option">
                    <Box class="example-listbox-option-icon">
                      <topic.icon />
                    </Box>
                    <Listbox.ItemText>{topic.label}</Listbox.ItemText>
                  </Box>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}

/** Show supporting text beneath each method name. */
export function ListboxDescription(): JSX.Element {
  const methods = createListCollection({
    items: [
      { label: 'Standard', value: 'standard', description: '5 to 7 business days' },
      { label: 'Express', value: 'express', description: '2 to 3 business days' },
      { label: 'Overnight', value: 'overnight', description: 'Next business day' },
      { label: 'Pickup', value: 'pickup', description: 'Ready in 2 hours' },
      { label: 'Freight', value: 'freight', description: 'Large orders, 7 to 10 business days' },
    ],
  });

  return (
    <Listbox.Root collection={methods} style={{ 'max-width': '400px' }}>
      <Listbox.Label>Select shipping method</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={methods.items}>
            {
              /** Keep the label and its description in a single option. */
              (method) => (
                <Listbox.Item item={method}>
                  <Box class="example-listbox-option-body">
                    <Listbox.ItemText>{method.label}</Listbox.ItemText>
                    <Text class="example-listbox-option-description">{method.description}</Text>
                  </Box>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.Root>
  );
}
