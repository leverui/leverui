import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  FormatByte as FormatByteExport,
  FormatNumber as FormatNumberExport,
  LocaleProvider as LocaleProviderExport,
} from '../src';

export interface FormatHydrationComponents {
  FormatByte: typeof FormatByteExport;
  FormatNumber: typeof FormatNumberExport;
  LocaleProvider: typeof LocaleProviderExport;
}

/** Build matching server and browser trees around text-only formatters. */
export function renderFormatHydrationTree({
  FormatByte,
  FormatNumber,
  LocaleProvider,
}: FormatHydrationComponents): JSX.Element {
  const [locale, setLocale] = createSignal('en-US');
  const [value, setValue] = createSignal(1450.45);

  /** Update the provider and both values after hydration. */
  function changeFormat(): void {
    setLocale('de-DE');
    setValue(2500.5);
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep consumer-owned elements stable around the formatted text. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'span',
          'data-testid': 'format-hydration-stable',
          children: 'Stable sibling',
        }),
        createComponent(LocaleProvider, {
          /** Track the locale chosen after hydration. */
          get locale() {
            return locale();
          },
          /** Construct both formatters inside the locale provider. */
          get children() {
            return [
              createComponent(Dynamic, {
                component: 'output',
                'data-testid': 'format-hydration-number',
                /** Keep the currency value reactive in the same output. */
                get children() {
                  return createComponent(FormatNumber, {
                    /** Read the latest amount when the formatter updates. */
                    get value() {
                      return value();
                    },
                    style: 'currency',
                    currency: 'USD',
                  });
                },
              }),
              createComponent(Dynamic, {
                component: 'output',
                'data-testid': 'format-hydration-byte',
                /** Keep the data size reactive in the same output. */
                get children() {
                  return createComponent(FormatByte, {
                    /** Read the latest size when the formatter updates. */
                    get value() {
                      return value();
                    },
                  });
                },
              }),
            ];
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'format-hydration-toggle',
          type: 'button',
          onClick: changeFormat,
          children: 'Change locale and value',
        }),
      ];
    },
  });
}
