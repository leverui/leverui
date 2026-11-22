import { splitProps } from '../primitives/utils/split-props';
import { createMemo, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { dispatchChartNativeEvent } from './chart-native-event';
import { cartesianChartKeys } from './cartesian-native';
import type { CartesianChartProps } from './cartesian-types';

/** Native chart frame and its keyboard interaction inputs. */
export interface CartesianFrameProps {
  chart: CartesianChartProps;
  interactive: boolean;
  activeIndex: Accessor<number | null>;
  setActiveIndex: (index: number | null) => void;
  onMeasure: (element: HTMLDivElement) => void;
  children: JSX.Element;
}

/** Forward native div props while retaining chart focus and measurement. */
export function CartesianFrame(props: CartesianFrameProps): JSX.Element {
  const native = createMemo(
    /** Rebind native attributes if a caller replaces the chart props object. */
    () => splitProps(props.chart, cartesianChartKeys)[1],
  );
  /** Start keyboard navigation at the first category. */
  function focus(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    if (props.interactive && props.chart.data.length > 0) props.setActiveIndex(0);
    dispatchChartNativeEvent(native().onFocus, event);
  }
  /** Close the chart tooltip when keyboard focus leaves. */
  function blur(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    props.setActiveIndex(null);
    dispatchChartNativeEvent(native().onBlur, event);
  }
  /** Move the category focus or dismiss its tooltip. */
  function keyDown(
    event: KeyboardEvent & { currentTarget: HTMLDivElement; target: Element },
  ): void {
    if (!props.interactive) return dispatchChartNativeEvent(native().onKeyDown, event);
    if (event.key === 'Escape') props.setActiveIndex(null);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const movement = event.key === 'ArrowRight' ? 1 : -1;
      props.setActiveIndex(
        Math.max(0, Math.min(props.chart.data.length - 1, (props.activeIndex() ?? 0) + movement)),
      );
    }
    dispatchChartNativeEvent(native().onKeyDown, event);
  }
  return (
    <div
      {...native()}
      data-chart-interactive={props.interactive ? '' : undefined}
      role={props.interactive ? 'group' : native().role}
      aria-label={
        props.interactive
          ? `${props.chart['aria-label'] ?? 'Cartesian chart'}; use left and right arrow keys`
          : native()['aria-label']
      }
      tabindex={props.interactive ? '0' : native().tabindex}
      onFocus={focus}
      onBlur={blur}
      onKeyDown={keyDown}
      ref={
        /** Give both width measurement and the consumer ref the rendered node. */
        (element) => {
          props.onMeasure(element);
          const external = native().ref;
          if (typeof external === 'function') external(element);
        }
      }
      class={[
        'leverui-cartesian-chart__root',
        `leverui-${props.chart.kind ?? 'area'}-chart`,
        native().class,
      ]}
      style={native().style}
    >
      {props.children}
    </div>
  );
}
