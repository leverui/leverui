import { type JSX } from '@solidjs/web';
import { Kbd } from '../../src';
import type { KbdSize, KbdVariant } from '../../src/components/kbd-props';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

const sizes: readonly KbdSize[] = ['sm', 'md', 'lg'];
const variants: readonly KbdVariant[] = ['raised', 'outline', 'subtle', 'plain'];

/** Render one size and palette combination. */
function renderKbdSize(size: KbdSize, palette: ExamplePalette): JSX.Element {
  return (
    <Kbd size={size} colorPalette={palette}>
      ⌘ C
    </Kbd>
  );
}

/** Render one variant and palette combination. */
function renderKbdVariant(variant: KbdVariant, palette: ExamplePalette): JSX.Element {
  return (
    <Kbd variant={variant} colorPalette={palette}>
      ⌘ C
    </Kbd>
  );
}

/** Compare all three Kbd sizes across the ten palettes. */
export function KbdSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={sizes} renderCell={renderKbdSize} />;
}

/** Compare all four Kbd treatments across the ten palettes. */
export function KbdVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={variants} renderCell={renderKbdVariant} />;
}
