import { type JSX } from '@solidjs/web';
import { PackedPortal } from './portal-example';
import { PackedPresence } from './presence-example';
import { PackedShow } from './show-example';
import { PackedVisuallyHidden } from './visually-hidden-example';

/** Render packaged conditional and portal utilities. */
export default function PackedUtilityRendering(): JSX.Element {
  return (
    <>
      <PackedPortal />
      <PackedPresence />
      <PackedShow />
      <PackedVisuallyHidden />
    </>
  );
}
