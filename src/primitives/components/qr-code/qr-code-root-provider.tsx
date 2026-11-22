import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseQrCodeReturn } from './use-qr-code';
import { QrCodeProvider } from './use-qr-code-context';

interface RootProviderProps {
  value: UseQrCodeReturn;
}

export type QrCodeRootProviderBaseProps = PolymorphicProps<'div'>;
export type QrCodeRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  QrCodeRootProviderBaseProps;

/** Provide the QrCode root provider to its children. */
export const QrCodeRootProvider = (props: QrCodeRootProviderProps) => {
  const [{ value: qrCode }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => qrCode().getRootProps(), localProps);

  return (
    <QrCodeProvider value={qrCode}>
      <primitive.div {...mergedProps} />
    </QrCodeProvider>
  );
};
