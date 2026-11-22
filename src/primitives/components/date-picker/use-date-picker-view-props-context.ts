import type { ViewProps } from '@zag-js/date-picker';
import { createContext } from '../../utils/create-context';

export type UseDatePickerViewContext = Required<ViewProps>;

export const [DatePickerViewProvider, useDatePickerViewContext] =
  createContext<UseDatePickerViewContext>({
    hookName: 'useDatePickerViewContext',
    providerName: '<DatePickerViewProvider />',
    strict: false,
    defaultValue: { view: 'day' },
  });
