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
import type { UseDatePickerReturn } from './use-date-picker';
import { DatePickerProvider } from './use-date-picker-context';

interface RootProviderProps {
  value: UseDatePickerReturn;
}

export type DatePickerRootProviderState = RootState;

export type DatePickerRootProviderBaseProps = RootProviderProps &
  UsePresenceProps &
  PolymorphicProps<'div', DatePickerRootProviderState>;
export type DatePickerRootProviderProps = Assign<HTMLProps<'div'>, DatePickerRootProviderBaseProps>;

/** Provide the DatePicker root provider to its children. */
export const DatePickerRootProvider = (props: DatePickerRootProviderProps) => {
  const [presenceProps, datePickerProps] = splitPresenceProps(props);
  const [{ value: datePicker }, localProps] = createSplitProps<RootProviderProps>()(
    datePickerProps,
    ['value'],
  );
  const presence = usePresence(mergeProps(presenceProps, () => ({ present: datePicker().open })));
  const mergedProps = mergeProps(() => datePicker().getRootProps(), localProps);

  return (
    <DatePickerProvider value={datePicker}>
      <PresenceProvider value={presence}>
        <primitive.div {...mergedProps} state={datePicker().getRootState()} />
      </PresenceProvider>
    </DatePickerProvider>
  );
};
