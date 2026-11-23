import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, DataList } from '../../src';
import type { DataListSize } from '../../src/components/data-list-choices';

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly DataListSize[];
const tableStyle = {
  width: '100%',
  'margin-bottom': '32px',
  'border-collapse': 'collapse',
} as const;
const headerStyle = {
  'font-size': '14px',
  'line-height': '21px',
  color: 'var(--lui-colors-fg-muted)',
} as const;
const cellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;

/** Compare the three Data List sizes in the table. */
export function DataListSizeTable(): JSX.Element {
  return (
    <table style={tableStyle}>
      <thead style={headerStyle}>
        <tr>
          <td style={cellStyle} />
          <For each={sizes}>
            {
              /** Label each size column. */
              (size) => <td style={cellStyle}>{size}</td>
            }
          </For>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle} />
          <For each={sizes}>
            {
              /** Place the corresponding list beneath its size label. */
              (size) => (
                <td style={cellStyle}>
                  <DataList.Root size={size}>
                    <DataList.Item>
                      <DataList.ItemLabel>Name</DataList.ItemLabel>
                      <DataList.ItemValue>Theo Park</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Email</DataList.ItemLabel>
                      <DataList.ItemValue>theo@example.com</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Badge colorPalette="teal">Active</Badge>
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </td>
              )
            }
          </For>
        </tr>
      </tbody>
    </table>
  );
}
