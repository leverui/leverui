import type {
  Api as QrCodeApi,
  Props as QrCodeMachineProps,
  QrCodeGenerateOptions,
  QrCodeGenerateResult,
  ValueChangeDetails,
} from '@zag-js/qr-code';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type UseQrCodeProps = Omit<QrCodeMachineProps, 'dir' | 'getRootNode' | 'id'> & {
  id?: string;
};
export type UseQrCodeReturn = Accessor<QrCodeApi<PropTypes>>;
export type UseQrCodeContext = UseQrCodeReturn;
export type { QrCodeGenerateOptions, QrCodeGenerateResult };
export type QrCodeValueChangeDetails = ValueChangeDetails;

export interface QrCodeContextProps {
  children: (context: UseQrCodeContext) => JSX.Element;
}
