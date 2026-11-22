import { type JSX } from '@solidjs/web';
import { Badge } from '../../src';
import type { BadgeSize } from '../../src/components/badge-size';
import type { BadgeVariant } from '../../src/components/badge-props';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

const badgeSizes: readonly BadgeSize[] = ['xs', 'sm', 'md', 'lg'];
const badgeVariants: readonly BadgeVariant[] = ['solid', 'subtle', 'outline', 'surface', 'plain'];

/** Show one solid Badge size in a palette table cell. */
function renderSize(size: BadgeSize, palette: ExamplePalette): JSX.Element {
  return (
    <Badge size={size} colorPalette={palette} variant="solid">
      New
    </Badge>
  );
}

/** Show one Badge variant in a palette table cell. */
function renderVariant(variant: BadgeVariant, palette: ExamplePalette): JSX.Element {
  return (
    <Badge variant={variant} colorPalette={palette}>
      New
    </Badge>
  );
}

/** Compare all Badge sizes across the palettes. */
export function BadgeSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={badgeSizes} renderCell={renderSize} />;
}

/** Compare all Badge variants across the palettes. */
export function BadgeVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={badgeVariants} renderCell={renderVariant} />;
}
