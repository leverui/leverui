import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Steps, useSteps } from '../src';

/** Render the basic number, check, and completion states. */
function BasicSteps(): JSX.Element {
  return (
    <>
      <Steps.Root
        items={[{ value: 'step-0' }, { value: 'step-1' }]}
        defaultValue="step-0"
        data-testid="steps-root"
      >
        <Steps.List>
          <Steps.Item value="step-0" data-testid="steps-item-0">
            <Steps.Trigger data-testid="steps-trigger-0">
              <Steps.Indicator data-testid="steps-indicator-0" />
              <Steps.Title>Account</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item value="step-1" data-testid="steps-item-1">
            <Steps.Trigger data-testid="steps-trigger-1">
              <Steps.Indicator data-testid="steps-indicator-1" />
              <Steps.Title>Review</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>
        <Steps.Content value="step-0">Account details</Steps.Content>
        <Steps.Content value="step-1">Review details</Steps.Content>
        <Steps.CompletedContent>Complete</Steps.CompletedContent>
        <Steps.PrevTrigger data-testid="steps-prev">Back</Steps.PrevTrigger>
        <Steps.NextTrigger data-testid="steps-next">Next</Steps.NextTrigger>
      </Steps.Root>
    </>
  );
}

/** Exercise an externally owned machine and the vertical subtle appearance. */
function ProviderSteps(): JSX.Element {
  const steps = useSteps({
    items: [{ value: 'step-0' }, { value: 'step-1' }],
    defaultValue: 'step-0',
    orientation: 'vertical',
  });
  return (
    <>
      <Steps.RootProvider value={steps} variant="subtle" size="sm" data-testid="steps-provider">
        <Steps.List>
          <Steps.Item value="step-0">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Start</Steps.Title>
              <Steps.Description>First task</Steps.Description>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item value="step-1">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Finish</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>
        <Steps.Content value="step-0">First panel</Steps.Content>
        <Steps.Content value="step-1">Second panel</Steps.Content>
        <Steps.PrevTrigger>Previous</Steps.PrevTrigger>
        <Steps.NextTrigger data-testid="steps-provider-next">Continue</Steps.NextTrigger>
      </Steps.RootProvider>
    </>
  );
}

/** Exercise controlled state and the primitive's linear validation boundary. */
function ControlledSteps(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('step-0');
  const [valid, setValid] = createSignal(false);
  const [invalidCount, setInvalidCount] = createSignal(0);
  return (
    <>
      <Steps.Root
        items={[{ value: 'step-0', invalid: !valid() }, { value: 'step-1' }]}
        value={value() ?? undefined}
        linear
        onValueChange={
          /** Keep the controlled step synchronized with the primitive. */
          (details) => setValue(details.value)
        }
        onNavigationBlocked={
          /** Record blocked transitions for a browser assertion. */
          () => setInvalidCount((count) => count + 1)
        }
        data-testid="steps-controlled"
      >
        <Steps.List>
          <Steps.Item value="step-0">
            <Steps.Indicator />
            <Steps.Title>Validate</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item value="step-1">
            <Steps.Indicator />
            <Steps.Title>Done</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>
        <Steps.Content value="step-0">Validation panel</Steps.Content>
        <Steps.Content value="step-1">Done panel</Steps.Content>
        <button
          onClick={
            /** Allow the next transition after the caller validates input. */
            () => setValid(true)
          }
          data-testid="steps-validate"
        >
          Validate
        </button>
        <Steps.NextTrigger data-testid="steps-controlled-next">Continue</Steps.NextTrigger>
        <output data-testid="steps-invalid-count">{invalidCount()}</output>
        <output data-testid="steps-current-step">{value()}</output>
      </Steps.Root>
    </>
  );
}

const meta = {
  title: 'Components/Steps',
  component: BasicSteps,
} satisfies Meta<typeof BasicSteps>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const Provider: Story = { render: ProviderSteps };
export const Controlled: Story = { render: ControlledSteps };
