import { type JSX } from '@solidjs/web';
import { PackedImage } from './image-example';
import { PackedSimpleGrid } from './simple-grid-example';
import { PackedSpacer } from './spacer-example';
import { PackedSticky } from './sticky-example';
import { PackedWrap } from './wrap-example';
import { PackedSplitter } from './splitter-example';

/** Render placement and resizable layout specimens. */
export default function PackedLayoutPlacement(): JSX.Element {
  return (
    <>
      <PackedImage />
      <PackedSimpleGrid />
      <PackedSpacer />
      <PackedSticky />
      <PackedWrap />
      <PackedSplitter />
    </>
  );
}
