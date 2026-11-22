import { splitProps } from '../primitives/utils/split-props';
import {
  splitPresenceProps,
  usePresence,
  type UsePresenceProps,
} from '../primitives/components/presence';
import { createMemo, Show, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { cx } from '../utils/cx';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type NativePresenceProps<As extends IntrinsicElement> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof UsePresenceProps | 'as' | 'asChild'> &
      UsePresenceProps &
      (As extends 'div' ? { as?: As } : { as: As }) & { asChild?: never }
  : never;
type ChildPresenceProps = Omit<
  JSX.IntrinsicElements['div'],
  keyof UsePresenceProps | 'as' | 'asChild' | 'ref'
> &
  UsePresenceProps & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export type PresenceProps<As extends IntrinsicElement = 'div'> =
  NativePresenceProps<As> | ChildPresenceProps;

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, keyof UsePresenceProps | 'ref'> &
  UsePresenceProps & {
    as?: IntrinsicElement | undefined;
    asChild?: PresenceProps['asChild'] | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the selected native tag without a component styling runtime. */
const DynamicElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Keep a native element mounted through the primitive and Zag entry and exit states. */
function PresenceRoot(props: RuntimeProps): JSX.Element {
  const [presenceProps, elementProps] = splitPresenceProps(props);
  const api = usePresence(presenceProps);
  const [local, native] = splitProps(elementProps, ['as', 'asChild', 'ref', 'class', 'children']);

  /** Supply the primitive's node ref before notifying the caller about the native node. */
  function attachNode(element: Element): void {
    api().ref(element);
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep state and native attributes reactive on both render paths. */
    () => ({
      hidden: api().presenceProps.hidden,
      'data-state': api().presenceProps['data-state'],
      ...native,
      'data-presence-root': '',
      class: cx('leverui-presence', local.class),
      ref: attachNode,
    }),
  );

  return (
    <Show when={!api().unmounted}>
      {local.asChild ? (
        renderNativeLayoutChild(
          'Presence',
          local.asChild,
          attributes,
          /** Keep the caller's child content reactive. */
          () => local.children,
        )
      ) : (
        <DynamicElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </DynamicElement>
      )}
    </Show>
  );
}

/** Expose native attributes, a selected tag, or one caller-owned child. */
export const Presence = PresenceRoot as <As extends IntrinsicElement = 'div'>(
  props: PresenceProps<As>,
) => JSX.Element;
