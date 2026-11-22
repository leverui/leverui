import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useQrCodeContext } from './use-qr-code-context';

export type QrCodeFrameBaseProps = PolymorphicProps<'svg'>;
export type QrCodeFrameProps = Assign<HTMLProps<'svg'>, QrCodeFrameBaseProps>;

/** Render the QrCode frame. */
export const QrCodeFrame = (props: QrCodeFrameProps) => {
  const qrCode = useQrCodeContext();
  const mergedProps = mergeProps(() => qrCode().getFrameProps(), props);

  return <primitive.svg {...mergedProps} />;
};
