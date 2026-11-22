import { splitProps } from '../primitives/utils/split-props';
import { createMemo, type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementTag } from './native-element-props';
import type { ResponsiveLinkVariant } from './link-variant';

export interface LinkBaseProps {
  /** Choose plain or underlined presentation at ordinary breakpoints. */
  variant?: ResponsiveLinkVariant | undefined;
  /** Select a built-in or consumer-defined palette. */
  colorPalette?: string | undefined;
  /** Suppress authored Link presentation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

type AnchorSpecificAttributes = Omit<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof JSX.HTMLAttributes<HTMLAnchorElement>
>;

export type LinkRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof LinkBaseProps> &
  AnchorSpecificAttributes &
  LinkBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Share Link defaults while each anchor owns its content and ref. */
export type LinkDefaults = Partial<Omit<LinkRootProps, 'children' | 'as' | 'asChild' | 'ref'>> & {
  /** Return a fresh label for every Link that inherits content. */
  children?: () => JSX.Element;
};

export interface LinkPropsProviderProps {
  value: LinkDefaults | Accessor<LinkDefaults>;
  children: JSX.Element;
}

const LinkContext = createOptionalContext<Accessor<LinkDefaults>>();

/** Supply reactive Link defaults to descendant anchors. */
export function LinkPropsProvider(props: LinkPropsProviderProps): JSX.Element {
  /** Read current defaults in each consumer's tracked scope. */
  function readDefaults(): LinkDefaults {
    const defaults = typeof props.value === 'function' ? props.value() : props.value;
    if (defaults.children != null && typeof defaults.children !== 'function') {
      throw new TypeError('LinkPropsProvider children must be a render function.');
    }
    return defaults;
  }

  return <LinkContext value={readDefaults}>{props.children}</LinkContext>;
}

/** Merge the nearest Link defaults with live instance props and fresh content. */
export function useLinkProps(instance: LinkRootProps): LinkRootProps {
  const inherited = useOptionalContext(LinkContext);
  const renderChildren = createMemo(
    /** Track the current shared label factory by identity. */
    () => inherited?.().children,
  );
  const content = createMemo(
    /** Build distinct inherited content unless this instance has its own. */
    () => {
      const local = instance.children;
      return local === undefined ? renderChildren()?.() : local;
    },
  );
  return mergeProps(
    /** Keep the shared label factory out of native anchor attributes. */
    () => splitProps(inherited?.() ?? {}, ['children'])[1],
    instance,
    {
      /** Forward this instance's content through the normal prop merge. */
      get children() {
        return content();
      },
    },
  );
}
