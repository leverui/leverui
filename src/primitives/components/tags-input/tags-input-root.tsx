import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/tags-input';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseTagsInputProps, useTagsInput } from './use-tags-input';
import { TagsInputProvider } from './use-tags-input-context';

export type TagsInputRootState = RootState;

export type TagsInputRootBaseProps = UseTagsInputProps &
  PolymorphicProps<'div', TagsInputRootState>;
export type TagsInputRootProps = Assign<HTMLProps<'div'>, TagsInputRootBaseProps>;

/** Render the TagsInput root. */
export const TagsInputRoot = (props: TagsInputRootProps) => {
  const [useTagsInputProps, localProps] = createSplitProps<UseTagsInputProps>()(props, [
    'addOnPaste',
    'allowDuplicates',
    'allowOverflow',
    'autoFocus',
    'blurBehavior',
    'defaultInputValue',
    'defaultValue',
    'delimiter',
    'disabled',
    'editable',
    'form',
    'id',
    'ids',
    'inputValue',
    'invalid',
    'max',
    'maxLength',
    'name',
    'onFocusOutside',
    'onHighlightChange',
    'onInputValueChange',
    'onInteractOutside',
    'onPointerDownOutside',
    'onValueChange',
    'onValueInvalid',
    'placeholder',
    'readOnly',
    'required',
    'translations',
    'validate',
    'value',
    'sanitizeValue',
  ]);

  const api = useTagsInput(useTagsInputProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <TagsInputProvider value={api}>
      <primitive.div {...mergedProps} state={api().getRootState()} />
    </TagsInputProvider>
  );
};
