import { type JSX } from '@solidjs/web';
import { FormatByte, HStack, LocaleProvider, Stack, Text } from '../../src';

const mediumWeight: JSX.CSSProperties = { 'font-weight': 'var(--lui-font-weights-medium)' };

/** Format the file size in the default unit. */
export function FormatByteBasic(): JSX.Element {
  return (
    <Text textStyle="lg">
      File size: <FormatByte value={1450.45} />
    </Text>
  );
}

/** Scale the unit across four orders of magnitude. */
export function FormatByteSizes(): JSX.Element {
  return (
    <Stack>
      <Text textStyle="lg">
        <FormatByte value={50} />
      </Text>
      <Text textStyle="lg">
        <FormatByte value={5000} />
      </Text>
      <Text textStyle="lg">
        <FormatByte value={5000000} />
      </Text>
      <Text textStyle="lg">
        <FormatByte value={5000000000} />
      </Text>
    </Stack>
  );
}

/** Display the size in bits. */
export function FormatByteWithUnit(): JSX.Element {
  return (
    <Text textStyle="lg">
      File size: <FormatByte value={1450.45} unit="bit" />
    </Text>
  );
}

/** Format one size under two locale providers. */
export function FormatByteWithLocale(): JSX.Element {
  return (
    <Text as="div" textStyle="lg">
      <HStack>
        <Text style={mediumWeight}>de-DE</Text>
        <LocaleProvider locale="de-DE">
          <FormatByte value={1450.45} />
        </LocaleProvider>
      </HStack>
      <HStack>
        <Text style={mediumWeight}>zh-CN</Text>
        <LocaleProvider locale="zh-CN">
          <FormatByte value={1450.45} />
        </LocaleProvider>
      </HStack>
    </Text>
  );
}

/** Compare the narrow, short, and long unit labels. */
export function FormatByteWithUnitDisplay(): JSX.Element {
  return (
    <Stack>
      <Text textStyle="lg">
        <FormatByte value={50345.53} unitDisplay="narrow" />
      </Text>
      <Text textStyle="lg">
        <FormatByte value={50345.53} unitDisplay="short" />
      </Text>
      <Text textStyle="lg">
        <FormatByte value={50345.53} unitDisplay="long" />
      </Text>
    </Stack>
  );
}
