import { QrCode, type QrCodeFrameProps, type QrCodeRootProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, QrCodeRootProps>>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'xl' } }, QrCodeRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, QrCodeRootProps>>;
export type NativeSvgRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: SVGSVGElement) => void }, QrCodeFrameProps>
>;
export type NativeSvgSizeAccepted = ExpectTrue<
  Assignable<{ htmlWidth: number; htmlHeight: number }, QrCodeFrameProps>
>;

/** Compile native QR parts against the consumer-facing declarations. */
export function typedQrCode(): JSX.Element {
  return (
    <QrCode.Root value="https://example.com" size={{ base: 'sm', md: 'xl' }}>
      <QrCode.Frame fill="var(--leverui-colors-blue-500)" htmlWidth={96} htmlHeight={96} />
      <QrCode.DownloadTrigger fileName="qr.png" mimeType="image/png">
        Download
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  );
}

/** Ensure QR components reject the unsupported object styling contract. */
export function rejectedQrStyles(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error QR roots have no CSS object prop. */}
      <QrCode.Root css={{ width: '40px' }} />
      {/* @ts-expect-error QR roots have no custom recipe prop. */}
      <QrCode.Root recipe={{}} />
      {/* @ts-expect-error QR frames reject arbitrary style shorthands. */}
      <QrCode.Frame mt="2" />
    </>
  );
}
