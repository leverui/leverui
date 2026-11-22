import { type JSX } from '@solidjs/web';
import { BarList, useChart } from '../../src';
import { searchSources } from './bar-list-data';

/** Shared labeled search chart with optional percent and tooltip columns. */
function LabeledBarList(props: { percent?: boolean; tooltip?: boolean }): JSX.Element {
  const chart = useChart({
    data: searchSources,
    sort: { by: 'value', direction: 'desc' },
    series: [{ name: 'name', color: 'teal.subtle', label: 'Search engine' }],
  });
  /** Format the share of all source counts. */
  function formatPercent(value: number): string {
    return `${chart.getValuePercent('value', value).toFixed(2)}%`;
  }
  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Label title="Search engine" flex={1}>
          <BarList.Bar tooltip={props.tooltip ?? false} />
        </BarList.Label>
        <BarList.Label title="Visits" titleAlignment="end">
          <BarList.Value />
        </BarList.Label>
        {props.percent && (
          <BarList.Label title="%" minW="4rem" titleAlignment="end">
            <BarList.Value valueFormatter={formatPercent} />
          </BarList.Label>
        )}
      </BarList.Content>
    </BarList.Root>
  );
}

/** Label the bar and value columns. */
export function BarListWithLabel(): JSX.Element {
  return <LabeledBarList />;
}

/** Add a separate percentage column. */
export function BarListMultiValue(): JSX.Element {
  return <LabeledBarList percent />;
}

/** Reveal the full numeric value when hovering a bar. */
export function BarListTooltip(): JSX.Element {
  return <LabeledBarList tooltip />;
}
