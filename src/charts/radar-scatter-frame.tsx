import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { dispatchChartNativeEvent } from './chart-native-event';
import { radarScatterRootStyle } from './radar-scatter-root-style';

/** Shared native boundary for the two chart roots. */
export interface RadarScatterFrameProps {
  kind: 'radar' | 'scatter';
  native: JSX.HTMLAttributes<HTMLDivElement> & { className?: string };
  dimension: number;
  interactive: boolean;
  keyboardLabel: string;
  ref?: ((element: HTMLDivElement) => void) | undefined;
  onMeasure?: ((element: HTMLDivElement) => void) | undefined;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  children: JSX.Element;
}

/** Forward native div props while preserving chart measurement and navigation. */
export function RadarScatterFrame(props: RadarScatterFrameProps): JSX.Element {
  const split = createMemo(
    /** Rebind native properties if the caller replaces their prop source. */
    () =>
      splitProps(props.native, [
        'class',
        'className',
        'style',
        'role',
        'tabindex',
        'aria-label',
        'onFocus',
        'onBlur',
        'onKeyDown',
      ]),
  );
  /** Run chart focus behavior, then the caller's native focus callback. */
  function focus(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    props.onFocus();
    dispatchChartNativeEvent(split()[0].onFocus, event);
  }

  /** Clear chart focus, then notify the caller's native blur callback. */
  function blur(event: FocusEvent & { currentTarget: HTMLDivElement; target: Element }): void {
    props.onBlur();
    dispatchChartNativeEvent(split()[0].onBlur, event);
  }

  /** Preserve arrow navigation and the caller's native keyboard callback. */
  function keyDown(
    event: KeyboardEvent & { currentTarget: HTMLDivElement; target: Element },
  ): void {
    props.onKeyDown(event);
    dispatchChartNativeEvent(split()[0].onKeyDown, event);
  }

  return (
    <div
      {...split()[1]}
      ref={
        /** Share the mounted node with measurement and the caller. */
        (element) => {
          props.onMeasure?.(element);
          untrack(() => props.ref)?.(element);
        }
      }
      class={[`leverui-${props.kind}-chart`, split()[0].class, split()[0].className]}
      role={props.interactive ? 'group' : split()[0].role}
      tabindex={props.interactive ? '0' : split()[0].tabindex}
      aria-label={props.interactive ? props.keyboardLabel : split()[0]['aria-label']}
      onFocus={focus}
      onBlur={blur}
      onKeyDown={keyDown}
      style={radarScatterRootStyle(
        props.kind === 'radar'
          ? '--leverui-private-radar-chart-width'
          : '--leverui-private-scatter-chart-height',
        props.dimension,
        split()[0].style,
      )}
    >
      {props.children}
    </div>
  );
}
