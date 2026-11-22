import { type JSX } from '@solidjs/web';
import { type UseQrCodeContext, useQrCodeContext } from './use-qr-code-context';

export interface QrCodeContextProps {
  children: (context: UseQrCodeContext) => JSX.Element;
}

/** Render the QrCode context context through a function child. */
export const QrCodeContext = (props: QrCodeContextProps) => props.children(useQrCodeContext());
