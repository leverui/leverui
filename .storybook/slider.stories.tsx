import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Slider } from '../src';
import '../demos/slider-example-styles.css';

/** Exercise controlled selection, forms, keyboard, and live CSS choices. */
function SliderContractExample(): JSX.Element {
  const [value, setValue] = createSignal([30]);
  const [large, setLarge] = createSignal(false);

  /** Keep the selected value owned by a Solid signal. */
  function handleValueChange(details: { value: number[] }): void {
    setValue(details.value);
  }

  /** Change both appearance variants without replacing the machine. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  return (
    <>
      <form data-testid="slider-form" style={{ width: '380px', padding: '24px' }}>
        <Slider.Root
          name="volume"
          value={value()}
          onValueChange={handleValueChange}
          min={0}
          max={100}
          step={5}
          size={large() ? 'lg' : 'sm'}
          variant={large() ? 'solid' : 'outline'}
          data-testid="slider-root"
        >
          <Slider.Label>Volume</Slider.Label>
          <Slider.ValueText data-testid="slider-value-text" />
          <Slider.Control data-testid="slider-control">
            <Slider.Track data-testid="slider-track">
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} data-testid="slider-thumb">
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        <output data-testid="slider-value">{value()[0]}</output>
        <button type="button" onClick={toggleAppearance} data-testid="slider-appearance-toggle">
          Toggle appearance
        </button>
      </form>
    </>
  );
}

/** Show a two-thumb range, collision spacing, and labeled marks. */
function SliderRangeExample(): JSX.Element {
  return (
    <>
      <form style={{ width: '380px', padding: '24px' }} data-testid="slider-range-form">
        <Slider.Root name="price" defaultValue={[20, 80]} minStepsBetweenThumbs={10}>
          <Slider.Label>Price</Slider.Label>
          <Slider.ValueText />
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
          <Slider.Marks marks={[0, { value: 50, label: 'Middle' }, 100]} />
        </Slider.Root>
      </form>
    </>
  );
}

/** Show vertical orientation, disabled state, and the external machine path. */
function SliderStateExample(): JSX.Element {
  const machine = Slider.useSlider({
    defaultValue: [40],
    min: 0,
    max: 100,
    orientation: 'vertical',
  });
  return (
    <>
      <Slider.PropsProvider value={{ size: 'lg' }}>
        <Slider.Root orientation="vertical" defaultValue={[25]} style={{ height: '220px' }}>
          <Slider.Label>Vertical</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Slider.Root defaultValue={[35]} disabled>
          <Slider.Label>Disabled</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Slider.Root defaultValue={[45]} readOnly data-testid="slider-readonly-root">
          <Slider.Label>Readonly</Slider.Label>
          <Slider.Control data-testid="slider-readonly-control">
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Slider.RootProvider
          value={machine}
          data-testid="slider-provider-root"
          style={{ height: '220px' }}
        >
          <Slider.Label>External</Slider.Label>
          <Slider.Control data-testid="slider-provider-control">
            <Slider.Track data-testid="slider-provider-track">
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
          <Slider.Marks marks={[0, { value: 50, label: 'External middle' }, 100]} />
        </Slider.RootProvider>
      </Slider.PropsProvider>
    </>
  );
}

/** Compose a drag value bubble with individually colored marker labels. */
function SliderGuideExample(): JSX.Element {
  const marks = [
    { value: 20, label: 'Low', color: 'green.fg' },
    { value: 50, label: 'Medium', color: 'orange.fg' },
    { value: 80, label: 'High', color: 'red.fg' },
  ] as const;

  return (
    <>
      <div style={{ width: '360px', padding: '24px' }}>
        <Slider.Root defaultValue={[40]}>
          <Slider.Label>Guide value</Slider.Label>
          <Slider.Control data-testid="slider-guide-control">
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.DraggingIndicator
                data-testid="slider-drag-value"
                class="slider-example-drag-indicator"
              >
                <Slider.ValueText />
              </Slider.DraggingIndicator>
              <Slider.HiddenInput />
            </Slider.Thumb>
            <Slider.MarkerGroup>
              {marks.map(
                /** Render each positioned marker with its own colored label. */
                (mark) => (
                  <Slider.Marker value={mark.value}>
                    <Slider.MarkerIndicator />
                    <Slider.MarkerLabel
                      style={{
                        color: `var(--lui-colors-${mark.color.replace('.', '-')})`,
                        'font-weight': 'var(--lui-font-weights-medium)',
                      }}
                    >
                      {mark.label}
                    </Slider.MarkerLabel>
                  </Slider.Marker>
                ),
              )}
            </Slider.MarkerGroup>
          </Slider.Control>
        </Slider.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Slider',
  component: SliderContractExample,
} satisfies Meta<typeof SliderContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Range: Story = { render: SliderRangeExample };
export const States: Story = { render: SliderStateExample };
export const Guide: Story = { render: SliderGuideExample };
