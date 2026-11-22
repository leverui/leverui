import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { DataList, InfoTip } from '../../src';

const stats = [
  { label: 'New users', value: '312' },
  { label: 'Orders', value: '1,480' },
  { label: 'Revenue', value: '£9,860' },
] as const;

/** Pair each summary label with a popover explaining its value. */
export function DataListWithInfo(): JSX.Element {
  return (
    <DataList.Root orientation="horizontal">
      <For each={stats}>
        {(item) => (
          <DataList.Item>
            <DataList.ItemLabel>
              {item.label}
              <InfoTip contentProps={{ 'aria-label': 'Total for the last 30 days' }}>
                Total for the last 30 days
              </InfoTip>
            </DataList.ItemLabel>
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        )}
      </For>
    </DataList.Root>
  );
}
