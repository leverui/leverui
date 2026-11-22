import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RatingGroup, type RatingGroupHoverChangeDetails } from '../src';

/** Keep one rating machine while count, size, and palette follow the viewport. */
function ResponsiveRating(): JSX.Element {
  const [wide, setWide] = createSignal(false);
  const [hovered, setHovered] = createSignal(-1);

  /** Subscribe to the breakpoint that drives the rendered rating props. */
  function connectBreakpoint(): (() => void) | undefined {
    const query = window.matchMedia('(min-width: 48rem)');
    setWide(query.matches);

    /** Keep machine props synchronized as the viewport crosses 48rem. */
    function updateWidth(event: MediaQueryListEvent): void {
      setWide(event.matches);
    }

    query.addEventListener('change', updateWidth);
    /** Remove the listener when Storybook unmounts the rating. */
    return () => query.removeEventListener('change', updateWidth);
  }

  /** Show the preview value without changing the committed rating. */
  function handleHover(details: RatingGroupHoverChangeDetails): void {
    setHovered(details.hoveredValue);
  }

  onSettled(connectBreakpoint);

  return (
    <>
      <RatingGroup.Root
        name="responsive-score"
        defaultValue={2}
        count={wide() ? 5 : 3}
        size={wide() ? 'lg' : 'sm'}
        colorPalette={wide() ? 'blue' : 'orange'}
        onHoverChange={handleHover}
        data-testid="rating-responsive"
      >
        <RatingGroup.Label>Responsive score</RatingGroup.Label>
        <RatingGroup.Control />
        <RatingGroup.HiddenInput />
      </RatingGroup.Root>
      <output data-testid="rating-hovered">{hovered() < 0 ? 'none' : hovered()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Rating Group Family Responsive',
  component: ResponsiveRating,
} satisfies Meta<typeof ResponsiveRating>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Responsive: Story = { render: ResponsiveRating };

/** Let authored media queries change size without a JavaScript listener. */
function ResponsiveCssRating(): JSX.Element {
  return (
    <RatingGroup.Root
      name="responsive-css-score"
      defaultValue={2}
      size={{ base: 'xs', md: 'lg' }}
      data-testid="rating-css-responsive"
    >
      <RatingGroup.Label>CSS responsive score</RatingGroup.Label>
      <RatingGroup.Control />
      <RatingGroup.HiddenInput />
    </RatingGroup.Root>
  );
}

export const CssBreakpoints: Story = { render: ResponsiveCssRating };
