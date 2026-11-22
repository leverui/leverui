import { type JSX } from '@solidjs/web';
import { Status } from '../../src';
import type { StatusSize } from '../../src/components/status-props';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

const sizes = ['sm', 'md', 'lg'] as const satisfies readonly StatusSize[];

/** Render one status size and palette combination. */
function renderStatusSize(size: StatusSize, palette: ExamplePalette): JSX.Element {
  return (
    <Status.Root size={size} colorPalette={palette}>
      <Status.Indicator />
      Status
    </Status.Root>
  );
}

/** Compare the three status sizes across all ten palettes. */
export function StatusSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={sizes} renderCell={renderStatusSize} />;
}
