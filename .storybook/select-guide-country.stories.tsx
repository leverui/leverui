import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select } from '../src';

const groups = [
  {
    name: 'America',
    items: [
      { value: 'US', label: 'United States', flag: '🇺🇸' },
      { value: 'CA', label: 'Canada', flag: '🇨🇦' },
      { value: 'MX', label: 'Mexico', flag: '🇲🇽' },
      { value: 'BR', label: 'Brazil', flag: '🇧🇷' },
    ],
  },
  {
    name: 'Africa',
    items: [
      { value: 'ZA', label: 'South Africa', flag: '🇿🇦' },
      { value: 'NG', label: 'Nigeria', flag: '🇳🇬' },
      { value: 'MA', label: 'Morocco', flag: '🇲🇦' },
      { value: 'EG', label: 'Egypt', flag: '🇪🇬' },
    ],
  },
  {
    name: 'Asia',
    items: [
      { value: 'CN', label: 'China', flag: '🇨🇳' },
      { value: 'JP', label: 'Japan', flag: '🇯🇵' },
      { value: 'IN', label: 'India', flag: '🇮🇳' },
      { value: 'KR', label: 'South Korea', flag: '🇰🇷' },
    ],
  },
  {
    name: 'Europe',
    items: [
      { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
      { value: 'FR', label: 'France', flag: '🇫🇷' },
      { value: 'DE', label: 'Germany', flag: '🇩🇪' },
      { value: 'IT', label: 'Italy', flag: '🇮🇹' },
      { value: 'ES', label: 'Spain', flag: '🇪🇸' },
    ],
  },
  {
    name: 'Oceania',
    items: [
      { value: 'AU', label: 'Australia', flag: '🇦🇺' },
      { value: 'NZ', label: 'New Zealand', flag: '🇳🇿' },
      { value: 'FJ', label: 'Fiji', flag: '🇫🇯' },
    ],
  },
];
const countries = Select.createListCollection({
  items: groups.flatMap(
    /** Keep one machine collection while rendering its continent groups. */
    (group) => group.items,
  ),
  itemToString:
    /** Include the flag in selected and typeahead text. */
    (item) => `${item.flag} ${item.label}`,
  itemToValue:
    /** Submit the stable country code through the hidden select. */
    (item) => item.value,
});

/** Render continent headings around one shared country collection. */
function CountrySelectGuide(): JSX.Element {
  return (
    <>
      <form data-testid="country-select-form" style={{ width: '320px', padding: '24px' }}>
        <Select.Root collection={countries} name="country" size="sm" defaultValue={['NG']}>
          <Select.HiddenSelect />
          <Select.Label>Select country</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="country-select-trigger">
              <Select.ValueText placeholder="Select country" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content data-testid="country-select-content">
                <Select.List>
                  <For each={groups}>
                    {
                      /** Keep each heading above only its continent's options. */
                      (group) => (
                        <Select.ItemGroup>
                          <Select.ItemGroupLabel>{group.name}</Select.ItemGroupLabel>
                          <For each={group.items}>
                            {
                              /** Bind the visible flag and name to its country item. */
                              (item) => (
                                <Select.Item item={item}>
                                  <Select.ItemText>{countries.stringifyItem(item)}</Select.ItemText>
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
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Country',
  component: CountrySelectGuide,
} satisfies Meta<typeof CountrySelectGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: CountrySelectGuide };
