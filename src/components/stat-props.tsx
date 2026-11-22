import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type StatSize = 'sm' | 'md' | 'lg';
export type ResponsiveStatSize =
  StatSize | readonly (StatSize | null)[] | ResponsiveValues<StatSize>;

export interface StatRootBaseProps {
  /** Set the value's text size at the selected breakpoints. */
  size?: ResponsiveStatSize | undefined;
  /** Omit authored presentation while retaining description-list semantics. */
  unstyled?: boolean | undefined;
}

export interface StatPartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

type NativeStatProps<Tag extends NativeElementTag, Behavior, As extends NativeElementTag> = Exclude<
  NativeElementProps<Tag, Behavior, As>,
  { asChild: RenderChild }
>;

type ChildStatProps<Tag extends NativeElementTag, Behavior, ChildElement extends Element> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'ref'
> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: ChildElement) => void };

export type StatRootProps<As extends NativeElementTag = 'dl'> =
  | NativeStatProps<'dl', StatRootBaseProps, As>
  | ChildStatProps<'dl', StatRootBaseProps, HTMLElement>;
export type StatGroupProps<As extends NativeElementTag = 'div'> =
  | NativeStatProps<'div', StatRootBaseProps, As>
  | ChildStatProps<'div', StatRootBaseProps, HTMLElement>;
export type StatLabelProps<As extends NativeElementTag = 'dt'> =
  NativeStatProps<'dt', StatPartOptions, As> | ChildStatProps<'dt', StatPartOptions, HTMLElement>;
export type StatValueTextProps<As extends NativeElementTag = 'dd'> =
  NativeStatProps<'dd', StatPartOptions, As> | ChildStatProps<'dd', StatPartOptions, HTMLElement>;
export type StatHelpTextProps<As extends NativeElementTag = 'span'> =
  | NativeStatProps<'span', StatPartOptions, As>
  | ChildStatProps<'span', StatPartOptions, HTMLElement>;
export type StatValueUnitProps<As extends NativeElementTag = 'span'> = StatHelpTextProps<As>;
export type StatUpIndicatorProps<As extends NativeElementTag = 'span'> = StatHelpTextProps<As>;
export type StatDownIndicatorProps<As extends NativeElementTag = 'span'> = StatHelpTextProps<As>;

export type StatRootRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | 'size'> &
  StatRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type StatPartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  StatPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface StatPropsProviderProps {
  value: StatRootBaseProps | Accessor<StatRootBaseProps>;
  children: JSX.Element;
}

const StatPropsContext = createOptionalContext<Accessor<StatRootBaseProps>>();

/** Supply reactive Stat size defaults to descendant roots. */
export function StatPropsProvider(props: StatPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): StatRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <StatPropsContext value={readDefaults}>{props.children}</StatPropsContext>;
}

/** Merge nearest Stat defaults with live root props. */
export function useStatProps(instance: StatRootRuntimeProps): StatRootRuntimeProps {
  const inherited = useOptionalContext(StatPropsContext);
  return mergeProps(
    /** Keep explicit root choices ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
