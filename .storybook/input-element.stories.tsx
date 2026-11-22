import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Input, InputElement } from '../src';

/** Compose a decorative element with a native editable Input. */
function InputElementContractExample(): JSX.Element {
  const [placement, setPlacement] = createSignal<'start' | 'end'>('start');

  /** Move the adornment without replacing the native input. */
  function togglePlacement(): void {
    setPlacement(placement() === 'start' ? 'end' : 'start');
  }

  return (
    <>
      <div style={{ position: 'relative', width: '280px' }} data-testid="input-element-container">
        <Input
          aria-label="Website"
          style={{
            'padding-inline-start': 'var(--leverui-spacing-10)',
            'padding-inline-end': 'var(--leverui-spacing-10)',
          }}
          placeholder="example.com"
        />
        <InputElement
          placement={placement()}
          style={{ top: '0', 'pointer-events': 'none' }}
          data-testid="input-element"
        >
          https://
        </InputElement>
      </div>
      <div style={{ position: 'relative', width: '280px', height: '40px' }}>
        <InputElement unstyled title="Plain element" data-testid="input-element-unstyled">
          Plain
        </InputElement>
      </div>
      <div style={{ position: 'relative', width: '280px', height: '40px' }}>
        <InputElement placement={{ base: 'start', md: 'end' }} data-testid="responsive-element">
          Unit
        </InputElement>
      </div>
      <button type="button" onClick={togglePlacement} data-testid="input-element-toggle">
        Toggle placement
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Input Element',
  component: InputElementContractExample,
} satisfies Meta<typeof InputElementContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
