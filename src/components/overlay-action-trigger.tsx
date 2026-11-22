import { splitProps } from '../primitives/utils/split-props';
import { useDialogContext } from '../primitives/components/dialog';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useDialogAuthoredStyleState } from './dialog-authored-style-state';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

type NativeActionProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  NativeHtmlAliases & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: HTMLElement) => void) | undefined;
    className?: string;
    unstyled?: boolean;
    type?: string;
  };
type ActionEvent = Parameters<JSX.EventHandler<HTMLElement, MouseEvent>>[0];
export type OverlayActionTriggerProps<As extends NativeElementTag = 'button'> = NativeElementProps<
  'button',
  NativeHtmlAliases & { unstyled?: boolean },
  As
>;

/** Render a selected native element with reactive action attributes. */
const NativeAction = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Close the nearest primitive dialog after the caller's click handler runs. */
function OverlayActionTriggerImpl(props: NativeActionProps): JSX.Element {
  const dialog = useDialogContext();
  const appearance = useDialogAuthoredStyleState();
  const family = appearance.family;
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'class',
    'className',
    'ref',
    'unstyled',
    'type',
    'onClick',
    ...nativeHtmlAliasNames,
  ]);

  /** Call either Solid handler form before closing the active machine. */
  function handleClick(event: ActionEvent): void {
    const action = local.onClick;
    if (typeof action === 'function') action(event);
    else if (action) action[0](action[1], event);
    dialog().setOpen(false);
  }

  /** Read caller-owned content for native or asChild rendering. */
  function readContent(): JSX.Element {
    return local.children;
  }

  const attributes = createMemo(
    /** Keep native, appearance, and caller-owned attributes reactive. */
    () => ({
      ...native,
      ...nativeHtmlAttributes(local),
      ...appearance.partAttributes(local.unstyled),
      type: local.as && local.as !== 'button' ? undefined : (local.type ?? 'button'),
      onClick: handleClick,
      ref: local.ref,
      class: composeRecipeClassNames(
        `${family}__actionTrigger`,
        undefined,
        local.class,
        local.className,
      ),
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          `${family === 'dialog' ? 'Dialog' : 'Drawer'}.ActionTrigger`,
          local.asChild,
          attributes,
          readContent,
        )
      ) : (
        <NativeAction component={local.as ?? 'button'} {...attributes()}>
          {local.children}
        </NativeAction>
      )}
    </>
  );
}

/** Type the action against its selected or caller-owned native element. */
export const OverlayActionTrigger = OverlayActionTriggerImpl as {
  <As extends NativeElementTag>(props: OverlayActionTriggerProps<As> & { as: As }): JSX.Element;
  (props: OverlayActionTriggerProps): JSX.Element;
};
