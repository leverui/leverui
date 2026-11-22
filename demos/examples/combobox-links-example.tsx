import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ExternalLinkIcon } from '@lucide/solid';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import './combobox-examples.css';

const frameworks = [
  { label: 'React', value: 'react', docs: 'https://react.dev' },
  { label: 'Solid', value: 'solid', docs: 'https://solidjs.com' },
  { label: 'Vue', value: 'vue', docs: 'https://vuejs.org' },
  { label: 'Angular', value: 'angular', docs: 'https://angular.io' },
  { label: 'Svelte', value: 'svelte', docs: 'https://svelte.dev' },
  { label: 'Preact', value: 'preact', docs: 'https://preactjs.com' },
  { label: 'Qwik', value: 'qwik', docs: 'https://qwik.builder.io' },
  { label: 'Lit', value: 'lit', docs: 'https://lit.dev' },
  { label: 'Alpine.js', value: 'alpinejs', docs: 'https://alpinejs.dev' },
  { label: 'Ember', value: 'ember', docs: 'https://emberjs.com' },
  { label: 'Next.js', value: 'nextjs', docs: 'https://nextjs.org' },
];

/** Render framework documentation links as selectable Combobox options. */
export function ComboboxLinksExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter links as the visitor types. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      style={{ width: '320px' }}
      selectionBehavior="clear"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Keep link navigation and Combobox option behavior on one element. */
                  (item) => (
                    <Combobox.Item
                      item={item}
                      asChild={
                        /** Merge the option props into the documentation anchor. */
                        (getProps) => (
                          <a {...getProps()} href={item.docs}>
                            {item.label}
                            <ExternalLinkIcon class="example-combobox-link-icon" />
                          </a>
                        )
                      }
                    />
                  )
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
