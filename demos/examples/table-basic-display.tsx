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

/** Show the default five-row product table. */
export function TableBasic(): JSX.Element {
  return (
    <Table.Root size="sm">
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

/** Alternate muted backgrounds on the product rows. */
export function TableWithStriped(): JSX.Element {
  return (
    <Table.Root size="sm" striped>
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

/** Draw the CSS variant’s vertical cell borders. */
export function TableWithColumnBorder(): JSX.Element {
  return (
    <Table.Root size="sm" showColumnBorder>
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

/** Enable the row hover treatment. */
export function TableWithInteractive(): JSX.Element {
  return (
    <Table.Root size="sm" interactive>
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

/** Style native table descendants through the Table root. */
export function TableWithNative(): JSX.Element {
  return (
    <Table.Root size="sm" native>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <For each={items}>
          {(item) => (
            <tr>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${(item.id === 1 ? 999 : item.price).toFixed(2)}</td>
            </tr>
          )}
        </For>
      </tbody>
    </Table.Root>
  );
}
