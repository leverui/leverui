import { useLocaleContext as usePrimitiveLocaleContext } from '../src/primitives/providers/locale';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { LocaleProvider, useFilter, useLocaleContext } from '../src';

interface LocaleProbeProps {
  testId: string;
  sensitivity: 'base' | 'variant';
}

/** Expose the nearest locale, direction, and locale-sensitive filtering. */
function LocaleProbe(props: LocaleProbeProps): JSX.Element {
  const context = useLocaleContext();
  const filter = useFilter({
    /** Follow the fixture's changing collation sensitivity. */
    get sensitivity() {
      return props.sensitivity;
    },
  });
  const turkishFilter = useFilter({ locale: 'tr-TR', sensitivity: 'base' });

  return (
    <output
      data-testid={props.testId}
      data-locale={context().locale}
      data-dir={context().dir}
      data-matches={String(filter().startsWith('I', 'ı'))}
      data-starts={String(filter().startsWith('Résumé', 'resume'))}
      data-ends={String(filter().endsWith('Résumé', 'SUME'))}
      data-contains={String(filter().contains('Résumé', 'ESUM'))}
      data-explicit-matches={String(turkishFilter().startsWith('I', 'ı'))}
    />
  );
}

/** Expose the same locale context from a primitive-backed descendant. */
function PrimitiveLocaleProbe(): JSX.Element {
  const context = usePrimitiveLocaleContext();
  return (
    <output
      data-testid="locale-primitive"
      data-locale={context().locale}
      data-dir={context().dir}
    />
  );
}

/** Exercise default, nested, RTL, and reactive locale scopes. */
function LocaleScopesExample(): JSX.Element {
  const [locale, setLocale] = createSignal('en-US');
  const [sensitivity, setSensitivity] = createSignal<'base' | 'variant'>('base');

  /** Switch the outer scope to a right-to-left locale. */
  function selectArabic(): void {
    setLocale('ar-EG');
  }

  /** Switch the outer scope to a locale with Turkish case matching. */
  function selectTurkish(): void {
    setLocale('tr-TR');
  }

  /** Restore the original locale without replacing the provider. */
  function selectEnglish(): void {
    setLocale('en-US');
  }

  /** Change filter matching without replacing any locale provider. */
  function toggleSensitivity(): void {
    setSensitivity(
      /** Swap the active collator option. */
      (current) => (current === 'base' ? 'variant' : 'base'),
    );
  }

  return (
    <section data-testid="locale-story">
      <LocaleProbe testId="locale-default" sensitivity={sensitivity()} />
      <button type="button" data-testid="locale-arabic" onClick={selectArabic}>
        Arabic
      </button>
      <button type="button" data-testid="locale-turkish" onClick={selectTurkish}>
        Turkish
      </button>
      <button type="button" data-testid="locale-english" onClick={selectEnglish}>
        English
      </button>
      <button type="button" data-testid="locale-sensitivity" onClick={toggleSensitivity}>
        Toggle sensitivity
      </button>
      <LocaleProvider locale={locale()}>
        <LocaleProbe testId="locale-outer" sensitivity={sensitivity()} />
        <PrimitiveLocaleProbe />
        <LocaleProvider locale="ar-EG">
          <LocaleProbe testId="locale-nested" sensitivity={sensitivity()} />
        </LocaleProvider>
      </LocaleProvider>
    </section>
  );
}

const meta = {
  title: 'Utilities/Locale',
  component: LocaleScopesExample,
} satisfies Meta<typeof LocaleScopesExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scopes: Story = {};
