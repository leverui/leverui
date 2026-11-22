import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useQrCodeContext } from './use-qr-code-context';

export type QrCodePatternBaseProps = PolymorphicProps<'path'>;
export type QrCodePatternProps = Assign<HTMLProps<'path'>, QrCodePatternBaseProps>;

/** Render the QrCode pattern. */
export const QrCodePattern = (props: QrCodePatternProps) => {
  const qrCode = useQrCodeContext();
  const mergedProps = mergeProps(() => qrCode().getPatternProps(), props);

  return <primitive.path {...mergedProps} />;
};
