import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSwitchContext } from './use-switch-context';

export type SwitchThumbBaseProps = PolymorphicProps<'span'>;
export type SwitchThumbProps = Assign<HTMLProps<'span'>, SwitchThumbBaseProps>;

/** Render the Switch thumb. */
export const SwitchThumb = (props: SwitchThumbProps) => {
  const api = useSwitchContext();
  const mergedProps = mergeProps(() => api().getThumbProps(), props);

  return <primitive.span {...mergedProps} />;
};
