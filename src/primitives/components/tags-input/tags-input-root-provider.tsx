import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/tags-input';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseTagsInputReturn } from './use-tags-input';
import { TagsInputProvider } from './use-tags-input-context';

interface RootProviderProps {
  value: UseTagsInputReturn;
}

export type TagsInputRootProviderState = RootState;

export type TagsInputRootProviderBaseProps = PolymorphicProps<'div', TagsInputRootProviderState>;
export type TagsInputRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  TagsInputRootProviderBaseProps;

/** Provide the TagsInput root provider to its children. */
export const TagsInputRootProvider = (props: TagsInputRootProviderProps) => {
  const [{ value: tagsInput }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => tagsInput().getRootProps(), localProps);

  return (
    <TagsInputProvider value={tagsInput}>
      <primitive.div {...mergedProps} state={tagsInput().getRootState()} />
    </TagsInputProvider>
  );
};
