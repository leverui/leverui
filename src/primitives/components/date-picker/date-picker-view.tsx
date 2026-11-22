import type { Assign } from '../../types';
import type { ViewProps } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { DatePickerViewProvider } from './use-date-picker-view-props-context';

export type DatePickerViewBaseProps = Required<ViewProps> & PolymorphicProps<'div'>;
export type DatePickerViewProps = Assign<HTMLProps<'div'>, DatePickerViewBaseProps>;

/** Render the DatePicker view. */
export const DatePickerView = (props: DatePickerViewProps) => {
  const [viewProps, localProps] = createSplitProps<Required<ViewProps>>()(props, ['view']);
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getViewProps(viewProps), localProps);

  return (
    <DatePickerViewProvider value={viewProps}>
      <primitive.div {...mergedProps} />
    </DatePickerViewProvider>
  );
};
