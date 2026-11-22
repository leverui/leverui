import { createContext } from '../../utils/create-context';
import type { UseDatePickerReturn } from './use-date-picker';

export type UseDatePickerContext = UseDatePickerReturn;

export const [DatePickerProvider, useDatePickerContext] = createContext<UseDatePickerContext>({
  hookName: 'useDatePickerContext',
  providerName: '<DatePickerProvider />',
});
