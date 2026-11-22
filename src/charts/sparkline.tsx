import { createMemo, createUniqueId, For, Show, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';
import { SparklineReferenceLines } from './sparkline-reference';
import { sparklineStyle } from './sparkline-style';
import { useSparklineWidth } from './sparkline-width';
import {
  sparklineAreaPath,
  sparklineBarX,
  sparklineLinePath,
  sparklinePoints,
  sparklineSmoothPath,
} from './sparkline-geometry';
import type { ClassValue } from '../utils/class-value';

/** One point in a Sparkline, optionally with its own bar color. */
export interface SparklineData {
  value: number;
  fill?: string;
}

/** Small chart props shared by standalone and composed examples. */
export interface SparklineProps {
  data: readonly SparklineData[];
  type?: 'area' | 'line' | 'bar';
  color?: string;
  gradient?: boolean;
  fillOpacity?: number;
  smooth?: boolean;
  width?: number | string;
  height?: number;
  inset?: number;
  reference?: boolean;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  'aria-label'?: string | false;
  class?: ClassValue;
  className?: string;
  style?: JSX.SvgSVGAttributes<SVGSVGElement>['style'];
  ref?: ((element: SVGSVGElement) => void) | undefined;
  unstyled?: boolean;
}

/** Read the nearest plotted index from a pointer's horizontal position. */
function nearestIndex(event: PointerEvent, count: number): number | null {
  if (count === 0) return null;
  const bounds =
    event.currentTarget instanceof SVGSVGElement
      ? event.currentTarget.getBoundingClientRect()
      : undefined;
  if (!bounds || count === 1) return 0;
  const fraction = (event.clientX - bounds.left) / bounds.width;
  return Math.max(0, Math.min(count - 1, Math.round(fraction * (count - 1))));
}

/** Draw a compact area, line, or bar chart using theme aware SVG colors. */
export function Sparkline(props: SparklineProps): JSX.Element {
  let chart: SVGSVGElement | undefined;
  const gradientId = createUniqueId();
  const measuredWidth = useSparklineWidth(
    /** Supply the mounted SVG for responsive measurement. */
    () => chart,
  );
  /** Use measured pixels for responsive charts and seven rem by default. */
  function width(): number {
    if (typeof props.width === 'number') return props.width;
    if (typeof props.width === 'string') return measuredWidth();
    return 112;
  }
  /** Use a three-rem height unless overridden. */
  const height = () => props.height ?? 48;
  const values = createMemo(
    /** Keep the geometry reactive to changes in the input series. */
    () =>
      props.data.map(
        /** Read one numeric chart sample. */
        (item) => item.value,
      ),
  );
  const points = createMemo(
    /** Scale the current values to the requested SVG dimensions. */
    () => sparklinePoints(values(), width(), height(), props.inset),
  );
  const line = createMemo(
    /** Choose straight or smoothed line geometry. */
    () => (props.smooth ? sparklineSmoothPath(points()) : sparklineLinePath(points())),
  );
  const activePoint = createMemo(
    /** Hide the guide when a changed series no longer contains the selected index. */
    () => {
      const index = props.activeIndex;
      return index !== null && index !== undefined && Number.isInteger(index)
        ? points()[index]
        : undefined;
    },
  );

  /** Report the nearest chart sample to a consumer interaction. */
  function move(event: PointerEvent): void {
    props.onActiveIndexChange?.(nearestIndex(event, props.data.length));
  }

  /** Restore the consumer's default value after pointer exit. */
  function leave(): void {
    props.onActiveIndexChange?.(null);
  }

  return (
    <svg
      ref={
        /** Share the measured SVG with the caller's native ref. */
        (element) => {
          chart = element;
          untrack(() => props.ref)?.(element);
        }
      }
      role="img"
      aria-label={props['aria-label'] ?? 'Sparkline'}
      width={typeof props.width === 'number' ? props.width : undefined}
      height={height()}
      viewBox={`0 0 ${width()} ${height()}`}
      preserveAspectRatio="none"
      class={['leverui-sparkline', props.class, props.className]}
      data-gradient={props.gradient ? '' : undefined}
      data-unstyled={props.unstyled ? '' : undefined}
      style={sparklineStyle(props)}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <Show when={props.gradient}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop class="leverui-sparkline__gradient-start" offset="0%" />
            <stop class="leverui-sparkline__gradient-end" offset="100%" />
          </linearGradient>
        </defs>
      </Show>
      <Show when={props.reference && values().length > 0}>
        <SparklineReferenceLines
          points={points()}
          values={values()}
          width={width()}
          inset={props.inset ?? 5}
        />
      </Show>
      <Show
        when={props.type === 'bar'}
        fallback={
          <>
            <Show when={props.type !== 'line'}>
              <path
                class="leverui-sparkline__area"
                d={sparklineAreaPath(line(), points(), height(), props.inset)}
                fill={props.gradient ? `url(#${gradientId})` : undefined}
              />
            </Show>
            <path class="leverui-sparkline__line" d={line()} fill="none" />
          </>
        }
      >
        <For each={points()}>
          {/** Draw each sample as an eight-pixel column. */}
          {(point, index) => (
            <rect
              class="leverui-sparkline__bar"
              x={sparklineBarX(width(), points().length, index())}
              y={point.y}
              width="8"
              height={Math.max(0, height() - (props.inset ?? 5) - point.y)}
              style={
                props.data[index()]?.fill
                  ? {
                      '--leverui-private-sparkline-bar-color': chartColor(
                        props.data[index()]?.fill,
                        'var(--leverui-colors-teal-solid)',
                      ),
                    }
                  : undefined
              }
            />
          )}
        </For>
      </Show>
      <Show when={activePoint()}>
        {(point) => (
          <>
            <line
              class="leverui-sparkline__active-guide"
              x1={point().x}
              x2={point().x}
              y1="5"
              y2={height() - 5}
            />
            <circle class="leverui-sparkline__active-point" cx={point().x} cy={point().y} r="3" />
          </>
        )}
      </Show>
    </svg>
  );
}
