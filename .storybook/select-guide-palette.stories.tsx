import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select } from '../src';

const frameworks = Select.createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'SolidJS', value: 'solid' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});

/** Apply the guide's palette tokens to one reactive Select trigger. */
function PaletteSelectGuide(): JSX.Element {
  const [palette, setPalette] = createSignal<'red' | 'blue'>('red');

  /** Recompute public palette tokens without remounting the Select machine. */
  function togglePalette(): void {
    setPalette(palette() === 'red' ? 'blue' : 'red');
  }

  return (
    <>
      <form data-testid="select-palette-form" style={{ width: '320px', padding: '24px' }}>
        <Select.Root
          collection={frameworks}
          name="framework"
          size="sm"
          colorPalette={palette()}
          defaultValue={['react']}
          data-testid="select-palette-root"
        >
          <Select.HiddenSelect />
          <Select.Label>Select framework</Select.Label>
          <Select.Control>
            <Select.Trigger
              data-testid="select-palette-trigger"
              style={{
                'border-color': 'var(--leverui-colors-color-palette-muted)',
                background: 'var(--leverui-colors-color-palette-subtle)',
                color: 'var(--leverui-colors-color-palette-fg)',
              }}
            >
              <Select.ValueText placeholder="Select framework" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator style={{ color: 'var(--leverui-colors-color-palette-fg)' }} />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <For each={frameworks.items}>
                    {
                      /** Keep the palette specimen's options in its collection. */
                      (item) => (
                        <Select.Item item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
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
        <button type="button" onClick={togglePalette}>
          Toggle palette
        </button>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Palette',
  component: PaletteSelectGuide,
} satisfies Meta<typeof PaletteSelectGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: PaletteSelectGuide };
