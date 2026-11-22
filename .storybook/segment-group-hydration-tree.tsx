import { type JSX } from '@solidjs/web';
import type { SegmentGroup as GroupExport } from '../src';

export type SegmentGroupHydrationComponents = {
  SegmentGroup: typeof GroupExport;
};

/** Render the same public parts under either machine ownership mode. */
export function renderSegmentGroupHydrationTree({
  SegmentGroup,
}: SegmentGroupHydrationComponents): JSX.Element {
  const external = SegmentGroup.useSegmentGroup({
    id: 'hydrated-segment-external',
    name: 'external-framework',
    defaultValue: 'React',
  });
  return (
    <>
      <SegmentGroup.Root
        id="hydrated-segment-primary"
        name="primary-framework"
        aria-label="Hydrated primary"
        defaultValue="Solid"
      >
        <SegmentGroup.Indicator data-testid="primary-indicator" />
        <SegmentGroup.Items items={['React', 'Solid']} />
      </SegmentGroup.Root>
      <SegmentGroup.RootProvider value={external} aria-label="Hydrated external">
        <SegmentGroup.Indicator data-testid="external-indicator" />
        <SegmentGroup.Items items={['React', 'Solid']} />
      </SegmentGroup.RootProvider>
    </>
  );
}
