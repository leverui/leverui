import { createContext } from '../../utils/create-context';
import type { UseDateInputReturn } from './use-date-input';

export type UseDateInputContext = UseDateInputReturn;

export const [DateInputProvider, useDateInputContext] = createContext<UseDateInputContext>({
  hookName: 'useDateInputContext',
  providerName: '<DateInputProvider />',
});
