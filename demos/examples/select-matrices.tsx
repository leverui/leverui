import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal, Select, Stack } from '../../src';
import { fruits, statuses, themes, times } from './select-matrix-options';

/** Show the four Select sizes. */
export function SelectSizes(): JSX.Element {
  return (
    <Stack gap="5" style={{ width: '320px' }}>
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Bind one Select to each named size. */
          (size) => (
            <Select.Root size={size} collection={fruits}>
              <Select.HiddenSelect />
              <Select.Label>{`size = ${size}`}</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select fruit" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    <Select.List>
                      <For each={fruits.items}>
                        {(fruit) => (
                          <Select.Item item={fruit}>
                            {fruit.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        )}
                      </For>
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the outline and subtle Select variants. */
export function SelectVariants(): JSX.Element {
  return (
    <Stack gap="5" style={{ width: '320px' }}>
      <For each={['outline', 'subtle'] as const}>
        {
          /** Keep option content identical across both variants. */
          (variant) => (
            <Select.Root variant={variant} collection={themes}>
              <Select.HiddenSelect />
              <Select.Label>{`Select theme - ${variant}`}</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select theme" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    <Select.List>
                      <For each={themes.items}>
                        {(theme) => (
                          <Select.Item item={theme}>
                            {theme.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        )}
                      </For>
                    </Select.List>
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Apply red palette tokens to the Select trigger and indicator. */
export function SelectColorPalette(): JSX.Element {
  return (
    <Select.Root colorPalette="red" collection={statuses} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select status</Select.Label>
      <Select.Control>
        <Select.Trigger
          style={{
            'border-color': 'var(--leverui-colors-color-palette-muted)',
            background: 'var(--leverui-colors-color-palette-subtle)',
            color: 'var(--leverui-colors-color-palette-fg)',
          }}
        >
          <Select.ValueText placeholder="Select status" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator style={{ color: 'var(--leverui-colors-color-palette-fg)' }} />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={statuses.items}>
                {
                  /** Bind each option to the red palette root. */
                  (item) => (
                    <Select.Item item={item}>
                      {item.label}
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

/** Place the popup above the trigger without flipping. */
export function SelectPositioning(): JSX.Element {
  return (
    <Select.Root
      collection={times}
      size="sm"
      style={{ width: '320px' }}
      positioning={{ placement: 'top', flip: false }}
    >
      <Select.HiddenSelect />
      <Select.Label>Select time</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select time" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={times.items}>
                {(time) => (
                  <Select.Item item={time}>
                    {time.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
