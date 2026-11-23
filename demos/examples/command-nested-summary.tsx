import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, DataList, HStack, Kbd, Stack, Text } from '../../src';
import { items, shortcuts, type Issue } from './command-nested-data';
import { NestedItemIcon } from './command-nested-results';

const fields = [
  { field: 'status', label: 'Status' },
  { field: 'priority', label: 'Priority' },
  { field: 'assignee', label: 'Assignee' },
  { field: 'project', label: 'Project' },
] as const;

/** Show the selected issue fields below the palette. */
export function NestedSummary(props: { issue: Issue }): JSX.Element {
  return (
    <DataList.Root orientation="horizontal" size="sm">
      <For each={fields}>
        {
          /** Show one scalar field with its selected choice. */
          ({ field, label }) => {
            /** Find the choice that matches the issue's current value. */
            const item = () =>
              items.find((entry) => entry.field === field && entry.option === props.issue[field]);
            return (
              <DataList.Item>
                <DataList.ItemLabel>{label}</DataList.ItemLabel>
                <DataList.ItemValue>
                  <HStack gap="1.5">
                    <Show when={item()}>{(choice) => <NestedItemIcon item={choice()} />}</Show>
                    {item()?.label}
                  </HStack>
                </DataList.ItemValue>
              </DataList.Item>
            );
          }
        }
      </For>
      <DataList.Item>
        <DataList.ItemLabel>Labels</DataList.ItemLabel>
        <DataList.ItemValue>
          <HStack gap="1.5" wrap="wrap">
            <Show when={props.issue.labels.length === 0}>
              <Text style={{ color: 'var(--lui-colors-fg-muted)' }}>None</Text>
            </Show>
            <For each={props.issue.labels}>
              {
                /** Show one selected label as an outlined badge. */
                (value) => {
                  const item = items.find(
                    (entry) => entry.field === 'labels' && entry.option === value,
                  );
                  return (
                    <Badge variant="outline" size="sm">
                      {item && <NestedItemIcon item={item} />}
                      {item?.label}
                    </Badge>
                  );
                }
              }
            </For>
          </HStack>
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

/** List the issue shortcuts beneath the selected fields. */
export function NestedShortcuts(props: { keysOf: (hotkey: string) => string[] }): JSX.Element {
  return (
    <Stack
      gap="2"
      textStyle="sm"
      style={{
        padding: 'var(--lui-spacing-4)',
        'border-width': '1px',
        'border-radius': 'var(--lui-radii-l3)',
        background: 'var(--lui-colors-bg-subtle)',
        'min-width': 'var(--lui-sizes-64)',
      }}
    >
      <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>Shortcuts</Text>
      <For each={shortcuts}>
        {(item) => (
          <HStack gap="3">
            <HStack gap="0.5" style={{ 'min-width': 'var(--lui-sizes-16)' }}>
              <For each={props.keysOf(item.hotkey)}>
                {(key) => (
                  <Kbd size="sm" variant="subtle">
                    {key}
                  </Kbd>
                )}
              </For>
            </HStack>
            <Text
              textStyle="xs"
              style={{
                color: 'var(--lui-colors-fg-muted)',
              }}
            >
              {item.label}
            </Text>
          </HStack>
        )}
      </For>
    </Stack>
  );
}
