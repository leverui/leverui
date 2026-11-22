import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ColorPicker, parseColor } from '../src';

/** Exercise custom native elements and changing appearance defaults. */
function ComposedColorPickerStory(): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const machine = ColorPicker.useColorPicker({ defaultValue: parseColor('#336699') });

  /** Increase both descendant roots without recreating either machine. */
  function increaseSize(): void {
    setSize('lg');
  }

  /** Keep appearance defaults reactive across both root modes. */
  function readDefaults(): { size: 'sm' | 'lg' } {
    return { size: size() };
  }

  /** Confirm the caller receives its selected root element. */
  function captureRoot(element: HTMLElement): void {
    element.setAttribute('data-root-ref', 'attached');
  }

  /** Confirm the primitive forwards its trigger's native element to the caller. */
  function captureTrigger(element: Element): void {
    element.setAttribute('data-trigger-ref', 'attached');
  }

  /** Render a caller-owned button with the primitive's live trigger props. */
  const renderTrigger: NonNullable<ColorPicker.TriggerProps['asChild']> = (getProps) => (
    <button {...getProps()} data-testid="color-picker-composed-trigger">
      Open custom picker
    </button>
  );

  return (
    <>
      <button type="button" onClick={increaseSize}>
        Increase picker size
      </button>
      <ColorPicker.PropsProvider value={readDefaults}>
        <ColorPicker.Root
          as="section"
          ref={captureRoot}
          data-testid="color-picker-composed-root"
          defaultValue={parseColor('#eb5e41')}
        >
          <ColorPicker.Label>Custom picker</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Input data-testid="color-picker-composed-input" />
            <ColorPicker.Trigger asChild={renderTrigger} ref={captureTrigger} />
          </ColorPicker.Control>
          <ColorPicker.Positioner>
            <ColorPicker.Content data-testid="color-picker-composed-content">
              <ColorPicker.Area />
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </ColorPicker.Root>
        <ColorPicker.RootProvider value={machine}>
          <ColorPicker.Control>
            <ColorPicker.Input data-testid="color-picker-composed-provider-input" />
          </ColorPicker.Control>
        </ColorPicker.RootProvider>
      </ColorPicker.PropsProvider>
    </>
  );
}

const meta = {
  title: 'Components/ColorPicker/Composition',
  component: ComposedColorPickerStory,
} satisfies Meta<typeof ComposedColorPickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReactiveDefaults: Story = { render: ComposedColorPickerStory };
