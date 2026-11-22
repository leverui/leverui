import { isServer } from '@solidjs/web';
import { createEffect, createSignal, type Accessor } from 'solid-js';
import { useEnvironmentContext } from '../components/environment';

/** Element ref callback and its latest observed rectangle. */
export interface UseElementRectReturn {
  ref: (element: HTMLElement | null) => void;
  rect: Accessor<DOMRect | null>;
}

/** Observe an element's rectangle in the nearest DOM environment. */
export function useElementRect(): UseElementRectReturn {
  const environment = useEnvironmentContext();
  // A caller-rendered child may run this ref during render, so allow that write.
  const [element, setElement] = createSignal<HTMLElement | null>(null, { ownedWrite: true });
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  /** Accept the element supplied by Solid's ref callback. */
  function ref(next: HTMLElement | null): void {
    setElement(next);
  }

  createEffect(
    /** Track the element and the environment's window. */
    () =>
      // Effect computes run during server rendering too; the observer is client-only.
      isServer
        ? undefined
        : { node: element(), Observer: environment().getWindow().ResizeObserver },
    /** Replace the observer when the element or environment changes. */
    (current) => {
      if (!current) return;
      const { node, Observer } = current;
      if (!node) {
        setRect(null);
        return;
      }
      setRect(null);
      const observer = new Observer(
        /** Publish the element's latest measured rectangle after a resize. */
        () => setRect(node.getBoundingClientRect()),
      );
      observer.observe(node);
      return (
        /** Release observation when the ref or owner changes. */
        () => observer.disconnect()
      );
    },
  );

  return { ref, rect };
}
