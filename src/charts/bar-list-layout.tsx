import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { BarListContext, type BarListData } from './bar-list-context';
import { barListClass } from './bar-list-class';
import { barListNativeStyle } from './bar-list-style';
import { chartSize } from './chart-size';
import type { UseChartReturn } from './use-chart';

/** Native div attributes accepted by Bar List layout pieces. */
export type BarListLayoutProps = JSX.HTMLAttributes<HTMLDivElement>;

/** Root props bind one chart model to all nested pieces. */
export interface BarListRootProps extends BarListLayoutProps {
  chart: UseChartReturn<BarListData>;
  barSize?: string | undefined;
}

/** Provide chart data and the row height to a Bar List. */
export function BarListRoot(props: BarListRootProps): JSX.Element {
  /** Keep a changing chart model visible to nested rows. */
  const chart = (): UseChartReturn<BarListData> => props.chart;
  const [local, native] = splitProps(props, ['chart', 'barSize', 'children', 'class', 'style']);
  return (
    <BarListContext value={chart}>
      <div
        {...native}
        class={barListClass('root', local.class)}
        style={
          local.barSize === undefined
            ? local.style
            : barListNativeStyle(
                { '--leverui-bar-list-size': chartSize(local.barSize) },
                local.style,
              )
        }
      >
        {local.children}
      </div>
    </BarListContext>
  );
}

/** Place the bar and value columns side by side. */
export function BarListContent(props: BarListLayoutProps): JSX.Element {
  const [local, native] = splitProps(props, ['children', 'class', 'style']);
  return (
    <div {...native} class={barListClass('content', local.class)} style={local.style}>
      {local.children}
    </div>
  );
}

/** Optional heading above the Bar List. */
export function BarListTitle(props: BarListLayoutProps): JSX.Element {
  const [local, native] = splitProps(props, ['children', 'class', 'style']);
  return (
    <div {...native} class={barListClass('title', local.class)} style={local.style}>
      {local.children}
    </div>
  );
}

/** Props for a labeled Bar List column. */
export interface BarListLabelProps extends Omit<BarListLayoutProps, 'title'> {
  title: JSX.Element;
  titleAlignment?: JSX.CSSProperties['text-align'];
  flex?: string | number;
  minW?: string;
}

/** Align a column heading with its bar or value rows. */
export function BarListLabel(props: BarListLabelProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'title',
    'titleAlignment',
    'flex',
    'minW',
    'children',
    'class',
    'style',
  ]);
  return (
    <div
      {...native}
      class={barListClass('label', local.class)}
      style={barListNativeStyle(
        {
          flex: local.flex,
          'min-width': local.minW === undefined ? undefined : chartSize(local.minW),
        },
        local.style,
      )}
    >
      <div class={barListClass('labelHeading')} style={{ 'text-align': local.titleAlignment }}>
        {local.title}
      </div>
      {local.children}
    </div>
  );
}
