import { DateFormatter } from '@internationalized/date';
import { createMemo, type Accessor } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useLocaleContext } from './use-locale-context';

export interface UseDateFormatterProps extends Intl.DateTimeFormatOptions {
  locale?: string;
}

export type UseDateFormatterReturn = Accessor<DateFormatter>;

/** Create the date formatter state and return its API. */
export function useDateFormatter(
  props: MaybeAccessor<UseDateFormatterProps> = {},
): UseDateFormatterReturn {
  const env = useLocaleContext();
  return createMemo(() => {
    const resolvedProps = runIfFn(props);
    const locale = resolvedProps.locale ?? env().locale;
    const options = { ...resolvedProps };
    delete options.locale;
    return new DateFormatter(locale, options);
  });
}
