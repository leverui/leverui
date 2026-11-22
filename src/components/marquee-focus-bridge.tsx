import { createEffect, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useMarqueeContext } from './marquee-machine';

interface MarqueeFocusBridgeProps {
  root: Accessor<Element | undefined>;
  children?: JSX.Element;
}

type FocusHandlers = {
  onFocusCapture?: (event: FocusEvent) => void;
  onBlurCapture?: (event: FocusEvent) => void;
};

/** Forward native focus transitions to Zag's capture handlers in Solid. */
export function MarqueeFocusBridge(props: MarqueeFocusBridgeProps): JSX.Element {
  const marquee = useMarqueeContext();

  createEffect(
    /** Track the marquee root element. */
    () => props.root(),
    /** Forward focus transitions on the current root. */
    (root) => {
      if (!root) return;

      /** Run the current machine handler when a descendant gains focus. */
      function handleFocusIn(event: Event): void {
        const handlers = marquee().getRootProps() as FocusHandlers;
        handlers.onFocusCapture?.(event as FocusEvent);
      }

      /** Run the current machine handler when focus leaves a descendant. */
      function handleFocusOut(event: Event): void {
        const handlers = marquee().getRootProps() as FocusHandlers;
        handlers.onBlurCapture?.(event as FocusEvent);
      }

      root.addEventListener('focusin', handleFocusIn);
      root.addEventListener('focusout', handleFocusOut);
      return (
        /** Stop forwarding focus from the previous root. */
        () => {
          root.removeEventListener('focusin', handleFocusIn);
          root.removeEventListener('focusout', handleFocusOut);
        }
      );
    },
  );

  return <>{props.children}</>;
}
