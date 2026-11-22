import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { useFileUploadItemGroupPropsContext } from './use-file-upload-item-group-props-context';
import { FileUploadItemPropsProvider } from './use-file-upload-item-props-context';

type ItemBaseProps = Omit<ItemProps, 'type'>;

export type FileUploadItemState = ItemState;

export type FileUploadItemBaseProps = ItemBaseProps & PolymorphicProps<'li', FileUploadItemState>;
export type FileUploadItemProps = Assign<HTMLProps<'li'>, FileUploadItemBaseProps>;

/** Render the FileUpload item. */
export const FileUploadItem = (props: FileUploadItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemBaseProps>()(props, ['file']);
  const fileUpload = useFileUploadContext();

  const itemGroupProps = useFileUploadItemGroupPropsContext();
  const itemPropsWithType = createMemo(() => ({ ...itemProps, type: itemGroupProps.type }));

  const mergedProps = mergeProps(() => fileUpload().getItemProps(itemPropsWithType()), localProps);

  return (
    <FileUploadItemPropsProvider value={itemPropsWithType}>
      <primitive.li {...mergedProps} state={fileUpload().getItemState(itemPropsWithType())} />
    </FileUploadItemPropsProvider>
  );
};
