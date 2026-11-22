import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Table } from '../../src';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0, stock: 12 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5, stock: 35 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0, stock: 8 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0, stock: 20 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95, stock: 50 },
] as const;

const endAligned = { 'text-align': 'end' } as const;
const totalStyle = { 'text-align': 'end', 'font-weight': 'bold' } as const;

/** Render every Table anatomy part for the guide Explorer. */
export function TableExplorerDemo(): JSX.Element {
  /** Add one numeric product field across all rows. */
  const sum = (field: 'price' | 'stock'): number =>
    items.reduce(
      /** Accumulate the selected field. */
      (total, item) => total + item[field],
      0,
    );

  return (
    <Table.Root size="sm">
      <Table.Caption>Products in stock and their prices</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader style={endAligned}>Price</Table.ColumnHeader>
          <Table.ColumnHeader style={endAligned}>Stock</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <For each={items}>
          {
            /** Render one product with its price and stock. */
            (item) => (
              <Table.Row>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell style={endAligned}>${item.price.toFixed(2)}</Table.Cell>
                <Table.Cell style={endAligned}>{item.stock}</Table.Cell>
              </Table.Row>
            )
          }
        </For>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colspan={2} style={totalStyle}>
            Total
          </Table.Cell>
          <Table.Cell style={totalStyle}>${sum('price').toFixed(2)}</Table.Cell>
          <Table.Cell style={totalStyle}>{sum('stock')}</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  );
}
