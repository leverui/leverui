import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSwitchContext } from './use-switch-context';

export type SwitchControlBaseProps = PolymorphicProps<'span'>;
export type SwitchControlProps = Assign<HTMLProps<'span'>, SwitchControlBaseProps>;

/** Render the Switch control. */
export const SwitchControl = (props: SwitchControlProps) => {
  const api = useSwitchContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.span {...mergedProps} />;
};
