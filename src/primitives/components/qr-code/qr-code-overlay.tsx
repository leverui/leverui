import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useQrCodeContext } from './use-qr-code-context';

export type QrCodeOverlayBaseProps = PolymorphicProps<'div'>;
export type QrCodeOverlayProps = Assign<HTMLProps<'div'>, QrCodeOverlayBaseProps>;

/** Render the QrCode overlay. */
export const QrCodeOverlay = (props: QrCodeOverlayProps) => {
  const qrCode = useQrCodeContext();
  const mergedProps = mergeProps(() => qrCode().getOverlayProps(), props);

  return <primitive.div {...mergedProps} />;
};
