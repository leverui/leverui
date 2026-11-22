import { splitProps } from '../primitives/utils/split-props';
import { createComponent, untrack, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import {
  mergeChildProps,
  type ChildAttributes,
  type RenderChild,
} from '../styled-system/child-props';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { useDialogAuthoredStyleState } from './dialog-authored-style-state';

type LayoutSlot = 'header' | 'body' | 'footer';
type LayoutTag = 'div';
type LayoutInput = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  NativeHtmlAliases & {
    className?: string;
    unstyled?: boolean;
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: HTMLElement) => void) | undefined;
  };
type LayoutProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  NativeHtmlAliases & { unstyled?: boolean },
  As
>;
type LayoutComponent = {
  <As extends NativeElementTag>(props: LayoutProps<As> & { as: As }): JSX.Element;
  (props: LayoutProps): JSX.Element;
};

export type DialogHeaderProps = LayoutProps;
export type DialogBodyProps = LayoutProps;
export type DialogFooterProps = LayoutProps;

/** Apply a Dialog layout slot to its native container. */
function renderLayoutPart(slot: LayoutSlot, tag: LayoutTag, props: LayoutInput): JSX.Element {
  const authored = useDialogAuthoredStyleState();
  const [content, local, rest] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );
  const attributes: JSX.HTMLAttributes<HTMLElement> = mergeProps(
    /** Forward reactive native attributes and events. */
    () => rest,
    /** Translate Lever UI aliases at the native element. */
    () => nativeHtmlAttributes(local),
    /** Keep Dialog layout selections available inside its portal. */
    () => authored.partAttributes(local.unstyled),
    {
      /** Preserve caller refs on the rendered element. */
      get ref() {
        return local.ref;
      },
      /** Compose the public part hook and caller classes. */
      get class() {
        return composeRecipeClassNames(
          `${authored.family}__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Keep the caller's content under the same Dialog context. */
      get children() {
        return content.children;
      },
    },
  );
  const nativeProps = mergeProps(attributes, {
    /** Render the selected native tag. */
    get component() {
      return local.as ?? tag;
    },
  });

  /** Give the child renderer reactive native attributes and the caller ref. */
  function readChildAttributes(): JSX.HTMLAttributes<HTMLElement> {
    return attributes;
  }

  /** Merge a child element's own attributes with the Dialog layout slot. */
  function getChildProps(childProps?: ChildAttributes): ChildAttributes {
    return mergeChildProps(readChildAttributes, childProps);
  }

  /** Create a caller-owned layout element once while its attributes stay live. */
  function renderAsChild(): JSX.Element {
    const renderChild = local.asChild;
    if (!renderChild) throw new Error('Dialog layout asChild renderer is missing.');
    return untrack(
      /** Create the child once while merged native attributes remain reactive. */
      () => renderChild(getChildProps),
    );
  }

  // Dynamic cannot infer the selected native element from a reactive prop record.
  const nativePart = Dynamic as Component<typeof nativeProps>;
  return <>{local.asChild ? renderAsChild() : createComponent(nativePart, nativeProps)}</>;
}

/** Render the Dialog heading region. */
function DialogHeaderImpl(props: LayoutInput): JSX.Element {
  return renderLayoutPart('header', 'div', props);
}

/** Render the scrollable Dialog body when inside scrolling is selected. */
function DialogBodyImpl(props: LayoutInput): JSX.Element {
  return renderLayoutPart('body', 'div', props);
}

/** Render the Dialog action region on a native div. */
function DialogFooterImpl(props: LayoutInput): JSX.Element {
  return renderLayoutPart('footer', 'div', props);
}

/** Type the header against its selected or caller-owned element. */
export const DialogHeader = DialogHeaderImpl as LayoutComponent;
/** Type the body against its selected or caller-owned element. */
export const DialogBody = DialogBodyImpl as LayoutComponent;
/** Type the footer against its selected or caller-owned element. */
export const DialogFooter = DialogFooterImpl as LayoutComponent;
