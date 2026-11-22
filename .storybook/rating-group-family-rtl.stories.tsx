import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LocaleProvider, RatingGroup } from '../src';

/** Let the shared RTL locale drive both the rating machine and its CSS appearance. */
function RtlHalfRating(): JSX.Element {
  return (
    <>
      <LocaleProvider locale="ar-EG">
        <form data-testid="rating-rtl-form">
          <RatingGroup.Root
            name="rtl-score"
            defaultValue={2.5}
            allowHalf
            colorPalette="blue"
            data-testid="rating-rtl-root"
          >
            <RatingGroup.Label>RTL score</RatingGroup.Label>
            <RatingGroup.Control />
            <RatingGroup.HiddenInput />
          </RatingGroup.Root>
        </form>
      </LocaleProvider>
    </>
  );
}

const meta = {
  title: 'Components/Rating Group Family RTL',
  component: RtlHalfRating,
} satisfies Meta<typeof RtlHalfRating>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Half: Story = { render: RtlHalfRating };
