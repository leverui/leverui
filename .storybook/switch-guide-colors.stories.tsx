import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Switch } from '../src';

const palettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;

/** Show the guide's ten palettes in both selection states. */
function SwitchGuideColors(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '8px', padding: '24px', width: '300px' }}>
        <For each={palettes}>
          {
            /** Keep the unchecked and checked palette pair together. */
            (palette) => (
              <div style={{ display: 'flex', 'align-items': 'center', gap: '40px' }}>
                <span style={{ width: '8ch' }}>{palette}</span>
                <For each={[false, true]}>
                  {
                    /** Name each example independently of its changing checked state. */
                    (checked) => (
                      <Switch.Root
                        colorPalette={palette}
                        defaultChecked={checked}
                        data-testid={`switch-guide-color-${palette}-${checked ? 'on' : 'off'}`}
                      >
                        <Switch.HiddenInput
                          aria-label={`${palette} palette example ${checked ? '2' : '1'}`}
                        />
                        <Switch.Control />
                      </Switch.Root>
                    )
                  }
                </For>
              </div>
            )
          }
        </For>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Switch Guide Colors',
  component: SwitchGuideColors,
} satisfies Meta<typeof SwitchGuideColors>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Palettes: Story = { render: SwitchGuideColors };
