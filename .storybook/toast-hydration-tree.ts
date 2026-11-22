import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Toast as ToastExport,
  Toaster as ToasterExport,
  ToasterProps,
  createToaster as CreateToasterExport,
} from '../src';

export interface ToastHydrationComponents {
  Toast: typeof ToastExport;
  Toaster: typeof ToasterExport;
  createToaster: typeof CreateToasterExport;
}

/** Build the same initially empty toast region on server and browser. */
export function renderToastHydrationTree({
  Toast,
  Toaster,
  createToaster,
}: ToastHydrationComponents): JSX.Element {
  const toaster = createToaster({ placement: 'bottom-end' });

  /** Add a toast after the browser attaches to the server region. */
  function showHydratedToast(): void {
    toaster.create({ title: 'Hydrated toast', type: 'success' });
  }

  return [
    createComponent(Dynamic, {
      component: 'button',
      id: 'toast-hydration-trigger',
      type: 'button',
      onClick: showHydratedToast,
      children: 'Show hydrated toast',
    }),
    createComponent<ToasterProps>(Toaster, {
      toaster,
      id: 'hydrated-toast-region',
      /** Render each new toast inside the primitive's machine context. */
      children: (item) =>
        createComponent(Toast.Root, {
          id: 'hydrated-toast',
          style: { width: 'var(--leverui-sizes-sm)' },
          /** Create the title beneath the nearest toast root. */
          get children() {
            return createComponent(Toast.Content, {
              /** Wrap the title so the toast height follows it. */
              get children() {
                return createComponent(Toast.Title, {
                  /** Follow store updates after hydration. */
                  get children() {
                    return item().title;
                  },
                });
              },
            });
          },
        }),
    }),
  ];
}
