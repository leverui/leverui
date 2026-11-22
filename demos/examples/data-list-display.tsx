import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { DataList, Stack } from '../../src';
import './data-list.css';

const stats = [
  { label: 'New users', value: '312' },
  { label: 'Orders', value: '1,480' },
  { label: 'Revenue', value: '£9,860' },
] as const;

const contactItems = [
  { label: 'First name', value: 'Imani' },
  { label: 'Last name', value: 'Kerr' },
  { label: 'Email', value: 'imani.kerr@example.com' },
  { label: 'Phone', value: '555 0142' },
  { label: 'Address', value: '42 Harbor Road, Lakeview' },
] as const;

/** Show the horizontal summary list. */
export function DataListBasic(): JSX.Element {
  return (
    <DataList.Root orientation="horizontal">
      <For each={stats}>
        {(item) => (
          <DataList.Item>
            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        )}
      </For>
    </DataList.Root>
  );
}

/** Compare the three sizes with one name and value each. */
export function DataListWithSizes(): JSX.Element {
  return (
    <Stack gap="4">
      <For each={['sm', 'md', 'lg'] as const}>
        {(size) => (
          <DataList.Root size={size}>
            <DataList.Item>
              <DataList.ItemLabel>Name</DataList.ItemLabel>
              <DataList.ItemValue>Theo Park</DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        )}
      </For>
    </Stack>
  );
}

/** Compare vertical and horizontal summary alignment. */
export function DataListWithOrientation(): JSX.Element {
  return (
    <Stack gap="8">
      <DataList.Root orientation="vertical">
        <For each={stats}>
          {(item) => (
            <DataList.Item>
              <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
              <DataList.ItemValue>{item.value}</DataList.ItemValue>
            </DataList.Item>
          )}
        </For>
      </DataList.Root>
      <DataList.Root orientation="horizontal">
        <For each={stats}>
          {(item) => (
            <DataList.Item>
              <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
              <DataList.ItemValue>{item.value}</DataList.ItemValue>
            </DataList.Item>
          )}
        </For>
      </DataList.Root>
    </Stack>
  );
}

/** Separate the five contact fields with row rules. */
export function DataListWithSeparator(): JSX.Element {
  return (
    <DataList.Root orientation="horizontal" class="data-list-separated">
      <For each={contactItems}>
        {(item) => (
          <DataList.Item>
            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        )}
      </For>
    </DataList.Root>
  );
}

/** Compare the subtle and bold label treatments. */
export function DataListWithVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <DataList.Root variant="subtle">
        <For each={stats}>
          {(item) => (
            <DataList.Item>
              <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
              <DataList.ItemValue>{item.value}</DataList.ItemValue>
            </DataList.Item>
          )}
        </For>
      </DataList.Root>
      <DataList.Root variant="bold">
        <For each={stats}>
          {(item) => (
            <DataList.Item>
              <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
              <DataList.ItemValue>{item.value}</DataList.ItemValue>
            </DataList.Item>
          )}
        </For>
      </DataList.Root>
    </Stack>
  );
}
