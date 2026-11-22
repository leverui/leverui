import { createContext } from './create-context';
import { createSplitProps } from './create-split-props';

export interface RenderStrategyProps {
  /**
   * Whether to enable lazy mounting
   * @default false
   */
  lazyMount?: boolean | undefined;
  /**
   * Whether to unmount on exit.
   * @default false
   */
  unmountOnExit?: boolean | undefined;
}

export const [RenderStrategyProvider, useRenderStrategyContext] =
  createContext<RenderStrategyProps>({
    hookName: 'useRenderStrategyContext',
    providerName: '<RenderStrategyProvider />',
  });

/** Split the render strategy props from the remaining props. */
export const splitRenderStrategyProps = <T extends RenderStrategyProps>(props: T) =>
  createSplitProps<RenderStrategyProps>()(props, ['lazyMount', 'unmountOnExit']);
