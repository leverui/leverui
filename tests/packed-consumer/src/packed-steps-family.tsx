import { Steps, StepsPropsProvider, useSteps, useStepsContext } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Read the installed machine context inside a composed item. */
function PackedStepsProbe(): JSX.Element {
  const machine = useStepsContext();
  return <output data-testid="packed-steps-probe">{machine().value}:ready</output>;
}

/** Exercise the packed external machine, namespace, and compound parts. */
export function PackedStepsFamily(): JSX.Element {
  const machine = useSteps({
    items: [{ value: 'step-0' }, { value: 'step-1' }],
    defaultValue: 'step-0',
    orientation: 'vertical',
  });
  return (
    <StepsPropsProvider value={{ size: 'sm', variant: 'subtle' }}>
      <Steps.RootProvider value={machine} data-testid="packed-steps-root">
        <Steps.List>
          <Steps.Item value="step-0" title="First">
            <Steps.Trigger data-testid="packed-steps-first">
              <Steps.Indicator data-testid="packed-steps-indicator" />
              <Steps.Title>First</Steps.Title>
              <Steps.Description>Initial task</Steps.Description>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item value="step-1" title="Second">
            <Steps.Trigger data-testid="packed-steps-second">
              <Steps.Indicator />
              <Steps.Title>Second</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>
        <Steps.Content value="step-0" data-testid="packed-steps-panel-first">
          First installed panel
        </Steps.Content>
        <Steps.Content value="step-1" data-testid="packed-steps-panel-second">
          Second installed panel
        </Steps.Content>
        <Steps.CompletedContent data-testid="packed-steps-complete">
          All done
        </Steps.CompletedContent>
        <Steps.PrevTrigger data-testid="packed-steps-prev">Previous</Steps.PrevTrigger>
        <Steps.NextTrigger data-testid="packed-steps-next">Continue</Steps.NextTrigger>
        <PackedStepsProbe />
      </Steps.RootProvider>
    </StepsPropsProvider>
  );
}
