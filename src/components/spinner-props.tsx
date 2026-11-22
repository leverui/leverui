import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementTag } from './native-element-props';

export type SpinnerSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ResponsiveSpinnerSize =
  SpinnerSize | readonly (SpinnerSize | null)[] | ResponsiveValues<SpinnerSize>;

export interface SpinnerBaseProps {
  /** Select an authored size at ordinary breakpoints. */
  size?: ResponsiveSpinnerSize | undefined;
  /** Name a palette for consumer CSS selectors and inherited variables. */
  colorPalette?: string | undefined;
  /** Suppress the default ring and animation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type SpinnerRootProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof SpinnerBaseProps
> &
  SpinnerBaseProps & {
    as?: NativeElementTag | 'svg';
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type SpinnerDefaults = Partial<
  Omit<SpinnerRootProps, 'as' | 'asChild' | 'children' | 'ref'>
>;

export interface SpinnerPropsProviderProps {
  value: SpinnerDefaults | Accessor<SpinnerDefaults>;
  children: JSX.Element;
}

const SpinnerContext = createOptionalContext<Accessor<SpinnerDefaults>>();

/** Provide changing Spinner defaults without owning each instance's element. */
export function SpinnerPropsProvider(props: SpinnerPropsProviderProps): JSX.Element {
  /** Read current defaults in each descendant's tracked scope. */
  function readValue(): SpinnerDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SpinnerContext value={readValue}>{props.children}</SpinnerContext>;
}

/** Compose the nearest defaults with one Spinner's native props. */
export function useSpinnerProps(instance: SpinnerRootProps): SpinnerRootProps {
  const inherited = useOptionalContext(SpinnerContext);
  return mergeProps(
    /** Keep inherited values live while local values take precedence. */
    () => inherited?.() ?? {},
    instance,
  );
}
