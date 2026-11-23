import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CircleSlashIcon, FlameIcon, HexagonIcon, NutIcon, TriangleIcon } from '@lucide/solid';
import { Dynamic } from '@solidjs/web';
import { HStack, IconButton, Portal, Select } from '../../src';

const shapeItems = [
  { label: 'Nut', value: 'nut', icon: NutIcon },
  { label: 'Triangle', value: 'triangle', icon: TriangleIcon },
  { label: 'Hexagon', value: 'hexagon', icon: HexagonIcon },
  { label: 'Flame', value: 'flame', icon: FlameIcon },
] as const;
const shapes = Select.createListCollection({ items: shapeItems });

/** Put Select's native trigger props on a square IconButton. */
function IconTrigger(): JSX.Element {
  const select = Select.useSelectContext();

  /** Resolve the current shape icon from the machine value. */
  function selectedIcon(): Component {
    const selected = shapeItems.find(
      /** Match the current selected value. */
      (item) => item.value === select().value[0],
    );
    return selected?.icon ?? CircleSlashIcon;
  }

  return (
    <IconButton
      {...select().getTriggerProps()}
      aria-label="Select shape"
      style={{ 'padding-inline': 'var(--lui-spacing-2)' }}
      variant="outline"
      size="sm"
    >
      <Dynamic component={selectedIcon()} />
    </IconButton>
  );
}

/** Show the selected shape using a single icon-only trigger. */
export function SelectIconButton(): JSX.Element {
  return (
    <Select.Root
      positioning={{ sameWidth: false }}
      collection={shapes}
      size="sm"
      style={{ width: '320px' }}
      defaultValue={['react']}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <IconTrigger />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content style={{ 'min-width': 'var(--lui-sizes-32)' }}>
            <Select.List>
              <For each={shapeItems}>
                {
                  /** Pair each shape icon with its readable name. */
                  (item) => (
                    <Select.Item item={item}>
                      <HStack>
                        <item.icon />
                        {item.label}
                      </HStack>
                      <Select.ItemIndicator />
                    </Select.Item>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
