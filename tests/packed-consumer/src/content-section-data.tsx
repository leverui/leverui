import { type JSX } from '@solidjs/web';
import { PackedStatus } from './status-example';
import { PackedTable } from './table-example';
import { PackedTag } from './tag-example';
import { PackedTimeline } from './timeline-example';

/** Render packaged status and structured-data specimens. */
export default function PackedContentData(): JSX.Element {
  return (
    <>
      <PackedStatus />
      <PackedTable />
      <PackedTag />
      <PackedTimeline />
    </>
  );
}
