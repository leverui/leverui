import { splitProps } from '../primitives/utils/split-props';
import { createMemo, type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ResponsiveCssValue } from '../styled-system/responsive-values';
import type { RenderSvgChild } from '../styled-system/svg-child-props';
import { mergeRecipeProps } from './recipe-props-merge';
import type { IconSize } from './icon-size';

export type {
  SvgChildAttributes,
  GetSvgChildProps,
  RenderSvgChild,
} from '../styled-system/svg-child-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type CallbackRef<As extends IntrinsicElement> = JSX.IntrinsicElements[As] extends {
  ref?: infer Ref;
}
  ? Extract<Ref, (element: never) => void>
  : never;

export interface IconBaseProps {
  /** Select an authored size at ordinary breakpoints. */
  size?: ResponsiveCssValue<IconSize> | undefined;
  /** Omit default presentation while keeping the native SVG and CSS hook. */
  unstyled?: boolean | undefined;
  /** Add a native class through the alternate naming convention. */
  className?: string | undefined;
  /** SVG focusability override; decorative icons default to false. */
  focusable?: boolean | 'true' | 'false' | undefined;
  /** Native tooltip text for the rendered element. */
  title?: string | false | undefined;
}

type NativeIconProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<
      JSX.IntrinsicElements[NoInfer<As>],
      keyof IconBaseProps | 'size' | 'as' | 'asChild' | 'ref'
    > &
      IconBaseProps &
      (As extends 'svg' ? { as?: As } : { as: As }) & {
        asChild?: undefined;
        ref?: CallbackRef<NoInfer<As>> | undefined;
      }
  : never;
type ChildIconProps = Omit<
  JSX.IntrinsicElements['svg'],
  keyof IconBaseProps | 'size' | 'as' | 'asChild' | 'ref'
> &
  IconBaseProps & {
    as?: never;
    asChild: RenderSvgChild;
    ref?: ((element: SVGSVGElement) => void) | undefined;
  };

export type IconProps<As extends IntrinsicElement = 'svg'> = NativeIconProps<As> | ChildIconProps;
export type IconRootProps = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, keyof IconBaseProps | 'ref'> &
  IconBaseProps & {
    as?: IntrinsicElement;
    asChild?: RenderSvgChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type IconDefaults = Partial<Omit<IconRootProps, 'asChild' | 'ref' | 'children'>> & {
  /** Return fresh SVG content whenever an Icon reads shared defaults. */
  children?: () => JSX.Element;
};

export interface IconPropsProviderProps {
  value: IconDefaults | Accessor<IconDefaults>;
  children: JSX.Element;
}

const IconContext = createOptionalContext<Accessor<IconDefaults>>();

/** Supply reactive Icon defaults while each instance owns its ref and renderer. */
export function IconPropsProvider(props: IconPropsProviderProps): JSX.Element {
  /** Resolve the current defaults inside a descendant's tracked scope. */
  function readDefaults(): IconDefaults {
    const defaults = typeof props.value === 'function' ? props.value() : props.value;
    if (defaults.children != null && typeof defaults.children !== 'function') {
      throw new TypeError('IconPropsProvider children must be a render function.');
    }
    return defaults;
  }

  return <IconContext value={readDefaults}>{props.children}</IconContext>;
}

/** Merge the nearest Icon provider with an instance's live native props. */
export function useIconProps(instance: IconRootProps): IconRootProps {
  const inherited = useOptionalContext(IconContext);
  const renderChildren = createMemo(
    /** Track the nearest provider's child factory by identity. */
    () => inherited?.().children,
  );
  const content = createMemo(
    /** Use local children or build fresh provider children for this Icon. */
    () => {
      const local = instance.children;
      return local === undefined ? renderChildren()?.() : local;
    },
  );
  return mergeRecipeProps<IconRootProps>(
    /** Keep the provider's render function out of native Icon props. */
    () => splitProps(inherited?.() ?? {}, ['children'])[1],
    mergeProps(instance, {
      /** Forward the per-instance SVG content through the ordinary merge. */
      get children() {
        return content();
      },
    }),
  );
}
