import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  LocaleProvider as LocaleProviderExport,
  useFilter as UseFilterExport,
  useLocaleContext as UseLocaleContextExport,
} from '../src';

type LocaleHydrationComponents = {
  LocaleProvider: typeof LocaleProviderExport;
  useFilter: typeof UseFilterExport;
  useLocaleContext: typeof UseLocaleContextExport;
};

/** Build identical locale markup for published SSR and browser hydration. */
export function renderLocaleHydrationTree({
  LocaleProvider,
  useFilter,
  useLocaleContext,
}: LocaleHydrationComponents): JSX.Element {
  const [locale, setLocale] = createSignal('ar-EG');

  /** Change the provider after its server content has hydrated. */
  function selectTurkish(): void {
    setLocale('tr-TR');
  }

  /** Read context and filtering inside the changing locale scope. */
  function LocaleProbe(): JSX.Element {
    const context = useLocaleContext();
    const filter = useFilter({ sensitivity: 'base' });
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'locale-hydration-probe',
      /** Track the locale and filter across hydration and updates. */
      get children() {
        return `${context().locale}:${context().dir}:${filter().startsWith('I', 'ı')}`;
      },
    });
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep the stable sibling next to the reactive provider. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'span',
          'data-testid': 'locale-hydration-stable',
          children: 'Stable sibling',
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'locale-hydration-toggle',
          onClick: selectTurkish,
          children: 'Select Turkish',
        }),
        createComponent(LocaleProvider, {
          /** Follow the changing locale on the same provider. */
          get locale() {
            return locale();
          },
          /** Construct the probe inside the provider context. */
          get children() {
            return createComponent(LocaleProbe, {});
          },
        }),
      ];
    },
  });
}
