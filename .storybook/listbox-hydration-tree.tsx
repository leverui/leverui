import { type JSX } from '@solidjs/web';
import type { Listbox as ListboxExport, createListCollection as CollectionExport } from '../src';

export type ListboxHydrationComponents = {
  Listbox: typeof ListboxExport;
  createListCollection: typeof CollectionExport;
};

const items = [
  { label: 'Solid', value: 'solid' },
  { label: 'React', value: 'react' },
];

/** Render direct JSX options under either Listbox root mode. */
function HydratedParts(props: { Listbox: typeof ListboxExport; name: string }): JSX.Element {
  const Listbox = props.Listbox;
  return (
    <>
      <Listbox.Label>{props.name}</Listbox.Label>
      <Listbox.Content data-testid={`${props.name}-content`}>
        <Listbox.List>
          {items.map(
            /** Keep collection item order identical on server and client. */
            (item) => (
              <Listbox.Item item={item} data-testid={`${props.name}-${item.value}`}>
                <Listbox.ItemText>{item.label}</Listbox.ItemText>
                <Listbox.ItemIndicator />
              </Listbox.Item>
            ),
          )}
        </Listbox.List>
      </Listbox.Content>
    </>
  );
}

/** Build matching machine-owned and external Listbox trees for hydration. */
export function renderListboxHydrationTree({
  Listbox,
  createListCollection,
}: ListboxHydrationComponents): JSX.Element {
  const collection = createListCollection({ items });
  const external = Listbox.useListbox({
    id: 'hydrated-listbox-external',
    collection,
    defaultValue: ['react'],
  });
  return (
    <>
      <Listbox.Root id="hydrated-listbox-primary" collection={collection} defaultValue={['solid']}>
        <HydratedParts Listbox={Listbox} name="Hydrated primary" />
      </Listbox.Root>
      <Listbox.RootProvider value={external}>
        <HydratedParts Listbox={Listbox} name="Hydrated external" />
      </Listbox.RootProvider>
    </>
  );
}
