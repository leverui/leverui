import { LocaleProvider, useFilter, useLocaleContext } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Read installed locale state and locale-aware string matching. */
function PackedLocaleProbe(): JSX.Element {
  const context = useLocaleContext();
  const filter = useFilter({ sensitivity: 'base' });
  return (
    <output
      id="packed-locale"
      data-locale={context().locale}
      data-dir={context().dir}
      data-matches={String(filter().startsWith('I', 'ı'))}
    />
  );
}

/** Exercise the published provider and hooks from an independent app. */
export function PackedLocale(): JSX.Element {
  return (
    <LocaleProvider locale="tr-TR">
      <PackedLocaleProbe />
    </LocaleProvider>
  );
}
