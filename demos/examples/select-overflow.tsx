import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal, Select } from '../../src';

const books = Select.createListCollection({
  items: [
    { label: 'The Lantern Keeper', value: 'the_lantern_keeper' },
    { label: 'Saltwind', value: 'saltwind' },
    { label: 'Paper Harbor', value: 'paper_harbor' },
    { label: 'The Glass Orchard', value: 'the_glass_orchard' },
    { label: 'A Map of Quiet Rivers', value: 'a_map_of_quiet_rivers' },
    { label: 'Copper Moon', value: 'copper_moon' },
    { label: 'The Last Lighthouse', value: 'the_last_lighthouse' },
    { label: 'Lanternwright', value: 'lanternwright' },
    { label: 'North of Ember', value: 'north_of_ember' },
    { label: 'The Winter Archive', value: 'the_winter_archive' },
    { label: 'Field Notes from Nowhere', value: 'field_notes_from_nowhere' },
    { label: 'Velvet Static', value: 'velvet_static' },
    { label: 'The Clockmaker Who Forgot Tuesday', value: 'the_clockmaker_who_forgot_tuesday' },
    { label: 'Under the Paper Sky', value: 'under_the_paper_sky' },
    { label: 'Tidewater', value: 'tidewater' },
    { label: '7 Bridges to Morning', value: '7_bridges_to_morning' },
    { label: 'A Small Brave Song', value: 'a_small_brave_song' },
    { label: 'Mosaic', value: 'mosaic' },
    { label: 'Fox Hollow', value: 'fox_hollow' },
    { label: 'Quicksilver', value: 'quicksilver' },
    { label: 'The Tale of the Seventh Lantern', value: 'the_tale_of_the_seventh_lantern' },
  ],
});

/** Let the current book choice be cleared from the trigger. */
export function SelectClear(): JSX.Element {
  return (
    <Select.Root
      collection={books}
      defaultValue={['the_lantern_keeper']}
      size="sm"
      style={{ width: '320px' }}
    >
      <Select.HiddenSelect />
      <Select.Label>Select favorite book</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select book" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.ClearTrigger />
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={books.items}>
                {(item) => (
                  <Select.Item item={item}>
                    {item.label}
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

/** Show the full movie collection in a scrollable popup. */
export function SelectOverflow(): JSX.Element {
  return (
    <Select.Root collection={books} size="sm" style={{ width: '240px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select book</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select book" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={books.items}>
                {
                  /** Preserve the movie order in the scrollable list. */
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
