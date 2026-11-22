import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Box as BoxExport,
  Flex as FlexExport,
  Image as ImageExport,
  Listbox as ListboxExport,
  Text as TextExport,
  VisuallyHidden as HiddenExport,
  createListCollection as CollectionExport,
} from '../src';
import { explorerImages, type ExplorerImage } from '../demos/listbox-image-explorer-data';

export type ImageExplorerComponents = {
  Box: typeof BoxExport;
  Flex: typeof FlexExport;
  Image: typeof ImageExport;
  Listbox: typeof ListboxExport;
  Text: typeof TextExport;
  VisuallyHidden: typeof HiddenExport;
  createListCollection: typeof CollectionExport;
};

/** Render the image explorer with Solid-owned controlled selection. */
export function renderImageExplorerTree(
  components: ImageExplorerComponents,
  initialValue = 'mountains',
  images: readonly ExplorerImage[] = explorerImages,
): JSX.Element {
  const { Box, Flex, Image, Listbox, Text, VisuallyHidden } = components;
  const collection = components.createListCollection({ items: images });
  const [selectedValue, setSelectedValue] = createSignal(initialValue);
  const currentImage = createMemo(
    /** Resolve the preview from the selected collection value. */
    () =>
      collection.items.find(
        /** Match the image whose value is selected by the Listbox. */
        (image) => image.value === selectedValue(),
      ),
  );

  /** Ignore an empty selection so the current preview remains visible. */
  function handleValueChange(details: { value: string[] }): void {
    const nextValue = details.value[0];
    if (nextValue) setSelectedValue(nextValue);
  }

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Flex style={{ gap: 'var(--leverui-spacing-6)', 'max-width': '800px' }}>
          <Listbox.Root
            style={{ 'max-width': 'var(--leverui-sizes-2xs)' }}
            collection={collection}
            value={[selectedValue()]}
            onValueChange={handleValueChange}
            variant="solid"
          >
            <VisuallyHidden>
              <Listbox.Label>Explore images</Listbox.Label>
            </VisuallyHidden>
            <Listbox.Content style={{ border: '0' }}>
              <Listbox.List>
                <For each={collection.items}>
                  {
                    /** Keep every option tied to the same collection item. */
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

          <Box id="image-preview" style={{ flex: '1' }}>
            <Show when={currentImage()} keyed>
              {
                /** Update the image and its text as one selected preview. */
                (image) => (
                  <Box>
                    <Text
                      style={{
                        'font-size': 'var(--leverui-font-sizes-lg)',
                        'font-weight': 'var(--leverui-font-weights-semibold)',
                        'margin-bottom': 'var(--leverui-spacing-3)',
                      }}
                    >
                      {image.label}
                    </Text>
                    <Image
                      src={image.url}
                      alt={image.label}
                      style={{
                        'border-radius': 'var(--leverui-radii-md)',
                        'max-height': '400px',
                        width: '100%',
                      }}
                      fit="cover"
                    />
                    <Text
                      style={{
                        'font-size': 'var(--leverui-font-sizes-sm)',
                        color: 'var(--leverui-colors-fg-muted)',
                        'margin-top': 'var(--leverui-spacing-2)',
                      }}
                    >
                      {image.description}
                    </Text>
                  </Box>
                )
              }
            </Show>
          </Box>
        </Flex>
      </div>
    </>
  );
}
