import { createContext } from '../../utils/create-context';
import type { UseRatingGroupReturn } from './use-rating-group';

export type UseRatingGroupContext = UseRatingGroupReturn;

export const [RatingGroupProvider, useRatingGroupContext] = createContext<UseRatingGroupContext>({
  hookName: 'useRatingGroupContext',
  providerName: '<RatingGroupProvider />',
});
