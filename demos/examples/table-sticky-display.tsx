import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Table } from '../../src';
import { stickyProducts } from './table-sticky-items';
import './table-cells.css';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Keep the product column visible during horizontal scrolling. */
export function TableWithStickyColumn(): JSX.Element {
  return (
    <Table.ScrollArea class="table-example-sticky-frame">
      <Table.Root size="sm" class="table-example-sticky-column">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader data-sticky="end" class="example-table-sticky-name">
              Product
            </Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-wide">Category</Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-price">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For each={items}>
            {(item) => (
              <Table.Row>
                <Table.Cell data-sticky="end" class="example-table-sticky-start">
                  {item.name}
                </Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell class="example-table-end">{item.price}</Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

/** Keep both header and product column visible across 36 rows. */
export function TableWithStickyHeaderAndColumn(): JSX.Element {
  return (
    <Table.ScrollArea class="table-example-sticky-frame" style={{ height: '500px' }}>
      <Table.Root
        size="sm"
        stickyHeader
        class="table-example-sticky-column table-example-sticky-both"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader data-sticky="end" class="example-table-sticky-name">
              Product
            </Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-wide">Category</Table.ColumnHeader>
            <Table.ColumnHeader class="example-table-price">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For each={stickyProducts}>
            {(item) => (
              <Table.Row>
                <Table.Cell data-sticky="end" class="example-table-sticky-start">
                  {item.name}
                </Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell class="example-table-end">{item.price}</Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
