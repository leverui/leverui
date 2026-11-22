import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseQrCodeProps, useQrCode } from './use-qr-code';
import { QrCodeProvider } from './use-qr-code-context';

export type QrCodeRootBaseProps = UseQrCodeProps & PolymorphicProps<'div'>;
export type QrCodeRootProps = Assign<HTMLProps<'div'>, QrCodeRootBaseProps>;

/** Render the QrCode root. */
export const QrCodeRoot = (props: QrCodeRootProps) => {
  const [useQrCodeProps, restProps] = createSplitProps<UseQrCodeProps>()(props, [
    'defaultValue',
    'encoding',
    'id',
    'ids',
    'onValueChange',
    'pixelSize',
    'value',
  ]);

  const api = useQrCode(useQrCodeProps);
  const mergedProps = mergeProps(() => api().getRootProps(), restProps);

  return (
    <QrCodeProvider value={api}>
      <primitive.div {...mergedProps} />
    </QrCodeProvider>
  );
};
