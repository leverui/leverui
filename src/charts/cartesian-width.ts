import { createSignal, onSettled, type Accessor } from 'solid-js';

/** Track a chart container's width without updating layout inside ResizeObserver. */
export function useCartesianWidth(container: () => HTMLDivElement | undefined): Accessor<number> {
  const [width, setWidth] = createSignal(700);
  let frame = 0;

  /** Measure the attached container after layout settles. */
  function measure(): void {
    const element = container();
    if (element) setWidth(Math.max(280, element.getBoundingClientRect().width));
  }

  /** Defer resize-driven updates to the next animation frame. */
  function schedule(): void {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measure);
  }

  /** Connect the browser-only resize observer after the chart mounts. */
  function connect(): (() => void) | undefined {
    const element = container();
    if (!element) return undefined;
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    /** Disconnect observer and pending frame with the chart owner. */
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }

  onSettled(connect);
  return width;
}
