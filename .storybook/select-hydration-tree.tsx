import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Portal as PortalExport, Select as SelectExport } from '../src';

export type SelectHydrationComponents = {
  Portal: typeof PortalExport;
  Select: typeof SelectExport;
};

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];

/** Render one selected item under either Select root mode. */
function renderOptions(Select: typeof SelectExport): JSX.Element {
  return (
    <For each={items}>
      {
        /** Bind each visual option to its collection item. */
        (item) => (
          <Select.Item item={item}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        )
      }
    </For>
  );
}

/** Recreate identical published-package JSX on server and browser. */
export function renderSelectHydrationTree({
  Portal,
  Select,
}: SelectHydrationComponents): JSX.Element {
  const collection = Select.createListCollection({ items });
  const external = Select.useSelect({
    id: 'hydrated-select-external',
    collection,
    name: 'external-framework',
    defaultValue: ['react'],
  });

  return (
    <>
      <form data-testid="hydrated-select-form">
        <Select.Root
          id="hydrated-select-primary"
          collection={collection}
          name="primary-framework"
          defaultValue={['solid']}
        >
          <Select.HiddenSelect />
          <Select.Label>Hydrated primary</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner data-testid="hydrated-select-positioner">
              <Select.Content>
                <Select.List>{renderOptions(Select)}</Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.RootProvider value={external}>
          <Select.HiddenSelect />
          <Select.Label>Hydrated external</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.List>{renderOptions(Select)}</Select.List>
            </Select.Content>
          </Select.Positioner>
        </Select.RootProvider>
      </form>
    </>
  );
}
