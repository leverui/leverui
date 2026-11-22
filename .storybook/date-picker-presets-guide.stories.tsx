import { parseDate } from '@internationalized/date';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker, Flex, Stack } from '../src';

const presets = [
  { label: 'Start day', value: parseDate('2026-03-14') },
  { label: 'Next week', value: parseDate('2026-03-21') },
  { label: 'Month end', value: parseDate('2026-03-31') },
] as const;

/** Place machine-owned preset buttons beside an inline day calendar. */
function PresetsSidebarPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root inline fixedWeeks defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Choose a date</DatePicker.Label>
        <DatePicker.Context>
          {
            /** Keep selected preset styling synchronized with the machine. */
            (api) => (
              <>
                <output data-testid="date-picker-sidebar-value">
                  {api().value[0]?.toString() ?? ''}
                </output>
                <Flex direction={{ base: 'column', sm: 'row' }}>
                  <Stack gap="0" data-testid="date-picker-preset-sidebar">
                    <For each={presets}>
                      {
                        /** Bind each sidebar row to its exact date value. */
                        (preset) => (
                          <DatePicker.PresetTrigger
                            value={[preset.value]}
                            aria-label={`Select ${preset.label}`}
                            data-selected={
                              api().value[0]?.compare(preset.value) === 0 ? '' : undefined
                            }
                          >
                            {preset.label}
                          </DatePicker.PresetTrigger>
                        )
                      }
                    </For>
                  </Stack>
                  <DatePicker.Content>
                    <DatePicker.View view="day">
                      <DatePicker.Header />
                      <DatePicker.DayTable data-testid="date-picker-sidebar-days" />
                    </DatePicker.View>
                  </DatePicker.Content>
                </Flex>
              </>
            )
          }
        </DatePicker.Context>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Presets Guide',
  component: PresetsSidebarPicker,
} satisfies Meta<typeof PresetsSidebarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sidebar: Story = { render: PresetsSidebarPicker };
