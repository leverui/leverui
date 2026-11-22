import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/solid';
import { ButtonGroup, Heading, IconButton, Pagination, Stack, Table } from '../../src';
import './table-cells.css';

const items = [
  { id: 1, name: 'Monitor', category: 'Electronics', price: 999.0 },
  { id: 2, name: 'Rice cooker', category: 'Kitchen', price: 64.5 },
  { id: 3, name: 'Bookshelf', category: 'Furniture', price: 135.0 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 549.0 },
  { id: 5, name: 'Backpack', category: 'Accessories', price: 89.95 },
] as const;

/** Present the product table with the five-page controls. */
export function TableWithPagination(): JSX.Element {
  return (
    <Stack gap="5" style={{ width: '100%' }}>
      <Heading size="xl">Products</Heading>
      <Table.Root size="sm" variant="outline" striped>
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
      <Pagination.Root count={items.length * 5} pageSize={5} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger
            asChild={
              /** Put previous-page behavior on the icon button. */
              (getProps) => (
                <IconButton {...getProps()} aria-label="Previous page">
                  <ChevronLeftIcon />
                </IconButton>
              )
            }
          />
          <Pagination.Items
            render={
              /** Preserve each page number and selected treatment. */
              (page, getProps) => (
                <IconButton
                  {...getProps()}
                  aria-label={`Page ${page.value}`}
                  variant="ghost"
                  class="table-example-page"
                >
                  {page.value}
                </IconButton>
              )
            }
          />
          <Pagination.NextTrigger
            asChild={
              /** Put next-page behavior on the icon button. */
              (getProps) => (
                <IconButton {...getProps()} aria-label="Next page">
                  <ChevronRightIcon />
                </IconButton>
              )
            }
          />
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
}
