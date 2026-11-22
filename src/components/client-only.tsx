import { createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface ClientOnlyProps {
  /** Render after mounting; use a function to defer browser-only API reads. */
  children: JSX.Element | (() => JSX.Element);
  /** Render on the server and until the client has mounted. */
  fallback?: JSX.Element | undefined;
}

/** Defer client content until Solid has hydrated the server fallback. */
export function ClientOnly(props: ClientOnlyProps): JSX.Element {
  const [mounted, setMounted] = createSignal(false);

  /** Reveal client content only after the initial browser render. */
  function markMounted(): void {
    setMounted(true);
  }

  /** Evaluate a render function only inside the mounted branch. */
  function renderContent(): JSX.Element {
    return typeof props.children === 'function' ? props.children() : props.children;
  }

  onSettled(markMounted);

  return <>{mounted() ? renderContent() : props.fallback}</>;
}
