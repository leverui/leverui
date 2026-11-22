import type { Assign } from '../../types';
import type { RootState } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseDateInputProps, useDateInput } from './use-date-input';
import { DateInputProvider } from './use-date-input-context';

export type DateInputRootState = RootState;

export type DateInputRootBaseProps = UseDateInputProps &
  PolymorphicProps<'div', DateInputRootState>;
export type DateInputRootProps = Assign<HTMLProps<'div'>, DateInputRootBaseProps>;

/** Render the DateInput root. */
export const DateInputRoot = (props: DateInputRootProps) => {
  const [useDateInputProps, localProps] = createSplitProps<UseDateInputProps>()(props, [
    'disabled',
    'id',
    'ids',
    'invalid',
    'locale',
    'maxGranularity',
    'max',
    'min',
    'name',
    'form',
    'onFocusChange',
    'onPlaceholderChange',
    'onValueChange',
    'readOnly',
    'required',
    'selectionMode',
    'timeZone',
    'hideTimeZone',
    'translations',
    'value',
    'defaultValue',
    'hourCycle',
    'granularity',
    'shouldForceLeadingZeros',
    'allSegments',
    'formatter',
    'placeholderValue',
    'defaultPlaceholderValue',
    'format',
    'createCalendar',
    'isDateUnavailable',
  ]);
  const api = useDateInput(useDateInputProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <DateInputProvider value={api}>
      <primitive.div {...mergedProps} state={api().getRootState()} />
    </DateInputProvider>
  );
};
