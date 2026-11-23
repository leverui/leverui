import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal, Select, Span, Stack } from '../../src';
import { media, mediaItems, planItems, plans } from './select-rich-data';

/** Show plan descriptions below each selectable label. */
export function SelectItemDescription(): JSX.Element {
  return (
    <Select.Root collection={plans} size="sm" style={{ width: '320px' }} defaultValue={['pro']}>
      <Select.HiddenSelect />
      <Select.Label>Select plan</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select plan" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={planItems}>
                {
                  /** Keep the plan's description inside its option. */
                  (item) => (
                    <Select.Item item={item}>
                      <Stack gap="0">
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Span
                          textStyle="xs"
                          style={{
                            color: 'var(--lui-colors-fg-muted)',
                          }}
                        >
                          {item.description}
                        </Span>
                      </Stack>
                      <Select.ItemIndicator />
                    </Select.Item>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

const categories = ['Books', 'Movies'] as const;

/** Split book and movie choices into labeled popup groups. */
export function SelectOptionGroup(): JSX.Element {
  return (
    <Select.Root collection={media} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select title</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select title" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={categories}>
                {
                  /** Match each heading to its own options. */
                  (category) => (
                    <Select.ItemGroup>
                      <Select.ItemGroupLabel>{category}</Select.ItemGroupLabel>
                      <For
                        each={mediaItems.filter(
                          /** Select only items from this heading. */
                          (item) => item.category === category,
                        )}
                      >
                        {
                          /** Keep the collection item attached to its option. */
                          (item) => (
                            <Select.Item item={item}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          )
                        }
                      </For>
                    </Select.ItemGroup>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
