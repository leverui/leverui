import { splitProps } from '../primitives/utils/split-props';
import { createMemo, type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { mergeProps as mergeReactiveProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveValues } from '../styled-system/responsive-values';
import type { NativeElementTag } from './native-element-props';

export type KbdSize = 'sm' | 'md' | 'lg';
export type KbdVariant = 'raised' | 'outline' | 'subtle' | 'plain';
export type ResponsiveKbdChoice<Choice extends string> =
  Choice | readonly (Choice | null)[] | ResponsiveValues<Choice>;

export interface KbdBaseProps {
  /** Select an authored size at ordinary breakpoints. */
  size?: ResponsiveKbdChoice<KbdSize> | undefined;
  /** Select an authored treatment at ordinary breakpoints. */
  variant?: ResponsiveKbdChoice<KbdVariant> | undefined;
  /** Select a built-in or consumer-defined color palette. */
  colorPalette?: string | undefined;
  /** Suppress the default Kbd presentation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type KbdRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof KbdBaseProps> &
  KbdBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Share attributes and fresh child content while each instance owns its ref. */
export type KbdDefaults = Partial<Omit<KbdRootProps, 'asChild' | 'children' | 'ref'>> & {
  children?: () => JSX.Element;
};

export interface KbdPropsProviderProps {
  value: KbdDefaults | Accessor<KbdDefaults>;
  children: JSX.Element;
}

const KbdContext = createOptionalContext<Accessor<KbdDefaults>>();

/** Supply reactive Kbd defaults to every descendant instance. */
export function KbdPropsProvider(props: KbdPropsProviderProps): JSX.Element {
  /** Read and validate the current inherited child factory. */
  function readDefaults(): KbdDefaults {
    const defaults = typeof props.value === 'function' ? props.value() : props.value;
    if (defaults.children != null && typeof defaults.children !== 'function') {
      throw new TypeError('KbdPropsProvider children must be a render function.');
    }
    return defaults;
  }

  return <KbdContext value={readDefaults}>{props.children}</KbdContext>;
}

/** Compose provider defaults with instance props and distinct child content. */
export function useKbdProps(instance: KbdRootProps): KbdRootProps {
  const inherited = useOptionalContext(KbdContext);
  const renderChildren = createMemo(
    /** Track the nearest provider's child factory by identity. */
    () => inherited?.().children,
  );
  const content = createMemo(
    /** Construct inherited content only when this instance lacks children. */
    () => instance.children ?? renderChildren()?.(),
  );
  return mergeProps(
    /** Keep the provider's child factory out of native attributes. */
    () => splitProps(inherited?.() ?? {}, ['children'])[1],
    mergeReactiveProps(instance, {
      /** Forward this instance's resolved content. */
      get children() {
        return content();
      },
    }),
  );
}
