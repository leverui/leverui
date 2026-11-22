import {
  LocaleProvider as PrimitiveLocaleProvider,
  useFilter as usePrimitiveFilter,
  useLocaleContext as usePrimitiveLocaleContext,
} from '../primitives/providers/locale';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface LocaleContext {
  /** Language and region used by locale-aware descendants. */
  locale: string;
  /** Writing direction derived from the locale. */
  dir: 'ltr' | 'rtl';
}

export interface LocaleProviderProps {
  /** Locale shared by descendants and primitive-backed components. */
  locale: string;
  /** Content within this locale scope. */
  children?: JSX.Element | undefined;
}

export interface UseFilterProps extends Intl.CollatorOptions {
  /** Explicit locale; the nearest provider is used when omitted. */
  locale?: string | undefined;
}

export interface FilterMatcher {
  /** Check whether a string begins with the supplied text. */
  startsWith(value: string, search: string): boolean;
  /** Check whether a string ends with the supplied text. */
  endsWith(value: string, search: string): boolean;
  /** Check whether a string contains the supplied text. */
  contains(value: string, search: string): boolean;
}

export type UseFilterReturn = Accessor<FilterMatcher>;

/** Share a reactive locale with Lever UI hooks and primitive-backed descendants. */
export function LocaleProvider(props: LocaleProviderProps): JSX.Element {
  return createComponent(PrimitiveLocaleProvider, {
    /** Track changes to the selected locale. */
    get locale() {
      return props.locale;
    },
    /** Resolve children inside the shared locale context. */
    get children() {
      return props.children;
    },
  });
}

/** Read the nearest locale and writing direction as a Solid accessor. */
export function useLocaleContext(): Accessor<LocaleContext> {
  return usePrimitiveLocaleContext();
}

/**
 * Create locale-aware string matchers that track provider and option changes.
 *
 * The primitive returns the matchers directly, and each one reads the current locale
 * and options when called. Lever keeps its accessor contract around them.
 */
export function useFilter(props: UseFilterProps): UseFilterReturn {
  const matcher = usePrimitiveFilter(props);
  return () => matcher;
}
