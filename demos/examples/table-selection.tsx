import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ActionBar, Button, Checkbox, Kbd, Portal, Table } from '../../src';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Show the selectable product table. */
export function TableWithSelection(): JSX.Element {
  const [selection, setSelection] = createSignal<readonly string[]>([]);
  /** Distinguish some selected rows from none or all. */
  const indeterminate = (): boolean => selection().length > 0 && selection().length < items.length;
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader style={{ width: '1.5rem' }}>
            <Checkbox.Root
              size="sm"
              class="table-example-selection-checkbox"
              aria-label="Select all rows"
              checked={indeterminate() ? 'indeterminate' : selection().length > 0}
              onCheckedChange={
                /** Select every product or clear the entire selection. */
                (details) =>
                  setSelection(
                    details.checked === true
                      ? items.map(/** Read each product's selection key. */ (i) => i.name)
                      : [],
                  )
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Table.ColumnHeader>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader>Price</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <For each={items}>
          {(item) => (
            <Table.Row data-selected={selection().includes(item.name) ? '' : undefined}>
              <Table.Cell>
                <Checkbox.Root
                  size="sm"
                  class="table-example-selection-checkbox"
                  aria-label="Select row"
                  checked={selection().includes(item.name)}
                  onCheckedChange={
                    /** Add or remove this product from the selection. */
                    (details) => {
                      const rest = selection().filter(
                        /** Keep other product selections. */ (name) => name !== item.name,
                      );
                      setSelection(details.checked === true ? [...rest, item.name] : rest);
                    }
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell>${item.price}</Table.Cell>
            </Table.Row>
          )}
        </For>
      </Table.Body>
    </Table.Root>
  );
}

/** Show selection actions in a floating bar while rows are selected. */
export function TableWithSelectionActionBar(): JSX.Element {
  const [selection, setSelection] = createSignal<readonly string[]>([]);
  /** Distinguish some selected rows from none or all. */
  const indeterminate = (): boolean => selection().length > 0 && selection().length < items.length;
  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader style={{ width: '1.5rem' }}>
              <Checkbox.Root
                size="sm"
                class="table-example-selection-checkbox"
                aria-label="Select all rows"
                checked={indeterminate() ? 'indeterminate' : selection().length > 0}
                onCheckedChange={
                  /** Select every product or clear the entire selection. */
                  (details) =>
                    setSelection(
                      details.checked === true
                        ? items.map(/** Read each product's selection key. */ (i) => i.name)
                        : [],
                    )
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Product</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For each={items}>
            {(item) => (
              <Table.Row data-selected={selection().includes(item.name) ? '' : undefined}>
                <Table.Cell>
                  <Checkbox.Root
                    size="sm"
                    class="table-example-selection-checkbox"
                    aria-label="Select row"
                    checked={selection().includes(item.name)}
                    onCheckedChange={
                      /** Add or remove this product from the selection. */
                      (details) => {
                        const rest = selection().filter(
                          /** Keep other product selections. */ (name) => name !== item.name,
                        );
                        setSelection(details.checked === true ? [...rest, item.name] : rest);
                      }
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>${item.price}</Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
      <ActionBar.Root open={selection().length > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>{selection().length} selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete <Kbd>⌫</Kbd>
              </Button>
              <Button variant="outline" size="sm">
                Share <Kbd>T</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}
