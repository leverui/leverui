import { type JSX } from '@solidjs/web';
import { ColorPalettes } from '../../components/color-palettes';
import { GuidePage } from '../../components/guide-page';

/** Render the Colors guide with a swatch for every color under its written part. */
export default function ColorsRoute(): JSX.Element {
  return (
    <GuidePage path="/docs/colors" wide>
      <ColorPalettes />
    </GuidePage>
  );
}
