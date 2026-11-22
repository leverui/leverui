import type { Assign } from '../../types';
import type { DownloadTriggerProps } from '@zag-js/qr-code';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useQrCodeContext } from './use-qr-code-context';

export type QrCodeDownloadTriggerBaseProps = DownloadTriggerProps & PolymorphicProps<'button'>;
export type QrCodeDownloadTriggerProps = Assign<
  HTMLProps<'button'>,
  QrCodeDownloadTriggerBaseProps
>;

/** Render the QrCode download trigger. */
export const QrCodeDownloadTrigger = (props: QrCodeDownloadTriggerProps) => {
  const [downloadTriggerProps, localProps] = createSplitProps<DownloadTriggerProps>()(props, [
    'fileName',
    'mimeType',
    'quality',
  ]);
  const qrCode = useQrCodeContext();
  const mergedProps = mergeProps(
    () => qrCode().getDownloadTriggerProps(downloadTriggerProps),
    localProps,
  );

  return <primitive.button {...mergedProps} />;
};
