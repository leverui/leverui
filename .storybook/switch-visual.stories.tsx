import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LocaleProvider, Switch, Theme } from '../src';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['solid', 'raised'] as const;
const states = [false, true] as const;

/** Render every visual state and scoped theme needed for the Switch visual checks. */
function SwitchVisualContract(): JSX.Element {
  return (
    <>
      <style>{'.switch-token-override { --leverui-colors-blue-solid: rgb(3, 111, 77); }'}</style>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <For each={sizes}>
          {
            /** Render every variant under this CSS size. */
            (size) => (
              <For each={variants}>
                {
                  /** Render both checked states for one visual variant. */
                  (variant) => (
                    <For each={states}>
                      {
                        /** Give each checked state a stable browser-test identity. */
                        (checked) => (
                          <Switch.Root
                            size={size}
                            variant={variant}
                            defaultChecked={checked}
                            data-testid={`visual-${size}-${variant}-${checked ? 'on' : 'off'}`}
                          >
                            <Switch.HiddenInput />
                            <Switch.Control />
                            <Switch.Label>{`${size} ${variant} ${checked ? 'on' : 'off'}`}</Switch.Label>
                          </Switch.Root>
                        )
                      }
                    </For>
                  )
                }
              </For>
            )
          }
        </For>
        <Switch.Root
          colorPalette="blue"
          defaultChecked
          class="switch-token-override"
          data-testid="visual-token-override"
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Token override</Switch.Label>
        </Switch.Root>
        <LocaleProvider locale="ar-EG">
          <Switch.Root defaultChecked data-testid="visual-rtl">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>RTL switch</Switch.Label>
          </Switch.Root>
        </LocaleProvider>
        <Theme appearance="dark" data-testid="visual-dark-scope">
          <Switch.Root data-testid="visual-dark">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Dark switch</Switch.Label>
          </Switch.Root>
          <Theme appearance="light" data-testid="visual-light-scope">
            <Switch.Root data-testid="visual-light">
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Nested light switch</Switch.Label>
            </Switch.Root>
          </Theme>
        </Theme>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Switch Visual',
  component: SwitchVisualContract,
} satisfies Meta<typeof SwitchVisualContract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: SwitchVisualContract };
