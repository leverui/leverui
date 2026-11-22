import { Badge, Card, Table } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const orders = [
  { id: '#3104', status: 'Paid', palette: 'green', total: '$240.00' },
  { id: '#3103', status: 'Pending', palette: 'orange', total: '$86.50' },
  { id: '#3102', status: 'Paid', palette: 'green', total: '$1,120.00' },
  { id: '#3101', status: 'Refunded', palette: 'gray', total: '$42.00' },
] as const;

/** Recent orders in a table, each with its payment status. */
export function OrdersCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Recent orders</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Order</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader class="home-showcase-end">Total</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={orders}>
              {/** One order. */}
              {(order) => (
                <Table.Row>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={order.palette}>{order.status}</Badge>
                  </Table.Cell>
                  <Table.Cell class="home-showcase-end">{order.total}</Table.Cell>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
}
