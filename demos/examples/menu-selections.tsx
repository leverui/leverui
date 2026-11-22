import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ArrowUpNarrowWideIcon, SettingsIcon } from '@lucide/solid';
import { Button, Menu, Portal, useCheckboxGroup } from '../../src';

const features = [
  { title: 'Autosave', value: 'autosave' },
  { title: 'Detect language', value: 'detect-language' },
  { title: 'Spellcheck', value: 'spellcheck' },
] as const;

/** Keep three checkbox menu choices independently selectable. */
export function MenuCheckboxItems(): JSX.Element {
  const group = useCheckboxGroup({ defaultValue: ['autosave'] });

  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              <SettingsIcon /> Features
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Features</Menu.ItemGroupLabel>
              <For each={features}>
                {
                  /** Bind each checkbox to the shared selected-feature state. */
                  (item) => (
                    <Menu.CheckboxItem
                      value={item.value}
                      checked={group().isChecked(item.value)}
                      onCheckedChange={
                        /** Toggle this feature in the shared group. */
                        () => group().toggleValue(item.value)
                      }
                    >
                      {item.title}
                      <Menu.ItemIndicator />
                    </Menu.CheckboxItem>
                  )
                }
              </For>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

const orders = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

/** Keep ascending and descending order mutually exclusive. */
export function MenuRadioItems(): JSX.Element {
  const [value, setValue] = createSignal('asc');

  return (
    <Menu.Root>
      <Menu.Trigger
        asChild={
          /** Keep trigger behavior on the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              <ArrowUpNarrowWideIcon /> Sort
            </Button>
          )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content style={{ 'min-width': '10rem' }}>
            <Menu.RadioItemGroup
              value={value()}
              onValueChange={
                /** Follow the selected radio value. */
                (details) => setValue(details.value)
              }
            >
              <For each={orders}>
                {
                  /** Render a labeled native menu radio choice. */
                  (item) => (
                    <Menu.RadioItem value={item.value}>
                      {item.label}
                      <Menu.ItemIndicator />
                    </Menu.RadioItem>
                  )
                }
              </For>
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
