import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FormatByte, FormatNumber, LocaleProvider } from '../src';

/** Show the number and byte options against a changing locale and value. */
function FormatContractExample(): JSX.Element {
  const [locale, setLocale] = createSignal('en-US');
  const [value, setValue] = createSignal(1450.45);
  const [detailed, setDetailed] = createSignal(false);

  /** Switch between locales used in the examples. */
  function toggleLocale(): void {
    setLocale(locale() === 'en-US' ? 'de-DE' : 'en-US');
  }

  /** Change both formatters' input without remounting their text containers. */
  function toggleValue(): void {
    setValue(value() === 1450.45 ? 2500.5 : 1450.45);
  }

  /** Change formatting options while keeping the same values and locale. */
  function toggleOptions(): void {
    setDetailed(!detailed());
  }

  return (
    <LocaleProvider locale={locale()}>
      <output data-testid="format-number-default">
        <FormatNumber value={value()} />
      </output>
      <output data-testid="format-number-currency">
        <FormatNumber value={value()} style="currency" currency="USD" />
      </output>
      <output data-testid="format-number-percent">
        <FormatNumber value={0.25} style="percent" />
      </output>
      <output data-testid="format-number-compact">
        <FormatNumber value={1500000} notation="compact" compactDisplay="short" />
      </output>
      <output data-testid="format-number-unit">
        <FormatNumber value={384.4} style="unit" unit="kilometer" />
      </output>
      <output data-testid="format-number-options">
        <FormatNumber value={1.2345} maximumFractionDigits={detailed() ? 3 : 1} />
      </output>
      <output data-testid="format-byte-default">
        <FormatByte value={value()} />
      </output>
      <output data-testid="format-byte-binary">
        <FormatByte value={2048} unitSystem="binary" unitDisplay={detailed() ? 'long' : 'short'} />
      </output>
      <output data-testid="format-byte-bit">
        <FormatByte value={value()} unit="bit" unitDisplay="narrow" />
      </output>
      <output data-testid="format-byte-zero">
        <FormatByte value={0} />
      </output>
      <button type="button" data-testid="format-locale-toggle" onClick={toggleLocale}>
        Toggle locale
      </button>
      <button type="button" data-testid="format-value-toggle" onClick={toggleValue}>
        Toggle value
      </button>
      <button type="button" data-testid="format-options-toggle" onClick={toggleOptions}>
        Toggle options
      </button>
    </LocaleProvider>
  );
}

const meta = {
  title: 'Content/Format',
  component: FormatContractExample,
} satisfies Meta<typeof FormatContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
