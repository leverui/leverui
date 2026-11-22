import type { Locale } from '@zag-js/i18n-utils';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseLocaleContext = Accessor<Locale>;

export const [LocaleContextProvider, useLocaleContext] = createContext<UseLocaleContext>({
  hookName: 'useEnvironmentContext',
  providerName: '<EnvironmentProvider />',
  strict: false,
  /** Default value. */
  defaultValue: () => ({ dir: 'ltr', locale: 'en-US' }),
});
