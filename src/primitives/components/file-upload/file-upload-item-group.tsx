import type { Assign } from '../../types';
import type { ItemGroupProps, ItemGroupState } from '@zag-js/file-upload';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFileUploadContext } from './use-file-upload-context';
import { FileUploadItemGroupPropsProvider } from './use-file-upload-item-group-props-context';

export type FileUploadItemGroupState = ItemGroupState;

export type FileUploadItemGroupBaseProps = PolymorphicProps<'ul', FileUploadItemGroupState> &
  ItemGroupProps;
export type FileUploadItemGroupProps = Assign<HTMLProps<'ul'>, FileUploadItemGroupBaseProps>;

/** Render the FileUpload item group. */
export const FileUploadItemGroup = (props: FileUploadItemGroupProps) => {
  const [itemGroupProps, localProps] = createSplitProps<ItemGroupProps>()(props, ['type']);
  const fileUpload = useFileUploadContext();
  const mergedProps = mergeProps(() => fileUpload().getItemGroupProps(itemGroupProps), localProps);

  return (
    <FileUploadItemGroupPropsProvider value={itemGroupProps}>
      <primitive.ul {...mergedProps} state={fileUpload().getItemGroupState(itemGroupProps)} />
    </FileUploadItemGroupPropsProvider>
  );
};
