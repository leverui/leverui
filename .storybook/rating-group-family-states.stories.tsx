import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RatingGroup } from '../src';

/** Compare required, read-only, and disabled ratings in one native form. */
function StateRatings(): JSX.Element {
  return (
    <>
      <form data-testid="rating-group-state-form">
        <RatingGroup.Root name="required" required count={3} data-testid="rating-required">
          <RatingGroup.Label>Required score</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
        <RatingGroup.Root
          name="readonly"
          readOnly
          defaultValue={2}
          count={3}
          data-testid="rating-readonly"
        >
          <RatingGroup.Label>Read-only score</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
        <RatingGroup.Root
          name="disabled"
          disabled
          defaultValue={2}
          count={3}
          data-testid="rating-disabled"
        >
          <RatingGroup.Label>Disabled score</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Rating Group Family States',
  component: StateRatings,
} satisfies Meta<typeof StateRatings>;
export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = { render: StateRatings };
