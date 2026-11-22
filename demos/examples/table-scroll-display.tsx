import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Table } from '../../src';
import './table-cells.css';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Allow horizontal scrolling across the wide product columns. */
export function TableWithOverflow(): JSX.Element {
  return (
    <Table.ScrollArea class="table-example-overflow">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader class="example-table-wide">Product</Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-wide">Category</Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-price">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For each={items}>
            {
              /** Keep each product aligned beneath the wide headers. */
              (item) => (
                <Table.Row>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell class="example-table-end">{item.price}</Table.Cell>
                </Table.Row>
              )
            }
          </For>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

/** Keep the header visible during vertical scrolling. */
export function TableWithStickyHeader(): JSX.Element {
  return (
    <Table.ScrollArea class="table-example-sticky-header">
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row class="table-example-muted-row">
            <Table.ColumnHeader>Product</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-end">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For each={items}>
            {
              /** Render one product row beneath the sticky header. */
              (item) => (
                <Table.Row>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell class="example-table-end">{item.price}</Table.Cell>
                </Table.Row>
              )
            }
          </For>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
