import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Stack, Table } from '../../src';
import './table-cells.css';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Compare the three table sizes. */
export function TableWithSizes(): JSX.Element {
  return (
    <Stack gap="10">
      <For each={['sm', 'md', 'lg'] as const}>
        {(size) => (
          <Table.Root size={size}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader class="example-table-end">Price</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <For each={items}>
                {(item) => (
                  <Table.Row>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell class="example-table-end">{item.price}</Table.Cell>
                  </Table.Row>
                )}
              </For>
            </Table.Body>
          </Table.Root>
        )}
      </For>
    </Stack>
  );
}

/** Compare the line and outline treatments. */
export function TableWithVariants(): JSX.Element {
  return (
    <Stack gap="10">
      <For each={['line', 'outline'] as const}>
        {(variant) => (
          <Table.Root size="sm" variant={variant}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader class="example-table-end">Price</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <For each={items}>
                {(item) => (
                  <Table.Row>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell class="example-table-end">{item.price}</Table.Cell>
                  </Table.Row>
                )}
              </For>
            </Table.Body>
          </Table.Root>
        )}
      </For>
    </Stack>
  );
}
