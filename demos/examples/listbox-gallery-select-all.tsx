import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Checkmark, Flex, Listbox, createListCollection } from '../../src';
import './listbox-examples.css';

const members = createListCollection({
  items: [
    { label: 'Ava Chen', value: 'ava-chen' },
    { label: 'Ben Ortiz', value: 'ben-ortiz' },
    { label: 'Chloe Martin', value: 'chloe-martin' },
    { label: 'Daniel Kim', value: 'daniel-kim' },
    { label: 'Elena Rossi', value: 'elena-rossi' },
    { label: 'Farah Haddad', value: 'farah-haddad' },
    { label: 'Gabriel Silva', value: 'gabriel-silva' },
    { label: 'Hana Sato', value: 'hana-sato' },
    { label: 'Isaac Moore', value: 'isaac-moore' },
    { label: 'Jonah Price', value: 'jonah-price' },
  ],
});

/** Toggle all options from a button inside the Listbox machine. */
function ListboxHeader(): JSX.Element {
  const listbox = Listbox.useListboxContext();

  /** Report whether every member is selected. */
  function isAllSelected(): boolean {
    return listbox().value.length === members.items.length;
  }

  /** Report whether only some members are selected. */
  function isSomeSelected(): boolean {
    return listbox().value.length > 0 && !isAllSelected();
  }

  /** Select every member, or clear them once all are selected. */
  function toggleAll(): void {
    listbox().setValue(
      isAllSelected()
        ? []
        : members.items.map(
            /** Read each collection item's stable value. */
            (item) => item.value,
          ),
    );
  }

  return (
    <Flex
      as="button"
      type="button"
      onClick={toggleAll}
      aria-pressed={isAllSelected() ? 'true' : isSomeSelected() ? 'mixed' : 'false'}
      data-testid="listbox-select-all"
      align="center"
      class="example-listbox-select-all-header"
    >
      <Checkmark
        filled
        size="sm"
        checked={isAllSelected()}
        indeterminate={isSomeSelected()}
        aria-hidden="true"
      />
      <Listbox.Label>Select team members</Listbox.Label>
    </Flex>
  );
}

/** Mirror one option's selection in its checkmark. */
function ListboxItemCheckmark(): JSX.Element {
  const itemState = Listbox.useListboxItemContext();
  return (
    <Checkmark filled size="sm" checked={itemState().selected} disabled={itemState().disabled} />
  );
}

/** Select or clear all ten member options together. */
export function ListboxSelectAll(): JSX.Element {
  return (
    <Box class="example-listbox-narrow">
      <Listbox.Root
        collection={members}
        selectionMode="multiple"
        class="example-listbox-select-all"
      >
        <ListboxHeader />
        <Listbox.Content class="example-listbox-select-all-content">
          <Listbox.List>
            <For each={members.items}>
              {
                /** Pair each option's text with its machine-owned checkmark. */
                (member) => (
                  <Listbox.Item item={member}>
                    <ListboxItemCheckmark />
                    <Listbox.ItemText>{member.label}</Listbox.ItemText>
                  </Listbox.Item>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>
    </Box>
  );
}
