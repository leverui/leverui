import { splitProps } from '../primitives/utils/split-props';
import { trapFocus } from '@zag-js/focus-trap';
import { createEffect, createMemo, createSignal, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { compact } from '../utils/compact';
import { cx } from '../utils/cx';
import {
  focusTrapOptionKeys,
  type FocusTrapBehaviorProps,
  type FocusTrapProps,
  type FocusTrapTag,
} from './focus-trap-props';

type RuntimeFocusTrapProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  FocusTrapBehaviorProps & {
    as?: FocusTrapTag | undefined;
    asChild?: FocusTrapProps['asChild'] | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render an HTML tag selected by the consumer without a style runtime. */
const DynamicElement = Dynamic as (
  props: { component: FocusTrapTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Recognize an HTML root without relying on the current window's constructor. */
function isHtmlElement(element: Element): element is HTMLElement {
  return element.nodeType === 1 && element.namespaceURI === 'http://www.w3.org/1999/xhtml';
}

/** Trap focus on the native node while following reactive Solid options. */
function FocusTrapImpl(props: RuntimeFocusTrapProps): JSX.Element {
  const [behavior, elementProps] = splitProps(props, focusTrapOptionKeys);
  const [local, native] = splitProps(elementProps, ['ref', 'as', 'asChild', 'children', 'class']);
  // A caller-rendered child may run this ref during render, so allow that write.
  const [node, setNode] = createSignal<HTMLElement | undefined>(undefined, { ownedWrite: true });

  /** Retain the actual native node and notify a consumer callback ref. */
  function attachNode(element: Element): void {
    if (!isHtmlElement(element)) {
      throw new Error('FocusTrap requires an HTML element.');
    }
    setNode(element);
    untrack(() => local.ref)?.(element);
  }

  createEffect(
    /** Track the node and every behavior option the trap reads. */
    () => {
      const element = node();
      if (!element || behavior.disabled) return undefined;
      return {
        element,
        options: {
          onActivate: behavior.onActivate,
          onDeactivate: behavior.onDeactivate,
          initialFocus: behavior.initialFocus,
          fallbackFocus: behavior.fallbackFocus,
          returnFocusOnDeactivate: behavior.returnFocusOnDeactivate,
          setReturnFocus: behavior.setReturnFocus,
          persistentElements: behavior.persistentElements,
        },
      };
    },
    /** Recreate Zag's trap when its node or behavior options change. */
    (current) => {
      if (!current) return;
      const { element, options } = current;
      const autofocus = element.querySelector<HTMLElement>('[autofocus], [data-autofocus]');
      return trapFocus(
        element,
        compact({ ...options, initialFocus: options.initialFocus ?? autofocus ?? undefined }),
      );
    },
  );

  const attributes = createMemo(
    /** Keep the public hook and consumer attributes live on the native node. */
    () => ({
      ...native,
      class: cx('leverui-focus-trap', local.class),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'FocusTrap',
          local.asChild,
          attributes,
          /** Keep caller-owned child content reactive. */
          () => local.children,
        )
      ) : (
        <DynamicElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </DynamicElement>
      )}
    </>
  );
}

/** Expose native element, child renderer, and Zag option types to consumers. */
export const FocusTrap = FocusTrapImpl as <As extends FocusTrapTag = 'div'>(
  props: FocusTrapProps<As>,
) => JSX.Element;
