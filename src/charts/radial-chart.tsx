import { For, Show, createMemo, createSignal, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { displayedNormalizedPoint, useChartDisplaySize } from './chart-display-size';
import { chartRootStyle } from './chart-root-style';
import { RadialChartCenter } from './radial-chart-center';
import { RadialChartLabels } from './radial-chart-labels';
import { RadialChartLegend } from './radial-chart-legend';
import { radialChartKeys } from './radial-native';
import { RadialChartTooltip } from './radial-chart-tooltip';
import type { RadialChartProps } from './radial-chart-types';
import { radialPoint, radialSectors, type RadialDatum } from './radial-geometry';
import { radialSectorShape } from './radial-sector-shape';

export type { RadialChartProps } from './radial-chart-types';
export type { RadialDatum } from './radial-geometry';

/** Draw an accessible, theme-aware pie or donut chart with native SVG. */
export function RadialChart(props: RadialChartProps): JSX.Element {
  const native = omit(props, ...radialChartKeys);
  let svgRef: SVGSVGElement | undefined;
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const [pointer, setPointer] = createSignal({ x: 0, y: 0 });
  /** Return the SVG side length. */
  const size = () => props.size ?? 200;
  const displaySize = useChartDisplaySize(() => svgRef, size, size);
  /** Project a normalized point through the current CSS dimensions. */
  const displayedPointer = () => displayedNormalizedPoint(pointer(), displaySize());
  /** Center all sectors inside the SVG viewbox. */
  const center = () => size() / 2;
  /** Reserve a legend row and ten pixels of plot margin before sizing a sector. */
  const outerRadius = () =>
    props.outerRadius ?? Math.max(0, (size() - (props.legend ? 28 : 0) - 10) * 0.4);
  /** Raise the sectors into the plot area when a legend occupies its bottom row. */
  const plotOffsetY = () => (props.legend ? -14 : 0);
  /** Shift the plot when asymmetric chart margins need room for labels. */
  const plotOffsetX = () => props.plotOffsetX ?? 0;
  /** Keep the inner hole within the visible sector radius. */
  const innerRadius = () => Math.min(props.innerRadius ?? 0, outerRadius());
  /** Enable rounded corners only when the chart has an inner ring edge. */
  const cornerRadius = () => (innerRadius() > 0 ? Math.max(0, props.cornerRadius ?? 0) : 0);
  const sectors = createMemo(
    /** Recalculate geometry when data or chart dimensions change. */
    () =>
      radialSectors(
        props.data,
        center(),
        innerRadius(),
        outerRadius(),
        props.startAngle,
        props.endAngle,
        props.paddingAngle,
      ),
  );
  const total = createMemo(
    /** Sum only values represented by a visible sector. */
    () => sectors().reduce((sum, sector) => sum + sector.datum.value, 0),
  );
  /** Format a sector's visible label. */
  function formatLabel(datum: RadialDatum): string {
    const percent = total() === 0 ? 0 : datum.value / total();
    return props.labelFormatter?.(datum, percent) ?? datum.name;
  }
  /** Adapt the label component's sector contract to the public formatter. */
  function formatSector(sector: { datum: RadialDatum }): string {
    return formatLabel(sector.datum);
  }
  /** Close a tooltip after pointer or keyboard focus leaves a sector. */
  function clearActive(): void {
    setActiveIndex(null);
  }
  /** Keep pointer coordinates proportional through CSS and numeric resizes. */
  function updatePointer(event: PointerEvent): void {
    const svg = (event.currentTarget as SVGPathElement).ownerSVGElement;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    });
  }

  return (
    <div
      {...native}
      ref={props.ref}
      class={['leverui-radial-chart', props.class, props.className]}
      data-chart-shape={innerRadius() > 0 ? 'donut' : 'pie'}
      data-label-placement={props.label}
      data-legend={props.legend ? '' : undefined}
      data-detached={props.detached ? '' : undefined}
      style={chartRootStyle('--leverui-private-radial-chart-size', props.size, props.style)}
    >
      <svg
        ref={svgRef}
        class="leverui-radial-chart__svg"
        role="img"
        aria-label={props['aria-label'] ?? 'Radial chart'}
        width={size()}
        height={size()}
        viewBox={`0 0 ${size()} ${size()}`}
      >
        <g transform={`translate(${plotOffsetX()} ${plotOffsetY()})`}>
          <For each={sectors()}>
            {/** Draw one focusable, color-coded chart sector. */}
            {(sector) => {
              /** Resolve the sector's current theme color. */
              const fill = () => chartColor(sector.datum.color, sector.datum.color);
              /** Draw the current outline with rounded corners when requested. */
              const path = () =>
                radialSectorShape(
                  sector,
                  center(),
                  innerRadius(),
                  outerRadius(),
                  cornerRadius(),
                  Boolean(props.detached && activeIndex() === sector.index),
                );
              /** Show this sector's value on pointer hover or keyboard focus. */
              function activate(): void {
                setActiveIndex(sector.index);
                const centroid = radialPoint(
                  center(),
                  (innerRadius() + outerRadius()) / 2,
                  sector.midAngle,
                );
                setPointer({
                  x: (centroid.x + plotOffsetX()) / size(),
                  y: (centroid.y + plotOffsetY()) / size(),
                });
              }
              /** Follow the pointer while it moves across the active sector. */
              function move(event: PointerEvent): void {
                setActiveIndex(sector.index);
                updatePointer(event);
              }
              /** Let keyboard users dismiss the active sector. */
              function keyDown(event: KeyboardEvent): void {
                if (event.key === 'Escape') clearActive();
              }
              return (
                <path
                  class="leverui-radial-chart__sector"
                  d={path()}
                  fill={fill()}
                  style={{
                    '--leverui-private-radial-sector-stroke': props.stroke,
                    '--leverui-private-radial-sector-stroke-width': props.strokeWidth,
                  }}
                  tabindex="0"
                  aria-label={`${sector.datum.name}: ${sector.datum.value}`}
                  onPointerEnter={move}
                  onPointerMove={move}
                  onPointerLeave={clearActive}
                  onFocus={activate}
                  onBlur={clearActive}
                  onKeyDown={keyDown}
                />
              );
            }}
          </For>
          <Show when={props.label}>
            {(placement) => (
              <RadialChartLabels
                sectors={sectors()}
                center={center()}
                innerRadius={innerRadius()}
                outerRadius={outerRadius()}
                placement={placement()}
                formatter={formatSector}
              />
            )}
          </Show>
          <Show when={props.centerTitle}>
            {(title) => (
              <RadialChartCenter
                center={center()}
                title={title()}
                description={props.centerDescription}
              />
            )}
          </Show>
        </g>
      </svg>
      <Show when={props.legend}>
        <RadialChartLegend data={props.data} />
      </Show>
      <Show when={props.tooltip && activeIndex() !== null && props.data[activeIndex() ?? -1]}>
        {(datum) => (
          <RadialChartTooltip
            datum={datum()}
            pointer={displayedPointer()}
            display={displaySize()}
          />
        )}
      </Show>
    </div>
  );
}
