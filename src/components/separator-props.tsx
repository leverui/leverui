import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type {
  SeparatorChoice,
  SeparatorOrientation,
  SeparatorSize,
  SeparatorVariant,
} from './separator-choices';

type IntrinsicElement = keyof JSX.IntrinsicElements;

export interface SeparatorBaseProps {
  /** Set line thickness through an authored size choice. */
  size?: SeparatorChoice<SeparatorSize> | undefined;
  /** Select the authored border treatment. */
  variant?: SeparatorChoice<SeparatorVariant> | undefined;
  /** Set the visual line direction at ordinary breakpoints. */
  orientation?: SeparatorChoice<SeparatorOrientation> | undefined;
  /** Suppress default line presentation while retaining semantics. */
  unstyled?: boolean | undefined;
}

export type SeparatorRootProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof SeparatorBaseProps | 'ref'
> &
  SeparatorBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

type NativeSeparatorProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof SeparatorBaseProps | 'as' | 'asChild'> &
      SeparatorBaseProps &
      (As extends 'span' ? { as?: As } : { as: As }) & { asChild?: never }
  : never;

type ChildSeparatorProps = Omit<
  JSX.IntrinsicElements['span'],
  keyof SeparatorBaseProps | 'as' | 'asChild' | 'ref'
> &
  SeparatorBaseProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

/** Preserve native tag and caller-owned child contracts without style objects. */
export type SeparatorProps<As extends IntrinsicElement = 'span'> =
  NativeSeparatorProps<As> | ChildSeparatorProps;

export interface SeparatorPropsProviderProps {
  value: SeparatorBaseProps | Accessor<SeparatorBaseProps>;
  children: JSX.Element;
}

const SeparatorContext = createOptionalContext<Accessor<SeparatorBaseProps>>();

/** Supply reactive finite choices to descendant separators. */
export function SeparatorPropsProvider(props: SeparatorPropsProviderProps): JSX.Element {
  /** Read provider values in each descendant's tracked scope. */
  function readDefaults(): SeparatorBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SeparatorContext value={readDefaults}>{props.children}</SeparatorContext>;
}

/** Merge inherited choices with live instance attributes and props. */
export function useSeparatorProps(instance: SeparatorRootProps): SeparatorRootProps {
  const inherited = useOptionalContext(SeparatorContext);
  return mergeProps(
    /** Give explicit instance props precedence over changing defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
