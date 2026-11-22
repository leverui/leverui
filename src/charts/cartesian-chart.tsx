import { Show, createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CartesianAxes } from './cartesian-axes';
import { CartesianFrame } from './cartesian-frame';
import { cartesianSvgHeight } from './cartesian-height';
import { chartDomain, cartesianPlot } from './cartesian-geometry';
import { CartesianInteraction, CartesianTooltip } from './cartesian-interaction';
import { CartesianLegend } from './cartesian-legend';
import { CartesianReferences } from './cartesian-references';
import { CartesianRightAxis } from './cartesian-right-axis';
import { CartesianSeriesLayer } from './cartesian-series';
import { useCartesianWidth } from './cartesian-width';
import type { CartesianChartProps } from './cartesian-types';

export type {
  CartesianChartProps,
  CartesianSeries,
  CartesianDatum,
  CartesianCurve,
  CartesianPlotMargin,
} from './cartesian-types';

/** Draw responsive Cartesian chart series with shared axes and interactions. */
export function CartesianChart(props: CartesianChartProps): JSX.Element {
  let container: HTMLDivElement | undefined;
  const width = useCartesianWidth(
    /** Read the attached DOM node only after Solid mounts the chart. */
    () => container,
  );
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const [highlightedSeries, setHighlightedSeries] = createSignal<string | null>(null);
  /** Keep the right-axis series out of the left numeric domain. */
  const leftSeries = () => props.series.filter((series) => series.yAxis !== 'right');
  /** Give right-axis series their own numeric domain. */
  const rightSeries = () => props.series.filter((series) => series.yAxis === 'right');
  /** Enable category navigation only when a visible tooltip can respond. */
  const interactive = () => props.tooltip !== false && props.data.length > 0;
  /** Cap default height at a responsive 4:3 frame while honoring explicit height. */
  const height = () => cartesianSvgHeight(width(), props);
  const plot = createMemo(
    /** Recompute the domain and margins when chart inputs change. */
    () =>
      cartesianPlot(
        width(),
        height(),
        props.yDomain
          ? { min: props.yDomain[0], max: props.yDomain[1] }
          : chartDomain(props.data, leftSeries(), props.stacked ?? false, props.percent ?? false),
        props.showYAxis ?? false,
        props.xAxisLabel,
        props.yAxisLabel,
        rightSeries().length > 0 ? (props.rightYAxisLabel ?? ' ') : undefined,
        props.legendPlacement === 'top-right' ? 50 : 4,
        props.plotMargin,
        props.xPadding,
      ),
  );
  const rightPlot = createMemo(
    /** Reuse the plot boundaries with an independent right-side scale. */
    () => {
      const domain = props.rightYDomain
        ? { min: props.rightYDomain[0], max: props.rightYDomain[1] }
        : chartDomain(props.data, rightSeries(), false, false);
      return { ...plot(), ...domain };
    },
  );
  /** Capture the chart container for responsive width measurement. */
  function measure(element: HTMLDivElement): void {
    container = element;
  }

  return (
    <CartesianFrame
      chart={props}
      interactive={interactive()}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onMeasure={measure}
    >
      <svg
        class="leverui-cartesian-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Cartesian chart'}
        width={width()}
        height={height()}
        viewBox={`0 0 ${width()} ${height()}`}
        style={{ height: `${height()}px` }}
      >
        <CartesianAxes
          data={props.data}
          xKey={props.xKey}
          plot={plot()}
          showGrid={props.showGrid ?? true}
          gridHorizontal={props.gridHorizontal ?? true}
          gridDashed={props.gridDashed ?? false}
          gridVertical={props.gridVertical ?? false}
          showYAxis={props.showYAxis ?? false}
          showXAxis={props.showXAxis ?? true}
          showAxisLines={props.showAxisLines ?? false}
          xTickAngle={props.xTickAngle ?? 0}
          percent={props.percent ?? false}
          xAxisLabel={props.xAxisLabel}
          yAxisLabel={props.yAxisLabel}
          xTickValues={props.xTickValues}
          xTickFormatter={props.xTickFormatter}
          yTickFormatter={props.yTickFormatter}
          yTickValues={props.yTickValues}
        />
        <Show when={rightSeries().length > 0}>
          <CartesianRightAxis plot={rightPlot()} label={props.rightYAxisLabel} />
        </Show>
        <CartesianReferences
          data={props.data}
          xKey={props.xKey}
          plot={plot()}
          lines={props.referenceLines}
          area={props.referenceArea}
          value={props.referenceValue}
          point={props.referencePoint}
        />
        <CartesianSeriesLayer
          data={props.data}
          series={props.series}
          plot={plot()}
          rightPlot={rightSeries().length > 0 ? rightPlot() : undefined}
          kind={props.kind ?? 'area'}
          stacked={props.stacked ?? false}
          percent={props.percent ?? false}
          fillOpacity={props.fillOpacity ?? 0.2}
          gradient={props.gradient ?? false}
          valueGradient={props.valueGradient ?? false}
          curve={props.curve ?? 'linear'}
          dots={props.dots ?? false}
          pointLabels={props.pointLabels ?? false}
          pointLabelPosition={props.pointLabelPosition ?? 'top'}
          connectNulls={props.connectNulls ?? false}
          activeIndex={activeIndex()}
          highlightedSeries={highlightedSeries()}
        />
        <Show when={interactive()}>
          <CartesianInteraction
            data={props.data}
            series={props.series}
            xKey={props.xKey}
            plot={plot()}
            activeIndex={activeIndex()}
            setActiveIndex={setActiveIndex}
            tooltip={props.tooltip ?? true}
          />
        </Show>
      </svg>
      <CartesianTooltip
        data={props.data}
        series={props.series}
        xKey={props.xKey}
        plot={plot()}
        activeIndex={activeIndex()}
        setActiveIndex={setActiveIndex}
        tooltip={props.tooltip ?? true}
        tooltipContent={props.tooltipContent}
      />
      <Show when={props.showLegend}>
        <CartesianLegend
          series={props.series}
          stacked={props.stacked ?? false}
          reverse={props.legendReverse ?? false}
          placement={props.legendPlacement ?? 'bottom'}
          onHover={props.legendInteraction === 'hover' ? setHighlightedSeries : undefined}
        />
      </Show>
    </CartesianFrame>
  );
}
