import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RatingGroup, type RatingGroupIconProps } from '../src';

const ratingIndices = [1, 2, 3] as const;

/** Render a fresh diamond SVG for each indicator layer. */
function DiamondIcon(props: RatingGroupIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 2 22 12 12 22 2 12z" />
    </svg>
  );
}

/** Name each custom rating item for assistive technology. */
function ratingValueText(index: number): string {
  return `${index} points`;
}

/** Render one manually composed item from the shared rating index list. */
function renderRatingItem(index: number): JSX.Element {
  return (
    <RatingGroup.Item index={index}>
      <RatingGroup.ItemIndicator icon={DiamondIcon} />
    </RatingGroup.Item>
  );
}

/** Exercise manual items, icon layers, translations, and form submission. */
function CustomRating(): JSX.Element {
  return (
    <>
      <form data-testid="rating-custom-form">
        <RatingGroup.Root
          name="custom-score"
          defaultValue={1}
          count={ratingIndices.length}
          translations={{ ratingValueText }}
        >
          <RatingGroup.Label>Custom score</RatingGroup.Label>
          <RatingGroup.Control>
            <For each={ratingIndices}>{renderRatingItem}</For>
          </RatingGroup.Control>
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Rating Group Family Custom',
  component: CustomRating,
} satisfies Meta<typeof CustomRating>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Custom: Story = { render: CustomRating };
