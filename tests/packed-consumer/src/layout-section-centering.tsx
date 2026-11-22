import { type JSX } from '@solidjs/web';
import { PackedAbsoluteCenter } from './absolute-center-example';
import { PackedAspectRatio } from './aspect-ratio-example';
import { PackedBleed } from './bleed-example';
import { PackedCenter } from './center-example';
import { PackedCircle } from './circle-example';
import { PackedSquare } from './square-example';

/** Render centered and shaped layout specimens. */
export default function PackedLayoutCentering(): JSX.Element {
  return (
    <>
      <PackedAbsoluteCenter />
      <PackedAspectRatio />
      <PackedBleed />
      <PackedCenter />
      <PackedCircle />
      <PackedSquare />
    </>
  );
}
