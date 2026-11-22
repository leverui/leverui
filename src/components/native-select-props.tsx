import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import type {
  NativeSelectChoice,
  NativeSelectSize,
  NativeSelectVariant,
} from './native-select-appearance';

export interface NativeSelectRootBaseProps {
  /** Select authored Native Select geometry at supported breakpoints. */
  size?: NativeSelectChoice<NativeSelectSize> | undefined;
  /** Select one authored surface treatment. */
  variant?: NativeSelectChoice<NativeSelectVariant> | undefined;
  /** Select a semantic color palette for focus and surface tokens. */
  colorPalette?: string | undefined;
  /** Disable the native field when no enclosing Field overrides this value. */
  disabled?: boolean | undefined;
  /** Mark the native field invalid when no enclosing Field overrides it. */
  invalid?: boolean | undefined;
  /** Retain native markup without default presentation. */
  unstyled?: boolean | undefined;
  /** Add a consumer class through the `className` alias. */
  className?: string | undefined;
}

export interface NativeSelectFieldBaseProps {
  /** Render one empty option before caller-owned choices. */
  placeholder?: string | undefined;
  /** Set an uncontrolled initial native selection. */
  defaultValue?: string | number | readonly string[] | undefined;
  /** Suppress the field's authored presentation. */
  unstyled?: boolean | undefined;
  /** Add a consumer class through the `className` alias. */
  className?: string | undefined;
  disabled?: never;
  required?: never;
  readOnly?: never;
  size?: never;
}

export interface NativeSelectIndicatorBaseProps {
  /** Suppress the indicator's authored presentation. */
  unstyled?: boolean | undefined;
  /** Add a consumer class through the `className` alias. */
  className?: string | undefined;
}

export type NativeSelectRootProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  NativeSelectRootBaseProps,
  As
>;
export type NativeSelectFieldProps<As extends NativeElementTag = 'select'> = NativeElementProps<
  'select',
  NativeSelectFieldBaseProps,
  As
>;
export type NativeSelectIndicatorProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  NativeSelectIndicatorBaseProps,
  As
>;

export type NativeSelectRuntimeRootProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof NativeSelectRootBaseProps | 'ref'
> &
  NativeSelectRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type NativeSelectDefaults = Partial<
  Omit<JSX.IntrinsicElements['div'], 'ref' | 'children' | 'innerHTML'>
> &
  NativeSelectRootBaseProps;

export interface NativeSelectPropsProviderProps {
  value: NativeSelectDefaults | Accessor<NativeSelectDefaults>;
  children: JSX.Element;
}

const NativeSelectPropsContext = createOptionalContext<Accessor<NativeSelectDefaults>>();

/** Supply reactive Native Select defaults to descendant roots. */
export function NativeSelectPropsProvider(props: NativeSelectPropsProviderProps): JSX.Element {
  /** Read the current defaults object or its Solid accessor. */
  function readDefaults(): NativeSelectDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <NativeSelectPropsContext value={readDefaults}>{props.children}</NativeSelectPropsContext>;
}

/** Merge inherited defaults with the root's own reactive native props. */
export function useNativeSelectProps(
  instance: NativeSelectRuntimeRootProps,
): NativeSelectRuntimeRootProps {
  const inherited = useOptionalContext(NativeSelectPropsContext);
  return mergeProps(
    /** Track provider changes while instance values retain precedence. */
    () => inherited?.() ?? {},
    instance,
  ) as NativeSelectRuntimeRootProps;
}
