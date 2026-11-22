import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { AlertContextProvider } from './alert-context';
import type { NativeElementTag } from './native-element-props';
import { useAlertProps, type AlertRootProps, type AlertRootRuntimeProps } from './alert-props';
import { alertRootAttributes } from './alert-root-attributes';

/** Render a selected native Alert element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render an Alert root with authored responsive choices and native semantics. */
function AlertRootComponent(props: AlertRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useAlertProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'status',
    'variant',
    'size',
    'inline',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);

  /** Forward the selected native node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep provider choices and native attributes reactive without style tags. */
    () => ({
      ...native,
      ...alertRootAttributes(local, local.unstyled),
      class: composeRecipeClassNames('alert__root', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );

  /** Mount children after the nearest Alert status context is available. */
  function renderRoot(): JSX.Element {
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild(
            'AlertRoot',
            contentProps.asChild,
            attributes,
            children(
              /** Keep compound parts mounted as status and layout change. */
              () => contentProps.children,
            ),
          )
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {contentProps.children}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(AlertContextProvider, {
    value: {
      /** Read the current status without freezing inherited provider changes. */
      status: () => local.status ?? 'info',
    },
    /** Construct parts under the nearest reactive status. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native Alert root props and refs for selected elements. */
export const AlertRoot = AlertRootComponent as <As extends NativeElementTag = 'div'>(
  props: AlertRootProps<As>,
) => JSX.Element;
