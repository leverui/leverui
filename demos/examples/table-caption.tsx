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

/** Place a product inventory caption beneath the table. */
export function TableWithCaption(): JSX.Element {
  return (
    <Table.Root size="sm">
      <Table.Caption captionSide="bottom">Products in stock and their prices</Table.Caption>
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
  );
}

/** Place the same product inventory caption above the table. */
export function TableWithCaptionTop(): JSX.Element {
  return (
    <Table.Root size="sm">
      <Table.Caption captionSide="top">Products in stock and their prices</Table.Caption>
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
  );
}

/** Specify the 50/40/remaining column widths. */
export function TableWithColumnGroup(): JSX.Element {
  return (
    <Table.Root size="sm" variant="outline">
      <Table.ColumnGroup>
        <Table.Column htmlWidth="50%" />
        <Table.Column htmlWidth="40%" />
        <Table.Column />
      </Table.ColumnGroup>
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
  );
}
