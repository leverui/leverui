import { splitProps } from '../src/primitives/utils/split-props';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Slider, type SliderMarksProps, type SliderRootProps } from '../src';

type ClosedSliderProps = SliderRootProps & {
  label?: JSX.Element;
  marks?: SliderMarksProps['marks'];
  showValue?: boolean;
};

/** Offer an application-owned closed Slider without hiding public composition. */
function ClosedSlider(props: ClosedSliderProps): JSX.Element {
  const [local, rootProps] = splitProps(props, ['label', 'marks', 'showValue']);
  return (
    <Slider.Root thumbAlignment="center" {...rootProps}>
      <Show when={local.label}>
        <Show when={local.showValue} fallback={<Slider.Label>{local.label}</Slider.Label>}>
          <div
            style={{
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'space-between',
              gap: '0.5rem',
            }}
          >
            <Slider.Label>{local.label}</Slider.Label>
            <Slider.ValueText />
          </div>
        </Show>
      </Show>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        <Slider.Marks marks={local.marks ?? []} />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Demonstrate the Solid closed component with native form output. */
function ClosedSliderGuide(): JSX.Element {
  return (
    <>
      <form data-testid="slider-closed-form" style={{ width: '260px', padding: '24px' }}>
        <ClosedSlider
          data-testid="slider-closed-root"
          name="volume"
          label="Volume"
          showValue
          defaultValue={[40]}
          marks={[0, { value: 50, label: 'Half' }, 100]}
        />
      </form>
    </>
  );
}

/** Exercise the direct-label branch without value text. */
function DefaultClosedSliderGuide(): JSX.Element {
  return (
    <>
      <form data-testid="slider-closed-default-form" style={{ width: '260px', padding: '24px' }}>
        <ClosedSlider
          data-testid="slider-closed-default-root"
          name="level"
          label="Level"
          defaultValue={[30]}
          marks={[0, 50, 100]}
        />
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Slider Guide Closed',
  component: ClosedSliderGuide,
} satisfies Meta<typeof ClosedSliderGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ClosedSliderGuide };
export const Default: Story = { render: DefaultClosedSliderGuide };
