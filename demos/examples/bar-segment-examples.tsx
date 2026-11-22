import { type JSX } from '@solidjs/web';
import { BarSegment, useChart } from '../../src';

const sources: BarSegment.BarSegmentData[] = [
  { name: 'Google', value: 500000, color: 'teal.solid' },
  { name: 'Direct', value: 100000, color: 'blue.solid' },
  { name: 'Bing', value: 200000, color: 'orange.solid' },
  { name: 'Yandex', value: 100000, color: 'purple.solid' },
];

const languages: BarSegment.BarSegmentData[] = [
  { name: 'Ruby', value: 450000, color: 'green.solid' },
  { name: 'CSS', value: 150000, color: 'yellow.solid' },
  { name: 'JavaScript', value: 300000, color: 'orange.solid' },
  { name: 'HTML', value: 175000, color: 'purple.solid' },
  { name: 'SolidJS', value: 225000, color: 'blue.solid' },
];

/** Sort a segment collection by its numeric value. */
function segmentChart(data: BarSegment.BarSegmentData[]) {
  return useChart({ data, sort: { by: 'value', direction: 'desc' } });
}

/** Render the segment values, bar, and names. */
export function BarSegmentBasic(): JSX.Element {
  const chart = segmentChart(sources);
  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar />
        <BarSegment.Label />
      </BarSegment.Content>
    </BarSegment.Root>
  );
}

/** Mark a 200,000 target across the source bar. */
export function BarSegmentReference(): JSX.Element {
  const chart = segmentChart(
    sources.map(
      /** Use the smaller Yandex segment. */
      (item) => (item.name === 'Yandex' ? { ...item, value: 80000 } : item),
    ),
  );
  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar>
          <BarSegment.Reference label="Target" value={200000} />
        </BarSegment.Bar>
        <BarSegment.Label />
      </BarSegment.Content>
    </BarSegment.Root>
  );
}

/** Add colored names and percentages below the source bar. */
export function BarSegmentLegend(): JSX.Element {
  const chart = segmentChart(sources);
  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar />
      </BarSegment.Content>
      <BarSegment.Legend showPercent />
    </BarSegment.Root>
  );
}

/** Reduce the bar height for the language collection. */
export function BarSegmentBarSize(): JSX.Element {
  const chart = segmentChart(languages);
  return (
    <BarSegment.Root chart={chart} barSize="3">
      <BarSegment.Content>
        <BarSegment.Bar gap="0.5" />
      </BarSegment.Content>
      <BarSegment.Legend gap="2" textStyle="xs" showPercent />
    </BarSegment.Root>
  );
}

/** Reveal name and value tooltips on hover or focus. */
export function BarSegmentTooltip(): JSX.Element {
  const chart = segmentChart(sources);
  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Bar tooltip />
      </BarSegment.Content>
      <BarSegment.Legend showPercent />
    </BarSegment.Root>
  );
}
