import { type JSX } from '@solidjs/web';
import { PackedColorSwatch } from './color-swatch-example';
import { PackedDataList } from './data-list-example';
import { PackedHighlight } from './highlight-example';
import { PackedIcon } from './icon-example';
import { PackedKbd } from './kbd-example';
import { PackedLink } from './link-example';
import { PackedLoader } from './loader-example';
import { PackedSpinner } from './spinner-example';

/** Render the packaged visual and inline-media specimens. */
export default function PackedPresentationMedia(): JSX.Element {
  return (
    <>
      <PackedColorSwatch />
      <PackedDataList />
      <PackedHighlight />
      <PackedIcon />
      <PackedKbd />
      <PackedLink />
      <PackedLoader />
      <PackedSpinner />
    </>
  );
}
