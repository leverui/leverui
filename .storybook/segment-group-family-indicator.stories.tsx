import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SegmentGroup, Theme } from '../src';

/** Mount a measured indicator under one explicit color scheme. */
function IndicatorSpecimen(props: { appearance: 'light' | 'dark' }): JSX.Element {
  return (
    <Theme appearance={props.appearance} hasBackground={false}>
      <SegmentGroup.Root
        aria-label={`${props.appearance} indicator`}
        defaultValue="Solid"
        size="sm"
        data-testid={`segment-indicator-${props.appearance}`}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={['React', 'Solid', 'Vue']} />
      </SegmentGroup.Root>
    </Theme>
  );
}

/** Compare visible indicator styles in light and dark scopes. */
function IndicatorComparison(): JSX.Element {
  return (
    <>
      <IndicatorSpecimen appearance="light" />
      <IndicatorSpecimen appearance="dark" />
    </>
  );
}

const meta = {
  title: 'Components/Segment Group Family Indicator',
  component: IndicatorComparison,
} satisfies Meta<typeof IndicatorComparison>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Comparison: Story = { render: IndicatorComparison };
