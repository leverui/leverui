import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { LoaderIcon } from '@lucide/solid';
import {
  Box,
  Center,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
  type SpinnerProps,
} from '../../src';
import { colorPalettes } from './playground-matrix';
import './spinner-display.css';

const spinnerSizes = ['inherit', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
type SpinnerSize = (typeof spinnerSizes)[number];

type GetSpinnerChildProps = Parameters<NonNullable<SpinnerProps['asChild']>>[0];

/** Show the small default spinner. */
export function SpinnerBasic(): JSX.Element {
  return <Spinner size="sm" />;
}

/** Color a large spinner with the teal token. */
export function SpinnerCustomColor(): JSX.Element {
  return <Spinner class="spinner-example-teal" size="lg" />;
}

/** Show each regular size in one row. */
export function SpinnerWithSizes(): JSX.Element {
  return (
    <HStack gap="5">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </HStack>
  );
}

/** Render one palette's three spinner sizes. */
function renderPaletteRow(colorPalette: (typeof colorPalettes)[number]): JSX.Element {
  return (
    <Stack align="center" direction="row" gap="10" class="spinner-example-palette-row">
      <Spinner size="sm" colorPalette={colorPalette} class="spinner-example-palette" />
      <Spinner size="md" colorPalette={colorPalette} class="spinner-example-palette" />
      <Spinner size="lg" colorPalette={colorPalette} class="spinner-example-palette" />
    </Stack>
  );
}

/** Compare spinner sizes across the color palettes. */
export function SpinnerWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>{renderPaletteRow}</For>
    </Stack>
  );
}

/** Render one green spinner with the outer spacing. */
function renderSpinnerSize(size: SpinnerSize): JSX.Element {
  return <Spinner class="spinner-example-green" size={size} />;
}

/** Compare every size in the spinner scale. */
export function SpinnerSizeTable(): JSX.Element {
  return (
    <div>
      <For each={spinnerSizes}>{renderSpinnerSize}</For>
    </div>
  );
}

/** Spin at the faster 0.8-second duration. */
export function SpinnerWithCustomSpeed(): JSX.Element {
  return <Spinner class="spinner-example-blue spinner-example-fast" />;
}

/** Increase the spinner ring to a four-pixel border. */
export function SpinnerWithCustomThickness(): JSX.Element {
  return <Spinner class="spinner-example-blue spinner-example-thick" />;
}

/** Put Spinner's attributes on a span that holds the loader icon. */
function renderSpinnerIcon(getProps: GetSpinnerChildProps): JSX.Element {
  return (
    <span {...getProps()}>
      <LoaderIcon />
    </span>
  );
}

/** Spin a custom icon as the indicator. */
export function SpinnerWithCustomIndicator(): JSX.Element {
  return <Spinner asChild={renderSpinnerIcon} class="spinner-example-icon" />;
}

/** Replace the transparent track with the gray token. */
export function SpinnerWithTrackColor(): JSX.Element {
  return <Spinner class="spinner-example-track" />;
}

/** Pair a teal spinner with the loading label. */
export function SpinnerWithLabel(): JSX.Element {
  return (
    <VStack class="spinner-example-label">
      <Spinner />
      <Text>Loading...</Text>
    </VStack>
  );
}

/** Cover the article with a translucent loading overlay. */
export function SpinnerWithOverlay(): JSX.Element {
  return (
    <Box style={{ position: 'relative', 'user-select': 'none' }} aria-busy="true">
      <Heading>Weekly sales report</Heading>
      <Text>
        Sales rose in all three regions this week. The full report has a chart for each product line
        and a short note on what changed since last week.
      </Text>
      <Box
        style={{
          position: 'absolute',
          inset: '0',
          background: 'color-mix(in srgb, var(--leverui-colors-bg) 80%, transparent)',
        }}
      >
        <Center style={{ height: '100%' }}>
          <Spinner class="spinner-example-teal" />
        </Center>
      </Box>
    </Box>
  );
}
