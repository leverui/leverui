import { splitProps } from '../primitives/utils/split-props';
import { useToastContext } from '../primitives/components/toast';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { getStatusIconPath } from './alert-icons';
import type { ToastIndicatorProps } from './toast-props';

/** Render the status glyph for success, warning, or error toasts. */
export function ToastIndicator(props: ToastIndicatorProps): JSX.Element {
  const toast = useToastContext();
  const [local, native] = splitProps(props, ['unstyled', 'class', 'className', 'children']);

  /** Follow the machine's current toast type. */
  function status(): string {
    return toast().type;
  }

  return (
    <>
      {status() === 'success' || status() === 'warning' || status() === 'error' ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          {...native}
          class={composeRecipeClassNames(
            'toast__indicator',
            undefined,
            local.class,
            local.className,
          )}
          data-unstyled={local.unstyled ? '' : undefined}
        >
          {local.children === undefined ? <path d={getStatusIconPath(status())} /> : local.children}
        </svg>
      ) : null}
    </>
  );
}
