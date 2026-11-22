import { type JSX } from '@solidjs/web';
import {
  ClientOnly,
  ColorModeButton,
  ColorModeIcon,
  createColorMode,
  IconButton,
  Skeleton,
} from '../../src';

/** Show the client-only ghost icon toggle. */
export function ColorModeIconButton(): JSX.Element {
  return <ColorModeButton />;
}

/** Pair a client-only icon toggle with a 32px skeleton fallback. */
export function ColorModeValueFallback(): JSX.Element {
  const { toggleColorMode } = createColorMode();

  return (
    <ClientOnly
      fallback={
        <Skeleton style={{ width: 'var(--leverui-sizes-8)', height: 'var(--leverui-sizes-8)' }} />
      }
    >
      <IconButton
        onClick={toggleColorMode}
        variant="outline"
        size="sm"
        aria-label="Toggle color mode"
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
}
