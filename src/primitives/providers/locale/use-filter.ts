import { type FilterOptions, type FilterReturn, createFilter } from '@zag-js/i18n-utils';
import { createMemo } from 'solid-js';
import { useLocaleContext } from './use-locale-context';

export type UseFilterProps = FilterOptions;

/** Create the filter state and return its API. */
export function useFilter(props: UseFilterProps): UseFilterReturn {
  const env = useLocaleContext();
  const filter = createMemo(() => createFilter({ ...props, locale: props.locale ?? env().locale }));
  return {
    /** Contains. */
    contains: (string, substring) => filter().contains(string, substring),
    /** Starts with. */
    startsWith: (string, substring) => filter().startsWith(string, substring),
    /** Ends with. */
    endsWith: (string, substring) => filter().endsWith(string, substring),
  };
}

export type UseFilterReturn = FilterReturn;
