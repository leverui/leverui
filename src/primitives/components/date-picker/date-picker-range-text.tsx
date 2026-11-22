import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { uniq } from '@zag-js/utils';
import { createMemo } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerRangeTextBaseProps = PolymorphicProps<'div'>;
export type DatePickerRangeTextProps = Assign<HTMLProps<'div'>, DatePickerRangeTextBaseProps>;

/** Render the DatePicker range text. */
export const DatePickerRangeText = (props: DatePickerRangeTextProps) => {
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getRangeTextProps(), props);
  const visibleRangeText = createMemo(() => {
    const { start, end } = api().visibleRangeText;
    return uniq([start, end]).filter(Boolean).join(' - ');
  });

  return <primitive.div {...mergedProps}>{visibleRangeText()}</primitive.div>;
};
