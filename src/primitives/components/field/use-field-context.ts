import { createContext } from '../../utils/create-context';
import type { UseFieldReturn } from './use-field';

export type UseFieldContext = UseFieldReturn;

export const [FieldProvider, useFieldContext] = createContext<UseFieldContext>({
  hookName: 'useFieldContext',
  providerName: '<FieldProvider />',
  strict: false,
});
