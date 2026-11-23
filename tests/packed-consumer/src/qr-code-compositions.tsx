import { Input, QrCode, Spinner, type QrCodeRootProps } from '@leverui/components';
import { createSignal, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';

/** Pair a controlled QR value with an editable native input. */
export function QrCodeWithInput(): JSX.Element {
  const [value, setValue] = createSignal('https://example.com');
  return (
    <div>
      <QrCode.Root value={value()}>
        <QrCode.Frame aria-label="Input QR code" />
      </QrCode.Root>
      <Input
        value={value()}
        onInput={
          /** Keep the SVG payload in step with typed text. */
          (event) => setValue(event.currentTarget.value)
        }
        aria-label="QR value"
      />
    </div>
  );
}

/** Overlay a visible loading state while keeping QR geometry mounted. */
export function QrCodeWithSpinner(): JSX.Element {
  return (
    <QrCode.Root value="https://example.com" encoding={{ ecc: 'H' }}>
      <QrCode.Frame aria-label="Loading QR code" />
      <QrCode.Overlay>
        <Spinner role="status" aria-label="Loading QR code" />
      </QrCode.Overlay>
    </QrCode.Root>
  );
}

type DefaultQrCodeRootProps = Extract<
  QrCodeRootProps,
  { as?: never; asChild?: never; render?: never }
>;

export interface ClosedQrCodeProps extends Omit<DefaultQrCodeRootProps, 'children' | 'overlay'> {
  fill?: string;
  overlay?: JSX.Element;
  children?: JSX.Element;
}

/** Wrap the multipart API with one application-owned QR composition. */
export function ClosedQrCode(props: ClosedQrCodeProps): JSX.Element {
  const root = omit(props, 'fill', 'overlay', 'children');
  return (
    <QrCode.Root {...root}>
      <QrCode.Frame aria-label="Closed QR code" fill={props.fill} />
      {props.overlay}
      {props.children && <QrCode.Overlay>{props.children}</QrCode.Overlay>}
    </QrCode.Root>
  );
}

/** Compile all documented compositions against the installed package. */
export function PackedQrCodeCompositions(): JSX.Element {
  return (
    <div>
      <QrCodeWithInput />
      <QrCodeWithSpinner />
      <ClosedQrCode value="https://example.com" fill="var(--lui-colors-blue-600)">
        UI
      </ClosedQrCode>
    </div>
  );
}
