import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Steps } from '../src';
import './steps-styles.css';

interface SampleProps {
  testId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'subtle';
  colorPalette?: 'blue' | 'red';
  class?: string;
}

/** Render one complete styled item for a computed CSS comparison. */
function SampleSteps(props: SampleProps): JSX.Element {
  return (
    <Steps.Root
      items={[{ value: 'step-0' }]}
      defaultValue="step-0"
      size={props.size}
      variant={props.variant}
      colorPalette={props.colorPalette}
      class={props.class}
      data-testid={props.testId}
    >
      <Steps.List>
        <Steps.Item value="step-0">
          <Steps.Trigger>
            <Steps.Indicator data-testid={`${props.testId}-indicator`} />
            <Steps.Title>{props.testId}</Steps.Title>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>
      <Steps.Content value="step-0">Current step</Steps.Content>
    </Steps.Root>
  );
}

/** Compare all sizes, variants, and two palette families. */
function StepsStyleGallery(): JSX.Element {
  return (
    <>
      <SampleSteps testId="steps-xs" size="xs" />
      <SampleSteps testId="steps-sm" size="sm" />
      <SampleSteps testId="steps-md" size="md" />
      <SampleSteps testId="steps-lg" size="lg" />
      <SampleSteps testId="steps-solid" variant="solid" />
      <SampleSteps testId="steps-subtle" variant="subtle" />
      <SampleSteps testId="steps-blue" colorPalette="blue" />
      <SampleSteps testId="steps-red" colorPalette="red" />
    </>
  );
}

/** Prove a normal consumer stylesheet overrides a public Steps color token. */
function StepsCssOverride(): JSX.Element {
  return <SampleSteps testId="steps-css-override" colorPalette="blue" class="steps-consumer" />;
}

/** Change the machine and authored layout from one Solid signal. */
function ReactiveSteps(): JSX.Element {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('horizontal');

  /** Toggle the current machine direction without replacing its root. */
  function toggleOrientation(): void {
    setOrientation(orientation() === 'horizontal' ? 'vertical' : 'horizontal');
  }

  return (
    <>
      <button onClick={toggleOrientation} data-testid="steps-orientation-toggle">
        Change orientation
      </button>
      <Steps.Root
        items={[{ value: 'step-0' }]}
        orientation={orientation()}
        data-testid="steps-reactive-root"
      >
        <Steps.List data-testid="steps-reactive-list">
          <Steps.Item value="step-0">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Current</Steps.Title>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
        <Steps.Content value="step-0">Panel</Steps.Content>
      </Steps.Root>
    </>
  );
}

/** Exercise responsive choices, reactive updates, and unstyled composition. */
function StepsCssContract(): JSX.Element {
  const [size, setSize] = createSignal<'xs' | 'sm'>('xs');

  /** Change the base size while retaining the same machine root. */
  function toggleSize(): void {
    setSize(size() === 'xs' ? 'sm' : 'xs');
  }

  return (
    <div>
      <button onClick={toggleSize} data-testid="steps-size-toggle">
        Change size
      </button>
      <Steps.Root
        items={[{ value: 'step-0' }]}
        size={{ base: size(), md: 'lg' }}
        variant={{ base: 'solid', md: 'subtle' }}
        data-testid="steps-css-root"
      >
        <Steps.List>
          <Steps.Item value="step-0">
            <Steps.Indicator data-testid="steps-css-indicator" />
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
      <Steps.Root items={[{ value: 'step-0' }]} unstyled data-testid="steps-css-unstyled-root">
        <Steps.List>
          <Steps.Item value="step-0">
            <Steps.Indicator class="steps-part-custom" data-testid="steps-css-unstyled-indicator" />
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
      <Steps.Root items={[{ value: 'step-0' }]}>
        <Steps.List>
          <Steps.Item value="step-0">
            <Steps.Indicator unstyled class="steps-part-custom" data-testid="steps-css-part" />
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Steps/Styles',
  component: StepsStyleGallery,
} satisfies Meta<typeof StepsStyleGallery>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {};
export const CssOverride: Story = { render: StepsCssOverride };
export const Reactive: Story = { render: ReactiveSteps };
export const CssContract: Story = { render: StepsCssContract };
