import { createMemo, createSignal, createUniqueId, type Accessor } from 'solid-js';
import { useLocaleContext } from '../components/locale';
import { chartValueOrder, groupChartData, type ChartValueDomain } from './use-chart-data';
import {
  chartColorToken,
  chartSizeToken,
  chartSpacingToken,
  type ChartColor,
  type ChartSize,
  type ChartSpacing,
} from './use-chart-tokens';

/** One named chart series with a CSS color or Lever UI color token. */
export interface ChartSeries<T> {
  name: keyof T;
  color?: string;
  label?: string;
}

/** Input data and optional ordering for a chart. */
export interface UseChartProps<T> {
  data: readonly T[];
  series?: readonly ChartSeries<T>[];
  sort?: { by: keyof T; direction: 'asc' | 'desc' };
}

/** Shared data, formatting, token, and highlight helpers for chart compositions. */
export interface UseChartReturn<T> {
  readonly id: string;
  readonly data: readonly T[];
  readonly series: readonly ChartSeries<T>[];
  readonly highlightedSeries: string | null;
  key: <K extends keyof T>(name: K) => K;
  getKey: <K extends keyof T>(name: K) => K;
  groupBy: (key: keyof T) => T[][];
  getSeries: (name: keyof T | string | undefined) => ChartSeries<T> | undefined;
  getSeriesOpacity: (name: string | undefined, fallback?: number) => number | undefined;
  setHighlightedSeries: (name: string | null) => void;
  isHighlightedSeries: (name: string | undefined) => boolean;
  getTotal: (key: keyof T) => number;
  getMin: (key: keyof T) => number;
  getMax: (key: keyof T) => number;
  getValuePercent: (key: keyof T, value: number, domain?: ChartValueDomain) => number;
  formatNumber: (options?: Intl.NumberFormatOptions) => (value: number) => string;
  formatDate: (options?: Intl.DateTimeFormatOptions) => (value: string) => string;
  color: (key: ChartColor | undefined) => string | undefined;
  size: (key: ChartSize | undefined) => string | undefined;
  spacing: (key: ChartSpacing | undefined) => string | undefined;
}

/** A year, a year and month, or a full date with no time, which JavaScript reads as UTC. */
const calendarDate = /^\d{4}(-\d{2}){0,2}$/;

/** Build reactive chart data and helpers without mutating the caller's source array. */
export function useChart<T>(
  props: UseChartProps<T> | Accessor<UseChartProps<T>>,
): UseChartReturn<T> {
  /** Read either a static chart definition or a Solid accessor. */
  const input = typeof props === 'function' ? props : () => props;
  const locale = useLocaleContext();
  const id = createUniqueId();
  /** Sort a copied data array whenever its reactive input changes. */
  const sortedData = createMemo<readonly T[]>(() => {
    const { data, sort } = input();
    if (!sort) return data;
    return [...data].sort(
      /** Order numbers numerically and other values as text. */
      (left, right) => chartValueOrder(left[sort.by], right[sort.by], sort.direction),
    );
  });
  const [highlightedSeries, setHighlightedSeries] = createSignal<string | null>(null);

  /** Read one numeric field from every entry. */
  function values(key: keyof T): number[] {
    return sortedData().map(
      /** Read a numeric field for comparison. */
      (item) => Number(item[key]),
    );
  }

  /** Add the numeric values of one field. */
  function getTotal(key: keyof T): number {
    return values(key).reduce(
      /** Accumulate one numeric field. */
      (total, value) => total + value,
      0,
    );
  }

  /** Find the smallest numeric value, returning zero for an empty chart. */
  function getMin(key: keyof T): number {
    const list = values(key);
    return list.length === 0 ? 0 : Math.min(...list);
  }

  /** Find the largest numeric value, returning zero for an empty chart. */
  function getMax(key: keyof T): number {
    const list = values(key);
    return list.length === 0 ? 0 : Math.max(...list);
  }

  /** Express a value as a percentage of its total, or of a domain or domain function. */
  function getValuePercent(key: keyof T, value: number, domain?: ChartValueDomain): number {
    const [minimum, maximum] =
      typeof domain === 'function'
        ? domain({ min: getMin(key), max: getMax(key) })
        : (domain ?? [0, getTotal(key)]);
    const span = maximum - minimum;
    return span === 0 ? 0 : ((value - minimum) / span) * 100;
  }

  /** Create an Intl number formatter for the current LocaleProvider locale. */
  function formatNumber(options?: Intl.NumberFormatOptions): (value: number) => string {
    const formatter = new Intl.NumberFormat(locale().locale, options);
    /** Format one number with the captured Intl options. */
    return (value: number): string => formatter.format(value);
  }

  /**
   * Create a date formatter for the current LocaleProvider locale. A date written without a
   * time, such as `2024-01-01`, is a calendar day, so it reads the same in every time zone.
   */
  function formatDate(options?: Intl.DateTimeFormatOptions): (value: string) => string {
    const local = new Intl.DateTimeFormat(locale().locale, options);
    const calendar = new Intl.DateTimeFormat(locale().locale, { timeZone: 'UTC', ...options });
    /** Format one date string with the captured Intl options. */
    return (value: string): string =>
      (calendarDate.test(value) ? calendar : local).format(new Date(value));
  }

  /** Find one configured series by its data key. */
  function getSeries(name: keyof T | string | undefined): ChartSeries<T> | undefined {
    return (input().series ?? []).find(
      /** Match the series data key. */
      (series) => series.name === name,
    );
  }

  /** Report whether a series is the highlighted one. */
  function isHighlightedSeries(name: string | undefined): boolean {
    return highlightedSeries() === name;
  }

  /** Dim every series except the highlighted one; undefined when nothing is highlighted. */
  function getSeriesOpacity(name: string | undefined, fallback = 0.2): number | undefined {
    if (!name || !highlightedSeries()) return undefined;
    return isHighlightedSeries(name) ? 1 : fallback;
  }

  /** Return a series data key with type checking; the identity on values. */
  function key<K extends keyof T>(name: K): K {
    return name;
  }

  return {
    id,
    /** Read the current sorted data. */
    get data() {
      return sortedData();
    },
    /** Read the current series configuration. */
    get series() {
      return input().series ?? [];
    },
    /** Read the current highlighted series. */
    get highlightedSeries() {
      return highlightedSeries();
    },
    key,
    getKey: key,
    /** Group the sorted entries by one field's value. */
    groupBy: (field) => groupChartData(sortedData(), field),
    getSeries,
    getSeriesOpacity,
    setHighlightedSeries,
    isHighlightedSeries,
    getTotal,
    getMin,
    getMax,
    getValuePercent,
    formatNumber,
    formatDate,
    color: chartColorToken,
    size: chartSizeToken,
    spacing: chartSpacingToken,
  };
}
