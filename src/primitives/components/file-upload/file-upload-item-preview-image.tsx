import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show, createEffect, createSignal } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context';

export type FileUploadItemPreviewImageBaseProps = PolymorphicProps<'img'>;
export type FileUploadItemPreviewImageProps = Assign<
  HTMLProps<'img'>,
  FileUploadItemPreviewImageBaseProps
>;

/** Render the FileUpload item preview image. */
export const FileUploadItemPreviewImage = (props: FileUploadItemPreviewImageProps) => {
  const fileUpload = useFileUploadContext();
  const itemProps = useFileUploadItemPropsContext();
  const [url, setUrl] = createSignal<string>('');

  createEffect(
    () => [fileUpload(), itemProps().file] as const,
    ([api, file]) => api.createFileUrl(file, (url) => setUrl(url)),
  );

  const mergedProps = mergeProps(
    () => fileUpload().getItemPreviewImageProps({ ...itemProps(), url: url() }),
    props,
  );

  return (
    <Show when={url()}>
      <primitive.img {...mergedProps} />
    </Show>
  );
};
