import { type JSX } from '@solidjs/web';
import { type UseStepsContext, useStepsContext } from './use-steps-context';

export interface StepsContextProps {
  children: (context: UseStepsContext) => JSX.Element;
}

/** Render the Steps context. */
export const StepsContext = (props: StepsContextProps) => {
  const context = useStepsContext();
  return props.children(context);
};
