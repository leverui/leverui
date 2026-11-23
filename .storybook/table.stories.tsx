import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Table } from '../src';

/** Apply the public Table cell class to a consumer-owned native cell. */
function TableCellProbe(): JSX.Element {
  return (
    <td class="lui-table__cell" data-testid="table-style-probe">
      Custom cell
    </td>
  );
}

/** Exercise semantic parts, variants, native mode, and reactive defaults. */
function TableContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);

  /** Mark the root's native table ref. */
  function markTable(element: HTMLTableElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change provider size without replacing table nodes. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Record native row events. */
  function recordRowClick(): void {
    setClicks(clicks() + 1);
  }

  return (
    <>
      <Table.RootPropsProvider
        value={
          /** Supply changing size and palette defaults to the first table. */
          () => ({ size: large() ? 'lg' : 'sm', colorPalette: 'blue' })
        }
      >
        <Table.ScrollArea
          style={{ height: '160px', width: '380px' }}
          data-testid="table-scroll-area"
        >
          <Table.Root
            ref={markTable}
            striped
            interactive
            stickyHeader
            showColumnBorder
            data-testid="table-parts-root"
          >
            <Table.Caption data-testid="table-caption">Inventory</Table.Caption>
            <Table.ColumnGroup data-testid="table-column-group">
              <Table.Column htmlWidth="40%" data-testid="table-column" />
              <Table.Column htmlWidth="30%" />
              <Table.Column htmlWidth="30%" />
            </Table.ColumnGroup>
            <Table.Header data-testid="table-header">
              <Table.Row data-testid="table-header-row">
                <Table.ColumnHeader scope="col" data-testid="table-column-header">
                  Item
                </Table.ColumnHeader>
                <Table.ColumnHeader scope="col">Price</Table.ColumnHeader>
                <Table.ColumnHeader scope="col">Note</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body data-testid="table-body">
              <Table.Row data-selected="" onClick={recordRowClick} data-testid="table-selected-row">
                <Table.Cell data-testid="table-reactive-cell">
                  <button type="button" data-testid="table-row-action">
                    Notebook
                  </button>
                </Table.Cell>
                <Table.Cell>$12</Table.Cell>
                <TableCellProbe />
              </Table.Row>
              <Table.Row data-testid="table-hover-row">
                <Table.Cell data-testid="table-striped-cell">Pencil</Table.Cell>
                <Table.Cell>$2</Table.Cell>
                <Table.Cell>Ready</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Marker</Table.Cell>
                <Table.Cell>$3</Table.Cell>
                <Table.Cell>Ready</Table.Cell>
              </Table.Row>
            </Table.Body>
            <Table.Footer data-testid="table-footer">
              <Table.Row>
                <Table.Cell colspan={3}>Three products</Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table.Root>
        </Table.ScrollArea>
      </Table.RootPropsProvider>
      <button type="button" onClick={toggleSize} data-testid="table-size-toggle">
        Toggle size
      </button>
      <output data-testid="table-clicks">{clicks()}</output>

      <Table.Root variant="outline" size="md" data-testid="table-outline-root">
        <Table.Caption captionSide="top" data-testid="table-top-caption">
          Summary
        </Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Metric</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell data-testid="table-outline-cell">Total</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <Table.Root size={{ base: 'sm', md: 'lg' }} data-testid="table-responsive-root">
        <Table.Body>
          <Table.Row>
            <Table.Cell data-testid="table-responsive-cell">Responsive size</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <Table.Root native size="sm" striped data-testid="table-native-root">
        <caption data-testid="table-native-caption">Plain descendants</caption>
        <thead>
          <tr>
            <th data-testid="table-native-header">Native heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-testid="table-native-cell">Native value</td>
          </tr>
        </tbody>
      </Table.Root>

      <Table.Root variant="outline" striped interactive stickyHeader showColumnBorder>
        <Table.Header unstyled>
          <Table.Row unstyled data-testid="table-unstyled-header-row">
            <Table.ColumnHeader unstyled data-testid="table-unstyled-heading">
              Plain heading
            </Table.ColumnHeader>
            <Table.ColumnHeader unstyled>Other heading</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body unstyled>
          <Table.Row unstyled data-selected="" data-testid="table-unstyled-row">
            <Table.Cell unstyled data-testid="table-unstyled-cell">
              Plain cell
            </Table.Cell>
            <Table.Cell unstyled>Other cell</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer unstyled data-testid="table-unstyled-footer">
          <Table.Row unstyled>
            <Table.Cell unstyled>Summary</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </>
  );
}

const meta = {
  title: 'Content/Table',
  component: TableContractExample,
} satisfies Meta<typeof TableContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
