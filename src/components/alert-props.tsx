import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveBooleanValue } from '../styled-system/responsive-values';
import type { AlertSize } from './alert-size';
import type { AlertStatus } from './alert-status';
import type { AlertVariant } from './alert-variant';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export interface AlertRootBaseProps {
  /** Select the semantic state and default indicator glyph. */
  status?: FiniteResponsiveChoice<AlertStatus> | undefined;
  /** Select the root's color treatment. */
  variant?: FiniteResponsiveChoice<AlertVariant> | undefined;
  /** Select Alert typography and spacing. */
  size?: FiniteResponsiveChoice<AlertSize> | undefined;
  /** Arrange title and description in one row. */
  inline?: ResponsiveBooleanValue | undefined;
  /** Override the status palette with a named or consumer-defined palette. */
  colorPalette?: string | undefined;
  /** Omit authored presentation while retaining native markup. */
  unstyled?: boolean | undefined;
}

export interface AlertPartOptions {
  /** Omit the default presentation for this part. */
  unstyled?: boolean | undefined;
}

type NativeAlertProps<
  Tag extends NativeElementTag,
  Behavior,
  As extends NativeElementTag,
> = Exclude<NativeElementProps<Tag, Behavior, As>, { asChild: RenderChild }>;
type ChildAlertProps<Tag extends NativeElementTag, Behavior> = Omit<
  JSX.IntrinsicElements[Tag],
  keyof Behavior | 'ref'
> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: HTMLElement) => void };

export type AlertRootProps<As extends NativeElementTag = 'div'> =
  NativeAlertProps<'div', AlertRootBaseProps, As> | ChildAlertProps<'div', AlertRootBaseProps>;
export type AlertTitleProps<As extends NativeElementTag = 'div'> =
  NativeAlertProps<'div', AlertPartOptions, As> | ChildAlertProps<'div', AlertPartOptions>;
export type AlertDescriptionProps<As extends NativeElementTag = 'div'> = AlertTitleProps<As>;
export type AlertContentProps<As extends NativeElementTag = 'div'> = AlertTitleProps<As>;
export type AlertIndicatorProps<As extends NativeElementTag = 'span'> =
  NativeAlertProps<'span', AlertPartOptions, As> | ChildAlertProps<'span', AlertPartOptions>;

export type AlertRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof AlertRootBaseProps | 'ref'
> &
  AlertRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type AlertPartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  AlertPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface AlertPropsProviderProps {
  value: AlertRootBaseProps | Accessor<AlertRootBaseProps>;
  children: JSX.Element;
}

const AlertPropsContext = createOptionalContext<Accessor<AlertRootBaseProps>>();

/** Supply reactive Alert choices to descendant roots. */
export function AlertPropsProvider(props: AlertPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): AlertRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <AlertPropsContext value={readDefaults}>{props.children}</AlertPropsContext>;
}

/** Merge nearest Alert defaults with live instance props. */
export function useAlertProps(instance: AlertRootRuntimeProps): AlertRootRuntimeProps {
  const inherited = useOptionalContext(AlertPropsContext);
  return mergeProps(
    /** Give explicit root values precedence over reactive defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
