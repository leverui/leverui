import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { DownloadIcon } from '@lucide/solid';
import { Box, FormatNumber, HStack, Sparkline, Text } from '../../src';
import { sparklineBars, sparklineValues, weeklyDownloads } from './sparkline-data';

/** Render the compact area chart. */
export function SparklineBasic(): JSX.Element {
  return <Sparkline data={sparklineValues} aria-label="Values over time" />;
}

/** Draw each sample as a colored vertical bar. */
export function SparklineBarChart(): JSX.Element {
  return <Sparkline data={sparklineBars} type="bar" aria-label="Values over time" />;
}

/** Keep only the line stroke and omit area fill. */
export function SparklineLineChart(): JSX.Element {
  return <Sparkline data={sparklineValues} type="line" aria-label="Values over time" />;
}

/** Fade the area fill below a smoothed line. */
export function SparklineGradient(): JSX.Element {
  return <Sparkline data={sparklineValues} gradient smooth aria-label="Values over time" />;
}

/** Label the minimum and maximum against a wider line chart. */
export function SparklineReference(): JSX.Element {
  return (
    <Sparkline
      data={sparklineValues}
      type="line"
      reference
      width={200}
      height={150}
      aria-label="Values with minimum and maximum reference lines"
    />
  );
}

/** Show a changing download count beside the hovered chart point. */
export function SparklineInteraction(): JSX.Element {
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const lastValue = weeklyDownloads[weeklyDownloads.length - 1]?.value ?? 0;
  /** Read the hovered or latest weekly count. */
  const value = () =>
    weeklyDownloads[activeIndex() ?? weeklyDownloads.length - 1]?.value ?? lastValue;
  /** Follow pointer changes reported by the Solid chart. */
  function updateActiveIndex(index: number | null): void {
    setActiveIndex(index);
  }
  return (
    <HStack align="flex-end" gap="0" style={{ 'max-width': 'var(--lui-sizes-sm)', width: '100%' }}>
      <Box style={{ flex: '1', 'font-weight': 'var(--lui-font-weights-medium)' }}>
        <HStack
          textStyle="sm"
          style={{
            color: 'var(--lui-colors-fg-muted)',
          }}
        >
          <DownloadIcon /> Weekly downloads
        </HStack>
        <Text
          textStyle="xl"
          style={{
            'margin-top': 'var(--lui-spacing-2)',
          }}
        >
          <FormatNumber value={value()} />
        </Text>
      </Box>
      <Box style={{ flex: '1' }}>
        <Sparkline
          data={weeklyDownloads}
          width="100%"
          activeIndex={activeIndex()}
          onActiveIndexChange={updateActiveIndex}
          aria-label="Weekly downloads over time"
        />
      </Box>
    </HStack>
  );
}
