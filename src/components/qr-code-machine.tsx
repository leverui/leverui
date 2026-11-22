import {
  QrCodeContext as PrimitiveContext,
  useQrCode as usePrimitiveQrCode,
  useQrCodeContext as usePrimitiveQrCodeContext,
} from '../primitives/components/qr-code';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  QrCodeContextProps,
  UseQrCodeContext,
  UseQrCodeProps,
  UseQrCodeReturn,
} from './qr-code-types';

/** Create the primitive's Zag QR machine behind a Lever UI API. */
export function useQrCode(props?: UseQrCodeProps | Accessor<UseQrCodeProps>): UseQrCodeReturn {
  return usePrimitiveQrCode(props);
}

/** Read the nearest primitive QR machine as a Solid accessor. */
export function useQrCodeContext(): UseQrCodeContext {
  return usePrimitiveQrCodeContext();
}

/** Provide a QR machine accessor to a child render callback. */
export function QrCodeContext(props: QrCodeContextProps): JSX.Element {
  return createComponent(PrimitiveContext, props);
}
