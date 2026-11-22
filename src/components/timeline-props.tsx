import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type TimelineSize = 'sm' | 'md' | 'lg' | 'xl';
export type TimelineVariant = 'subtle' | 'solid' | 'outline' | 'plain';
export type ResponsiveTimelineChoice<T extends string | boolean> =
  T | readonly (T | null)[] | ResponsiveValues<T>;

export interface TimelineRootBaseProps {
  /** Select marker geometry and title scale. */
  size?: ResponsiveTimelineChoice<TimelineSize> | undefined;
  /** Select the marker color treatment. */
  variant?: ResponsiveTimelineChoice<TimelineVariant> | undefined;
  /** Display the line beneath the final item. */
  showLastSeparator?: ResponsiveTimelineChoice<boolean> | undefined;
  /** Select semantic marker colors. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining list semantics. */
  unstyled?: boolean | undefined;
}

export interface TimelinePartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

export type TimelineRootProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  TimelineRootBaseProps,
  As
>;
export type TimelineItemProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  TimelinePartOptions,
  As
>;
export type TimelineSeparatorProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;
export type TimelineIndicatorProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;
export type TimelineConnectorProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;
export type TimelineContentProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;
export type TimelineTitleProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;
export type TimelineDescriptionProps<As extends NativeElementTag = 'div'> = TimelineItemProps<As>;

export type TimelineRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof TimelineRootBaseProps
> &
  TimelineRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type TimelinePartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  TimelinePartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface TimelineRootPropsProviderProps {
  value: TimelineRootBaseProps | Accessor<TimelineRootBaseProps>;
  children: JSX.Element;
}

const TimelinePropsContext = createOptionalContext<Accessor<TimelineRootBaseProps>>();

/** Supply reactive Timeline choices to descendant roots. */
export function TimelineRootPropsProvider(props: TimelineRootPropsProviderProps): JSX.Element {
  /** Read changing defaults inside each root's tracked scope. */
  function readDefaults(): TimelineRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <TimelinePropsContext value={readDefaults}>{props.children}</TimelinePropsContext>;
}

/** Merge nearest Timeline defaults with explicit root props. */
export function useTimelineProps(instance: TimelineRootRuntimeProps): TimelineRootRuntimeProps {
  const inherited = useOptionalContext(TimelinePropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
