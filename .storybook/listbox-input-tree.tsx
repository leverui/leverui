import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Input as InputExport,
  ListCollection,
  Listbox as ListboxExport,
  Text as TextExport,
  createListCollection as CollectionExport,
  useFilter as FilterExport,
  useListCollection as ListCollectionExport,
} from '../src';
import { filterFrameworks, priorityFrameworks, type ListboxFramework } from './listbox-input-data';

export type ListboxInputComponents = {
  Input: typeof InputExport;
  Listbox: typeof ListboxExport;
  Text: typeof TextExport;
  createListCollection: typeof CollectionExport;
  useFilter: typeof FilterExport;
  useListCollection: typeof ListCollectionExport;
};

type FilterCompositionProps = {
  components: ListboxInputComponents;
  collection: () => ListCollection<ListboxFramework>;
  query: string;
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void;
};

/** Render the current framework items under their owning collection. */
function FrameworkOptions(props: {
  Listbox: typeof ListboxExport;
  items: readonly ListboxFramework[];
}): JSX.Element {
  return (
    <For each={props.items}>
      {
        /** Keep the option and indicator inside the same machine item. */
        (framework) => (
          <props.Listbox.Item item={framework}>
            <props.Listbox.ItemText>{framework.label}</props.Listbox.ItemText>
            <props.Listbox.ItemIndicator />
          </props.Listbox.Item>
        )
      }
    </For>
  );
}

/** Render the shared Listbox markup for interactive and static guide fixtures. */
function FilterComposition(props: FilterCompositionProps): JSX.Element {
  const { Input, Listbox } = props.components;
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root style={{ 'max-width': '320px' }} collection={props.collection()}>
          <Listbox.Label>Select Framework</Listbox.Label>
          <Listbox.Input
            asChild={
              /** Keep Zag input behavior on the styled Input. */
              (getProps) => (
                <Input
                  {...getProps({ onInput: props.onInput })}
                  defaultValue={props.query}
                  placeholder="Type to filter frameworks..."
                  aria-label="Filter frameworks"
                />
              )
            }
          />
          <Listbox.Content style={{ 'max-height': '200px' }}>
            <Listbox.Empty>No frameworks found</Listbox.Empty>
            <Listbox.List>
              <FrameworkOptions Listbox={Listbox} items={props.collection().items} />
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}

/** Render the searchable ten-item Listbox composition. */
export function renderFilterTree(components: ListboxInputComponents): JSX.Element {
  const matcher = components.useFilter({ sensitivity: 'base' });

  /** Match labels using the active locale's base sensitivity. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = components.useListCollection({
    initialItems: filterFrameworks,
    filter: contains,
  });

  /** Follow the native input value as the collection filter changes. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  return (
    <FilterComposition
      components={components}
      collection={collection}
      query=""
      onInput={handleInput}
    />
  );
}

/** Render a fixed query subset solely for server-side visual comparisons. */
export function renderStaticFilterFixture(
  components: ListboxInputComponents,
  query: string,
): JSX.Element {
  const matcher = components.useFilter({ sensitivity: 'base' });
  const items = filterFrameworks.filter(
    /** Match the fixture's initial option subset. */
    (item) => matcher().contains(item.label, query),
  );
  const collection = components.createListCollection({ items });

  /** Supply the fixed collection to the shared visual markup. */
  function getCollection(): ListCollection<ListboxFramework> {
    return collection;
  }

  return <FilterComposition components={components} collection={getCollection} query={query} />;
}

/** Render the Home/End navigation-priority input. */
export function renderKeyboardPriorityTree(components: ListboxInputComponents): JSX.Element {
  const { Input, Listbox, Text } = components;
  const collection = components.createListCollection({ items: priorityFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root collection={collection} style={{ 'max-width': '320px' }}>
          <Listbox.Label>Select framework</Listbox.Label>
          <Listbox.Input
            keyboardPriority="navigate"
            asChild={
              /** Put navigation keys on the styled native input. */
              (getProps) => (
                <Input
                  {...getProps()}
                  placeholder="Press Home or End"
                  aria-label="Navigate frameworks"
                />
              )
            }
          />
          <Text
            textStyle="xs"
            style={{
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            Home and End highlight the first and last item instead of moving the text caret.
          </Text>
          <Listbox.Content>
            <Listbox.List>
              <FrameworkOptions Listbox={Listbox} items={collection.items} />
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}
