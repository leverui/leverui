import { createCollator } from '@zag-js/i18n-utils';
import { createMemo } from 'solid-js';
import { useLocaleContext } from './use-locale-context';

export interface UseCollatorProps extends Intl.CollatorOptions {
  locale?: string;
}

export type UseCollatorReturn = Intl.Collator;

/** Create the collator state and return its API. */
export function useCollator(props: UseCollatorProps = {}): UseCollatorReturn {
  const env = useLocaleContext();
  const collator = createMemo(() => {
    const { locale, ...options } = props;
    return createCollator(locale ?? env().locale, options);
  });
  return {
    /** Compare. */
    compare: (x, y) => collator().compare(x, y),
    /** Resolved options. */
    resolvedOptions: () => collator().resolvedOptions(),
  };
}
