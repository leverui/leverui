import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Image as ImageExport,
  Listbox as ListboxExport,
  Stack as StackExport,
  Text as TextExport,
  createListCollection as CollectionExport,
} from '../src';
import { horizontalAlbums, type HorizontalAlbum } from '../demos/listbox-horizontal-data';

/** Public components used by both source stories and published fixtures. */
export interface HorizontalListboxComponents {
  Image: typeof ImageExport;
  Listbox: typeof ListboxExport;
  Stack: typeof StackExport;
  Text: typeof TextExport;
  createListCollection: typeof CollectionExport;
}

/** Render the album cards under the horizontal Listbox machine. */
export function renderHorizontalListbox(
  components: HorizontalListboxComponents,
  initialValue: readonly string[] = [],
  albums: readonly HorizontalAlbum[] = horizontalAlbums,
): JSX.Element {
  const { Image, Listbox, Stack, Text, createListCollection } = components;
  const collection = createListCollection({ items: albums });

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          orientation="horizontal"
          style={{ 'max-width': '640px' }}
          defaultValue={[...initialValue]}
        >
          <Listbox.Label>Select Album</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={collection.items}>
                {
                  /** Preserve collection item identity and the card layout. */
                  (album) => (
                    <Listbox.Item
                      item={album}
                      style={{
                        'flex-direction': 'column',
                        'align-items': 'flex-start',
                        gap: 'var(--leverui-spacing-2)',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={album.image}
                        alt={album.title}
                        fit="cover"
                        style={{
                          background: 'var(--leverui-colors-bg-subtle)',
                          'aspect-ratio': '1',
                          'border-radius': 'var(--leverui-radii-l2)',
                          'flex-shrink': '0',
                          height: '150px',
                          'min-width': '150px',
                        }}
                      />
                      <Stack gap="0">
                        <Text
                          style={{
                            'font-size': 'var(--leverui-font-sizes-sm)',
                            'font-weight': 'var(--leverui-font-weights-medium)',
                            'white-space': 'nowrap',
                          }}
                        >
                          {album.title}
                        </Text>
                        <Text style={{ 'font-size': 'var(--leverui-font-sizes-xs)' }}>
                          {album.artist}
                        </Text>
                      </Stack>
                      <Listbox.ItemIndicator
                        style={{
                          position: 'absolute',
                          top: 'var(--leverui-spacing-4)',
                          right: 'var(--leverui-spacing-4)',
                          background: 'var(--leverui-colors-color-palette-solid)',
                          color: 'var(--leverui-colors-color-palette-contrast)',
                          'border-width': '2px',
                          'border-color': 'var(--leverui-colors-fg-inverted)',
                        }}
                      />
                    </Listbox.Item>
                  )
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}
