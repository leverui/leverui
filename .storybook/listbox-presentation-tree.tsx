import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Box as BoxExport,
  Checkmark as CheckmarkExport,
  Listbox as ListboxExport,
  Text as TextExport,
  createListCollection as CollectionExport,
} from '../src';
import {
  checkmarkFrameworks,
  describedFrameworks,
  iconFrameworks,
} from './listbox-presentation-data';
import { FrameworkIcon } from './listbox-presentation-icons';

export type PresentationComponents = {
  Box: typeof BoxExport;
  Checkmark: typeof CheckmarkExport;
  Listbox: typeof ListboxExport;
  Text: typeof TextExport;
  createListCollection: typeof CollectionExport;
};

/** Bind one checkmark to its containing Listbox item's reactive state. */
function ItemCheckmark(props: {
  Checkmark: typeof CheckmarkExport;
  Listbox: typeof ListboxExport;
}): JSX.Element {
  const item = props.Listbox.useListboxItemContext();
  return <props.Checkmark filled size="sm" checked={item().selected} disabled={item().disabled} />;
}

/** Render the multiple-selection checkmark composition. */
export function renderCheckmarkTree(
  components: PresentationComponents,
  initialSelection: readonly string[] = [],
): JSX.Element {
  const { Listbox, Checkmark } = components;
  const collection = components.createListCollection({ items: checkmarkFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          selectionMode="multiple"
          defaultValue={[...initialSelection]}
          style={{ 'max-width': '320px' }}
        >
          <Listbox.Label>Select frameworks (with checkmarks)</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={collection.items}>
                {
                  /** Keep each marker under its corresponding machine option. */
                  (framework) => (
                    <Listbox.Item item={framework}>
                      <ItemCheckmark Checkmark={Checkmark} Listbox={Listbox} />
                      <Listbox.ItemText>{framework.label}</Listbox.ItemText>
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

/** Render the five supporting item descriptions. */
export function renderDescriptionTree(
  components: PresentationComponents,
  initialSelection: readonly string[] = [],
): JSX.Element {
  const { Box, Listbox, Text } = components;
  const collection = components.createListCollection({ items: describedFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          defaultValue={[...initialSelection]}
          style={{ 'max-width': '400px' }}
        >
          <Listbox.Label>Select framework</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={collection.items}>
                {
                  /** Keep the text and description in a single option. */
                  (framework) => (
                    <Listbox.Item item={framework}>
                      <Box style={{ flex: '1' }}>
                        <Listbox.ItemText>{framework.label}</Listbox.ItemText>
                        <Text
                          style={{
                            'font-size': 'var(--lui-font-sizes-xs)',
                            color: 'var(--lui-colors-fg-muted)',
                            'margin-top': 'var(--lui-spacing-1)',
                          }}
                        >
                          {framework.description}
                        </Text>
                      </Box>
                      <Listbox.ItemIndicator />
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

/** Render the four decorative framework icons. */
export function renderIconTree(
  components: PresentationComponents,
  initialSelection: readonly string[] = [],
): JSX.Element {
  const { Box, Listbox } = components;
  const collection = components.createListCollection({ items: iconFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          defaultValue={[...initialSelection]}
          style={{ 'max-width': '320px' }}
        >
          <Listbox.Label>Select framework</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={collection.items}>
                {
                  /** Keep icon and text under one accessible option. */
                  (framework) => (
                    <Listbox.Item item={framework}>
                      <Box
                        style={{
                          display: 'flex',
                          'align-items': 'center',
                          gap: 'var(--lui-spacing-3)',
                          flex: '1',
                        }}
                      >
                        <Box style={{ color: 'var(--lui-colors-fg-muted)', 'flex-shrink': '0' }}>
                          <FrameworkIcon kind={framework.icon} />
                        </Box>
                        <Listbox.ItemText>{framework.label}</Listbox.ItemText>
                      </Box>
                      <Listbox.ItemIndicator />
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
