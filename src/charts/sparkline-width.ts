import { createSignal, onSettled, type Accessor } from 'solid-js';

/** Track a responsive Sparkline's rendered width for pixel-accurate SVG geometry. */
export function useSparklineWidth(element: () => SVGSVGElement | undefined): Accessor<number> {
  const [width, setWidth] = createSignal(112);

  /** Measure the rendered chart without changing its CSS width. */
  function measure(): void {
    const chart = element();
    if (chart) setWidth(Math.max(1, chart.getBoundingClientRect().width));
  }

  /** Follow container resizes after Solid attaches the SVG. */
  function connect(): (() => void) | undefined {
    const chart = element();
    if (!chart) return undefined;
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(chart);
    /** Stop watching when the chart unmounts. */
    return () => observer.disconnect();
  }

  onSettled(connect);
  return width;
}
