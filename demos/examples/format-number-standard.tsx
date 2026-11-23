import { type JSX } from '@solidjs/web';
import { FormatNumber, HStack, LocaleProvider, Text } from '../../src';

const mediumWeight: JSX.CSSProperties = { 'font-weight': 'var(--lui-font-weights-medium)' };

/** Format the number with the default locale. */
export function FormatNumberBasic(): JSX.Element {
  return (
    <Text textStyle="lg">
      <FormatNumber value={1450.45} />
    </Text>
  );
}

/** Format a fraction as a percentage with two decimal places. */
export function FormatNumberWithPercentage(): JSX.Element {
  return (
    <Text textStyle="lg">
      <FormatNumber
        value={0.145}
        style="percent"
        maximumFractionDigits={2}
        minimumFractionDigits={2}
      />
    </Text>
  );
}

/** Format an amount as US dollars. */
export function FormatNumberWithCurrency(): JSX.Element {
  return (
    <Text textStyle="lg">
      <FormatNumber value={1234.45} style="currency" currency="USD" />
    </Text>
  );
}

/** Format one number under two locale providers. */
export function FormatNumberWithLocale(): JSX.Element {
  return (
    <Text as="div" textStyle="lg">
      <HStack>
        <Text style={mediumWeight}>de-DE</Text>
        <LocaleProvider locale="de-DE">
          <FormatNumber value={1450.45} />
        </LocaleProvider>
      </HStack>
      <HStack>
        <Text style={mediumWeight}>zh-CN</Text>
        <LocaleProvider locale="zh-CN">
          <FormatNumber value={1450.45} />
        </LocaleProvider>
      </HStack>
    </Text>
  );
}

/** Format a distance with a localized unit label. */
export function FormatNumberWithUnit(): JSX.Element {
  return (
    <Text textStyle="lg">
      <FormatNumber value={384.4} style="unit" unit="kilometer" />
    </Text>
  );
}

/** Abbreviate a large number with compact notation. */
export function FormatNumberWithCompact(): JSX.Element {
  return (
    <Text textStyle="lg">
      <FormatNumber value={1500000} notation="compact" compactDisplay="short" />
    </Text>
  );
}
