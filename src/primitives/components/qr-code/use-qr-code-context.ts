import { createContext } from '../../utils/create-context';
import type { UseQrCodeReturn } from './use-qr-code';

export type UseQrCodeContext = UseQrCodeReturn;

export const [QrCodeProvider, useQrCodeContext] = createContext<UseQrCodeContext>({
  hookName: 'useQrCodeContext',
  providerName: '<QrCodeProvider />',
});
