import { type JSX } from '@solidjs/web';

/** Invoke a plain or bound Solid event handler after chart-owned behavior. */
export function dispatchChartNativeEvent<E extends Event>(
  handler: JSX.EventHandlerUnion<HTMLDivElement, E> | undefined,
  event: E & { currentTarget: HTMLDivElement; target: Element },
): void {
  if (typeof handler === 'function') handler(event);
  else if (handler) handler[0](handler[1], event);
}
