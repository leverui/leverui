import { createContext } from '../../utils/create-context';
import type { UseFieldsetReturn } from './use-fieldset';

export type UseFieldsetContext = UseFieldsetReturn;

export const [FieldsetProvider, useFieldsetContext] = createContext<UseFieldsetContext>({
  hookName: 'useFieldsetContext',
  providerName: '<FieldsetProvider />',
  strict: false,
});
