import { type JSX } from '@solidjs/web';
import type { Combobox as ComboboxExport, createListCollection as CollectionExport } from '../src';

export type ComboboxHydrationComponents = {
  Combobox: typeof ComboboxExport;
  createListCollection: typeof CollectionExport;
};

const items = [
  { label: 'Solid', value: 'solid' },
  { label: 'React', value: 'react' },
];

/** Render normal JSX controls and options under either Combobox machine. */
function HydratedParts(props: { Combobox: typeof ComboboxExport; name: string }): JSX.Element {
  const Combobox = props.Combobox;
  return (
    <>
      <Combobox.Label>{props.name}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input aria-label={props.name} />
        <Combobox.Trigger aria-label={`Show ${props.name} options`} />
      </Combobox.Control>
      <Combobox.Positioner data-testid={`${props.name}-positioner`}>
        <Combobox.Content>
          <Combobox.List>
            {items.map(
              /** Render each collection item with the same server and client order. */
              (item) => (
                <Combobox.Item item={item} data-testid={`${props.name}-${item.value}`}>
                  {item.label}
                </Combobox.Item>
              ),
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Positioner>
    </>
  );
}

/** Build matching JSX trees with stable IDs for server and browser hydration. */
export function renderComboboxHydrationTree({
  Combobox,
  createListCollection,
}: ComboboxHydrationComponents): JSX.Element {
  const collection = createListCollection({ items });
  const external = Combobox.useCombobox({
    id: 'hydrated-external',
    collection,
    name: 'external',
    defaultValue: ['react'],
  });
  return (
    <>
      <form data-testid="hydrated-combobox-form">
        <Combobox.Root
          id="hydrated-primary"
          collection={collection}
          name="primary"
          defaultValue={['solid']}
        >
          <HydratedParts Combobox={Combobox} name="Hydrated primary" />
        </Combobox.Root>
        <Combobox.RootProvider value={external}>
          <HydratedParts Combobox={Combobox} name="Hydrated external" />
        </Combobox.RootProvider>
      </form>
    </>
  );
}
