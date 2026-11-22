import type { Assign } from '../../types';
import type { HiddenInputProps } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDateInputContext } from './use-date-input-context';

export type DateInputHiddenInputBaseProps = PolymorphicProps<'input'> & HiddenInputProps;
export type DateInputHiddenInputProps = Assign<HTMLProps<'input'>, DateInputHiddenInputBaseProps>;

const splitHiddenInputProps = createSplitProps<HiddenInputProps>();

/** Render the DateInput hidden input. */
export const DateInputHiddenInput = (props: DateInputHiddenInputProps) => {
  const [hiddenInputProps, localProps] = splitHiddenInputProps(props, ['index', 'name']);
  const api = useDateInputContext();
  const mergedProps = mergeProps(() => api().getHiddenInputProps(hiddenInputProps), localProps);
  return <primitive.input {...mergedProps} />;
};
