import { createSignal, onSettled, type Accessor } from 'solid-js';
/** Measured CSS dimensions of a chart SVG. */
export interface ChartDisplaySize {
  width: number;
  height: number;
}

/** One point in an SVG chart coordinate system. */
export interface ChartPoint {
  x: number;
  y: number;
}

/** Track CSS scaling so chart overlays use displayed rather than viewBox coordinates. */
export function useChartDisplaySize(
  chart: () => SVGSVGElement | undefined,
  width: () => number,
  height: () => number,
): Accessor<ChartDisplaySize> {
  const [size, setSize] = createSignal({ width: width(), height: height() });

  /** Measure the SVG after layout or a CSS width change. */
  function measure(): void {
    const bounds = chart()?.getBoundingClientRect();
    if (bounds && bounds.width > 0 && bounds.height > 0) {
      setSize({ width: bounds.width, height: bounds.height });
    }
  }

  /** Observe responsive scaling only after browser mount. */
  function connect(): (() => void) | undefined {
    const element = chart();
    if (!element) return undefined;
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(
      /** Update tooltip boundaries after rendered SVG dimensions change. */
      () => measure(),
    );
    observer.observe(element);
    /** Disconnect the chart's size observer with its Solid owner. */
    return () => observer.disconnect();
  }

  onSettled(connect);
  return size;
}

/** Convert a chart viewBox point to the SVG's displayed pixel coordinates. */
export function displayedChartPoint(
  point: ChartPoint,
  viewWidth: number,
  viewHeight: number,
  display: ChartDisplaySize,
): ChartPoint {
  return {
    x: (point.x * display.width) / viewWidth,
    y: (point.y * display.height) / viewHeight,
  };
}

/** Convert a normalized chart point to the current displayed dimensions. */
export function displayedNormalizedPoint(point: ChartPoint, display: ChartDisplaySize): ChartPoint {
  return { x: point.x * display.width, y: point.y * display.height };
}
