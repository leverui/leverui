import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  TableBody as BodyExport,
  TableCell as CellExport,
  TableRoot as RootExport,
  TableRootPropsProvider as PropsProviderExport,
  TableRow as RowExport,
} from '../src';

export interface TableHydrationComponents {
  TableRootPropsProvider: typeof PropsProviderExport;
  TableRoot: typeof RootExport;
  TableBody: typeof BodyExport;
  TableRow: typeof RowExport;
  TableCell: typeof CellExport;
}

/** Build matching server and browser Table trees with a reactive size. */
export function renderTableHydrationTree(components: TableHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change provider defaults after the browser attaches. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return createComponent(components.TableRootPropsProvider, {
    /** Follow size changes through the reactive props provider. */
    value: () => ({ size: large() ? 'lg' : 'sm' }),
    /** Place the table and button under the same provider. */
    get children() {
      return [
        createComponent(components.TableRoot, {
          id: 'hydrated-table',
          /** Build body parts only after the root style context exists. */
          get children() {
            return createComponent(components.TableBody, {
              /** Keep the native row inside the body. */
              get children() {
                return createComponent(components.TableRow, {
                  /** Render the reactive cell without changing its identity. */
                  get children() {
                    return createComponent(components.TableCell, {
                      id: 'hydrated-table-cell',
                      children: 'Notebook',
                    });
                  },
                });
              },
            });
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'table-hydration-toggle',
          type: 'button',
          onClick: toggleSize,
          children: 'Toggle size',
        }),
      ];
    },
  });
}
