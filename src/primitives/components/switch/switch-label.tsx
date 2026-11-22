import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSwitchContext } from './use-switch-context';

export type SwitchLabelBaseProps = PolymorphicProps<'span'>;
export type SwitchLabelProps = Assign<HTMLProps<'span'>, SwitchLabelBaseProps>;

/** Render the Switch label. */
export const SwitchLabel = (props: SwitchLabelProps) => {
  const api = useSwitchContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.span {...mergedProps} />;
};
