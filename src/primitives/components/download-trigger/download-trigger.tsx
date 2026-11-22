import type { Assign } from '../../types';
import { splitProps } from '../../utils/split-props';
import { type JSX } from '@solidjs/web';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { primitive } from '../factory';
import { type UseDownloadProps, useDownload } from './use-download';

export type DownloadTriggerBaseProps = PolymorphicProps<'button'> & UseDownloadProps;

export type DownloadTriggerProps = Assign<HTMLProps<'button'>, DownloadTriggerBaseProps>;

/** Render the DownloadTrigger root. */
export function DownloadTrigger(props: DownloadTriggerProps) {
  const [downloadProps, restProps] = splitProps(props, ['fileName', 'data', 'mimeType', 'onClick']);
  const { download } = useDownload(() => ({
    fileName: downloadProps.fileName,
    mimeType: downloadProps.mimeType,
    data: downloadProps.data,
  }));

  /** Handle click. */
  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof downloadProps.onClick === 'function') {
      downloadProps.onClick(e);
    }

    if (e.defaultPrevented) return;

    download();
  };

  return <primitive.button {...restProps} type="button" onClick={handleClick} />;
}
