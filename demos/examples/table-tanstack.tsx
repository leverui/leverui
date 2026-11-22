import {
  constructTable,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/table-core';
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings';
import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Table } from '../../src';

interface TanstackProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const data: readonly TanstackProduct[] = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0, stock: 50 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5, stock: 120 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0, stock: 30 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0, stock: 75 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95, stock: 200 },
];

// TanStack's Solid adapter targets Solid 1, so this static table uses the
// framework-neutral core with TanStack's own store bindings.
const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columns: Array<ColumnDef<typeof features, TanstackProduct>> = [
  { accessorKey: 'name', header: 'Product' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'price',
    header: 'Price',
    /** Format the product's numeric price as currency. */
    cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
  },
  { accessorKey: 'stock', header: 'Stock' },
];

/** Render a header or cell template, calling it when it is a function. */
function flexRender<Context>(
  template: string | ((context: Context) => unknown) | undefined,
  context: Context,
): JSX.Element {
  const value = typeof template === 'function' ? template(context) : template;
  return typeof value === 'string' || typeof value === 'number' ? value : null;
}

/** Render the product data through TanStack Table. */
export function TableWithTanstack(): JSX.Element {
  const table = constructTable({ features, columns, data });
  return (
    <Table.Root size="sm" variant="outline" native>
      <thead>
        <For each={table.getHeaderGroups()}>
          {
            /** Render one TanStack header group. */ (group) => (
              <tr>
                <For each={group.headers}>
                  {
                    /** Skip placeholder headers while retaining their cells. */ (header) => (
                      <th>
                        <Show when={!header.isPlaceholder}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Show>
                      </th>
                    )
                  }
                </For>
              </tr>
            )
          }
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>
          {
            /** Render the table's current sorted and paginated rows. */ (row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {
                    /** Render each cell through its column template. */ (cell) => (
                      <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    )
                  }
                </For>
              </tr>
            )
          }
        </For>
      </tbody>
    </Table.Root>
  );
}
