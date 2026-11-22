import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Button, ButtonGroup, Heading, Stack, Steps, Text } from '../../src';

const onboardingSteps = [
  {
    title: 'Create account',
    description:
      'Sign up with your email and create a secure password. Make sure to verify your email address.',
  },
  {
    title: 'Profile setup',
    description:
      'Add your details, a profile picture, and your preferences so we can set things up for you.',
  },
  {
    title: 'Get started',
    description:
      'Look around the dashboard, connect with other people, and start using the features right away.',
  },
] as const;

/** Lay out an onboarding flow that renders every Steps part the Explorer can highlight. */
export function StepsExplorerDemo(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'max-width': 'var(--leverui-sizes-md)' }}>
      <Heading size="md">Onboarding steps</Heading>
      <Steps.Root
        defaultValue="step-1"
        defaultCompletedValues={['step-0']}
        items={onboardingSteps.map((_, index) => ({ value: `step-${index}` }))}
        orientation="vertical"
      >
        <Stack gap="8">
          <Steps.List style={{ gap: 'var(--leverui-spacing-6)' }}>
            <For each={onboardingSteps}>
              {
                /** Render one step with its description under the indicator. */
                (step, index) => (
                  <Box style={{ position: 'relative' }}>
                    <Steps.Item value={`step-${index()}`}>
                      <Steps.Trigger style={{ 'align-items': 'flex-start' }}>
                        <Steps.Indicator />
                        <Steps.Title
                          style={{ 'font-weight': 'var(--leverui-font-weights-semibold)' }}
                        >
                          {step.title}
                        </Steps.Title>
                      </Steps.Trigger>
                      <Steps.Separator />
                    </Steps.Item>
                    <Box
                      style={{
                        'padding-inline-start': 'var(--leverui-spacing-10)',
                        'margin-top': 'var(--leverui-spacing-2)',
                      }}
                    >
                      <Steps.Content value={`step-${index()}`}>
                        <Steps.Description style={{ color: 'var(--leverui-colors-gray-500)' }}>
                          {step.description}
                        </Steps.Description>
                      </Steps.Content>
                    </Box>
                  </Box>
                )
              }
            </For>
          </Steps.List>
          <Steps.CompletedContent>
            <Text
              style={{
                'margin-top': 'var(--leverui-spacing-2)',
                'font-weight': 'var(--leverui-font-weights-medium)',
                color: 'var(--leverui-colors-green-600)',
              }}
            >
              ✅ All steps are complete! You're ready to go.
            </Text>
          </Steps.CompletedContent>
          <Box>
            <ButtonGroup
              size="sm"
              variant="outline"
              style={{ width: '100%', 'justify-content': 'space-between' }}
            >
              <Steps.PrevTrigger
                asChild={
                  /** Forward the previous action to the outlined button. */
                  (getProps) => <Button {...getProps()}>Previous</Button>
                }
              />
              <Steps.NextTrigger
                asChild={
                  /** Forward the next action to the outlined button. */
                  (getProps) => <Button {...getProps()}>Next</Button>
                }
              />
            </ButtonGroup>
          </Box>
        </Stack>
      </Steps.Root>
    </Stack>
  );
}
