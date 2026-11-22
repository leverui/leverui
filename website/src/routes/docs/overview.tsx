import { type JSX } from '@solidjs/web';
import { ConceptOverviewGrid } from '../../components/concept-overview-grid';
import { GuidePage } from '../../components/guide-page';
import { conceptRoute } from '../../lib/concept-pages';

/**
 * Render the Components overview. It has its own route, so the demo of every component loads
 * with this page only and not with each guide.
 */
export default function ComponentOverviewRoute(): JSX.Element {
  return (
    <GuidePage path={conceptRoute('overview')} wide>
      <ConceptOverviewGrid />
    </GuidePage>
  );
}
