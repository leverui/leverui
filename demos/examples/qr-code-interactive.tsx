import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  Input,
  QrCode,
  SegmentGroup,
  Stack,
  useQrCode,
  type SegmentGroupValueChangeDetails,
} from '../../src';

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
const initialValue = 'https://www.google.com';

/** Accept only the four error correction levels. */
function isErrorLevel(value: string | null): value is ErrorLevel {
  return value === 'L' || value === 'M' || value === 'Q' || value === 'H';
}

/** Switch QR error correction through the Segment Group. */
export function QrCodeWithErrorLevel(): JSX.Element {
  const [errorLevel, setErrorLevel] = createSignal<ErrorLevel>('L');

  /** Update the encoder only for a known correction level. */
  function updateLevel(details: SegmentGroupValueChangeDetails): void {
    if (isErrorLevel(details.value)) setErrorLevel(details.value);
  }

  return (
    <Stack align="flex-start">
      <QrCode.Root value={initialValue} size="xl" encoding={{ ecc: errorLevel() }}>
        <QrCode.Frame />
      </QrCode.Root>
      <SegmentGroup.Root size="sm" defaultValue="L" onValueChange={updateLevel}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={['L', 'M', 'Q', 'H']} />
      </SegmentGroup.Root>
    </Stack>
  );
}

/** Regenerate the QR pattern as the native input value changes. */
export function QrCodeWithInput(): JSX.Element {
  const [value, setValue] = createSignal(initialValue);

  /** Keep the controlled QR value synchronized with text input. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
  }

  return (
    <Stack gap="4" style={{ 'max-width': '240px' }}>
      <QrCode.Root value={value()}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <Input value={value()} onInput={updateValue} />
    </Stack>
  );
}

/** Update an externally owned QR machine through its public hook. */
export function QrCodeWithStore(): JSX.Element {
  const qrCode = useQrCode({ defaultValue: initialValue });

  /** Replace the current encoded URL without remounting the frame. */
  function updateUrl(): void {
    qrCode().setValue('https://www.x.com');
  }

  return (
    <Stack align="flex-start">
      <Button onClick={updateUrl}>Update to x.com</Button>
      <QrCode.RootProvider value={qrCode}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.RootProvider>
    </Stack>
  );
}
