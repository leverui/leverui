import { type JSX } from '@solidjs/web';
import { type UseStepsItemContext, useStepsItemContext } from './use-steps-item-context';

export interface StepsItemContextProps {
  children: (context: UseStepsItemContext) => JSX.Element;
}

/** Render the Steps item context. */
export const StepsItemContext = (props: StepsItemContextProps) => {
  return props.children(useStepsItemContext());
};

StepsItemContext.displayName = 'StepsItemContext';
