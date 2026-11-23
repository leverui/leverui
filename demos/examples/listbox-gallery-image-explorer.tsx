import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Flex, Image, Listbox, Text, VisuallyHidden, createListCollection } from '../../src';
import { explorerImages } from '../listbox-image-explorer-data';
import './listbox-examples.css';

/** Update the preview when an image option is selected. */
export function ListboxImageExplorer(): JSX.Element {
  const collection = createListCollection({ items: explorerImages });
  const [selectedImage, setSelectedImage] = createSignal('mountains');
  const currentImage = createMemo(
    /** Resolve the preview from the selected collection value. */
    () =>
      collection.items.find(
        /** Match the image whose value is selected by the Listbox. */
        (image) => image.value === selectedImage(),
      ),
  );

  /** Keep the current preview when the selection empties. */
  function changeValue(details: { value: string[] }): void {
    const next = details.value[0];
    if (next) setSelectedImage(next);
  }

  return (
    <Flex class="example-listbox-gallery">
      <Listbox.Root
        collection={collection}
        value={[selectedImage()]}
        onValueChange={changeValue}
        variant="solid"
        style={{ 'max-width': 'var(--lui-sizes-2xs)' }}
      >
        <VisuallyHidden>
          <Listbox.Label>Explore images</Listbox.Label>
        </VisuallyHidden>
        <Listbox.Content class="example-listbox-gallery-content">
          <Listbox.List>
            <For each={collection.items}>
              {
                /** Keep the option text and indicator under one machine item. */
                (image) => (
                  <Listbox.Item item={image}>
                    <Listbox.ItemText>{image.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>

      <Box style={{ flex: '1' }}>
        <Show when={currentImage()} keyed>
          {
            /** Update the image and its text as one selected preview. */
            (image) => (
              <Box>
                <Text class="example-listbox-gallery-title">{image.label}</Text>
                <Image
                  src={image.url}
                  alt={image.label}
                  fit="cover"
                  class="example-listbox-gallery-image"
                />
                <Text class="example-listbox-gallery-caption">{image.description}</Text>
              </Box>
            )
          }
        </Show>
      </Box>
    </Flex>
  );
}
