import { type JSX } from '@solidjs/web';
import { Link } from '../../src';
import type { LinkVariant } from '../../src/components/link-variant';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

const variants = ['underline', 'plain'] as const satisfies readonly LinkVariant[];

/** Render one link variant in the color palette matrix. */
function renderLinkVariant(variant: LinkVariant, palette: ExamplePalette): JSX.Element {
  return (
    <Link variant={variant} colorPalette={palette}>
      Open in new tab
    </Link>
  );
}

/** Compare the two authored Link variants across all ten palettes. */
export function LinkVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={variants} renderCell={renderLinkVariant} />;
}
