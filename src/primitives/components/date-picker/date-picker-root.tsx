import type { Assign } from '../../types';
import type { RootState } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import { type UseDatePickerProps, useDatePicker } from './use-date-picker';
import { DatePickerProvider } from './use-date-picker-context';

export type DatePickerRootState = RootState;

export type DatePickerRootBaseProps = UseDatePickerProps &
  UsePresenceProps &
  PolymorphicProps<'div', DatePickerRootState>;
export type DatePickerRootProps = Assign<HTMLProps<'div'>, DatePickerRootBaseProps>;

/** Render the DatePicker root. */
export const DatePickerRoot = (props: DatePickerRootProps) => {
  const [presenceProps, datePickerProps] = splitPresenceProps(props);
  const [useDatePickerProps, localProps] = createSplitProps<UseDatePickerProps>()(datePickerProps, [
    'closeOnSelect',
    'createCalendar',
    'defaultFocusedValue',
    'defaultOpen',
    'defaultValue',
    'defaultView',
    'disabled',
    'fixedWeeks',
    'focusedValue',
    'format',
    'id',
    'ids',
    'inline',
    'invalid',
    'isDateUnavailable',
    'locale',
    'max',
    'maxSelectedDates',
    'maxView',
    'min',
    'minView',
    'name',
    'numOfMonths',
    'onFocusChange',
    'onOpenChange',
    'onValueChange',
    'onViewChange',
    'onVisibleRangeChange',
    'open',
    'openOnClick',
    'outsideDaySelectable',
    'parse',
    'placeholder',
    'positioning',
    'readOnly',
    'required',
    'selectionMode',
    'showWeekNumbers',
    'startOfWeek',
    'timeZone',
    'translations',
    'value',
    'view',
  ]);
  const api = useDatePicker(useDatePickerProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <DatePickerProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <primitive.div {...mergedProps} state={api().getRootState()} />
      </PresenceProvider>
    </DatePickerProvider>
  );
};
