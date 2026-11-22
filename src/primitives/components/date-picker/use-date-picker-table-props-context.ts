import type { TableProps } from '@zag-js/date-picker';
import { createContext } from '../../utils/create-context';

export type UseDatePickerTableContext = TableProps;

export const [DatePickerTableProvider, useDatePickerTableContext] =
  createContext<UseDatePickerTableContext>({
    hookName: 'useDatePickerTableContext',
    providerName: '<DatePickerTableProvider />',
  });
