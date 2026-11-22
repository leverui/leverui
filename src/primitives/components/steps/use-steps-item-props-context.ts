import type { ItemProps } from '@zag-js/steps';
import { createContext } from '../../utils/create-context';

export type UseStepsItemPropsContext = ItemProps;

export const [StepsItemPropsProvider, useStepsItemPropsContext] =
  createContext<UseStepsItemPropsContext>({
    hookName: 'useStepsItemPropsContext',
    providerName: '<StepsItemPropsProvider />',
  });
