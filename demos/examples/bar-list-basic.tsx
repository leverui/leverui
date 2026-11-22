import { type JSX } from '@solidjs/web';
import { BarList, useChart } from '../../src';
import { funnelStages, searchSources } from './bar-list-data';

/** Render the shared two-column chart layout. */
function TwoColumn(props: {
  data: BarList.BarListData[];
  direction?: 'asc' | 'desc';
  color: string;
}): JSX.Element {
  const chart = useChart(
    /** Track the data, sort direction, and color props. */
    () => ({
      data: props.data,
      sort: { by: 'value', direction: props.direction ?? 'desc' },
      series: [{ name: 'name', color: props.color }],
    }),
  );
  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  );
}

/** Render the descending search source list. */
export function BarListBasic(): JSX.Element {
  return <TwoColumn data={searchSources} color="teal.subtle" />;
}

/** Render the same data from smallest to largest. */
export function BarListAscending(): JSX.Element {
  return <TwoColumn data={searchSources} direction="asc" color="teal.subtle" />;
}

/** Show each funnel value and its share of the total. */
export function BarListFormatter(): JSX.Element {
  const chart = useChart({
    data: funnelStages,
    sort: { by: 'value', direction: 'desc' },
    series: [{ name: 'name', color: 'pink.subtle' }],
  });
  /** Format one value with its fraction of all funnel stages. */
  function formatValue(value: number): string {
    return `${value} (${chart.getValuePercent('value', value).toFixed(0)}%)`;
  }
  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Bar />
        <BarList.Value valueFormatter={formatValue} />
      </BarList.Content>
    </BarList.Root>
  );
}

/** Turn funnel names into links while preserving the bar widths. */
export function BarListLink(): JSX.Element {
  const chart = useChart({
    data: funnelStages,
    sort: { by: 'value', direction: 'desc' },
    series: [{ name: 'name', color: 'pink.subtle' }],
  });
  /** Render each source name as its supplied anchor. */
  function renderLink({ payload }: { payload: BarList.BarListData }): JSX.Element {
    return <a href={payload.href}>{payload.name}</a>;
  }
  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Bar label={renderLink} />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  );
}
