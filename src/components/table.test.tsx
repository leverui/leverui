import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { GetChildProps } from '../styled-system/child-props';
import { Table } from '../index';

/** Preserve native table semantics, forwarded attributes, and scoped parts. */
function verifiesNativeParts(): void {
  let table: HTMLTableElement | undefined;

  /** Capture the actual table element from the public ref. */
  function captureTable(element: HTMLTableElement): void {
    table = element;
  }

  render(
    /** Mount all table sections inside their Table root. */
    () => (
      <>
        <Table.Root ref={captureTable} title="Inventory" size="sm" data-testid="table">
          <Table.Caption>Inventory</Table.Caption>
          <Table.ColumnGroup>
            <Table.Column htmlWidth="40%" data-testid="column" />
          </Table.ColumnGroup>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col">Item</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell">Notebook</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>One item</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </>
    ),
  );

  const root = screen.getByTestId('table');
  expect(root).toBe(table);
  expect(root.tagName).toBe('TABLE');
  expect(root.getAttribute('title')).toBe('Inventory');
  expect(root.hasAttribute('size')).toBe(false);
  expect(root.querySelector('caption')?.textContent).toBe('Inventory');
  expect(root.querySelector('colgroup')?.tagName).toBe('COLGROUP');
  expect(screen.getByTestId('column').getAttribute('width')).toBe('40%');
  expect(root.querySelector('th')?.getAttribute('scope')).toBe('col');
  expect(screen.getByTestId('cell').tagName).toBe('TD');
  expect(root.querySelector('tfoot')?.textContent).toBe('One item');
}

it('renders native table sections and forwards table attributes', verifiesNativeParts);

/** Keep explicit root variants independent of changing provider defaults. */
function verifiesReactiveDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Render inherited and explicitly sized tables together. */
  function Example(): JSX.Element {
    return (
      <>
        <Table.RootPropsProvider value={() => ({ size: large() ? 'lg' : 'sm' })}>
          <Table.Root data-testid="inherited">
            <Table.Body>
              <Table.Row>
                <Table.Cell data-testid="inherited-cell">Inherited</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <Table.Root size="md" data-testid="fixed">
            <Table.Body>
              <Table.Row>
                <Table.Cell>Fixed</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.RootPropsProvider>
      </>
    );
  }

  render(
    /** Mount the provider before changing its signal. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const cell = screen.getByTestId('inherited-cell');
  const fixed = screen.getByTestId('fixed');
  const initialCellClass = cell.className;
  const fixedClass = fixed.className;
  expect(inherited).toHaveAttribute('data-size', 'sm');
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(screen.getByTestId('inherited-cell')).toBe(cell);
  expect(inherited).toHaveAttribute('data-size', 'lg');
  expect(cell.className).toBe(initialCellClass);
  expect(fixed).toHaveAttribute('data-size', 'md');
  expect(fixed.className).toBe(fixedClass);
}

it('updates inherited size without replacing semantic parts', verifiesReactiveDefaults);

/** Require a Table root before a styled section requests slot context. */
function verifiesRootRequirement(): void {
  /** Attempt to mount a styled cell outside its table root. */
  function mountOrphan(): void {
    render(
      /** Render the invalid part in the package provider. */
      () => (
        <>
          <Table.Cell>Orphan</Table.Cell>
        </>
      ),
    );
  }

  expect(mountOrphan).toThrow(/inside TableRoot/);
}

it('rejects a styled cell without its Table root', verifiesRootRequirement);

/** Preserve native columns and table content through caller-owned elements. */
function verifiesCallerOwnedParts(): void {
  let column: Element | undefined;

  /** Render the consumer's scroll container with merged Table attributes. */
  function renderScroll(getProps: GetChildProps): JSX.Element {
    return <section {...getProps()} data-testid="owned-scroll" />;
  }

  /** Render the consumer's void column with its native width attribute. */
  function renderColumn(getProps: GetChildProps): JSX.Element {
    return <col {...getProps()} data-testid="owned-column" />;
  }

  /** Capture the actual consumer-owned column node. */
  function captureColumn(element: Element): void {
    column = element;
  }

  render(
    /** Mount the caller-owned nodes around a semantic Table. */
    () => (
      <Table.ScrollArea asChild={renderScroll} title="Inventory scroll">
        <Table.Root>
          <Table.ColumnGroup>
            <Table.Column asChild={renderColumn} htmlWidth="25%" ref={captureColumn} />
          </Table.ColumnGroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Notebook</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    ),
  );

  const scroll = screen.getByTestId('owned-scroll');
  const nativeColumn = screen.getByTestId('owned-column');
  expect(scroll.tagName).toBe('SECTION');
  expect(scroll.getAttribute('title')).toBe('Inventory scroll');
  expect(scroll.className).toContain('lui-table__scrollArea');
  expect(scroll.querySelector('table tbody td')?.textContent).toBe('Notebook');
  expect(nativeColumn).toBe(column);
  expect(nativeColumn.getAttribute('width')).toBe('25%');
  expect(nativeColumn.className).toContain('lui-table__column');
}

it('keeps caller-owned scroll and column elements native', verifiesCallerOwnedParts);
