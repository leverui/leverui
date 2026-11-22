import { Table, type TableRootProps } from '@leverui/components';
import type * as LeverUIPackage from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectFalse<Value extends false> = Value;

export type StyleHookRemoved = ExpectFalse<
  'useTableStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof TableRootProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof TableRootProps ? true : false>;
export type UnknownSizeRejected = ExpectFalse<Assignable<{ size: 'ghost' }, TableRootProps>>;

/** Compile native Table parts, responsive variants, and column widths. */
export function AcceptedTableTypes(): JSX.Element {
  return (
    <Table.Root size={{ base: 'sm', md: 'lg' }} variant="outline" striped>
      <Table.ColumnGroup>
        <Table.Column htmlWidth="40%" />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader scope="col">Item</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell style={{ 'text-align': 'end' }}>Notebook</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/** Keep unsupported object styles and arbitrary style props out of Table. */
export function RejectedTableTypes(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Table has no CSS object prop. */}
      <Table.Root css={{ padding: '4px' }} />
      {/* @ts-expect-error Table has no custom recipe prop. */}
      <Table.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Table has no arbitrary style prop. */}
      <Table.Cell padding="4px" />
    </>
  );
}
