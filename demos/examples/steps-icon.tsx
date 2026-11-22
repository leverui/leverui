import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon, CheckIcon, UserIcon, WalletIcon } from '@lucide/solid';
import { Button, ButtonGroup, Steps } from '../../src';

const iconSteps = [
  { icon: UserIcon, description: 'Contact details' },
  { icon: WalletIcon, description: 'Payment' },
  { icon: CalendarIcon, description: 'Book an appointment' },
] as const;

/** Replace step numbers with three task icons. */
export function StepsIcon(): JSX.Element {
  return (
    <Steps.Root
      defaultValue="step-1"
      defaultCompletedValues={['step-0']}
      items={iconSteps.map((_, index) => ({ value: `step-${index}` }))}
      size="sm"
    >
      <Steps.List>
        <For each={iconSteps}>
          {
            /** Use each task's icon until the step completes. */
            (item, index) => (
              <Steps.Item value={`step-${index()}`}>
                <Steps.Indicator>
                  <Steps.Status incomplete={<item.icon />} complete={<CheckIcon />} />
                </Steps.Indicator>
                <Steps.Separator />
              </Steps.Item>
            )
          }
        </For>
      </Steps.List>
      <For each={iconSteps}>
        {
          /** Attach task copy to its matching icon. */
          (item, index) => (
            <Steps.Content value={`step-${index()}`}>{item.description}</Steps.Content>
          )
        }
      </For>
      <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>
      <ButtonGroup size="sm" variant="outline">
        <Steps.PrevTrigger asChild={(getProps) => <Button {...getProps()}>Prev</Button>} />
        <Steps.NextTrigger asChild={(getProps) => <Button {...getProps()}>Next</Button>} />
      </ButtonGroup>
    </Steps.Root>
  );
}
