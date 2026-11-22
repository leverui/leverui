import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Listbox as ListboxExport, createListCollection as CollectionExport } from '../src';
import {
  disabledFrameworks,
  groupedMedia,
  mediaCategory,
  multipleFrameworks,
} from './listbox-collection-guide-data';

/** Public parts shared by source stories and published hydration. */
export interface ListboxCollectionGuideComponents {
  Listbox: typeof ListboxExport;
  createListCollection: typeof CollectionExport;
}

export type ListboxCollectionGuide = 'disabled' | 'grouped' | 'multiple';
type FrameworkItem = { label: string; value: string; disabled?: boolean };

/** Render the framework options inside one machine-owned content part. */
function FrameworkOptions(props: {
  Listbox: typeof ListboxExport;
  items: readonly FrameworkItem[];
}): JSX.Element {
  const Listbox = props.Listbox;
  return (
    <For each={props.items}>
      {
        /** Preserve each collection item's selection and disabled metadata. */
        (item) => (
          <Listbox.Item item={item}>
            <Listbox.ItemText>{item.label}</Listbox.ItemText>
            <Listbox.ItemIndicator />
          </Listbox.Item>
        )
      }
    </For>
  );
}

/** Render the collection with disabled Vue and Svelte options. */
function DisabledGuide(props: {
  components: ListboxCollectionGuideComponents;
  initialValue: string[];
}): JSX.Element {
  const { Listbox, createListCollection } = props.components;
  const collection = createListCollection({ items: disabledFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          style={{ width: '320px' }}
          defaultValue={props.initialValue}
        >
          <Listbox.Label>Select framework</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <FrameworkOptions Listbox={Listbox} items={disabledFrameworks} />
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}

/** Preserve category groups and their accessible labels in order. */
function GroupedGuide(props: {
  components: ListboxCollectionGuideComponents;
  initialValue: string[];
}): JSX.Element {
  const { Listbox, createListCollection } = props.components;
  const collection = createListCollection({ items: groupedMedia, groupBy: mediaCategory });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          style={{ width: '320px' }}
          defaultValue={props.initialValue}
        >
          <Listbox.Label>Select media</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <For each={collection.group()}>
                {
                  /** Keep grouped rows under their primitive group and label. */
                  ([category, items], index) => (
                    <Listbox.ItemGroup style={{ 'border-top-width': index() === 0 ? '0' : '1px' }}>
                      <Listbox.ItemGroupLabel>{category}</Listbox.ItemGroupLabel>
                      <FrameworkOptions Listbox={Listbox} items={items} />
                    </Listbox.ItemGroup>
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

/** Render the additive six-option selection mode. */
function MultipleGuide(props: {
  components: ListboxCollectionGuideComponents;
  initialValue: string[];
}): JSX.Element {
  const { Listbox, createListCollection } = props.components;
  const collection = createListCollection({ items: multipleFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          selectionMode="multiple"
          style={{ 'max-width': '320px' }}
          defaultValue={props.initialValue}
        >
          <Listbox.Label>Select frameworks (multiple)</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <FrameworkOptions Listbox={Listbox} items={multipleFrameworks} />
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </div>
    </>
  );
}

/** Choose the collection guide while retaining identical source and published parts. */
export function renderListboxCollectionGuide(
  components: ListboxCollectionGuideComponents,
  guide: ListboxCollectionGuide,
  initialValue: readonly string[] = [],
): JSX.Element {
  const props = { components, initialValue: [...initialValue] };
  switch (guide) {
    case 'disabled':
      return <DisabledGuide {...props} />;
    case 'grouped':
      return <GroupedGuide {...props} />;
    case 'multiple':
      return <MultipleGuide {...props} />;
  }
}
