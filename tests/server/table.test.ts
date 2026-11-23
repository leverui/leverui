import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  TableBody as BodyExport,
  TableCaption as CaptionExport,
  TableCell as CellExport,
  TableColumnHeader as ColumnHeaderExport,
  TableHeader as HeaderExport,
  TableRoot as RootExport,
  TableRow as RowExport,
} from '../../src';

type ServerComponents = {
  TableRoot: typeof RootExport;
  TableCaption: typeof CaptionExport;
  TableHeader: typeof HeaderExport;
  TableBody: typeof BodyExport;
  TableRow: typeof RowExport;
  TableColumnHeader: typeof ColumnHeaderExport;
  TableCell: typeof CellExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render one published semantic Table with authored CSS parts. */
function renderServerTable(): string {
  return renderToString(
    /** Render the semantic table in one server owner. */
    () =>
      createComponent(server.TableRoot<'table'>, {
        id: 'server-table',
        size: 'sm',
        variant: 'outline',
        title: 'Inventory',
        /** Render caption, header, and body under the slot provider. */
        get children() {
          return [
            createComponent(server.TableCaption, { children: 'Inventory caption' }),
            createComponent(server.TableHeader, {
              /** Keep the native header row under the table context. */
              get children() {
                return createComponent(server.TableRow, {
                  /** Render one scoped native column header. */
                  get children() {
                    return createComponent(server.TableColumnHeader, { children: 'Product' });
                  },
                });
              },
            }),
            createComponent(server.TableBody, {
              /** Keep the native body row under the table context. */
              get children() {
                return createComponent(server.TableRow, {
                  /** Render one scoped native data cell. */
                  get children() {
                    return createComponent(server.TableCell, { children: 'Notebook' });
                  },
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Render plain descendants under the public native-mode root. */
function renderNativeTable(): string {
  return renderToString(
    /** Place plain descendants under the native-mode table root. */
    () =>
      createComponent(server.TableRoot<'table'>, {
        id: 'server-native-table',
        native: true,
        size: 'sm',
        /** Keep plain native descendants in valid table order. */
        get children() {
          return createComponent(Dynamic, {
            component: 'tbody',
            /** Render a native row without a Table part wrapper. */
            get children() {
              return createComponent(Dynamic, {
                component: 'tr',
                /** Render a native cell under the root's nested selectors. */
                get children() {
                  return createComponent(Dynamic, { component: 'td', children: 'Plain cell' });
                },
              });
            },
          });
        },
      }),
  );
}

/** Verify published Table semantics and variant props stay off native tags. */
function verifiesServerTable(): void {
  const markup = renderServerTable();
  expect(markup).toMatch(/<table[^>]*id="server-table"/);
  expect(markup).toContain('title="Inventory"');
  expect(markup).toMatch(/<caption[^>]*>Inventory caption<\/caption>/);
  expect(markup).toMatch(/<thead[^>]*>.*<tr[^>]*>.*<th[^>]*>Product<\/th>/s);
  expect(markup).toMatch(/<tbody[^>]*>.*<tr[^>]*>.*<td[^>]*>Notebook<\/td>/s);
  expect(markup).toContain('lui-table__cell');
  expect(markup).not.toMatch(/<table[^>]*\s(?:size|variant|native|recipe|css|unstyled)=/);
}

test('published Table renders semantic parts and scoped CSS hooks', verifiesServerTable);

/** Verify native-mode SSR keeps plain descendants and consumes its control prop. */
function verifiesNativeServerTable(): void {
  const markup = renderNativeTable();
  expect(markup).toMatch(/<table[^>]*id="server-native-table"/);
  expect(markup).toMatch(/<tbody[^>]*>.*<tr[^>]*>.*<td[^>]*>Plain cell<\/td>/s);
  expect(markup).toMatch(/\sdata\-native(?:=""|(?=[\s/>]))/);
  expect(markup).not.toMatch(/<table[^>]*\s(?:native|size)=/);
}

test('published Table native mode retains plain HTML descendants', verifiesNativeServerTable);
