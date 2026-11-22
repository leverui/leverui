import { type JSX } from '@solidjs/web';
import { chartColor } from './chart-color';

type NativeStyle = JSX.SvgSVGAttributes<SVGSVGElement>['style'];

interface SparklineStyleOptions {
  width?: number | string;
  height?: number;
  color?: string;
  fillOpacity?: number;
  unstyled?: boolean;
  style?: NativeStyle;
}

/** Merge live geometry and color variables before consumer native styles. */
export function sparklineStyle(props: SparklineStyleOptions): NativeStyle {
  const defaults: Record<string, string> = {};
  if (props.width !== undefined)
    defaults['--leverui-sparkline-width'] =
      typeof props.width === 'number' ? `${props.width}px` : props.width;
  if (props.height !== undefined) defaults['--leverui-sparkline-height'] = `${props.height}px`;
  if (props.color)
    defaults['--leverui-sparkline-color'] = chartColor(
      props.color,
      'var(--leverui-colors-teal-solid)',
    );
  if (props.fillOpacity !== undefined)
    defaults['--leverui-sparkline-area-opacity'] = `${props.fillOpacity}`;
  if (props.unstyled && typeof props.width === 'string') defaults.width = props.width;
  if (typeof props.style === 'string') {
    const declarations = Object.entries(defaults)
      .map(
        /** Serialize only authored variable overrides before caller CSS. */
        ([name, value]) => `${name}:${value}`,
      )
      .join(';');
    return declarations ? `${declarations};${props.style}` : props.style;
  }
  return { ...defaults, ...props.style };
}
