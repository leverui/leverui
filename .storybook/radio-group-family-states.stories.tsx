import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioGroup } from '../src';
import { RadioGroupFamilyChoice } from './radio-group-family-choice';

/** Keep the four machine states in one native form for browser verification. */
function StateGroups(): JSX.Element {
  return (
    <>
      <form data-testid="radio-group-state-form">
        <RadioGroup.Root name="required" required data-testid="radio-group-required">
          <RadioGroup.Label>Required choice</RadioGroup.Label>
          <RadioGroupFamilyChoice value="one" label="Required one" />
          <RadioGroupFamilyChoice value="two" label="Required two" />
        </RadioGroup.Root>
        <RadioGroup.Root
          name="invalid"
          invalid
          defaultValue="one"
          data-testid="radio-group-invalid"
        >
          <RadioGroup.Label>Invalid choice</RadioGroup.Label>
          <RadioGroupFamilyChoice value="one" label="Invalid one" />
          <RadioGroupFamilyChoice value="two" label="Invalid two" />
        </RadioGroup.Root>
        <RadioGroup.Root
          name="readonly"
          readOnly
          defaultValue="one"
          data-testid="radio-group-readonly"
        >
          <RadioGroup.Label>Read-only choice</RadioGroup.Label>
          <RadioGroupFamilyChoice value="one" label="Read-only one" />
          <RadioGroupFamilyChoice value="two" label="Read-only two" />
        </RadioGroup.Root>
        <RadioGroup.Root
          name="disabled"
          disabled
          defaultValue="one"
          data-testid="radio-group-disabled"
        >
          <RadioGroup.Label>Disabled choice</RadioGroup.Label>
          <RadioGroupFamilyChoice value="one" label="Disabled one" />
          <RadioGroupFamilyChoice value="two" label="Disabled two" />
        </RadioGroup.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Radio Group Family States',
  component: StateGroups,
} satisfies Meta<typeof StateGroups>;
export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = { render: StateGroups };
