import type { DownloadTriggerProps } from '@zag-js/qr-code';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import { omit } from '../utils/omit';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { QrCodeAppearance } from './qr-code-choices';
import type { UseQrCodeProps, UseQrCodeReturn } from './qr-code-types';

type PartAppearance = { unstyled?: boolean; className?: string };

export type QrCodeRootBaseProps = UseQrCodeProps &
  QrCodeAppearance &
  PrimitiveCompositionProps<'div'>;
export type QrCodeRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  QrCodeRootBaseProps & NativeHtmlAliases,
  As
>;
export type QrCodeRootProviderBaseProps = QrCodeAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseQrCodeReturn };
export type QrCodeRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', QrCodeRootProviderBaseProps & NativeHtmlAliases, As>;
export type QrCodeFrameProps<As extends PrimitiveNativeTag = 'svg'> = PrimitiveNativeElementProps<
  'svg',
  PartAppearance & NativeHtmlAliases,
  As
>;
export type QrCodePatternProps<As extends PrimitiveNativeTag = 'path'> =
  PrimitiveNativeElementProps<'path', PartAppearance & NativeHtmlAliases, As>;
export type QrCodeOverlayProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  PartAppearance & NativeHtmlAliases,
  As
>;
export type QrCodeDownloadTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<
    'button',
    PartAppearance & DownloadTriggerProps & NativeHtmlAliases,
    As
  >;

type QrCodeDefaults = Partial<Omit<QrCodeRootBaseProps, 'children' | 'ref' | 'asChild'>>;

export interface QrCodePropsProviderProps {
  value: QrCodeDefaults | Accessor<QrCodeDefaults>;
  children: JSX.Element;
}

const QrCodePropsContext = createOptionalContext<Accessor<QrCodeDefaults>>();
export const qrCodeMachineKeys = [
  'defaultValue',
  'encoding',
  'id',
  'ids',
  'onValueChange',
  'pixelSize',
  'value',
] as const;

/** Supply reactive QR defaults without creating a machine. */
export function QrCodePropsProvider(props: QrCodePropsProviderProps): JSX.Element {
  /** Read a static or accessor-based default record. */
  function readDefaults(): QrCodeDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <QrCodePropsContext value={readDefaults}>{props.children}</QrCodePropsContext>;
}

/** Merge inherited defaults before one machine-owned QR root. */
export function useQrCodeProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(QrCodePropsContext);
  return mergeProps(
    /** Keep explicit root values ahead of inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without replacing a caller-owned QR machine. */
export function useQrCodeRootProviderProps<
  Props extends QrCodeAppearance & { value: UseQrCodeReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(QrCodePropsContext);
  return mergeProps(
    /** Leave machine settings on the external accessor. */
    () => omit(inherited?.() ?? {}, qrCodeMachineKeys),
    instance,
  ) as Props;
}
