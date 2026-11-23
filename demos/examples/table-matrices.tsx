import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Table, type TableRootBaseProps } from '../../src';
import './table-cells.css';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['line', 'outline'] as const;
const colorPalettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headingStyle = {
  ...cellStyle,
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'font-weight': 'normal',
  'text-align': 'left',
} as const;
const labelStyle = {
  'font-size': 'var(--lui-font-sizes-sm)',
  color: 'var(--lui-colors-fg-muted)',
  'min-width': '8ch',
} as const;

/** Compare all table sizes across line and outline variants. */
export function TableSizeTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <td />
          <For each={sizes}>{(size) => <td style={cellStyle}>{size}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={variants}>
          {(variant) => (
            <tr>
              <td style={cellStyle}>
                <Span style={labelStyle}>{variant}</Span>
              </td>
              <For each={sizes}>
                {(size) => (
                  <td style={cellStyle}>
                    <DemoTable size={size} variant={variant} striped />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

/** Compare table variants across all ten palettes. */
export function TableVariantTable(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <th scope="col" style={headingStyle} />
          <For each={variants}>
            {(variant) => (
              <th scope="col" style={headingStyle}>
                {variant}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={colorPalettes}>
          {(palette) => (
            <tr>
              <th scope="row" style={headingStyle}>
                <Span style={labelStyle}>{palette}</Span>
              </th>
              <For each={variants}>
                {(variant) => (
                  <td style={cellStyle}>
                    <DemoTable variant={variant} colorPalette={palette} showColumnBorder />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Render the product table shown in every matrix cell. */
function DemoTable(props: TableRootBaseProps): JSX.Element {
  return (
    <Table.Root size="sm" {...props}>
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
