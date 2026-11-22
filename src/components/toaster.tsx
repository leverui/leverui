import { splitProps } from '../primitives/utils/split-props';
import {
  Toaster as PrimitiveToaster,
  type ToasterProps as PrimitiveToasterProps,
} from '../primitives/components/toast';
import type * as ZagToast from '@zag-js/toast';
import { createComponent, createEffect, createMemo, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX, isServer } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useEnvironmentContext } from './environment';
import type { ToasterProps } from './toast-props';
import { trackToastPageIdle } from './toast-page-idle';
import { disableMachinePageIdle, type CreateToasterReturn, type ToastOptions } from './toast-store';
import type { ClassValue } from '../utils/class-value';

type ToasterRenderProps<T> = NativeHtmlAliases &
  Omit<ZagToast.GroupProps, 'id' | 'store' | 'children'> & {
    toaster: CreateToasterReturn<T>;
    children: (toast: Accessor<ToastOptions<T>>) => JSX.Element;
    unstyled?: boolean;
    class?: ClassValue;
    className?: string;
    ref?: unknown;
  };

/** Identify a document without assuming it belongs to the global window. */
function isDocument(root: Node): root is Document {
  return root.nodeType === 9;
}

/** Render the primitive's labeled notification region with a native CSS hook. */
function ToasterImpl<T = JSX.Element>(props: ToasterRenderProps<T>): JSX.Element {
  const environment = useEnvironmentContext();
  const machineToaster = createMemo(() => disableMachinePageIdle(props.toaster));

  /** Find the document whose page-idle state pauses toasts, if pausing is on. */
  function ownerDocument(): Document | undefined {
    if (!props.toaster.attrs.pauseOnPageIdle) return undefined;
    const rootNode = props.getRootNode?.() ?? environment().getRootNode();
    return isDocument(rootNode)
      ? rootNode
      : (rootNode.ownerDocument ?? environment().getDocument());
  }

  createEffect(
    /** Track the toaster and its owner document. */
    () => ({ toaster: props.toaster, document: isServer ? undefined : ownerDocument() }),
    /** Move the page-idle listener when the primitive environment root changes. */
    ({ toaster, document }) => (document ? trackToastPageIdle(toaster, document) : undefined),
  );

  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', ...nativeHtmlAliasNames],
  );

  const primitiveProps = mergeProps(
    /** Forward toaster store, child renderer, and native attributes. */
    () => native,
    /** Convert Lever UI aliases to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve the stable region class and caller classes. */
      get class() {
        return composeRecipeClassNames('toast__toaster', undefined, local.class, local.className);
      },
      /** Preserve a ref on the native region. */
      get ref() {
        return local.ref as PrimitiveToasterProps['ref'];
      },
      /** Keep native semantics when the caller removes default CSS. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep the upstream group from also owning document visibility. */
      get toaster() {
        return machineToaster();
      },
      /** Bridge the primitive's untyped payload to this store's caller-owned payload type. */
      get children() {
        return (toast: Accessor<ToastOptions>) =>
          content.children(toast as Accessor<ToastOptions<T>>);
      },
    },
  );

  return createComponent(PrimitiveToaster, primitiveProps);
}

/** Expose native region props and caller-owned toast payloads. */
export const Toaster = ToasterImpl as <T = JSX.Element>(props: ToasterProps<T>) => JSX.Element;
