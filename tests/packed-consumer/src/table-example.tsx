import { Table, type TableRootProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Table namespace, native mode, and reactive styles. */
export function PackedTable(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);
  const rootProps: TableRootProps = { striped: true, interactive: true };

  /** Confirm the installed root forwards its native table ref. */
  function captureRoot(element: HTMLTableElement): void {
    element.dataset.packedTableRef = element.tagName.toLowerCase();
  }

  /** Update the provider's size without replacing table descendants. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Confirm the installed row forwards a native event. */
  function recordClick(): void {
    setClicks(clicks() + 1);
  }

  return (
    <section>
      <Table.RootPropsProvider value={() => ({ size: large() ? 'lg' : 'sm' })}>
        <Table.ScrollArea id="packed-table-scroll" style={{ width: '300px' }}>
          <Table.Root {...rootProps} id="packed-table" ref={captureRoot}>
            <Table.Caption>Installed inventory</Table.Caption>
            <Table.ColumnGroup>
              <Table.Column htmlWidth="60%" id="packed-table-column" />
              <Table.Column htmlWidth="40%" />
            </Table.ColumnGroup>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader scope="col">Item</Table.ColumnHeader>
                <Table.ColumnHeader scope="col">Price</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row onClick={recordClick} id="packed-table-row">
                <Table.Cell id="packed-table-cell">
                  <button type="button" id="packed-table-row-action">
                    Notebook
                  </button>
                </Table.Cell>
                <Table.Cell>$12</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Table.RootPropsProvider>
      <button type="button" id="packed-table-toggle" onClick={toggleSize}>
        Change table size
      </button>
      <output id="packed-table-clicks">{clicks()}</output>
      <div class="packed-table-css">
        <Table.Root id="packed-table-css-root">
          <Table.Body>
            <Table.Row>
              <Table.Cell id="packed-table-css-cell">Consumer CSS</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
      <Table.Root native size="sm" id="packed-table-native">
        <tbody>
          <tr>
            <td id="packed-table-plain-cell">Plain cell</td>
          </tr>
        </tbody>
      </Table.Root>
    </section>
  );
}
