import { type JSX } from '@solidjs/web';
import type { RatingGroup as RatingGroupExport } from '../dist/index.js';

export type RatingGroupHydrationComponents = {
  RatingGroup: typeof RatingGroupExport;
};

/** Render matching half and whole ratings under both root modes. */
export function renderRatingGroupHydrationTree({
  RatingGroup,
}: RatingGroupHydrationComponents): JSX.Element {
  const external = RatingGroup.useRatingGroup({
    id: 'hydrated-rating-external',
    name: 'external-score',
    defaultValue: 4,
  });

  return (
    <>
      <form data-testid="primary-rating-form">
        <RatingGroup.Root
          id="hydrated-rating-primary"
          name="primary-score"
          defaultValue={2.5}
          allowHalf
          data-testid="primary-rating-root"
        >
          <RatingGroup.Label>Hydrated primary</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
      </form>
      <RatingGroup.PropsProvider
        value={{ value: 1, class: 'inherited-rating', style: { color: 'rgb(1, 2, 3)' } }}
      >
        <form data-testid="external-rating-form">
          <RatingGroup.RootProvider value={external} data-testid="external-rating-root">
            <RatingGroup.Label>Hydrated external</RatingGroup.Label>
            <RatingGroup.Control />
            <RatingGroup.HiddenInput />
          </RatingGroup.RootProvider>
        </form>
      </RatingGroup.PropsProvider>
    </>
  );
}
